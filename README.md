# Click For Parts

This starter project turns the website brief into a practical, handoff-ready static website structure for Click For Parts.

## What is included
- Semantic HTML for the main marketing sections
- CSS split into base and responsive files
- Minimal JavaScript for navigation and form handling
- A Node.js backend for contact form processing
- A simple build plan and client handover checklist

## Current stack
- Frontend: HTML5 + CSS3 + vanilla JavaScript
- Hosting: Render (Node.js service)
- Domain: clickforparts.co.za (once confirmed)
- Email: info@clickforparts.co.za (once configured)
- Video: YouTube or Vimeo embeds

Live demo

- Render service (Phase 2 VERIFIED): https://click-for-parts.onrender.com

Deployment facts (verified)

- Hosting provider: Render Web Service
- GitHub repository: `Khul4ni/click-for-parts`
- Branch: `master`
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`

Notes

- `render.yaml` (local): present in the working directory but UNTRACKED by Git in this environment; it was NOT verified as part of the live deployment.
- Domain: `clickforparts.co.za` — proposed / placeholder — NOT YET CONFIGURED
- Email: `info@clickforparts.co.za` — proposed / placeholder — NOT YET CONFIGURED
- Do not hard-code email service ports or DNS records until the hosting account or domain is provisioned.
- Replace all placeholders with real business details before launch.

## Contact email delivery

**TEMPORARY / TEST-MODE EMAIL DELIVERY — VERIFIED**

The contact form sends through Resend using `Click For Parts <onboarding@resend.dev>`.
The production flow is:

```text
Visitor
  → async contact form
  → Express validation
  → honeypot, per-IP rate limiting, and 16 KB body limit
  → Resend API
  → CONTACT_TO_EMAIL
  → accessible success or error feedback
```

Render provides `RESEND_API_KEY` and `CONTACT_TO_EMAIL` as environment variables. Their
values must never be committed or logged. Production verification confirmed valid
submission acceptance, the frontend success state, rejection of invalid submissions,
active abuse protection, privacy-safe logging, and working desktop/mobile navigation.

Current limitations:

- No custom domain or business mailbox has been configured.
- The `resend.dev` sender is temporary.
- The in-memory rate limiter resets whenever the service restarts.
- Provider acceptance does not guarantee inbox delivery, although the owner has observed
  successful delivery during Phase 4A verification.

Phase 4B remains future work: purchase and configure the custom domain and business
mailbox, verify a Resend sender domain, publish SPF/DKIM/DMARC records, replace the test
sender, and complete final production hardening.
