# Click For Parts — Technical Documentation

## 1. Current status matrix

| Area | Status | Current fact |
|---|---|---|
| Production website | **VERIFIED** | https://click-for-parts.onrender.com |
| Render deployment | **VERIFIED** | Web Service auto-deploying from `master` |
| Public business email | **VERIFIED** | `info@clickforparts.co.za` |
| Google Workspace Gmail | **VERIFIED** | Incoming and outgoing tests succeeded |
| SPF | **CONFIGURED** | Google-only SPF is published |
| DKIM | **CONFIGURED / PROPAGATION PENDING** | Google selector is published; verification is pending |
| DMARC | **NOT YET CONFIGURED** | Planned after DKIM stabilises |
| Custom website domain | **OWNED / NOT YET CONNECTED TO RENDER** | `clickforparts.co.za` is active at HostAfrica |
| Resend custom sender domain | **NOT YET CONFIGURED** | Temporary `resend.dev` sender remains active |
| Phase 4A | **COMPLETE / VERIFIED** | Temporary Resend delivery is production-live |
| Phase 4B | **PARTIALLY STARTED / NOT COMPLETE** | Domain and mail infrastructure work remains |

## 2. Company and product scope

Click For Parts (Pty) Ltd is a registered South African private company.

- Registration number: `2026/594687/07`
- Registration date: 29 July 2026
- Registered office: 62 6th Street, Springs, Gauteng, 1575, South Africa
- Phone: `066 560 8782`
- Email: `info@clickforparts.co.za`

The business is positioned as an integrated automotive partner for individual motorists
and fleet operators. Its three services are Motor Vehicle Spares, Vehicle Tracking, and
Motor Insurance. Fleet is a customer segment/use case, not a fourth service. The core
message is: **We keep you covered on every journey.**

Do not add unverified claims about partners, clients, certifications, testimonials,
insurers, tracking providers, statistics, or delivery guarantees.

## 3. Application architecture

### Stack

- HTML5, CSS3, and vanilla JavaScript
- Node.js and Express
- Resend Node.js SDK
- Node.js built-in test runner
- GitHub source repository
- Render Web Service hosting

The repository does not explicitly pin Node.js. Resend requires Node.js 20 or newer.

### Request flow

```text
Browser
  → Express static assets
  → asynchronous POST /contact
  → server validation
  → request and field-size controls
  → honeypot
  → in-memory per-IP rate limiting
  → Resend API
  → configured recipient
  → JSON response
  → accessible frontend status
```

### Important files

- `index.html`: page structure, service content, verified public contact details, and form
- `css/style.css`: dark navy design system and component styles
- `css/responsive.css`: mobile navigation and responsive layout
- `js/main.js`: navigation behavior and asynchronous form submission
- `server.js`: Express server, validation, abuse protection, and Resend delivery
- `package.json` / `package-lock.json`: runtime scripts and dependencies
- `test/server.test.js`: backend and privacy tests with a mocked sender
- `test/frontend.test.js`: form-state and duplicate-submit tests

The legacy `contact.php` file is not used by the production Node/Express path.

## 4. Website and accessibility

The production page contains Home, Services, Integrated Value, How It Works, Who We
Serve, About, Contact, and Footer sections. It presents three automotive services and no
portfolio/client placeholders.

The verified Contact and Footer details are:

- Click For Parts (Pty) Ltd
- [066 560 8782](tel:+27665608782)
- [info@clickforparts.co.za](mailto:info@clickforparts.co.za)
- 62 6th Street, Springs, Gauteng, 1575

Verified desktop and approximately 390px mobile behavior includes:

- no horizontal overflow,
- no browser console errors,
- working mobile menu open/close behavior,
- correct `aria-expanded` state,
- visible keyboard focus with cyan treatment,
- dark navy sticky navigation,
- tap-friendly phone and email links, and
- responsive footer wrapping.

### Header regression history

A legacy CSS rule briefly caused a light header background with near-white navigation
text. Commit `91d35fb903504090dc3b84a7550262226e0e9f68`
(`fix: restore dark navigation styling`) restored the dark navy header and mobile menu.

## 5. Contact endpoint

### Validation

Required fields: `name`, `email`, `phone`, `interest`, and `message`. The `company` field
is optional.

Allowed `interest` values:

- `spares`
- `tracking`
- `insurance`
- `fleet`
- `other`

The server also enforces maximum field lengths and a 16 KB request-body limit.

### Abuse controls

- hidden honeypot field,
- route-scoped per-IP in-memory rate limiter,
- duplicate-submit prevention in the browser, and
- disabled submit control while a request is pending.

The limiter resets when the process restarts and does not coordinate across multiple
instances.

### Responses

- `200`: Resend accepted the request
- `400`: required-field, format, whitelist, or honeypot failure
- `413`: request body too large
- `429`: rate limit exceeded
- `502`: provider rejection/failure
- `503`: missing server configuration

Provider acceptance means accepted for processing, not guaranteed inbox placement.

### Logging and privacy

Only privacy-safe operational events are logged. The application does not log customer
name, customer email, phone, company, enquiry message, API keys, recipient address, or
raw provider errors.

## 6. Phase 4A email delivery

**TEMPORARY / TEST-MODE EMAIL DELIVERY — VERIFIED**

- Provider: Resend API
- Sender: `Click For Parts <onboarding@resend.dev>`
- Runtime configuration: `RESEND_API_KEY` and `CONTACT_TO_EMAIL`
- Public business mailbox: `info@clickforparts.co.za`

Environment-variable values are secrets and must never appear in source, documentation,
logs, screenshots, or chat.

Production verification includes valid request acceptance, `Sending...`, success and
failure UI states, duplicate-submit prevention, invalid request rejection, honeypot,
body-size and rate-limit behavior, privacy-safe logging, and owner-observed inbox delivery.

The automated sender is not the public mailbox. The form still sends from
`onboarding@resend.dev`; a custom sender such as `website@clickforparts.co.za` is only a
future option pending Resend domain verification.

## 7. Domain, Google Workspace, and DNS

### Domain

- Domain: `clickforparts.co.za`
- Registrar / DNS provider: HostAfrica
- Registration state: **OWNED / ACTIVE**
- Render mapping: **NOT YET CONNECTED**
- Current public site: https://click-for-parts.onrender.com

The apex and `www` hostnames remain Phase 4B work. Do not claim that the custom domain
currently serves the website.

### Google Workspace

- Domain ownership: **VERIFIED**
- Gmail: **ACTIVATED / VERIFIED**
- Incoming test: **VERIFIED**
- Outgoing test: **VERIFIED**
- Primary mailbox: `info@clickforparts.co.za`
- MX host: `@`
- MX priority: `1`
- MX destination: `smtp.google.com`

### SPF

Status: **CONFIGURED**

```text
v=spf1 include:_spf.google.com ~all
```

This is the current Google-only SPF configuration and replaced the legacy HostAfrica mail
configuration.

### DKIM

Status: **CONFIGURED / PROPAGATION PENDING**

- Record type: `TXT`
- Selector / host: `google._domainkey`
- Value prefix: `v=DKIM1; k=rsa; p=...`

The full public key is intentionally omitted. Google Workspace authentication has not yet
verified the record and advised allowing up to 48 hours for DNS propagation.

### DMARC

Status: **NOT YET CONFIGURED**

Planned order:

1. Keep SPF configured.
2. Verify DKIM.
3. Allow authentication to stabilise.
4. Publish DMARC.
5. Begin with monitoring such as `p=none`.

An outgoing Gmail test initially landed in spam. SPF, DKIM, and DMARC improve sender
authentication and deliverability, but receiving providers make independent spam and
inbox-placement decisions.

## 8. Deployment and operations

- Production: **VERIFIED**
- Hosting: Render Web Service
- Repository: `Khul4ni/click-for-parts`
- Branch: `master`
- Auto-deploy: enabled from `master`
- Build: `npm install`
- Start: `npm start`
- Live URL: https://click-for-parts.onrender.com

Render environment values must be managed in Render, never in Git. No custom-domain,
Google Workspace, DNS, or Resend-provider configuration is controlled by application code.

`render.yaml` is **UNTRACKED / UNUSED / UNREVIEWED**. It is not part of the verified live
deployment and must not be modified or described as active configuration.

## 9. Testing

Run locally:

```bash
npm test
```

The built-in test suite uses a mocked email sender and does not call the real Resend API.
Coverage includes valid submissions, optional company, required fields, interest and
email validation, safe HTML, honeypot, request size, rate limiting, provider failure,
missing configuration, privacy-safe logs, sending/success/failure UI states, request
encoding, and duplicate-submit prevention.

Production verification has additionally covered Render deployment, exact deployed-file
matching, desktop/mobile rendering, navigation, focus behavior, footer wrapping, direct
business contact links, form UI, Resend acceptance, and owner-observed inbox delivery.

## 10. Git milestones

| Commit | Milestone |
|---|---|
| `d7ba8a883bd848fb85438793ce3f308f6ccfb408` | Phase 3 website implementation |
| `c46967e3afdd79eb595fc43b430a677a519041ee` | Privacy-safe contact logging |
| `cff3381bfc4c74640a3411c540a31b38a35fa46f` | Phase 3 merge |
| `679fca53d2b2f1b9d6dc1ebd120db736ba054b6f` | Phase 4A Resend implementation |
| `3e7ff76cc6b21514e4ffa2c9a5836e41b237a309` | Phase 4A merge |
| `91d35fb903504090dc3b84a7550262226e0e9f68` | Dark navigation regression fix |
| `b33767eceb67cf8b7a253e781a68c38688b2cb50` | Phase 4A documentation closeout |
| `8c15eae78c109f5ae878b1fadbeb25ae8be8edab` | Public business email link |
| `f23a79fd274945cc063c20be25ad4e279f8ded60` | Verified business contact details |

These hashes and messages were verified from repository history during reconciliation.

## 11. Procurement and supplier documentation

The business has supporting CIPC registration, SARS registration, business-banking
confirmation, supplier-verification paperwork, an active domain, and a working Google
Workspace mailbox. This supports procurement and business-verification readiness.

Do not reproduce personal ID numbers, bank details, tax references, passwords, API keys,
personal residential addresses, or other sensitive supporting-document data.

Supplier-verification/onboarding paperwork involving Netstar / Altron exists. It does not
by itself prove final appointment. Do not describe Click For Parts as an official Netstar
partner, authorised dealer, or approved supplier without separate explicit evidence.

## 12. Phase 4B remaining work

Phase 4B is **PARTIALLY STARTED AT INFRASTRUCTURE LEVEL / NOT COMPLETE**.

Remaining work:

1. Verify Google Workspace DKIM after propagation.
2. Configure DMARC after DKIM and authentication stabilise.
3. Verify `clickforparts.co.za` in Resend.
4. Replace the temporary automated sender and confirm routing to the business mailbox.
5. Connect `clickforparts.co.za` and `www.clickforparts.co.za` to Render.
6. Verify HTTPS, canonical redirects, DNS, and production behavior.
7. Complete final DNS and production hardening.
