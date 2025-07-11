// Compression detection and optimization
/* eslint-disable no-console */
(function () {
  'use strict';

  // Check if gzip is enabled
  function checkCompression() {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', window.location.href, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        const encoding = xhr.getResponseHeader('Content-Encoding');
        if (!encoding || !encoding.includes('gzip')) {
          // Gzip compression not detected - consider enabling server compression
        }
      }
    };
    xhr.send();
  }

  // Lazy load non-critical resources
  function lazyLoadResources() {
    const nonCriticalCSS = document.querySelectorAll(
      'link[rel="stylesheet"]:not([data-critical])'
    );
    nonCriticalCSS.forEach(link => {
      link.setAttribute('media', 'print');
      link.onload = function () {
        this.media = 'all';
      };
    });
  }

  // Preload critical resources
  function preloadCriticalResources() {
    const criticalResources = [
      '/assets/css/style.css',
      '/assets/js/firebaseConfig.js',
      '/manifest.json',
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      checkCompression();
      lazyLoadResources();
      preloadCriticalResources();
    });
  } else {
    checkCompression();
    lazyLoadResources();
    preloadCriticalResources();
  }
})();
