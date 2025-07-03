// Development Environment Detection and HMR Integration
// This script detects if we're in development mode and initializes appropriate features

const isDevelopment = () => {
  return (
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1' ||
    location.hostname === '0.0.0.0' ||
    location.port === '3000' ||
    location.search.includes('dev=true') ||
    sessionStorage.getItem('dev_mode') === 'true'
  );
};

const isViteHMR = () => {
  return typeof import.meta !== 'undefined' && import.meta.hot;
};

// Initialize development features
if (isDevelopment()) {
  // Development console styling
  const devConsoleStyle =
    'background: linear-gradient(45deg, #00b4d8, #007cba); color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold;';

  console.log('%c🏀 3 Ball Network - Development Mode', devConsoleStyle);
  console.log('🔥 HMR Status:', isViteHMR() ? 'Active' : 'Not Available');
  console.log('🌍 Environment:', {
    hostname: location.hostname,
    port: location.port,
    protocol: location.protocol,
    viteHMR: isViteHMR(),
  });

  // Add development indicator to page
  const devIndicator = document.createElement('div');
  devIndicator.id = 'dev-indicator';
  devIndicator.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(0, 180, 216, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      z-index: 9999;
      font-family: monospace;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      cursor: pointer;
    ">
      🔥 DEV ${isViteHMR() ? '+ HMR' : ''}
    </div>
  `;

  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(devIndicator);

    // Click to show dev info
    devIndicator.addEventListener('click', () => {
      console.group('🛠️ Development Information');
      console.log('📱 Viewport:', {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
      });
      console.log('🔄 HMR Features:', {
        viteHMR: isViteHMR(),
        cssHMR: !!document.querySelector('style[data-vite-dev-id]'),
        jsHMR: typeof import.meta !== 'undefined' && !!import.meta.hot,
      });
      console.log('📊 Performance:', {
        domContentLoaded:
          performance.timing.domContentLoadedEventEnd -
          performance.timing.navigationStart,
        loadComplete:
          performance.timing.loadEventEnd - performance.timing.navigationStart,
      });
      console.groupEnd();
    });
  });

  // Performance monitoring in development
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        console.log('⚡ Performance Metrics:', {
          'DOM Content Loaded': `${Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)}ms`,
          'Load Complete': `${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`,
          'First Paint':
            performance
              .getEntriesByType('paint')
              .find(entry => entry.name === 'first-paint')?.startTime || 'N/A',
        });
      }
    }, 1000);
  });

  // Enhanced error handling for development
  window.addEventListener('error', event => {
    console.group('❌ JavaScript Error');
    console.error('Message:', event.message);
    console.error('File:', event.filename);
    console.error('Line:', event.lineno);
    console.error('Column:', event.colno);
    console.error('Stack:', event.error?.stack);
    console.groupEnd();
  });

  window.addEventListener('unhandledrejection', event => {
    console.group('❌ Unhandled Promise Rejection');
    console.error('Reason:', event.reason);
    console.groupEnd();
  });
}

// HMR-specific initialization
if (isViteHMR()) {
  // Custom HMR accept handlers for different file types
  if (import.meta.hot) {
    // CSS hot reload
    import.meta.hot.accept(['**/*.css'], modules => {
      console.log('🎨 CSS reloaded via HMR');
    });

    // JavaScript module hot reload
    import.meta.hot.accept(['**/*.js'], modules => {
      console.log('⚙️ JavaScript modules reloaded via HMR');
    });

    // Full page reload for HTML changes
    import.meta.hot.accept(['**/*.html'], () => {
      console.log('📄 HTML changed, triggering full reload');
      window.location.reload();
    });
  }
}

export { isDevelopment, isViteHMR };
