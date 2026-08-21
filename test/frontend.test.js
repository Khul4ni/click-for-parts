const test = require('node:test');
const assert = require('node:assert/strict');

class FakeClassList {
  constructor() { this.values = new Set(['visually-hidden']); }
  remove(value) { this.values.delete(value); }
  toggle(value) {
    if (this.values.has(value)) {
      this.values.delete(value);
      return false;
    }
    this.values.add(value);
    return true;
  }
}

function createFrontend({ responseOk = true, deferred = false } = {}) {
  let submitHandler;
  let resolveFetch;
  const button = { disabled: false };
  const status = { textContent: '', classList: new FakeClassList() };
  const form = {
    action: '/contact',
    valid: true,
    resetCalls: 0,
    checkValidity() { return this.valid; },
    reportValidity() {},
    reset() { this.resetCalls += 1; },
    querySelector(selector) { return selector === 'button[type="submit"]' ? button : null; },
    addEventListener(type, handler) { if (type === 'submit') submitHandler = handler; },
  };
  const documentRef = {
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getElementById(id) {
      if (id === 'contact-form') return form;
      if (id === 'form-status') return status;
      return null;
    },
  };
  let fetchCalls = 0;
  let fetchOptions;
  const fetchImpl = (url, options) => {
    fetchCalls += 1;
    fetchOptions = options;
    if (deferred) return new Promise((resolve) => { resolveFetch = () => resolve({ ok: responseOk }); });
    return Promise.resolve({ ok: responseOk });
  };

  return { button, documentRef, fetchImpl, form, get fetchCalls() { return fetchCalls; }, get fetchOptions() { return fetchOptions; }, get resolveFetch() { return resolveFetch; }, status, get submitHandler() { return submitHandler; } };
}

const originalFormData = global.FormData;
global.FormData = class FormDataMock { constructor(form) { this.form = form; } };
const { initializePage } = require('../js/main');

test.after(() => { global.FormData = originalFormData; });

test('mobile navigation resets aria-expanded after a navigation link is selected', () => {
  const listeners = {};
  const attributes = { 'aria-expanded': 'false' };
  const toggle = {
    addEventListener(type, handler) { listeners[`toggle-${type}`] = handler; },
    setAttribute(name, value) { attributes[name] = value; },
  };
  const nav = {
    classList: new FakeClassList(),
    querySelector() { return { focus() {} }; },
  };
  const link = {
    addEventListener(type, handler) { listeners[`link-${type}`] = handler; },
  };
  const documentRef = {
    querySelector(selector) { return selector === '.nav-toggle' ? toggle : nav; },
    querySelectorAll() { return [link]; },
    getElementById() { return null; },
  };

  initializePage(documentRef, async () => ({ ok: true }));
  listeners['toggle-click']();
  assert.equal(attributes['aria-expanded'], 'true');
  assert.equal(nav.classList.values.has('is-open'), true);

  listeners['link-click']();
  assert.equal(attributes['aria-expanded'], 'false');
  assert.equal(nav.classList.values.has('is-open'), false);
});

test('frontend shows sending then success and resets form', async () => {
  const fixture = createFrontend({ deferred: true });
  initializePage(fixture.documentRef, fixture.fetchImpl);
  const pending = fixture.submitHandler({ preventDefault() {} });
  assert.equal(fixture.status.textContent, 'Sending...');
  assert.equal(fixture.button.disabled, true);
  fixture.resolveFetch();
  await pending;
  assert.equal(fixture.status.textContent, 'Message sent successfully.');
  assert.equal(fixture.button.disabled, false);
  assert.equal(fixture.form.resetCalls, 1);
  assert.ok(fixture.fetchOptions.body instanceof URLSearchParams);
});

test('frontend shows safe failure state without resetting', async () => {
  const fixture = createFrontend({ responseOk: false });
  initializePage(fixture.documentRef, fixture.fetchImpl);
  await fixture.submitHandler({ preventDefault() {} });
  assert.equal(fixture.status.textContent, 'Something went wrong. Please try again.');
  assert.equal(fixture.button.disabled, false);
  assert.equal(fixture.form.resetCalls, 0);
});

test('frontend prevents duplicate submission while pending', async () => {
  const fixture = createFrontend({ deferred: true });
  initializePage(fixture.documentRef, fixture.fetchImpl);
  const first = fixture.submitHandler({ preventDefault() {} });
  await fixture.submitHandler({ preventDefault() {} });
  assert.equal(fixture.fetchCalls, 1);
  fixture.resolveFetch();
  await first;
});
