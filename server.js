const express = require('express');
const path = require('path');

const app = express();
const preferredPort = Number(process.env.PORT) || 3000;
const portsToTry = [preferredPort, 3001, 3002, 3003, 3004, 3005];

function startServer(port) {
  app.listen(port, () => {
    console.log(`Click For Parts server running on http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE' && portsToTry.length > 1) {
      const nextPort = portsToTry.shift();
      console.log(`Port ${port} is busy. Trying ${nextPort} instead...`);
      startServer(nextPort);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/contact', (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim();
  const phone = String(req.body.phone || '').trim();
  const interest = String(req.body.interest || '').trim();
  const message = String(req.body.message || '').trim();

  const allowedInterests = [
    'spares',
    'tracking',
    'insurance',
    'fleet',
    'other',
  ];

  if (!name || !email || !phone || !interest || !message || !allowedInterests.includes(interest)) {
    return res.status(400).send('Please complete the required fields.');
  }

  console.log('New contact request:');
  console.log({ name, email, phone, interest, message });

  // TODO: Replace console logging with an email service or database integration.

  return res.redirect('/');
});

startServer(portsToTry[0]);
