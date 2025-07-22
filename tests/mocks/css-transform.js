// CSS Transform for Jest
// Returns empty object for CSS imports during testing

module.exports = {
  process() {
    return 'module.exports = {};';
  },
  getCacheKey() {
    // Make a cache key, so that file is processed only once
    return 'css-transform';
  },
};
