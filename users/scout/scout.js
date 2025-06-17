import { db, auth, storage } from '../../shared/firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// --- Accessibility: Skip Navigation (ensure first focusable element) ---
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('skip-link')) {
    const skip = document.createElement('a');
    skip.href = "#scout-content";
    skip.id = "skip-link";
    skip.textContent = "Skip to main content";
    skip.tabIndex = 1;
    skip.style.position = "absolute";
    skip.style.left = "-999px";
    skip.style.top = "0";
    skip.style.background = "#fff";
    skip.style.color = "#0078d4";
    skip.style.padding = "8px";
    skip.style.zIndex = 10001;
    skip.onfocus = () => { skip.style.left = "8px"; };
    skip.onblur = () => { skip.style.left = "-999px"; };
    document.body.insertBefore(skip, document.body.firstChild);
  }
  const fallback = document.getElementById('no-js-fallback');
  if (fallback) fallback.style.display = 'none';
  const style = document.createElement('style');
  style.innerHTML = `
    button:focus, a:focus, input:focus, textarea:focus, select:focus {
      outline: 2px solid #0078d4 !important;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
  // Ensure skip link target is focusable
  const main = document.getElementById('scout-content');
  if (main && !main.hasAttribute('tabindex')) {
    main.setAttribute('tabindex', '-1');
  }
  // ARIA role for nav
  const nav = document.querySelector('nav');
  if (nav) nav.setAttribute('role', 'navigation');
  const activeLink = document.querySelector('nav a.active');
  if (activeLink) activeLink.setAttribute('aria-current', 'page');
  // Skip link visibility
  const skip = document.getElementById('skip-link');
  if (skip) {
    skip.style.transition = 'left 0.2s';
    skip.style.outline = 'none';
    skip.addEventListener('focus', () => {
      skip.style.left = '8px';
      skip.style.boxShadow = '0 0 0 3px #0078d4';
    });
    skip.addEventListener('blur', () => {
      skip.style.left = '-999px';
      skip.style.boxShadow = 'none';
    });
  }
});

// --- Toast Accessibility: Dismiss with Escape ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const toast = document.getElementById('toast');
    if (toast && toast.style.display === 'block') {
      toast.style.display = 'none';
    }
  }
});

// --- Accessibility: Announce Loading States ---
function announceLoading(msg = "Loading...") {
  let loadingLive = document.getElementById('aria-loading');
  if (!loadingLive) {
    loadingLive = document.createElement('div');
    loadingLive.id = 'aria-loading';
    loadingLive.setAttribute('aria-live', 'assertive');
    loadingLive.style.position = 'absolute';
    loadingLive.style.left = '-9999px';
    document.body.appendChild(loadingLive);
  }
  loadingLive.textContent = msg;
}

// --- Loading Skeletons for Player List ---
function showPlayerListSkeleton(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
  `;
  announceLoading("Loading player list...");
}

// --- Persistent Undo: Store undo state in sessionStorage ---
function saveUndoState(playerId, playerData) {
  sessionStorage.setItem('undoPlayerId', playerId);
  sessionStorage.setItem('undoPlayerData', JSON.stringify(playerData));
  sessionStorage.setItem('undoTimestamp', Date.now());
}
function restoreUndoState() {
  const playerId = sessionStorage.getItem('undoPlayerId');
  const playerData = sessionStorage.getItem('undoPlayerData');
  const timestamp = sessionStorage.getItem('undoTimestamp');
  if (playerId && playerData && timestamp && Date.now() - Number(timestamp) < 5000) {
    return { playerId, playerData: JSON.parse(playerData) };
  }
  return null;
}
function clearUndoState() {
  sessionStorage.removeItem('undoPlayerId');
  sessionStorage.removeItem('undoPlayerData');
  sessionStorage.removeItem('undoTimestamp');
}

// --- Output Encoding for Security ---
function encodeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// --- Rate Limiting for Feedback ---
let lastFeedbackTime = 0;
function canSendFeedback() {
  const now = Date.now();
  if (now - lastFeedbackTime < 10000) {
    showToast('Please wait before sending more feedback.', 'error');
    return false;
  }
  lastFeedbackTime = now;
  return true;
}

// --- Feature Detection for Virtual Scrolling ---
function supportsVirtualScroll() {
  return typeof window.IntersectionObserver !== 'undefined';
}

// --- Auth State & Session Timeout Handling ---
let sessionTimeoutHandle = null;
let sessionWarningTimeout = null;
let sessionCountdownInterval = null;
function showSessionWarning() {
  showToast('You will be logged out soon due to inactivity.', 'error');
  announceError('Session will expire soon.');
  startSessionCountdown(120);
}
function resetSessionTimeout() {
  if (sessionTimeoutHandle) clearTimeout(sessionTimeoutHandle);
  if (sessionWarningTimeout) clearTimeout(sessionWarningTimeout);
  if (sessionCountdownInterval) clearInterval(sessionCountdownInterval);
  sessionWarningTimeout = setTimeout(showSessionWarning, 58 * 60 * 1000);
  sessionTimeoutHandle = setTimeout(() => {
    showToast('Session expired. Please log in again.', 'error');
    window.logout();
  }, 60 * 60 * 1000);
}
['click', 'keydown', 'mousemove', 'touchstart'].forEach(evt =>
  window.addEventListener(evt, resetSessionTimeout)
);

// --- Session Expiry Countdown ---
function showSessionCountdown(secondsLeft) {
  let countdown = document.getElementById('session-countdown');
  if (!countdown) {
    countdown = document.createElement('div');
    countdown.id = 'session-countdown';
    countdown.style.position = 'fixed';
    countdown.style.bottom = '2em';
    countdown.style.right = '1em';
    countdown.style.background = '#b00020';
    countdown.style.color = '#fff';
    countdown.style.padding = '0.5em 1em';
    countdown.style.borderRadius = '6px';
    countdown.style.zIndex = 10002;
    countdown.setAttribute('role', 'alert');
    document.body.appendChild(countdown);
  }
  countdown.textContent = `Session expires in ${secondsLeft} seconds`;
  if (secondsLeft <= 0) {
    countdown.remove();
  }
}
function startSessionCountdown(duration = 120) {
  let secondsLeft = duration;
  showSessionCountdown(secondsLeft);
  if (sessionCountdownInterval) clearInterval(sessionCountdownInterval);
  sessionCountdownInterval = setInterval(() => {
    secondsLeft--;
    showSessionCountdown(secondsLeft);
    if (secondsLeft <= 0) {
      clearInterval(sessionCountdownInterval);
      let countdown = document.getElementById('session-countdown');
      if (countdown) countdown.remove();
    }
  }, 1000);
}

// --- Graceful Auth Token Expiry ---
auth.onIdTokenChanged(async user => {
  if (!user) {
    showToast('Session expired. Please log in again.', 'error');
    window.logout();
  }
});

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "/users/registration.html";
  } else {
    const main = document.getElementById('scout-content');
    if (main) main.setAttribute('role', 'main');
    document.getElementById('scout-content').textContent = `Logged in as ${user.email}`;
    loadPlayersForScoutDashboard();
    resetSessionTimeout();
  }
});

window.logout = async function() {
  await signOut(auth);
  window.location.href = "/users/registration.html";
};

// --- Scout Dashboard: Browse Players, Ratings, Badges, Reports, Search, Sort ---
let scoutPlayers = [];
let currentSort = { key: 'name', dir: 1 };
let lastVisible = null;
let isLoading = false;
let searchTimeout = null;
let lastFocusedElement = null; // Standardize focus management
let lastDeletedPlayer = null;
let lastDeletedPlayerData = null;
let tagEditTimeout = null;

const PAGE_SIZE = 25;

// --- Accessibility: Live Region Politeness ---
let statusRegion = document.getElementById('aria-status');
if (!statusRegion) {
  statusRegion = document.createElement('div');
  statusRegion.id = 'aria-status';
  statusRegion.setAttribute('aria-live', 'polite');
  statusRegion.setAttribute('role', 'status');
  statusRegion.style.position = 'absolute';
  statusRegion.style.left = '-9999px';
  document.body.appendChild(statusRegion);
}
let errorRegion = document.getElementById('aria-error');
if (!errorRegion) {
  errorRegion = document.createElement('div');
  errorRegion.id = 'aria-error';
  errorRegion.setAttribute('aria-live', 'assertive');
  errorRegion.setAttribute('role', 'alert');
  errorRegion.style.position = 'absolute';
  errorRegion.style.left = '-9999px';
  document.body.appendChild(errorRegion);
}
function announceStatus(msg) {
  statusRegion.textContent = msg;
}
function announceError(msg) {
  errorRegion.textContent = msg;
}

// --- User Experience: Loading State Consistency ---
function showGlobalLoading(show = true, message = "Loading...") {
  let overlay = document.getElementById('global-loading');
  let live = document.getElementById('global-loading-live');
  if (!overlay && show) {
    overlay = document.createElement('div');
    overlay.id = 'global-loading';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(255,255,255,0.7)';
    overlay.style.zIndex = 10001;
    overlay.innerHTML = `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:2em;">${encodeHTML(message)}</div>`;
    document.body.appendChild(overlay);

    live = document.createElement('div');
    live.id = 'global-loading-live';
    live.setAttribute('aria-live', 'assertive');
    live.style.position = 'absolute';
    live.style.left = '-9999px';
    document.body.appendChild(live);
  }
  if (overlay) overlay.style.display = show ? 'block' : 'none';
  if (live) live.textContent = show ? message : '';
  announceLoading(show ? message : "");
}

function clearLoadingStates() {
  const overlay = document.getElementById('global-loading');
  if (overlay) overlay.style.display = 'none';
  const skeletons = document.querySelectorAll('.skeleton-card');
  skeletons.forEach(s => s.remove());
  announceLoading("");
}

// --- Progressive Enhancement: Network Resilience with Retry ---
async function fetchWithRetry(fn, retries = 2, delay = 1000) {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < retries) await new Promise(res => setTimeout(res, delay));
    }
  }
  throw lastError;
}

// --- Modal Accessibility: Focus Trap and Management ---
function trapFocus(modal) {
  function isTopmostModal() {
    const modals = Array.from(document.querySelectorAll('[role="dialog"]:not([aria-hidden="true"])'))
      .filter(m => m.style.display !== 'none');
    return modals.length && modals[modals.length - 1] === modal;
  }
  modal.addEventListener('keydown', function(e) {
    if (!isTopmostModal()) return;
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) { last.focus(); e.preventDefault(); }
      } else {
        if (document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    }
    if (e.key === 'Escape') {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      if (lastFocusedElement) setTimeout(() => lastFocusedElement.focus(), 100);
    }
  });
}

// --- Feedback Modal: Rate Limiting and Dynamic Import (Code Splitting) ---
window.openFeedbackModal = async function(event) {
  if (!canSendFeedback()) return;
  lastFocusedElement = event?.target || null;
  let modal = document.getElementById('feedback-modal');
  try {
    if (!modal) {
      const { FeedbackModal } = await import('./feedback-modal.js');
      modal = FeedbackModal();
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'feedback-title');
      modal.setAttribute('aria-describedby', 'feedback-desc');
      createModalCloseButton(modal);
      document.body.appendChild(modal);
    }
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => modal.querySelector('textarea,button,input')?.focus(), 100);
    trapFocus(modal);
  } catch (e) {
    showGlobalError('Feedback feature unavailable. Please try again later.');
  }
};

// --- Modal Accessibility: Ensure aria-modal, role, and close button ---
function createModalCloseButton(modal) {
  let closeBtn = modal.querySelector('.modal-close-btn');
  if (!closeBtn) {
    closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close-btn';
    closeBtn.setAttribute('aria-label', 'Close modal');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '8px';
    closeBtn.style.right = '12px';
    closeBtn.style.fontSize = '2em';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = '#333';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      if (lastFocusedElement) setTimeout(() => lastFocusedElement.focus(), 100);
    };
    modal.appendChild(closeBtn);
  }
}

// --- User Experience: Focus Management after closing toasts ---
function showToast(msg, type = 'info', undoCallback = null) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '1em';
    toast.style.right = '1em';
    toast.style.zIndex = 9999;
    toast.style.display = 'none';
    toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    document.body.appendChild(toast);
  }
  toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
  toast.innerHTML = encodeHTML(msg);
  if (undoCallback) {
    const undoBtn = document.createElement('button');
    undoBtn.textContent = 'Undo';
    undoBtn.setAttribute('aria-label', 'Undo last action');
    undoBtn.tabIndex = 0;
    undoBtn.onclick = () => {
      undoCallback();
      toast.style.display = 'none';
      announceStatus('Undo performed.');
      if (lastFocusedElement) setTimeout(() => lastFocusedElement.focus(), 100);
    };
    toast.appendChild(undoBtn);
    announceStatus('Undo available. Press tab to access the undo button.');
  }
  toast.style.background = type === 'error' ? '#b00020' : '#222';
  toast.style.color = '#fff';
  toast.style.padding = '1em';
  toast.style.borderRadius = '6px';
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
    if (lastFocusedElement) setTimeout(() => lastFocusedElement.focus(), 100);
  }, 4000);
  if (type === 'error') announceError(msg);
  else announceStatus(msg);
}

// --- Remove duplicate modal/focus logic and reminders/comments for production ---

// --- End of file ---