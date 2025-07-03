// HMR Development Helper
// This script provides enhanced Hot Module Replacement features for 3 Ball Network

// Form state preservation functions (module level)
function preserveAppState() {
  const forms = document.querySelectorAll('form');
  const formData = new Map();

  forms.forEach((form, index) => {
    const data = new FormData(form);
    formData.set(index, Object.fromEntries(data));
  });

  // Store in sessionStorage for restoration after reload
  sessionStorage.setItem('hmr_form_state', JSON.stringify([...formData]));
}

// Restore form state after HMR
function restoreAppState() {
  const savedState = sessionStorage.getItem('hmr_form_state');
  if (savedState) {
    try {
      const formData = new Map(JSON.parse(savedState));
      const forms = document.querySelectorAll('form');

      forms.forEach((form, index) => {
        const data = formData.get(index);
        if (data) {
          Object.entries(data).forEach(([name, value]) => {
            const input = form.querySelector(`[name="${name}"]`);
            if (input) input.value = value;
          });
        }
      });

      sessionStorage.removeItem('hmr_form_state');
    } catch (error) {
      console.warn('Could not restore form state:', error);
    }
  }
}

if (import.meta.hot) {
  // Enable CSS HMR
  import.meta.hot.accept();

  // Custom HMR for Firebase modules
  import.meta.hot.accept('./firebaseConfig.js', newModule => {
    console.log('🔥 Firebase config reloaded');
    // Force a full page reload for Firebase changes
    window.location.reload();
  });

  // Enhanced error overlay
  import.meta.hot.on('vite:error', payload => {
    console.error('❌ HMR Error:', payload);
    showErrorOverlay(payload);
  });

  // Development notifications
  let notificationCount = 0;

  import.meta.hot.on('vite:beforeUpdate', () => {
    showDevNotification('🔄 Updating...', 'info');
  });

  import.meta.hot.on('vite:afterUpdate', () => {
    showDevNotification('✅ Updated successfully!', 'success');
  });

  // Chart.js HMR support
  if (window.Chart) {
    import.meta.hot.accept(
      ['./playerCharts.js', './teamCharts.js', './advancedMetrics.js'],
      () => {
        console.log('📊 Chart modules reloaded');
        // Reinitialize charts if they exist
        if (window.reinitializeCharts) {
          window.reinitializeCharts();
        }
      }
    );
  }

  // Dashboard HMR support
  const dashboardModules = [
    './playerDashboard.js',
    './coachDashboard.js',
    './scoutDashboard.js',
    './fanDashboard.js',
    './adminDashboard.js',
  ];

  import.meta.hot.accept(dashboardModules, newModules => {
    console.log('🎛️ Dashboard modules reloaded');
    // Preserve application state during dashboard updates
    preserveAppState();
  });

  // Development notification system
  function showDevNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.hmr-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `hmr-notification hmr-${type}`;
    notification.innerHTML = `
      <div class="hmr-notification-content">
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // Add styles
    if (!document.querySelector('#hmr-styles')) {
      const styles = document.createElement('style');
      styles.id = 'hmr-styles';
      styles.textContent = `
        .hmr-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          animation: hmrSlideIn 0.3s ease;
        }
        
        .hmr-info { border-left: 4px solid #00b4d8; }
        .hmr-success { border-left: 4px solid #10b981; }
        .hmr-error { border-left: 4px solid #ef4444; }
        
        .hmr-notification-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .hmr-notification button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 18px;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @keyframes hmrSlideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'hmrSlideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
      }
    }, 3000);
  }

  // Enhanced error overlay
  function showErrorOverlay(error) {
    const overlay = document.createElement('div');
    overlay.id = 'hmr-error-overlay';
    overlay.innerHTML = `
      <div class="hmr-error-content">
        <h2>🚨 Development Error</h2>
        <div class="hmr-error-message">${error.message || 'Unknown error'}</div>
        <div class="hmr-error-stack">${error.stack || ''}</div>
        <button onclick="document.getElementById('hmr-error-overlay').remove()">
          Close
        </button>
      </div>
    `;

    // Add error overlay styles
    if (!document.querySelector('#hmr-error-styles')) {
      const styles = document.createElement('style');
      styles.id = 'hmr-error-styles';
      styles.textContent = `
        #hmr-error-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .hmr-error-content {
          background: #1a1a1a;
          color: white;
          padding: 24px;
          border-radius: 12px;
          max-width: 80vw;
          max-height: 80vh;
          overflow: auto;
          border: 2px solid #ef4444;
        }
        
        .hmr-error-content h2 {
          margin: 0 0 16px 0;
          color: #ef4444;
        }
        
        .hmr-error-message {
          background: #2a2a2a;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
          font-family: monospace;
          color: #fbbf24;
        }
        
        .hmr-error-stack {
          background: #2a2a2a;
          padding: 12px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 12px;
          color: #9ca3af;
          white-space: pre-wrap;
          margin-bottom: 16px;
          max-height: 300px;
          overflow: auto;
        }
        
        .hmr-error-content button {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(overlay);
  }

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    restoreAppState();
    showDevNotification('🔥 HMR Active - Development Mode', 'info');
  });

  console.log('🔥 HMR Helper loaded - Enhanced development experience active');
}

export { preserveAppState, restoreAppState };
