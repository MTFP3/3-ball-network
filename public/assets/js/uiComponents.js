/**
 * Secure UI Component Library
 * Provides reusable, XSS-safe DOM element creation functions
 *
 * Security Benefits:
 * - No innerHTML usage reduces XSS risk
 * - Programmatic element creation with proper sanitization
 * - Consistent, maintainable component structure
 * - Better testability and reusability
 */

// Utility function to safely set text content
function safeText(element, text) {
  element.textContent = text || '';
  return element;
}

// Utility function to safely set attributes
function safeAttr(element, attr, value) {
  if (value !== null && value !== undefined) {
    element.setAttribute(attr, String(value));
  }
  return element;
}

// Utility function to add classes safely
function safeClass(element, ...classes) {
  classes.filter(Boolean).forEach(cls => element.classList.add(cls));
  return element;
}

// Utility function to clear container safely
function clearContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  return container;
}

/**
 * Game Card Component
 * Creates a secure game card element for dashboards
 */
export function createGameCard(gameId, game, options = {}) {
  const div = document.createElement('div');
  safeClass(div, 'game-card', options.extraClass);

  const title = document.createElement('h3');
  safeText(
    title,
    `${game.date || 'Unknown'} vs ${game.opponent || 'Opponent'}`
  );

  const score = document.createElement('p');
  safeText(score, `Final Score: ${game.finalScore || 'TBD'}`);

  const buttonContainer = document.createElement('div');
  safeClass(buttonContainer, 'button-group');

  if (options.showPlayerStats !== false) {
    const playerStatsBtn = document.createElement('button');
    safeClass(playerStatsBtn, 'btn', 'btn-primary');
    safeText(playerStatsBtn, 'View Player Stats');
    safeAttr(playerStatsBtn, 'data-game-id', gameId);
    if (options.onPlayerStats) {
      playerStatsBtn.addEventListener('click', options.onPlayerStats);
    }
    buttonContainer.appendChild(playerStatsBtn);
  }

  if (options.showHighlights !== false) {
    const highlightsBtn = document.createElement('button');
    safeClass(highlightsBtn, 'btn', 'btn-secondary');
    safeText(highlightsBtn, 'View Highlights');
    safeAttr(highlightsBtn, 'data-game-id', gameId);
    if (options.onHighlights) {
      highlightsBtn.addEventListener('click', options.onHighlights);
    }
    buttonContainer.appendChild(highlightsBtn);
  }

  div.appendChild(title);
  div.appendChild(score);
  div.appendChild(buttonContainer);

  return div;
}

/**
 * Player Card Component
 * Creates a secure player information card
 */
export function createPlayerCard(playerId, player, options = {}) {
  const div = document.createElement('div');
  safeClass(div, 'player-card', options.extraClass);

  const header = document.createElement('div');
  safeClass(header, 'player-header');

  const name = document.createElement('h4');
  safeText(name, player.name || 'Unknown Player');

  const position = document.createElement('span');
  safeClass(position, 'position-badge');
  safeText(position, player.position || 'N/A');

  header.appendChild(name);
  header.appendChild(position);

  const stats = document.createElement('div');
  safeClass(stats, 'player-stats');

  if (player.avgGrade) {
    const grade = document.createElement('p');
    safeText(grade, `Average Grade: ${player.avgGrade}`);
    stats.appendChild(grade);
  }

  if (player.gamesPlayed) {
    const games = document.createElement('p');
    safeText(games, `Games Played: ${player.gamesPlayed}`);
    stats.appendChild(games);
  }

  const actions = document.createElement('div');
  safeClass(actions, 'player-actions');

  if (options.showProfile !== false) {
    const profileBtn = document.createElement('button');
    safeClass(profileBtn, 'btn', 'btn-outline');
    safeText(profileBtn, 'View Profile');
    safeAttr(profileBtn, 'data-player-id', playerId);
    if (options.onViewProfile) {
      profileBtn.addEventListener('click', options.onViewProfile);
    }
    actions.appendChild(profileBtn);
  }

  div.appendChild(header);
  div.appendChild(stats);
  div.appendChild(actions);

  return div;
}

/**
 * Video Clip Component
 * Creates a secure video clip element with controls
 */
export function createVideoClip(clip, options = {}) {
  const container = document.createElement('div');
  safeClass(container, 'clip-container', options.extraClass);

  const header = document.createElement('div');
  safeClass(header, 'clip-header');

  const title = document.createElement('h5');
  safeText(title, clip.type || 'Play');

  const timestamp = document.createElement('span');
  safeClass(timestamp, 'timestamp');
  safeText(timestamp, clip.timestamp ? `${clip.timestamp}s` : '');

  header.appendChild(title);
  header.appendChild(timestamp);

  if (clip.clipUrl) {
    const video = document.createElement('video');
    safeAttr(video, 'src', clip.clipUrl);
    safeAttr(video, 'controls', 'true');
    safeAttr(video, 'width', options.width || '320');
    safeAttr(video, 'height', options.height || 'auto');
    container.appendChild(video);
  }

  container.appendChild(header);

  return container;
}

/**
 * Tag List Component
 * Creates a secure list of tags
 */
export function createTagList(tags, options = {}) {
  const ul = document.createElement('ul');
  safeClass(ul, 'tag-list', options.extraClass);

  if (!Array.isArray(tags) || tags.length === 0) {
    const li = document.createElement('li');
    safeClass(li, 'no-tags');
    safeText(li, 'No tags available');
    ul.appendChild(li);
    return ul;
  }

  tags.forEach(tag => {
    const li = document.createElement('li');
    safeClass(li, 'tag-item');

    if (typeof tag === 'string') {
      safeText(li, tag);
    } else if (tag && typeof tag === 'object') {
      safeText(li, `${tag.type || 'Action'} at ${tag.timestamp || 0}s`);
    }

    if (options.onTagClick) {
      li.addEventListener('click', () => options.onTagClick(tag));
      safeClass(li, 'clickable');
    }

    ul.appendChild(li);
  });

  return ul;
}

/**
 * Action List Component
 * Creates a secure list of player actions
 */
export function createActionList(actions, options = {}) {
  const container = document.createElement('div');
  safeClass(container, 'action-list', options.extraClass);

  if (options.title) {
    const title = document.createElement('h4');
    safeText(title, options.title);
    container.appendChild(title);
  }

  if (!Array.isArray(actions) || actions.length === 0) {
    const noActions = document.createElement('p');
    safeClass(noActions, 'no-actions');
    safeText(noActions, 'No actions recorded');
    container.appendChild(noActions);
    return container;
  }

  const ul = document.createElement('ul');
  safeClass(ul, 'actions');

  actions.forEach(action => {
    const li = document.createElement('li');
    safeClass(li, 'action-item');
    safeText(li, `${action.type || 'Action'} at ${action.timestamp || 0}s`);
    ul.appendChild(li);
  });

  container.appendChild(ul);
  return container;
}

/**
 * Scouting Report Component
 * Creates a secure scouting report display
 */
export function createScoutingReport(report, options = {}) {
  const container = document.createElement('div');
  safeClass(container, 'scouting-report', options.extraClass);

  const header = document.createElement('div');
  safeClass(header, 'report-header');

  const title = document.createElement('h4');
  safeText(title, '📋 Scouting Report');

  const grade = document.createElement('span');
  safeClass(grade, 'grade-badge');
  safeText(grade, `Grade: ${report.grade || 'N/A'}`);

  header.appendChild(title);
  header.appendChild(grade);

  const content = document.createElement('div');
  safeClass(content, 'report-content');

  const reportText = document.createElement('p');
  safeText(reportText, report.report || 'No report available');

  content.appendChild(reportText);

  container.appendChild(header);
  container.appendChild(content);

  return container;
}

/**
 * Status Badge Component
 * Creates a secure status indicator
 */
export function createStatusBadge(status, options = {}) {
  const badge = document.createElement('span');
  safeClass(
    badge,
    'status-badge',
    `status-${status.toLowerCase()}`,
    options.extraClass
  );
  safeText(badge, status);
  return badge;
}

/**
 * Loading Component
 * Creates a secure loading indicator
 */
export function createLoadingIndicator(message = 'Loading...') {
  const container = document.createElement('div');
  safeClass(container, 'loading-indicator');

  const spinner = document.createElement('div');
  safeClass(spinner, 'spinner');

  const text = document.createElement('p');
  safeText(text, message);

  container.appendChild(spinner);
  container.appendChild(text);

  return container;
}

/**
 * Error Component
 * Creates a secure error message display
 */
export function createErrorMessage(message, options = {}) {
  const container = document.createElement('div');
  safeClass(container, 'error-message', options.type || 'error');

  const icon = document.createElement('span');
  safeClass(icon, 'error-icon');
  safeText(icon, '⚠️');

  const text = document.createElement('p');
  safeText(text, message);

  container.appendChild(icon);
  container.appendChild(text);

  if (options.dismissible) {
    const closeBtn = document.createElement('button');
    safeClass(closeBtn, 'close-btn');
    safeText(closeBtn, '×');
    closeBtn.addEventListener('click', () => {
      container.remove();
    });
    container.appendChild(closeBtn);
  }

  return container;
}

/**
 * Optimistic UI Component
 * Creates elements with pending, success, and error states for smooth UX
 */
export function createOptimisticElement(content, options = {}) {
  const element = document.createElement(options.tag || 'div');
  safeClass(element, 'optimistic-element', options.extraClass);

  if (typeof content === 'string') {
    safeText(element, content);
  } else {
    element.appendChild(content);
  }

  // Add state management methods
  element.setPending = function (message = 'Loading...') {
    this.classList.add('pending');
    this.style.opacity = '0.7';

    if (options.showSpinner) {
      const spinner = document.createElement('div');
      spinner.classList.add('optimistic-spinner');
      spinner.style.cssText =
        'width: 16px; height: 16px; border: 2px solid #ffa500; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; display: inline-block; margin-left: 8px;';
      this.appendChild(spinner);
    }
  };

  element.setSuccess = function (message = 'Success!') {
    this.classList.remove('pending');
    this.classList.add('success');
    this.style.opacity = '1';
    this.style.borderColor = '#28a745';

    // Remove spinner
    const spinner = this.querySelector('.optimistic-spinner');
    if (spinner) spinner.remove();

    if (options.autoRemoveSuccess) {
      setTimeout(() => {
        this.classList.remove('success');
        this.style.borderColor = '';
      }, options.autoRemoveSuccess);
    }
  };

  element.setError = function (message = 'Error occurred') {
    this.classList.remove('pending');
    this.classList.add('error');
    this.style.opacity = '1';
    this.style.borderColor = '#dc3545';

    // Remove spinner
    const spinner = this.querySelector('.optimistic-spinner');
    if (spinner) spinner.remove();
  };

  return element;
}

/**
 * Optimistic List Manager
 * Manages adding/removing items from lists with optimistic updates
 */
export function createOptimisticList(container, options = {}) {
  return {
    addItem: function (item, tempId) {
      const element = createOptimisticElement(item, {
        showSpinner: true,
        autoRemoveSuccess: 3000,
        ...options,
      });
      element.dataset.tempId = tempId;
      element.setPending();

      if (options.prepend) {
        container.prepend(element);
      } else {
        container.appendChild(element);
      }

      return element;
    },

    confirmItem: function (tempId, finalData = null) {
      const element = container.querySelector(`[data-temp-id="${tempId}"]`);
      if (element) {
        element.setSuccess();
        if (finalData) {
          // Update with final data if provided
          element.removeAttribute('data-temp-id');
          element.dataset.finalId = finalData.id;
        }
      }
      return element;
    },

    rejectItem: function (tempId) {
      const element = container.querySelector(`[data-temp-id="${tempId}"]`);
      if (element) {
        element.setError();
        setTimeout(() => {
          element.remove();
        }, 2000); // Give time to see the error state
      }
    },

    updateItem: function (id, newContent) {
      const element = container.querySelector(
        `[data-final-id="${id}"], [data-temp-id="${id}"]`
      );
      if (element) {
        clearContainer(element);
        if (typeof newContent === 'string') {
          safeText(element, newContent);
        } else {
          element.appendChild(newContent);
        }
      }
    },
  };
}

/**
 * Progress Indicator Component
 * Creates a progress bar for file uploads and long operations
 */
export function createProgressIndicator(options = {}) {
  const container = document.createElement('div');
  safeClass(container, 'progress-container', options.extraClass);
  container.style.cssText =
    'width: 100%; background: #f0f0f0; border-radius: 4px; overflow: hidden; height: 8px; margin: 8px 0;';

  const bar = document.createElement('div');
  bar.classList.add('progress-bar');
  bar.style.cssText =
    'height: 100%; background: linear-gradient(90deg, #007cba, #00b4d8); width: 0%; transition: width 0.3s ease;';

  container.appendChild(bar);

  container.setProgress = function (percent) {
    bar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  };

  container.setIndeterminate = function () {
    bar.style.width = '100%';
    bar.style.background =
      'linear-gradient(90deg, transparent, #00b4d8, transparent)';
    bar.style.animation = 'shimmer 2s infinite';
  };

  container.complete = function () {
    this.setProgress(100);
    bar.style.background = '#28a745';
    setTimeout(() => {
      container.style.opacity = '0';
      setTimeout(() => container.remove(), 300);
    }, 1000);
  };

  return container;
}

/**
 * Toast Notification System
 * Creates non-intrusive notifications for user feedback
 */
export function createToast(message, type = 'info', duration = 5000) {
  // Create toast container if it doesn't exist
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  safeClass(toast, 'toast', `toast-${type}`);
  toast.style.cssText = `
    background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
    color: white;
    padding: 12px 16px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-size: 14px;
    max-width: 300px;
    pointer-events: auto;
    cursor: pointer;
    transform: translateY(100%);
    opacity: 0;
    transition: all 0.3s ease;
  `;

  safeText(toast, message);
  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  // Auto remove
  const removeToast = () => {
    toast.style.transform = 'translateY(100%)';
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  };

  setTimeout(removeToast, duration);
  toast.addEventListener('click', removeToast);

  return toast;
}

/**
 * Initialize UI Components Styles
 * Adds necessary CSS animations and styles for secure UI components
 */
function initializeUIStyles() {
  if (document.getElementById('ui-components-styles')) return; // Already initialized

  const style = document.createElement('style');
  style.id = 'ui-components-styles';
  style.textContent = `
    /* Spinner Animation */
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Shimmer Animation for Progress */
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    /* Toast Slide In Animation */
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
    
    /* Optimistic Element States */
    .optimistic-element.pending {
      animation: pulse 2s infinite;
    }
    
    .optimistic-element.success {
      animation: successBounce 0.6s ease-out;
    }
    
    .optimistic-element.error {
      animation: errorShake 0.6s ease-out;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }
    
    @keyframes successBounce {
      0%, 20%, 60%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      80% { transform: translateY(-5px); }
    }
    
    @keyframes errorShake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
}

// Auto-initialize styles when module loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUIStyles);
} else {
  initializeUIStyles();
}

// Export utilities for use in other modules
export { clearContainer, safeText, safeAttr, safeClass, initializeUIStyles };
