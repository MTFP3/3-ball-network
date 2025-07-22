/**
 * Custom Jest matchers for enhanced testing
 */

expect.extend({
  // Custom matcher for testing if an element is visible
  toBeVisible(received) {
    const pass =
      received &&
      received.style.display !== 'none' &&
      received.style.visibility !== 'hidden';

    if (pass) {
      return {
        message: () => `expected element not to be visible`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to be visible`,
        pass: false,
      };
    }
  },

  // Custom matcher for testing Firebase data structure
  toMatchFirebaseDoc(received, expected) {
    const pass = JSON.stringify(received) === JSON.stringify(expected);

    if (pass) {
      return {
        message: () =>
          `expected Firebase document not to match ${JSON.stringify(expected)}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected Firebase document to match ${JSON.stringify(expected)}, but received ${JSON.stringify(received)}`,
        pass: false,
      };
    }
  },

  // Custom matcher for testing video analysis results
  toBeValidVideoAnalysis(received) {
    const requiredFields = ['highlights', 'stats', 'confidence'];
    const pass = requiredFields.every(field => received.hasOwnProperty(field));

    if (pass) {
      return {
        message: () => `expected video analysis to be invalid`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected video analysis to have fields: ${requiredFields.join(', ')}`,
        pass: false,
      };
    }
  },

  // Custom matcher for testing accessibility
  toBeAccessible(received) {
    const hasAriaLabel =
      received.getAttribute('aria-label') ||
      received.getAttribute('aria-labelledby');
    const hasRole = received.getAttribute('role');
    const isFocusable =
      received.tabIndex >= 0 ||
      ['button', 'input', 'select', 'textarea', 'a'].includes(
        received.tagName.toLowerCase()
      );

    const pass = hasAriaLabel || hasRole || !isFocusable;

    if (pass) {
      return {
        message: () => `expected element not to be accessible`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected element to have proper accessibility attributes (aria-label, aria-labelledby, or role)`,
        pass: false,
      };
    }
  },
});
