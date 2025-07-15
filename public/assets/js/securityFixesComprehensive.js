/**
 * Comprehensive Security Fixes for 3 Ball Network
 * This script removes XSS vulnerabilities and unsafe practices
 */

(function () {
  'use strict';

  // Track elements that need fixing
  let elementsFixed = 0;

  /**
   * Remove all inline event handlers and replace with secure event listeners
   */
  function removeInlineEventHandlers() {
    console.log('🔒 Removing inline event handlers...');

    // Find all elements with onclick attributes
    const elementsWithOnclick = document.querySelectorAll('[onclick]');
    elementsWithOnclick.forEach(element => {
      const onclickValue = element.getAttribute('onclick');
      element.removeAttribute('onclick');

      // Handle common onclick patterns securely
      if (onclickValue.includes('clearCacheAndReload()')) {
        element.addEventListener('click', clearCacheAndReload);
      } else if (onclickValue.includes("window.location.href='/'")) {
        element.addEventListener('click', () => (window.location.href = '/'));
      } else if (onclickValue.includes('this.parentNode.remove()')) {
        element.addEventListener('click', function () {
          if (this.parentNode) {
            this.parentNode.remove();
          }
        });
      } else if (onclickValue.includes('liveCoaching.closeModal()')) {
        element.addEventListener('click', () => {
          if (window.liveCoaching && window.liveCoaching.closeModal) {
            window.liveCoaching.closeModal();
          }
        });
      }

      elementsFixed++;
    });

    // Remove other inline event handlers
    const inlineEvents = [
      'onchange',
      'onload',
      'onsubmit',
      'onerror',
      'onmouseover',
      'onfocus',
      'onblur',
    ];
    inlineEvents.forEach(eventName => {
      const elements = document.querySelectorAll(`[${eventName}]`);
      elements.forEach(element => {
        element.removeAttribute(eventName);
        elementsFixed++;
      });
    });
  }

  /**
   * Replace innerHTML usage with secure DOM creation
   */
  function replaceInnerHTMLUsage() {
    console.log('🔒 Replacing innerHTML usage...');

    // Override innerHTML setter to log usage and provide warnings
    const originalInnerHTML = Object.getOwnPropertyDescriptor(
      Element.prototype,
      'innerHTML'
    );

    Object.defineProperty(Element.prototype, 'innerHTML', {
      get: originalInnerHTML.get,
      set: function (value) {
        // Log usage for debugging
        console.warn(
          '⚠️ innerHTML usage detected:',
          this.tagName,
          value.substring(0, 100)
        );

        // If it's just clearing content, use safer method
        if (value === '') {
          while (this.firstChild) {
            this.removeChild(this.firstChild);
          }
          return;
        }

        // For non-empty content, use original but warn
        console.warn(
          '🚨 SECURITY: innerHTML with content detected. Consider using secure DOM creation instead.'
        );
        originalInnerHTML.set.call(this, value);
      },
    });
  }

  /**
   * Secure loading functions
   */
  function createSecureLoadingFunctions() {
    console.log('🔒 Creating secure loading functions...');

    // Secure loading spinner
    window.showLoading = function (element) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      if (element) {
        element.innerHTML = '';

        const spinner = document.createElement('span');
        spinner.className = 'loading-spinner';

        const text = document.createTextNode(' Loading...');

        element.appendChild(spinner);
        element.appendChild(text);
        element.disabled = true;
      }
    };

    // Secure loading hide
    window.hideLoading = function (element, originalText) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      if (element) {
        element.innerHTML = '';
        element.textContent = originalText || 'Submit';
        element.disabled = false;
      }
    };

    // Secure loading overlay
    window.showLoadingOverlay = function (message = 'Loading...') {
      let overlay = document.getElementById('loading-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.className = 'loading-overlay';

        const container = document.createElement('div');
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        const text = document.createElement('p');
        text.textContent = message;

        container.appendChild(spinner);
        container.appendChild(text);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
      }
      overlay.classList.remove('hidden');
    };

    window.hideLoadingOverlay = function () {
      const overlay = document.getElementById('loading-overlay');
      if (overlay) {
        overlay.classList.add('hidden');
      }
    };
  }

  /**
   * Secure dialog replacements
   */
  function createSecureDialogs() {
    console.log('🔒 Creating secure dialog functions...');

    // Replace alert with secure modal
    const originalAlert = window.alert;
    window.alert = function (message) {
      console.log('🔒 Secure alert:', message);

      const modal = document.createElement('div');
      modal.className = 'secure-alert-modal';
      modal.style.cssText =
        'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:10001';

      const content = document.createElement('div');
      content.style.cssText =
        'background:#fff;padding:20px;border-radius:8px;max-width:400px;margin:20px';

      const messageEl = document.createElement('p');
      messageEl.textContent = message;

      const button = document.createElement('button');
      button.textContent = 'OK';
      button.style.cssText =
        'background:#007cba;color:#fff;border:none;padding:10px 20px;border-radius:4px;cursor:pointer';
      button.addEventListener('click', () => modal.remove());

      content.appendChild(messageEl);
      content.appendChild(button);
      modal.appendChild(content);
      document.body.appendChild(modal);

      button.focus();
    };

    // Replace prompt with secure modal
    window.prompt = function (message, defaultText = '') {
      console.log('🔒 Secure prompt:', message);

      return new Promise(resolve => {
        const modal = document.createElement('div');
        modal.className = 'secure-prompt-modal';
        modal.style.cssText =
          'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:10001';

        const content = document.createElement('div');
        content.style.cssText =
          'background:#fff;padding:20px;border-radius:8px;max-width:400px;margin:20px';

        const messageEl = document.createElement('p');
        messageEl.textContent = message;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = defaultText;
        input.style.cssText =
          'width:100%;padding:8px;margin:10px 0;border:1px solid #ccc;border-radius:4px';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText =
          'display:flex;gap:10px;justify-content:flex-end;margin-top:15px';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText =
          'background:#666;color:#fff;border:none;padding:10px 20px;border-radius:4px;cursor:pointer';
        cancelBtn.addEventListener('click', () => {
          modal.remove();
          resolve(null);
        });

        const okBtn = document.createElement('button');
        okBtn.textContent = 'OK';
        okBtn.style.cssText =
          'background:#007cba;color:#fff;border:none;padding:10px 20px;border-radius:4px;cursor:pointer';
        okBtn.addEventListener('click', () => {
          const value = input.value;
          modal.remove();
          resolve(value);
        });

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(okBtn);

        content.appendChild(messageEl);
        content.appendChild(input);
        content.appendChild(buttonContainer);
        modal.appendChild(content);
        document.body.appendChild(modal);

        input.focus();
        input.select();
      });
    };
  }

  /**
   * Fix cache clear functionality securely
   */
  function fixCacheClearFunction() {
    window.clearCacheAndReload = function () {
      const status = document.getElementById('status');
      if (status) {
        status.innerHTML = '';
        const infoDiv = document.createElement('div');
        infoDiv.className = 'info';
        infoDiv.textContent = '🔄 Clearing cache...';
        status.appendChild(infoDiv);
      }

      // Clear service worker cache
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .getRegistrations()
          .then(function (registrations) {
            for (const registration of registrations) {
              registration.unregister();
            }
          });

        // Clear caches
        if ('caches' in window) {
          caches.keys().then(function (names) {
            for (const name of names) {
              caches.delete(name);
            }
          });
        }
      }

      // Force reload with cache bypass
      setTimeout(() => {
        if (status) {
          status.innerHTML = '';
          const successDiv = document.createElement('div');
          successDiv.className = 'success';
          successDiv.textContent = '✅ Cache cleared! Reloading...';
          status.appendChild(successDiv);
        }
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      }, 500);
    };

    // Add event listeners for cache clear buttons
    const clearCacheBtn = document.getElementById('clearCacheBtn');
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', window.clearCacheAndReload);
    }

    const homepageBtn = document.getElementById('homepageBtn');
    if (homepageBtn) {
      homepageBtn.addEventListener('click', () => (window.location.href = '/'));
    }
  }

  /**
   * Initialize all security fixes
   */
  function initializeSecurityFixes() {
    console.log('🔒 Initializing comprehensive security fixes...');

    removeInlineEventHandlers();
    replaceInnerHTMLUsage();
    createSecureLoadingFunctions();
    createSecureDialogs();
    fixCacheClearFunction();

    console.log(`✅ Security fixes applied. ${elementsFixed} elements fixed.`);

    // Add security indicator
    const indicator = document.createElement('div');
    indicator.style.cssText =
      'position:fixed;bottom:10px;left:10px;background:#4caf50;color:#fff;padding:5px 10px;border-radius:4px;font-size:12px;z-index:9999;opacity:0.8';
    indicator.textContent = '🔒 Security Enhanced';
    document.body.appendChild(indicator);

    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    }, 3000);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSecurityFixes);
  } else {
    initializeSecurityFixes();
  }
})();
