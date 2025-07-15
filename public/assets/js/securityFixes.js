/**
 * 🔒 Security Fixes for 3 Ball Network
 *
 * This module replaces inline event handlers and other security vulnerabilities
 * with secure alternatives. Load this after the DOM is ready.
 */

// Safe DOM manipulation utilities
const DOMUtils = {
  /**
   * Safely set text content, preventing XSS
   */
  safeText(element, text) {
    if (element && typeof text === 'string') {
      element.textContent = text;
    }
  },

  /**
   * Safely create elements with text content
   */
  createElement(tag, textContent = '', className = '') {
    const element = document.createElement(tag);
    if (textContent) {
      element.textContent = textContent;
    }
    if (className) {
      element.className = className;
    }
    return element;
  },

  /**
   * Replace innerHTML usage with secure DOM creation
   */
  replaceInnerHTML(container, contentData) {
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Create content based on data structure
    if (Array.isArray(contentData)) {
      contentData.forEach(item => {
        if (typeof item === 'string') {
          const textNode = document.createTextNode(item);
          container.appendChild(textNode);
        } else if (item.tag) {
          const element = this.createElement(
            item.tag,
            item.text,
            item.className
          );
          container.appendChild(element);
        }
      });
    }
  },
};

// Remove inline onclick handlers and replace with event listeners
function secureEventHandlers() {
  // Demo tab switching for scout demo
  const navTabs = document.querySelectorAll('.nav-tab[onclick]');
  navTabs.forEach(tab => {
    const onclickAttr = tab.getAttribute('onclick');
    if (onclickAttr && onclickAttr.includes('switchTab')) {
      // Extract tab name from onclick attribute
      const match = onclickAttr.match(/switchTab\('([^']+)'\)/);
      if (match) {
        const tabName = match[1];
        tab.removeAttribute('onclick');
        tab.dataset.tab = tabName;
        tab.addEventListener('click', e => {
          e.preventDefault();
          switchTabSecure(tabName, e.target);
        });
      }
    }
  });

  // Remove inline onclick from close buttons
  const closeButtons = document.querySelectorAll('button[onclick*="remove"]');
  closeButtons.forEach(btn => {
    const onclickAttr = btn.getAttribute('onclick');
    if (onclickAttr && onclickAttr.includes('parentNode.remove')) {
      btn.removeAttribute('onclick');
      btn.addEventListener('click', e => {
        e.preventDefault();
        const parent = e.target.parentNode;
        if (parent) {
          parent.remove();
        }
      });
    }
  });

  // Remove all remaining onclick handlers
  const elementsWithOnclick = document.querySelectorAll('[onclick]');
  elementsWithOnclick.forEach(element => {
    console.warn('Removing insecure onclick handler from:', element);
    element.removeAttribute('onclick');
  });
}

// Secure tab switching function
function switchTabSecure(tabName, clickedElement) {
  // Update nav tabs
  document
    .querySelectorAll('.nav-tab')
    .forEach(tab => tab.classList.remove('active'));
  clickedElement.classList.add('active');

  // Update sections
  document
    .querySelectorAll('.demo-section')
    .forEach(section => section.classList.remove('active'));

  const targetSection = document.getElementById(tabName);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Initialize charts if needed (analytics tab)
  if (tabName === 'analytics' && typeof initAnalyticsCharts === 'function') {
    setTimeout(initAnalyticsCharts, 100);
  }
}

// Replace alert() and prompt() with better UX
function replaceDialogs() {
  // Store original functions
  const originalAlert = window.alert;
  const originalPrompt = window.prompt;

  // Replace alert with toast notifications
  window.alert = function (message) {
    showToast(message, 'info');
  };

  // Replace prompt with modal dialogs
  window.prompt = function (message, defaultText = '') {
    return showPromptModal(message, defaultText);
  };

  // Keep originals available for debugging
  window._originalAlert = originalAlert;
  window._originalPrompt = originalPrompt;
}

// Toast notification system
function showToast(message, type = 'info') {
  const toastContainer = getOrCreateToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    background: ${getToastColor(type)};
    color: white;
    padding: 12px 20px;
    margin: 8px 0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
  `;

  const messageSpan = document.createElement('span');
  messageSpan.textContent = message;
  toast.appendChild(messageSpan);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    margin-left: 12px;
    cursor: pointer;
    padding: 0;
  `;
  closeBtn.addEventListener('click', () => {
    removeToast(toast);
  });
  toast.appendChild(closeBtn);

  toastContainer.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 10);

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(toast);
  }, 5000);
}

function getOrCreateToastContainer() {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }
  return container;
}

function removeToast(toast) {
  toast.style.transform = 'translateX(100%)';
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}

function getToastColor(type) {
  switch (type) {
    case 'success':
      return '#34c759';
    case 'error':
      return '#ff453a';
    case 'warning':
      return '#ff9500';
    default:
      return '#00b4d8';
  }
}

// Modal prompt replacement
function showPromptModal(message, defaultText = '') {
  return new Promise(resolve => {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      max-width: 400px;
      width: 90%;
    `;

    const messageEl = document.createElement('p');
    messageEl.textContent = message;
    messageEl.style.marginBottom = '16px';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = defaultText;
    input.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-bottom: 16px;
      font-size: 14px;
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `
      padding: 8px 16px;
      background: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;

    const okBtn = document.createElement('button');
    okBtn.textContent = 'OK';
    okBtn.style.cssText = `
      padding: 8px 16px;
      background: #00b4d8;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;

    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
      resolve(null);
    });

    okBtn.addEventListener('click', () => {
      const value = input.value;
      document.body.removeChild(modal);
      resolve(value);
    });

    // Enter key submits
    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        okBtn.click();
      }
    });

    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(okBtn);

    dialog.appendChild(messageEl);
    dialog.appendChild(input);
    dialog.appendChild(buttonContainer);
    modal.appendChild(dialog);

    document.body.appendChild(modal);
    input.focus();
  });
}

// Remove production console logging
function removeProductionLogging() {
  if (typeof window.console !== 'undefined') {
    // Only in production (check for absence of dev markers)
    const isProduction =
      !window.location.hostname.includes('localhost') &&
      !window.location.hostname.includes('127.0.0.1') &&
      !window.location.port;

    if (isProduction) {
      // Preserve error logging but remove info/debug logs
      const originalLog = console.log;
      const originalDebug = console.debug;
      const originalInfo = console.info;

      console.log = () => {};
      console.debug = () => {};
      console.info = () => {};

      // Keep for development
      console._originalLog = originalLog;
      console._originalDebug = originalDebug;
      console._originalInfo = originalInfo;
    }
  }
}

// Initialize security fixes
function initSecurityFixes() {
  try {
    secureEventHandlers();
    replaceDialogs();
    removeProductionLogging();

    console.log('🔒 Security fixes applied successfully');
  } catch (error) {
    console.error('❌ Error applying security fixes:', error);
  }
}

// Export for use
window.SecurityFixes = {
  DOMUtils,
  initSecurityFixes,
  showToast,
  secureEventHandlers,
  replaceDialogs,
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSecurityFixes);
} else {
  initSecurityFixes();
}
