# Click For Parts

Click For Parts (Pty) Ltd is a registered South African private company positioned as
an integrated automotive partner for individual motorists and fleet operators.

Core positioning: **We keep you covered on every journey.**

## Services

The business has three core service pillars:

1. Motor Vehicle Spares
2. Vehicle Tracking
3. Motor Insurance

Fleet is a customer segment and use case, not a fourth service. The project does not
claim unverified partners, clients, certifications, testimonials, provider relationships,
statistics, or delivery guarantees.

## Company and public contact information

- Legal name: Click For Parts (Pty) Ltd
- Registration number: `2026/594687/07`
- Registration date: 29 July 2026
- Registered office: 62 6th Street, Springs, Gauteng, 1575, South Africa
- Phone: [066 560 8782](tel:+27665608782)
- Email: [info@clickforparts.co.za](mailto:info@clickforparts.co.za)

Sensitive supporting-document details are private and must not be committed or exposed.

## Production deployment

- Status: **VERIFIED**
- Website: https://click-for-parts.onrender.com
- Hosting: Render Web Service
- Repository: `Khul4ni/click-for-parts`
- Deployment branch: `master`
- Deployment: Render auto-deploys from `master`
- Runtime: Node.js / Express
- Build command: `npm install`
- Start command: `npm start`

The production site uses a dark navy responsive design and includes Home, Services,
Integrated Value, How It Works, Who We Serve, About, Contact, and Footer sections.
Desktop and approximately 390px mobile behavior have been verified.

## Phase 4A contact delivery

**TEMPORARY / TEST-MODE EMAIL DELIVERY — VERIFIED**

```text
Visitor
  → async contact form
  → Express validation
  → body-size protection
  → honeypot
  → in-memory rate limiting
  → Resend API
  → configured recipient
  → accessible success or error feedback
```

Temporary automated sender: `Click For Parts <onboarding@resend.dev>`.

Runtime environment-variable names:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`

Their values must never be committed, printed, or logged. The public Google Workspace
mailbox and automated Resend sender are separate systems: the form does **not** currently
send from `info@clickforparts.co.za`.

Server validation requires `name`, `email`, `phone`, `interest`, and `message`; `company`
is optional. Allowed interest values are `spares`, `tracking`, `insurance`, `fleet`, and
`other`.

Phase 4A verification covers valid acceptance, sending/success/failure UI states,
duplicate-submit protection, invalid-submission rejection, the honeypot, 16 KB body
limit, per-IP rate limiting, privacy-safe logging, and owner-observed inbox delivery.

Limitations:

- `onboarding@resend.dev` is temporary.
- The in-memory limiter resets on restart and is not distributed across instances.
- Provider acceptance does not guarantee inbox placement.
- A custom Resend sender domain is not configured.

## Domain and business email

- `clickforparts.co.za`: **OWNED / ACTIVE / NOT YET CONNECTED TO RENDER**
- Registrar and DNS provider: HostAfrica
- Google Workspace domain ownership: **VERIFIED**
- Gmail activation: **VERIFIED**
- Incoming and outgoing mailbox tests: **VERIFIED**
- Primary mailbox: `info@clickforparts.co.za`
- SPF: **CONFIGURED** — `v=spf1 include:_spf.google.com ~all`
- DKIM: **CONFIGURED / PROPAGATION PENDING** — selector `google._domainkey`
- DMARC: **NOT YET CONFIGURED**
- Resend custom sender domain: **NOT YET CONFIGURED**

The current Google Workspace MX record uses priority `1` and destination
`smtp.google.com`. One outgoing test initially reached spam; SPF, DKIM, and DMARC improve
authentication and deliverability, but mailbox providers make independent spam decisions.

## Phase 4B remaining work

Phase 4B is partially started at the infrastructure level but is not complete:

1. Verify Google Workspace DKIM after DNS propagation.
2. Allow authentication changes to stabilise, then configure DMARC beginning with a
   monitoring policy such as `p=none`.
3. Verify `clickforparts.co.za` in Resend.
4. Replace the temporary Resend sender with an approved domain sender.
5. Connect the apex and `www` domains to Render.
6. Verify redirects, HTTPS, DNS, and production behavior on the custom domain.
7. Complete final production hardening.

## Local development

```bash
npm install
npm test
npm start
```

The repository does not currently pin a Node version. The installed Resend SDK requires
Node.js 20 or newer.

## Render configuration note

`render.yaml` is **UNTRACKED / UNUSED / UNREVIEWED**. It is not part of the live
deployment and must not be treated as production configuration.
