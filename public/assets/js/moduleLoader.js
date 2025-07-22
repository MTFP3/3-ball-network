/**
 * Dynamic Module Loader
 * Implements code splitting for large modules to improve initial load time
 */

class ModuleLoader {
  constructor() {
    this.loadedModules = new Set();
    this.loadingPromises = new Map();
  }

  /**
   * Dynamically load a module if not already loaded
   * @param {string} modulePath - Path to the module
   * @param {string} moduleId - Unique identifier for the module
   * @returns {Promise} - Promise that resolves when module is loaded
   */
  async loadModule(modulePath, moduleId) {
    // Return if already loaded
    if (this.loadedModules.has(moduleId)) {
      return Promise.resolve();
    }

    // Return existing promise if currently loading
    if (this.loadingPromises.has(moduleId)) {
      return this.loadingPromises.get(moduleId);
    }

    // Create loading promise
    const loadingPromise = this.createModuleLoader(modulePath, moduleId);
    this.loadingPromises.set(moduleId, loadingPromise);

    try {
      await loadingPromise;
      this.loadedModules.add(moduleId);
      this.loadingPromises.delete(moduleId);
    } catch (error) {
      this.loadingPromises.delete(moduleId);
      throw error;
    }

    return loadingPromise;
  }

  /**
   * Create script loader for module
   * @param {string} modulePath - Path to the module
   * @param {string} moduleId - Unique identifier for the module
   * @returns {Promise} - Promise that resolves when script loads
   */
  createModuleLoader(modulePath, moduleId) {
    return new Promise((resolve, reject) => {
      // Check if module is ES6 module or regular script
      const isModule = modulePath.includes('-portal') || modulePath.includes('coach');
      
      const script = document.createElement('script');
      script.src = modulePath;
      
      if (isModule) {
        script.type = 'module';
      }
      
      script.async = true;
      script.onload = () => {
        console.log(`✅ Dynamically loaded: ${moduleId}`);
        resolve();
      };
      
      script.onerror = () => {
        console.error(`❌ Failed to load: ${moduleId}`);
        reject(new Error(`Failed to load module: ${moduleId}`));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Load module when element becomes visible (intersection observer)
   * @param {string} targetSelector - CSS selector for target element
   * @param {string} modulePath - Path to the module
   * @param {string} moduleId - Unique identifier for the module
   */
  loadOnVisible(targetSelector, modulePath, moduleId) {
    const target = document.querySelector(targetSelector);
    if (!target) {
      console.warn(`Target element not found: ${targetSelector}`);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadModule(modulePath, moduleId);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px' // Load 50px before element comes into view
    });

    observer.observe(target);
  }

  /**
   * Load module on user interaction
   * @param {string} triggerSelector - CSS selector for trigger element
   * @param {string} modulePath - Path to the module
   * @param {string} moduleId - Unique identifier for the module
   * @param {string} eventType - Event type to listen for (default: 'click')
   */
  loadOnInteraction(triggerSelector, modulePath, moduleId, eventType = 'click') {
    const setupListener = () => {
      const trigger = document.querySelector(triggerSelector);
      if (!trigger) {
        console.warn(`Trigger element not found: ${triggerSelector}`);
        return;
      }

      const handler = () => {
        this.loadModule(modulePath, moduleId);
        trigger.removeEventListener(eventType, handler);
      };

      trigger.addEventListener(eventType, handler);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupListener);
    } else {
      setupListener();
    }
  }

  /**
   * Preload modules during idle time
   * @param {Array} modules - Array of {path, id} objects
   */
  preloadOnIdle(modules) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        modules.forEach(({ path, id }) => {
          this.loadModule(path, id);
        });
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        modules.forEach(({ path, id }) => {
          this.loadModule(path, id);
        });
      }, 2000);
    }
  }
}

// Create global instance
window.moduleLoader = new ModuleLoader();

// Export for ES6 modules
export default ModuleLoader;
