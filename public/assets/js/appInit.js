/**
 * Main App Initialization and Performance Optimization
 * Handles dynamic loading and performance monitoring
 */

(function() {
  'use strict';

  // Performance optimization configuration
  const PERFORMANCE_CONFIG = {
    // Modules to preload during idle time
    idlePreloadModules: [
      { path: '/assets/js/videoProcessor.js', id: 'video-processor' },
      { path: '/assets/js/videoGallery.js', id: 'video-gallery' },
      { path: '/assets/js/analytics.js', id: 'analytics' },
    ],
    
    // Critical modules that should load immediately
    criticalModules: [
      { path: '/assets/js/auth.js', id: 'auth' },
      { path: '/assets/js/firebaseConfig.js', id: 'firebase-config' },
    ],
    
    // Chunk size warning threshold
    chunkSizeWarning: 500, // KB
  };

  /**
   * Initialize performance monitoring
   */
  function initPerformanceMonitoring() {
    // Monitor chunk loading
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('.js') && entry.transferSize > PERFORMANCE_CONFIG.chunkSizeWarning * 1024) {
            console.warn(`⚠️ Large chunk loaded: ${entry.name} (${Math.round(entry.transferSize / 1024)}KB)`);
          }
        }
      });
      
      observer.observe({ type: 'resource', buffered: true });
    }

    // Track dynamic imports
    const originalImport = window.import;
    if (originalImport) {
      window.import = function(...args) {
        console.log(`🔄 Dynamic import: ${args[0]}`);
        return originalImport.apply(this, args);
      };
    }
  }

  /**
   * Initialize module loading strategy
   */
  function initModuleLoading() {
    if (!window.moduleLoader) {
      console.warn('Module loader not available');
      return;
    }

    // Load critical modules immediately
    PERFORMANCE_CONFIG.criticalModules.forEach(({ path, id }) => {
      window.moduleLoader.loadModule(path, id).catch(error => {
        console.error(`Failed to load critical module ${id}:`, error);
      });
    });

    // Preload non-critical modules during idle time
    window.moduleLoader.preloadOnIdle(PERFORMANCE_CONFIG.idlePreloadModules);

    // Set up intersection observers for common elements
    setupLazyLoading();
  }

  /**
   * Set up lazy loading for common UI elements
   */
  function setupLazyLoading() {
    // Dashboard charts
    window.moduleLoader.loadOnVisible(
      '.chart-container, .analytics-dashboard', 
      '/assets/js/playerCharts.js', 
      'player-charts'
    );

    // Team management
    window.moduleLoader.loadOnVisible(
      '.team-section, .team-management', 
      '/assets/js/teamCharts.js', 
      'team-charts'
    );

    // Search functionality
    window.moduleLoader.loadOnInteraction(
      '.search-input, .search-button', 
      '/assets/js/searchEngine.js', 
      'search-engine',
      'focus'
    );

    // Game grading
    window.moduleLoader.loadOnVisible(
      '.game-grade, .grading-section', 
      '/assets/js/game-grade.js', 
      'game-grade'
    );
  }

  /**
   * Initialize bundle size optimization features
   */
  function initBundleOptimization() {
    // Track bundle loading times
    const bundleMetrics = {
      startTime: performance.now(),
      chunksLoaded: 0,
      totalSize: 0
    };

    // Monitor script loading
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      script.addEventListener('load', () => {
        bundleMetrics.chunksLoaded++;
        console.log(`📦 Chunk ${bundleMetrics.chunksLoaded} loaded`);
      });
    });

    // Report bundle metrics after page load
    window.addEventListener('load', () => {
      const loadTime = performance.now() - bundleMetrics.startTime;
      console.log(`📊 Bundle loading complete in ${Math.round(loadTime)}ms`);
      console.log(`📦 Total chunks loaded: ${bundleMetrics.chunksLoaded}`);
      
      // Store metrics for analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'bundle_performance', {
          event_category: 'Performance',
          bundle_load_time: Math.round(loadTime),
          chunks_loaded: bundleMetrics.chunksLoaded
        });
      }
    });
  }

  /**
   * Main initialization function
   */
  function initialize() {
    console.log('🚀 Initializing 3 Ball Network performance optimizations...');
    
    initPerformanceMonitoring();
    initBundleOptimization();
    
    // Wait for module loader to be available
    if (window.moduleLoader) {
      initModuleLoading();
    } else {
      // Retry after a short delay
      setTimeout(() => {
        if (window.moduleLoader) {
          initModuleLoading();
        } else {
          console.warn('Module loader not available after timeout');
        }
      }, 100);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Export for debugging
  window.performanceConfig = PERFORMANCE_CONFIG;

})();
