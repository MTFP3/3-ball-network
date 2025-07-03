// Service Worker Registration with Auto-Update
// Universal cache-busting service worker helper

class ServiceWorkerManager {
  constructor() {
    this.registering = false;
    this.registration = null;
  }

  async initialize() {
    if (!('serviceWorker' in navigator) || this.registering) {
      return;
    }

    this.registering = true;

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', this.registration);

      // Check for updates frequently
      this.startUpdateChecking();

      // Handle updates
      this.setupUpdateHandling();

      // Handle controller changes
      this.setupControllerChangeHandling();
    } catch (error) {
      console.error('SW registration failed: ', error);
    }
  }

  startUpdateChecking() {
    // Check for updates immediately and then every 5 seconds
    this.registration.update();

    setInterval(() => {
      this.registration.update();
    }, 5000);
  }

  setupUpdateHandling() {
    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration.installing;
      console.log('New service worker found, installing...');

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // New version available, force immediate update
            console.log('New version available, updating immediately...');
            newWorker.postMessage({ type: 'SKIP_WAITING' });
          } else {
            console.log('App is cached for the first time');
          }
        }
      });
    });
  }

  setupControllerChangeHandling() {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service worker controller changed, reloading page...');
      window.location.reload();
    });
  }

  async clearAllCaches() {
    console.log('Clearing all caches...');

    // Tell service worker to clear its caches
    if (this.registration?.active) {
      this.registration.active.postMessage({ type: 'CLEAR_CACHE' });
    }

    // Clear all caches from this context
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }

    console.log('All caches cleared, reloading...');
    window.location.reload();
  }

  async forceUpdate() {
    if (this.registration) {
      await this.registration.update();
      console.log('Forced service worker update check');
    }
  }
}

// Global instance
const swManager = new ServiceWorkerManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => swManager.initialize());
} else {
  swManager.initialize();
}

// Expose global functions for debugging
window.clearAllCaches = () => swManager.clearAllCaches();
window.forceUpdate = () => swManager.forceUpdate();
window.swManager = swManager;

export { swManager, ServiceWorkerManager };
