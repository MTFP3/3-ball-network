import { db, storage, COLLECTIONS, sanitize, showMessage, showConfirm } from './admin.js';

/**
 * Trap focus inside a modal dialog.
 * @param {HTMLElement} modal
 * @param {HTMLElement} [trigger]
 */
export function trapFocus(modal, trigger) {
  const focusable = modal.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  function handleKeydown(e) {
    if (e.key === 'Tab' && first && last) {
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    }
    if (e.key === 'Escape') {
      modal.dispatchEvent(new CustomEvent('closeModal'));
      if (trigger) trigger.focus();
    }
  }
  modal.addEventListener('keydown', handleKeydown);
  modal.addEventListener('closeModal', function cleanup() {
    modal.removeEventListener('keydown', handleKeydown);
    modal.removeEventListener('closeModal', cleanup);
  });
}

/**
 * Setup keyboard shortcuts for the document.
 */
export function setupKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName.toUpperCase();
    const isEditable = document.activeElement.isContentEditable;
    if (
      e.key === '/' &&
      tag !== 'INPUT' &&
      tag !== 'TEXTAREA' &&
      !isEditable
    ) {
      e.preventDefault();
      const search = document.getElementById('search-pages');
      if (search) search.focus();
    }
    // Add more shortcuts as needed
  });
}

export function showLoading(target) {
  if (target) target.innerHTML = `<div class="skeleton" style="height:2em;width:100%"></div>`;
}
export function showError(target, msg) {
  if (target) target.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
}
export function reportError(error, context = {}) {
  // Send to Sentry, Firestore, or your backend
  console.error('Reported error:', error, context);
}
export function trackMetric(event, details = {}) {
  // Send to analytics backend
  console.log('Tracked metric:', event, details);
}

// REMOVE the <meta> tag from here and place it in your HTML <head> instead.
// Updated CSP below for reference:

/*
<meta http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    script-src 'self' https://cdn.jsdelivr.net https://unpkg.com https://www.gstatic.com https://www.gstatic.com/firebasejs/ https://www.googleapis.com;
    style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com;
    img-src 'self' data: https://ui-avatars.com;
    font-src 'self' https://cdn.jsdelivr.net https://fonts.gstatic.com https://fonts.googleapis.com https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/fonts/;
  ">
</meta>
*/