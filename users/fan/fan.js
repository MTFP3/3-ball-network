import { db, auth, storage } from '../../shared/firebase.js';
import { collection, getDocs, query, limit, startAfter } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// --- Progressive Enhancement: <noscript> and skip links (add to HTML) ---
// <noscript><div class="noscript-warning">JavaScript is required for full functionality. Please enable JS.</div></noscript>
// <a href="#main-content" class="skip-link" tabindex="0" aria-label="Skip to main content">Skip to main content</a>

// --- Accessibility: Live Region Announcements & Accessible Animations ---
let liveRegion = document.getElementById('sr-live-region');
if (!liveRegion) {
  liveRegion = document.createElement('div');
  liveRegion.id = 'sr-live-region';
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('role', 'status');
  liveRegion.style.position = 'absolute';
  liveRegion.style.width = '1px';
  liveRegion.style.height = '1px';
  liveRegion.style.margin = '-1px';
  liveRegion.style.border = '0';
  liveRegion.style.padding = '0';
  liveRegion.style.overflow = 'hidden';
  liveRegion.style.clip = 'rect(0 0 0 0)';
  document.body.appendChild(liveRegion);
}
function announceSR(message) {
  liveRegion.textContent = message;
}

// --- Accessible Animations: Respect prefers-reduced-motion ---
function setupReducedMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduced-motion');
    document.querySelectorAll('.animated, .fade-in, .fade-out').forEach(el => {
      el.classList.remove('animated', 'fade-in', 'fade-out');
    });
  }
}
setupReducedMotion();

// --- Accessible Color Palettes: High Contrast & Dark Mode ---
function setupColorThemes() {
  const contrastToggle = document.getElementById('contrast-toggle');
  if (contrastToggle) {
    contrastToggle.setAttribute('aria-label', 'Toggle high contrast mode');
    contrastToggle.checked = localStorage.getItem('highContrast') === 'true';
    document.body.classList.toggle('high-contrast', contrastToggle.checked);
    contrastToggle.addEventListener('change', () => {
      document.body.classList.toggle('high-contrast', contrastToggle.checked);
      localStorage.setItem('highContrast', contrastToggle.checked ? 'true' : 'false');
      announceSR(contrastToggle.checked ? 'High contrast mode enabled' : 'High contrast mode disabled');
    });
  }
  // Dark mode handled elsewhere (see setupDarkModeToggle)
}
setupColorThemes();

// --- Advanced i18n: Dynamic Content, Fallbacks, User Profile Language ---
let LANGUAGES = {};
let userLang = null;

// Load translations dynamically from external JSON files with fallback chain
async function loadTranslations(lang) {
  try {
    let response = await fetch(`/i18n/${lang}.json`);
    if (response.ok) {
      LANGUAGES = await response.json();
      return;
    }
    const baseLang = lang.split('-')[0];
    if (baseLang !== lang) {
      response = await fetch(`/i18n/${baseLang}.json`);
      if (response.ok) {
        LANGUAGES = await response.json();
        return;
      }
    }
    response = await fetch(`/i18n/en.json`);
    if (response.ok) {
      LANGUAGES = await response.json();
    }
  } catch (e) {
    LANGUAGES = {
      en: {
        loading: "Loading...",
        loaded: "Loaded.",
        failed: "Failed to load section.",
        noProfiles: "No public player profiles available. Check back later or follow players to see more highlights.",
        noHighlights: "No highlights available yet. Check back later!",
        noRecaps: "No AI recaps available yet. Check back later!",
        loadMore: "Load More",
        backToTop: "Back to Top",
        retry: "Retry"
      }
    };
    announceSR('Error loading translations. Showing default language.');
  }
}

// Get language from user profile, localStorage, or browser
async function determineUserLang(user) {
  if (user && user.language) return user.language;
  const stored = localStorage.getItem('lang');
  if (stored) return stored;
  return navigator.language || 'en';
}

// Translation function with fallback
function t(key) {
  if (!LANGUAGES[userLang]) return LANGUAGES['en'][key] || key;
  return LANGUAGES[userLang][key] || LANGUAGES['en'][key] || key;
}

// --- Robust Error Boundaries for async actions and dynamic UI ---
async function safeAsync(fn, fallbackMsg = 'An error occurred.') {
  try {
    return await fn();
  } catch (e) {
    showErrorBoundary(fallbackMsg, e);
    announceSR(fallbackMsg);
    return null;
  }
}
function showErrorBoundary(message, error) {
  let errorDiv = document.createElement('div');
  errorDiv.className = 'error-boundary';
  errorDiv.setAttribute('role', 'alert');
  errorDiv.innerHTML = `
    <strong>${message}</strong>
    <details style="user-select:text"><summary>Details</summary><pre>${error ? error.message : ''}</pre></details>
    <button onclick="this.parentNode.remove()" aria-label="Dismiss error">Dismiss</button>
  `;
  document.body.appendChild(errorDiv);
  errorDiv.querySelector('button').focus();
}

// --- Settings Modal for Personalization ---
function showSettingsModal() {
  if (document.getElementById('settings-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'settings-modal';
  modal.className = 'settings-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="settings-content">
      <h2>Settings</h2>
      <label for="lang-switcher">Language</label>
      <select id="lang-switcher" aria-label="Language selector">
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="ar">العربية</option>
      </select>
      <label for="dark-mode-toggle">Dark Mode</label>
      <input type="checkbox" id="dark-mode-toggle" aria-label="Toggle dark mode">
      <label for="font-size-select">Font Size</label>
      <select id="font-size-select" aria-label="Font size selector">
        <option value="medium">Medium</option>
        <option value="large">Large</option>
        <option value="small">Small</option>
      </select>
      <label for="compact-toggle">Compact Mode</label>
      <input type="checkbox" id="compact-toggle" aria-label="Toggle compact mode">
      <button id="onboarding-again" aria-label="Show onboarding">Show Onboarding</button>
      <button id="undo-history" aria-label="Show undo/redo history">Undo/Redo History</button>
      <button id="close-settings" aria-label="Close settings">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('close-settings').onclick = () => modal.remove();
  document.getElementById('onboarding-again').onclick = () => {
    modal.remove();
    showOnboarding();
  };
  document.getElementById('undo-history').onclick = () => {
    modal.remove();
    showUndoHistory();
  };
  setupLanguageSwitcher();
  setupDarkModeToggle();
  setupPersonalization();
  modal.querySelector('select, input, button').focus();
}

// --- Persistent Onboarding (can revisit from settings/help) ---
function showOnboarding() {
  const modal = document.createElement('div');
  modal.className = 'onboarding-modal animated-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="onboarding-content" tabindex="0">
      <h2>Welcome!</h2>
      <p>Explore highlights, save favorites, and switch languages or themes anytime.</p>
      <button id="close-onboarding" aria-label="Close onboarding dialog">Got it!</button>
    </div>
  `;
  document.body.appendChild(modal);
  const closeBtn = document.getElementById('close-onboarding');
  closeBtn.onclick = () => {
    localStorage.setItem('onboardingComplete', 'true');
    modal.remove();
  };
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const focusable = modal.querySelectorAll('button, [tabindex="0"]');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
    if (e.key === 'Escape') {
      closeBtn.click();
    }
  });
  closeBtn.focus();
  announceSR('Onboarding started.');
}

// --- Settings Discoverability: Add a visible button in main nav ---
function setupSettingsButton() {
  if (document.getElementById('settings-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'settings-btn';
  btn.className = 'settings-btn';
  btn.setAttribute('aria-label', 'Open settings');
  btn.innerHTML = '⚙️ Settings';
  btn.onclick = showSettingsModal;
  document.body.prepend(btn);
}
setupSettingsButton();

// --- Undo/Redo History (full stack) ---
const undoStack = [];
const redoStack = [];
function removeFavorite(type, id) {
  let favs = JSON.parse(localStorage.getItem('favorites') || '{}');
  favs[type] = (favs[type] || []).filter(favId => favId !== id);
  localStorage.setItem('favorites', JSON.stringify(favs));
  undoStack.push({ action: 'remove', type, id });
  redoStack.length = 0;
  showUndo(() => undoFavorite(type, id), () => redoFavorite(type, id));
}
function saveFavorite(type, id) {
  let favs = JSON.parse(localStorage.getItem('favorites') || '{}');
  favs[type] = favs[type] || [];
  if (!favs[type].includes(id)) favs[type].push(id);
  localStorage.setItem('favorites', JSON.stringify(favs));
  undoStack.push({ action: 'add', type, id });
  redoStack.length = 0;
  showToast('Saved!', true);
}
function undoFavorite(type, id) {
  saveFavorite(type, id);
  redoStack.push({ action: 'remove', type, id });
}
function redoFavorite(type, id) {
  removeFavorite(type, id);
}
function showUndo(undoFn, redoFn) {
  let undoBar = document.createElement('div');
  undoBar.className = 'undo-bar animated-toast';
  undoBar.setAttribute('role', 'status');
  undoBar.setAttribute('aria-live', 'polite');
  undoBar.innerHTML = `
    <span>${t('Action undone.')}</span>
    <button aria-label="Undo last action" class="focus-visible">Undo</button>
    <button aria-label="Redo last action" class="focus-visible">Redo</button>
  `;
  const [undoBtn, redoBtn] = undoBar.querySelectorAll('button');
  undoBtn.onclick = () => {
    undoFn();
    undoBar.remove();
  };
  redoBtn.onclick = () => {
    redoFn();
    undoBar.remove();
  };
  document.body.appendChild(undoBar);
  undoBtn.focus();
  setTimeout(() => undoBar.classList.add('fade-out'), 4000);
  setTimeout(() => undoBar.remove(), 4500);
}

// --- Undo/Redo History UI: Modal to view/jump to history ---
function showUndoHistory() {
  const modal = document.createElement('div');
  modal.className = 'undo-history-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="undo-history-content">
      <h2>Undo/Redo History</h2>
      <ul id="history-list"></ul>
      <button id="close-history" aria-label="Close history">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
  const list = modal.querySelector('#history-list');
  undoStack.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = `${item.action} ${item.type} ${item.id}`;
    li.tabIndex = 0;
    li.onclick = () => {
      announceSR(`Jumped to history step ${i + 1}`);
      modal.remove();
    };
    list.appendChild(li);
  });
  modal.querySelector('#close-history').onclick = () => modal.remove();
  modal.querySelector('li,button').focus();
}

// --- Onboarding Revisit: Add a "Help" link in settings/footer ---
function setupHelpLink() {
  if (document.getElementById('help-link')) return;
  const link = document.createElement('a');
  link.id = 'help-link';
  link.href = '#';
  link.textContent = 'Help / Onboarding';
  link.setAttribute('aria-label', 'Show onboarding');
  link.onclick = (e) => {
    e.preventDefault();
    showOnboarding();
  };
  document.body.appendChild(link);
}
setupHelpLink();

// --- Service Worker Update Flow ---
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    showToast('A new version is available. <button id="sw-refresh" aria-label="Refresh for update">Refresh</button>');
    announceSR('A new version is available. Please refresh.');
    setTimeout(() => {
      const btn = document.getElementById('sw-refresh');
      if (btn) btn.onclick = () => location.reload();
    }, 100);
  });
}

// --- Image CDN Automation Example ---
function createResponsiveImage(src, alt, srcset, sizes) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  if (srcset) img.srcset = srcset;
  if (sizes) img.sizes = sizes;
  img.loading = 'lazy';
  return img;
}

// --- Analytics: Custom Metrics & Real-Time Alerting (pseudo-code) ---
function trackMetric(name, value) {
  // Example: send to analytics endpoint
  // fetch('/analytics/metric', { method: 'POST', body: JSON.stringify({ name, value }) });
  console.log('Metric:', name, value);
}
function alertOnError(error) {
  // Example: send to alerting service
  // fetch('/alerts', { method: 'POST', body: JSON.stringify({ error }) });
  console.error('ALERT:', error);
}

// --- Main Auth/Init Flow ---
onAuthStateChanged(auth, async user => {
  userLang = await safeAsync(() => determineUserLang(user), 'Failed to determine language.');
  await safeAsync(() => loadTranslations(userLang), 'Failed to load translations.');
  setupColorThemes();
  setupLanguageSwitcher(user);
  setupDarkModeToggle();
  setupPersonalization();
  // ...rest of your app logic...
});

// --- Automated Accessibility Audits (CI) ---
// In your CI pipeline, run: npx axe ./dist or pa11y-ci ./dist

// --- Preload Fonts (add to HTML head) ---
// <link rel="preload" href="/fonts/YourFont.woff2" as="font" type="font/woff2" crossorigin>

// --- SSR & Critical CSS Automation ---
// Use SSR/static HTML for all critical UI and a tool like Critters or Penthouse to inline above-the-fold CSS

/**
 * For further improvements:
 * - Continue manual accessibility testing with screen readers and keyboard.
 * - Use color contrast checkers for all color themes.
 * - Expand undo/redo history UI for full navigation.
 * - Track onboarding, theme/language, and undo/redo usage for analytics.
 * - Set up real-time alerting for errors, slow performance, or CSP violations.
 */