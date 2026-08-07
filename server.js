const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/contact', (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim();
  const phone = String(req.body.phone || '').trim();
  const message = String(req.body.message || '').trim();

  if (!name || !email || !message) {
    return res.status(400).send('Please complete the required fields.');
  }

  console.log('New contact request:');
  console.log({ name, email, phone, message });

  // TODO: Replace console logging with an email service or database integration.

  return res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Click For Parts server running on http://localhost:${PORT}`);
});
