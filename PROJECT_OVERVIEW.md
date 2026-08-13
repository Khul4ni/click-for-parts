# Click For Parts System Overview

## Project Purpose

This project is a marketing-focused website for Click For Parts. It is designed as a small business landing site with an informational homepage, service descriptions, a portfolio placeholder, and a contact form.

## Technology Stack

- Frontend:
  - HTML5 for page structure and content
  - CSS3 for layout, typography, colors, and responsive styling
  - Vanilla JavaScript for navigation toggling, smooth section behavior, and year auto-update
- Backend:
  - Node.js with Express as the contact form backend
  - No database or email service is configured yet
- Hosting model:
  - Static site assets served from the project root
  - A single Express route to process contact form submissions

## Files and Structure

Root files:
- `index.html`
  - Main website page with hero, about, services, portfolio, clients, and contact sections.
  - Uses a contact form that posts to `/contact`.
- `contact.php`
  - Original PHP contact handler.
  - No longer used by the new JavaScript backend and can be removed once server deployment is confirmed.
- `server.js`
  - Express server entry point.
  - Serves static site content and handles POST requests at `/contact`.
- `README.md`
  - Project summary, stack guidance, and deployment notes.
- `PROJECT_OVERVIEW.md`
  - Comprehensive system explanation including features, functions, and project structure.
- `BUILD_PLAN.md`
  - Original development and handoff checklist.

Asset folders:
- `css/`
  - `style.css` — primary site styling, layout, typography, buttons, cards, and form styles.
  - `responsive.css` — responsive layout rules for smaller screens.
- `js/`
  - `main.js` — frontend behavior for navigation toggle, anchor link handling, and dynamic year update.

## Frontend Features

### Navigation
- Responsive mobile navigation menu.
- Toggle button opens and closes the menu.
- Anchor links collapse the menu when a section is selected.

### Hero and marketing content
- Hero section with messaging, call-to-action buttons, and brand positioning.
- About and services sections describing the business offer.
- Portfolio placeholder for embedded video content.
- Clients and partners section for logos/names.

### Contact section
- Contact form fields: name, email, phone, and message.
- Required validation on name, email, and message.
- Uses `novalidate` meaning browser validation is not forced; custom backend validation is used instead.
- Contact details block with phone, WhatsApp, email, and address placeholders.

### Footer
- Copyright and current year text updated automatically.

## Backend Features

### Express backend
- Single endpoint: `POST /contact`
- Receives form data from the frontend contact form
- Validates required fields: `name`, `email`, and `message`
- Logs request details to the server console
- Redirects back to the homepage after handling the submission

### Data handling
- Uses `express.urlencoded()` middleware to parse form submissions
- Uses `express.json()` middleware for consistency with JSON request handling
- Currently prints contact submissions to console as a stand-in for real delivery

### Deployment notes
- The backend is intended to run on Node.js with Express.
- To start the server:
  1. Install Node.js dependencies:
     ```bash
     npm init -y
     npm install express
     ```
  2. Run the server:
     ```bash
     node server.js
     ```
  3. Open `http://localhost:3000` in a browser.

- If deploying to production, add a real email service or persistence layer.
- If deploying to production, add a real email service or persistence layer.
Render is the recommended deployment target for this Node.js-backed site.
Deployment status: Deployed to Render (Phase 2 VERIFIED). Live URL: https://click-for-parts.onrender.com

Deployment facts (verified)

- Hosting provider: Render Web Service
- GitHub repository: `Khul4ni/click-for-parts`
- Branch: `master`
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`

Note: a local file named `render.yaml` exists in the working directory but is UNTRACKED by Git in this environment and was NOT part of the verified deployment. Review before committing.
- If the site remains fully static, the `server.js` backend can still be used for contact form handling behind a Node host.

## Recommended Improvements

- Replace console logging in `server.js` with a transactional email provider or CRM integration.
- Remove `contact.php` and update documentation once the backend is confirmed to use Node/Express.
- Add client-side form validation and user-friendly success/error messaging.
- Improve accessibility by adding `aria-live` messaging and validation error text.
- Add production-ready security headers and request rate limiting if this is deployed publicly.

## Summary of current behavior

- Users load `index.html`.
- They can navigate sections through the site header links.
- They can submit the contact form.
- The form sends a `POST` request to the backend route `/contact`.
- The backend validates required fields.
- The backend logs the form data and redirects to the homepage.

## Phase 4A temporary email delivery

**TEMPORARY / TEST-MODE EMAIL DELIVERY**

The Express contact route now validates and rate-limits submissions before sending them
through Resend. It uses the Resend test sender until the owner purchases and verifies a
custom domain. Resend test-mode delivery may be restricted to the email associated with
the Resend account. Provider credentials and the recipient are supplied only through
Render environment variables.

## Important notes

- `contact.php` remains in the repository for reference but is not part of the current JavaScript backend flow.
- The new backend expects the form action to target the Node server root path.
- This setup is suitable for local development and can be extended for deployment on any Node-capable host.
