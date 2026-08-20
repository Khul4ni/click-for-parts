# Click For Parts System Overview

## Purpose and positioning

Click For Parts is the production website for Click For Parts (Pty) Ltd, a registered
South African private company and integrated automotive partner.

The site positions three core services:

- Motor Vehicle Spares
- Vehicle Tracking
- Motor Insurance

It serves individual motorists and fleet operators. Fleet is a customer segment/use
case, not a separate fourth service. The primary message is: **We keep you covered on
every journey.**

No unverified partner, client, certification, testimonial, insurer, tracking-provider,
performance-statistic, or delivery-guarantee claim should be added.

## Verified company information

- Legal name: Click For Parts (Pty) Ltd
- Registration number: `2026/594687/07`
- Registration date: 29 July 2026
- Registered office: 62 6th Street, Springs, Gauteng, 1575, South Africa
- Phone: `066 560 8782` (`tel:+27665608782`)
- Public mailbox: `info@clickforparts.co.za`

The website displays the legal name, phone, email, and registered-office address. It does
not contain personal ID numbers, bank details, tax references, passwords, API keys, or
private supporting-document information.

## Technology and repository

- Frontend: semantic HTML, CSS, and vanilla JavaScript
- Backend: Node.js and Express
- Contact delivery: Resend Node.js SDK
- Tests: Node.js built-in test runner
- Hosting: Render Web Service
- Repository: `Khul4ni/click-for-parts`
- Deployment branch: `master`
- Live URL: https://click-for-parts.onrender.com

Render deployment and the production website are **VERIFIED**. Render auto-deploys from
`master`. The repository does not pin Node; Resend requires Node.js 20 or newer.

## Production website

The current single-page site includes accessible sticky desktop/mobile navigation, a
dark navy responsive visual system, Home, the three service pillars, Integrated Value,
How It Works, Who We Serve, About, Contact, and a responsive legal/contact footer.

The Contact section and footer show the verified phone, mailbox, and registered-office
address. Phone and email use accessible `tel:` and `mailto:` links.

Production checks at desktop and approximately 390px mobile confirmed no horizontal
overflow, no console errors, working mobile navigation and `aria-expanded` behavior,
keyboard focus visibility, cyan focus treatment, a dark navy sticky header, and a
responsive footer.

## Contact form architecture

```text
Visitor
  → asynchronous form submission
  → POST /contact
  → Express validation
  → 16 KB body limit and field-length limits
  → honeypot
  → per-IP in-memory rate limiting
  → Resend API
  → CONTACT_TO_EMAIL
  → accessible frontend success/failure feedback
```

Required fields are `name`, `email`, `phone`, `interest`, and `message`; `company` is
optional. Allowed interests are `spares`, `tracking`, `insurance`, `fleet`, and `other`.

Expected responses are `200` for provider acceptance, `400` for invalid input, `413` for
an oversized body, `429` for rate limiting, `502` for provider failure, and `503` for
missing server configuration.

## Email systems: important distinction

### Public business mailbox

- Mailbox: `info@clickforparts.co.za`
- Provider: Google Workspace
- Domain ownership: **VERIFIED**
- Gmail activation: **VERIFIED**
- Incoming/outgoing tests: **VERIFIED**

### Automated website delivery

- Phase: **TEMPORARY / TEST-MODE EMAIL DELIVERY — VERIFIED**
- Provider: Resend
- Sender: `Click For Parts <onboarding@resend.dev>`
- Configuration names: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`

The public mailbox and automated sender are separate. The form does not send from the
public mailbox or custom domain yet. A later approved sender may be
`website@clickforparts.co.za`, but that is only a plan and is not implemented.

## Security and privacy

The server logs only privacy-safe operational events. It does not log customer names,
email addresses, phone numbers, company names, enquiry messages, API keys, recipient
addresses, or raw provider errors.

Current basic abuse controls are a honeypot, request/field limits, duplicate-submit
prevention, and per-IP in-memory rate limiting. The limiter resets on restart and is not
distributed. Provider API acceptance does not guarantee inbox delivery.

## Domain and authentication state

- Domain `clickforparts.co.za`: **OWNED / ACTIVE**
- Website domain mapping: **NOT YET CONNECTED TO RENDER**
- DNS provider: HostAfrica
- Google-only SPF: **CONFIGURED**
- DKIM: **CONFIGURED / PROPAGATION PENDING**
- DMARC: **NOT YET CONFIGURED**
- Resend sender-domain verification: **NOT YET CONFIGURED**

Current DNS facts:

- Google Workspace MX: host `@`, priority `1`, destination `smtp.google.com`
- SPF: `v=spf1 include:_spf.google.com ~all`
- DKIM selector: `google._domainkey`; the TXT value begins `v=DKIM1; k=rsa; p=...`

The full DKIM key is intentionally omitted. DMARC should be added only after DKIM is
verified and authentication has stabilised, beginning with monitoring such as `p=none`.
Email authentication supports deliverability but does not guarantee inbox placement.

## Procurement readiness

The business has CIPC registration, SARS registration, business-banking confirmation,
supplier-verification paperwork, an active domain, and a working Google Workspace
mailbox. Sensitive values in these documents remain private.

Supplier-verification/onboarding paperwork involving Netstar / Altron exists. It is not
evidence of final appointment, so the business must not be described as an official
Netstar partner, authorised dealer, or approved supplier without separate proof.

## Phase status

- Phase 3 website redesign: **COMPLETE / VERIFIED**
- Phase 4A Resend delivery: **COMPLETE / VERIFIED**
- Phase 4B: **PARTIALLY STARTED AT INFRASTRUCTURE LEVEL / NOT COMPLETE**

Phase 4B remaining work includes DKIM verification, DMARC, Resend domain verification,
replacement of the temporary sender, Render custom-domain mapping for apex and `www`,
HTTPS/redirect verification, and final DNS/production hardening.

## Repository note

`render.yaml` remains **UNTRACKED / UNUSED / UNREVIEWED** and is not part of the live
Render deployment.
