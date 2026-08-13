const express = require('express');
const path = require('path');
const { Resend } = require('resend');

const allowedInterests = new Set([
  'spares',
  'tracking',
  'insurance',
  'fleet',
  'other',
]);

const fieldLimits = {
  name: 100,
  email: 254,
  phone: 50,
  company: 150,
  message: 3000,
};

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character]);
}

function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 5, now = Date.now } = {}) {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const timestamp = now();
    const existing = attempts.get(key);
    const entry = !existing || timestamp - existing.startedAt >= windowMs
      ? { count: 0, startedAt: timestamp }
      : existing;

    entry.count += 1;
    attempts.set(key, entry);

    if (entry.count > max) {
      console.warn('Contact submission rate limited.');
      return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }

    return next();
  };
}

function buildEmail({ name, email, phone, company, interest, message }) {
  const companyLine = company ? `Company: ${company}\n` : '';
  const text = [
    'New Click For Parts enquiry',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    companyLine.trimEnd(),
    `Interest: ${interest}`,
    '',
    'Message:',
    message,
  ].filter((line) => line !== '').join('\n');

  const htmlCompany = company
    ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>`
    : '';

  const html = [
    '<h1>New Click For Parts enquiry</h1>',
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>`,
    htmlCompany,
    `<p><strong>Interest:</strong> ${escapeHtml(interest)}</p>`,
    `<p><strong>Message:</strong><br>${escapeHtml(message).replace(/\r?\n/g, '<br>')}</p>`,
  ].join('');

  return { text, html };
}

function createApp({
  emailSender,
  apiKey = process.env.RESEND_API_KEY,
  contactToEmail = process.env.CONTACT_TO_EMAIL,
  rateLimitOptions,
} = {}) {
  const app = express();
  const sender = emailSender || (apiKey ? new Resend(apiKey).emails : null);

  app.set('trust proxy', 1);
  app.use(express.urlencoded({ extended: false, limit: '16kb' }));
  app.use(express.json({ limit: '16kb' }));
  app.use(express.static(path.join(__dirname)));

  app.post('/contact', createRateLimiter(rateLimitOptions), async (req, res) => {
    const website = String(req.body.website || '').trim();
    if (website) {
      console.warn('Contact submission rejected by abuse protection.');
      return res.status(400).json({ message: 'Unable to process this request.' });
    }

    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim();
    const phone = String(req.body.phone || '').trim();
    const company = String(req.body.company || '').trim();
    const interest = String(req.body.interest || '').trim();
    const message = String(req.body.message || '').trim();

    const fieldsHaveValidLengths = name.length <= fieldLimits.name
      && email.length <= fieldLimits.email
      && phone.length <= fieldLimits.phone
      && company.length <= fieldLimits.company
      && message.length <= fieldLimits.message;
    const emailHasValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !email || !phone || !interest || !message
      || !allowedInterests.has(interest) || !fieldsHaveValidLengths || !emailHasValidFormat) {
      return res.status(400).json({ message: 'Please complete the required fields.' });
    }

    if (!sender || !contactToEmail) {
      console.error('Contact email delivery is not configured.');
      return res.status(503).json({ message: 'Something went wrong. Please try again.' });
    }

    const { text, html } = buildEmail({ name, email, phone, company, interest, message });

    try {
      const result = await sender.send({
        from: 'Click For Parts <onboarding@resend.dev>',
        to: [contactToEmail],
        replyTo: email,
        subject: `New Click For Parts enquiry — ${interest}`,
        text,
        html,
      });

      if (result.error) {
        console.error('Contact email provider rejected the request.');
        return res.status(502).json({ message: 'Something went wrong. Please try again.' });
      }

      console.log(`Contact submission accepted: interest=${interest}`);
      return res.status(200).json({ message: 'Message sent successfully.' });
    } catch {
      console.error('Contact email provider request failed.');
      return res.status(502).json({ message: 'Something went wrong. Please try again.' });
    }
  });

  app.use((error, req, res, next) => {
    if (error?.type === 'entity.too.large') {
      return res.status(413).json({ message: 'Request is too large.' });
    }

    console.error('Unexpected server error.');
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  });

  return app;
}

function startServer() {
  const app = createApp();
  const preferredPort = Number(process.env.PORT) || 3000;
  const portsToTry = [preferredPort, 3001, 3002, 3003, 3004, 3005];

  function listen(port) {
    app.listen(port, () => {
      console.log(`Click For Parts server running on http://localhost:${port}`);
    }).on('error', (error) => {
      if (error.code === 'EADDRINUSE' && portsToTry.length > 1) {
        const nextPort = portsToTry.shift();
        console.log(`Port ${port} is busy. Trying ${nextPort} instead...`);
        listen(nextPort);
      } else {
        console.error('Server failed to start.');
        process.exit(1);
      }
    });
  }

  listen(portsToTry[0]);
}

if (require.main === module) {
  startServer();
}

module.exports = { buildEmail, createApp, escapeHtml };
