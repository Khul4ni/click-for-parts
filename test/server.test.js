const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { createApp } = require('../server');

const validSubmission = {
  name: 'Test User',
  email: 'visitor@example.com',
  phone: '0123456789',
  company: 'Example & Sons',
  interest: 'spares',
  message: 'Please quote <part> & accessories.',
  website: '',
};

async function withServer(options, callback) {
  const server = createApp(options).listen(0);
  await once(server, 'listening');
  const { port } = server.address();
  try {
    await callback(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

function post(url, body, headers = {}) {
  return fetch(`${url}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

test('valid submission sends safe text and HTML email', async () => {
  let sent;
  const emailSender = { send: async (payload) => { sent = payload; return { data: { id: 'test-id' }, error: null }; } };

  await withServer({ emailSender, contactToEmail: 'recipient@example.com' }, async (url) => {
    const response = await post(url, validSubmission);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).message, 'Message sent successfully.');
  });

  assert.equal(sent.from, 'Click For Parts <onboarding@resend.dev>');
  assert.deepEqual(sent.to, ['recipient@example.com']);
  assert.equal(sent.replyTo, validSubmission.email);
  assert.equal(sent.subject, 'New Click For Parts enquiry — spares');
  assert.match(sent.text, /Example & Sons/);
  assert.match(sent.html, /Example &amp; Sons/);
  assert.match(sent.html, /&lt;part&gt; &amp; accessories/);
  assert.doesNotMatch(sent.html, /<part>/);
});

test('optional company may be omitted', async () => {
  let sent;
  const emailSender = { send: async (payload) => { sent = payload; return { data: { id: 'test-id' } }; } };
  const body = { ...validSubmission };
  delete body.company;

  await withServer({ emailSender, contactToEmail: 'recipient@example.com' }, async (url) => {
    assert.equal((await post(url, body)).status, 200);
  });

  assert.doesNotMatch(sent.text, /Company:/);
  assert.doesNotMatch(sent.html, /Company:/);
});

test('missing required fields and invalid interests are rejected', async (t) => {
  const emailSender = { send: async () => { throw new Error('should not send'); } };
  for (const field of ['name', 'email', 'phone', 'interest', 'message']) {
    await t.test(`missing ${field}`, async () => {
      const body = { ...validSubmission, [field]: '' };
      await withServer({ emailSender, contactToEmail: 'recipient@example.com' }, async (url) => {
        assert.equal((await post(url, body)).status, 400);
      });
    });
  }

  await t.test('invalid interest', async () => {
    await withServer({ emailSender, contactToEmail: 'recipient@example.com' }, async (url) => {
      assert.equal((await post(url, { ...validSubmission, interest: 'invalid' })).status, 400);
    });
  });

  await t.test('invalid email', async () => {
    await withServer({ emailSender, contactToEmail: 'recipient@example.com' }, async (url) => {
      assert.equal((await post(url, { ...validSubmission, email: 'not-an-email' })).status, 400);
    });
  });
});

test('honeypot blocks delivery', async () => {
  let calls = 0;
  const emailSender = { send: async () => { calls += 1; } };
  await withServer({ emailSender, contactToEmail: 'recipient@example.com' }, async (url) => {
    assert.equal((await post(url, { ...validSubmission, website: 'spam.example' })).status, 400);
  });
  assert.equal(calls, 0);
});

test('oversized request returns 413', async () => {
  const emailSender = { send: async () => ({ data: { id: 'test-id' } }) };
  await withServer({ emailSender, contactToEmail: 'recipient@example.com' }, async (url) => {
    const response = await post(url, 'x'.repeat(17 * 1024), { 'Content-Type': 'application/json' });
    assert.equal(response.status, 413);
  });
});

test('rate limiter is scoped to contact requests', async () => {
  const emailSender = { send: async () => ({ data: { id: 'test-id' } }) };
  await withServer({ emailSender, contactToEmail: 'recipient@example.com', rateLimitOptions: { max: 1 } }, async (url) => {
    assert.equal((await post(url, validSubmission)).status, 200);
    assert.equal((await post(url, validSubmission)).status, 429);
    assert.equal((await fetch(`${url}/`)).status, 200);
  });
});

test('provider rejection and failure return safe 502 responses', async (t) => {
  for (const emailSender of [
    { send: async () => ({ error: { message: 'secret provider detail' } }) },
    { send: async () => { throw new Error('secret provider detail'); } },
  ]) {
    await t.test('safe provider failure', async () => {
      await withServer({ emailSender, contactToEmail: 'recipient@example.com' }, async (url) => {
        const response = await post(url, validSubmission);
        assert.equal(response.status, 502);
        assert.deepEqual(await response.json(), { message: 'Something went wrong. Please try again.' });
      });
    });
  }
});

test('missing configuration returns 503 without sending', async () => {
  await withServer({ apiKey: '', contactToEmail: '' }, async (url) => {
    const response = await post(url, validSubmission);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { message: 'Something went wrong. Please try again.' });
  });
});

test('operational logs contain no submitted customer data or provider details', async () => {
  const original = { log: console.log, error: console.error, warn: console.warn };
  const logs = [];
  console.log = (...args) => logs.push(args.join(' '));
  console.error = (...args) => logs.push(args.join(' '));
  console.warn = (...args) => logs.push(args.join(' '));

  try {
    const emailSender = { send: async () => { throw new Error('provider-secret-detail'); } };
    await withServer({ emailSender, contactToEmail: 'recipient@example.com' }, async (url) => {
      await post(url, validSubmission);
    });
  } finally {
    Object.assign(console, original);
  }

  const output = logs.join('\n');
  for (const sensitive of [validSubmission.name, validSubmission.email, validSubmission.phone, validSubmission.message, 'provider-secret-detail']) {
    assert.doesNotMatch(output, new RegExp(sensitive.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
