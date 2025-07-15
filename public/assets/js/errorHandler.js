/**
 * Centralized Error Message Handler
 * Provides user-friendly error messages with modern event handling
 */

class ErrorHandler {
  constructor() {
    this.initializeGlobalErrorHandling();
  }

  /**
   * Display a user-friendly error message with auto-dismiss
   * @param {string} message - The error message to display
   * @param {number} duration - Auto-dismiss duration in milliseconds (default: 5000)
   * @param {string} type - Message type: 'error', 'warning', 'info', 'success'
   */
  showUserFriendlyError(message, duration = 5000, type = 'error') {
    const errorDiv = document.createElement('div');
    errorDiv.className = `user-message user-message--${type}`;

    // Set up styling
    const colors = {
      error: { bg: '#ff4444', color: '#fff' },
      warning: { bg: '#ff9500', color: '#fff' },
      info: { bg: '#007aff', color: '#fff' },
      success: { bg: '#34c759', color: '#fff' },
    };

    const style = colors[type] || colors.error;
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${style.bg};
      color: ${style.color};
      padding: 15px 40px 15px 15px;
      border-radius: 8px;
      z-index: 10000;
      max-width: 300px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.4;
      animation: slideIn 0.3s ease-out;
    `;

    // Create close button with data attribute instead of onclick
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.setAttribute('data-action', 'close-message');
    closeButton.style.cssText = `
      background: none;
      border: none;
      color: ${style.color};
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 18px;
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s;
    `;

    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.backgroundColor = 'rgba(255,255,255,0.2)';
    });

    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.backgroundColor = 'transparent';
    });

    // Set up message content
    const messageContent = document.createElement('div');
    messageContent.textContent = message;

    errorDiv.appendChild(messageContent);
    errorDiv.appendChild(closeButton);

    // Add CSS animation
    const style_elem = document.createElement('style');
    style_elem.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      .user-message--removing {
        animation: slideOut 0.3s ease-in forwards;
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    if (!document.querySelector('style[data-error-handler]')) {
      style_elem.setAttribute('data-error-handler', 'true');
      document.head.appendChild(style_elem);
    }

    document.body.appendChild(errorDiv);

    // Set up event delegation for close button
    this.setupCloseHandler(errorDiv, closeButton);

    // Auto-remove after specified duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeMessage(errorDiv);
      }, duration);
    }

    return errorDiv;
  }

  /**
   * Set up close button event handling
   */
  setupCloseHandler(errorDiv, closeButton) {
    closeButton.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      this.removeMessage(errorDiv);
    });
  }

  /**
   * Remove message with animation
   */
  removeMessage(errorDiv) {
    if (!errorDiv.parentNode) return;

    errorDiv.classList.add('user-message--removing');
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 300);
  }

  /**
   * Initialize global error handling for unhandled promises
   */
  initializeGlobalErrorHandling() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', e => {
      console.error('Unhandled promise rejection:', e.reason);
      this.showUserFriendlyError(
        'Network error. Please check your connection.'
      );
      e.preventDefault(); // Prevent default browser error handling
    });

    // Handle general JavaScript errors
    window.addEventListener('error', e => {
      console.error('JavaScript error:', e.error);
      // Only show user-friendly messages for network/firebase errors
      if (
        e.error &&
        (e.error.message.includes('fetch') ||
          e.error.message.includes('firebase'))
      ) {
        this.showUserFriendlyError('Something went wrong. Please try again.');
      }
    });
  }

  /**
   * Convenience methods for different message types
   */
  showError(message, duration = 5000) {
    return this.showUserFriendlyError(message, duration, 'error');
  }

  showWarning(message, duration = 5000) {
    return this.showUserFriendlyError(message, duration, 'warning');
  }

  showInfo(message, duration = 5000) {
    return this.showUserFriendlyError(message, duration, 'info');
  }

  showSuccess(message, duration = 5000) {
    return this.showUserFriendlyError(message, duration, 'success');
  }
}

// Create global instance
const errorHandler = new ErrorHandler();

// Export for ES6 modules
export { ErrorHandler, errorHandler };

// Also make available globally for legacy code
window.errorHandler = errorHandler;
window.showUserFriendlyError = (message, duration, type) => {
  return errorHandler.showUserFriendlyError(message, duration, type);
};
