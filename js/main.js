document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        // focus first link for keyboard users
        const firstLink = nav.querySelector('a');
        firstLink?.focus();
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      nav?.classList.remove('is-open');
    });
  });

  // Basic client-side validation for the contact form (does not replace server validation)
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', (e) => {
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const interest = form.querySelector('#interest');
      const message = form.querySelector('#message');
      let invalid = false;
      let msg = '';
      if (!name?.value.trim()) { invalid = true; msg = 'Please enter your name.'; }
      else if (!email?.value.trim()) { invalid = true; msg = 'Please enter your email.'; }
      else if (!interest?.value) { invalid = true; msg = 'Please select what you are interested in.'; }
      else if (!message?.value.trim()) { invalid = true; msg = 'Please enter a short message.'; }

      if (invalid) {
        e.preventDefault();
        status.textContent = msg;
        status.classList.remove('visually-hidden');
        status.focus?.();
      } else {
        // allow form to submit; show a brief status for screen-readers
        status.textContent = 'Submitting request…';
        status.classList.remove('visually-hidden');
      }
    });
  }
});
