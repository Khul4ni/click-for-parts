function initializePage(documentRef = document, fetchImpl = fetch) {
  const toggle = documentRef.querySelector('.nav-toggle');
  const nav = documentRef.querySelector('.site-nav');
  const year = documentRef.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        nav.querySelector('a')?.focus();
      }
    });
  }

  documentRef.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      nav?.classList.remove('is-open');
    });
  });

  const form = documentRef.getElementById('contact-form');
  const status = documentRef.getElementById('form-status');
  const submitButton = form?.querySelector('button[type="submit"]');
  let isSubmitting = false;

  if (!form || !status || !submitButton) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    isSubmitting = true;
    submitButton.disabled = true;
    status.textContent = 'Sending...';
    status.classList.remove('visually-hidden');

    try {
      const response = await fetchImpl(form.action, {
        method: 'POST',
        body: new URLSearchParams(new FormData(form)),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Submission failed');

      status.textContent = 'Message sent successfully.';
      form.reset();
    } catch {
      status.textContent = 'Something went wrong. Please try again.';
    } finally {
      isSubmitting = false;
      submitButton.disabled = false;
    }
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => initializePage());
}

if (typeof module !== 'undefined') {
  module.exports = { initializePage };
}
