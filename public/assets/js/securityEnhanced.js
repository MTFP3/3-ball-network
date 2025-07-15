/**
 * Enhanced Security Monitoring for 3 Ball Network
 * Provides comprehensive security validation and monitoring
 */

class SecurityMonitor {
  constructor() {
    this.violations = [];
    this.init();
  }

  init() {
    this.monitorDOMChanges();
    this.validateExistingContent();
    this.setupCSP();
  }

  // Monitor for unsafe DOM manipulation
  monitorDOMChanges() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.validateElement(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Validate individual elements for security issues
  validateElement(element) {
    // Check for script tags
    if (element.tagName === 'SCRIPT' && !element.hasAttribute('nonce')) {
      this.reportViolation('Unsafe script tag detected', element);
    }

    // Check for inline event handlers
    const eventAttrs = ['onclick', 'onload', 'onerror', 'onchange', 'onsubmit'];
    eventAttrs.forEach(attr => {
      if (element.hasAttribute(attr)) {
        this.reportViolation(`Inline event handler detected: ${attr}`, element);
      }
    });

    // Check for javascript: URLs
    const links = element.querySelectorAll('a[href^="javascript:"]');
    if (links.length > 0) {
      this.reportViolation('JavaScript URL detected', element);
    }
  }

  // Validate existing page content
  validateExistingContent() {
    console.log('🔍 Validating existing page content...');

    // Check all elements on the page
    document.querySelectorAll('*').forEach(element => {
      this.validateElement(element);
    });

    console.log(
      `✅ Security validation complete. Found ${this.violations.length} violations.`
    );
  }

  // Setup Content Security Policy
  setupCSP() {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content =
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;";
    document.head.appendChild(meta);
  }

  // Report security violation
  reportViolation(message, element) {
    const violation = {
      message,
      element: element.tagName,
      timestamp: new Date().toISOString(),
    };

    this.violations.push(violation);
    console.warn('🚨 Security Violation:', violation);
  }

  // Get security status report
  getSecurityReport() {
    return {
      totalViolations: this.violations.length,
      violations: this.violations,
      securityLevel:
        this.violations.length === 0 ? 'SECURE' : 'NEEDS_ATTENTION',
    };
  }
}

// Initialize security monitoring
if (typeof window !== 'undefined') {
  window.securityMonitor = new SecurityMonitor();

  // Expose security report globally
  window.getSecurityReport = () => window.securityMonitor.getSecurityReport();
}

export default SecurityMonitor;
