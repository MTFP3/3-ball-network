# Jest Testing Setup - Simplified Approach

## Overview
We've simplified our Jest testing setup to avoid the complications of `jest-environment-jsdom`. Instead, we focus on testing the core basketball logic using the Node.js environment, which is more reliable and doesn't require additional DOM packages.

## Current Approach

### 1. Use Node Environment
```json
{
  "testEnvironment": "node",
  "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"]
}
```

### 2. Focus on Business Logic
Instead of testing DOM manipulation, we test:
- Basketball analytics calculations
- Player performance metrics
- Team chemistry algorithms
- Injury prevention logic
- Core business rules

### 3. Separation of Concerns
- **Backend Logic**: Tested with Jest in Node environment (`/src/` directory)
- **Frontend Logic**: Tested with browser-based tools or E2E tests
- **Integration**: Tested through API endpoints and user workflows

## Current Project Setup

### Dependencies
```json
{
  "devDependencies": {
    "jest": "^30.0.3",
    "jest-environment-jsdom": "^30.x.x"
  }
}
```

### Configuration Files
- **Primary Config**: `tests/config/jest.config.cjs`
- **Fallback Config**: `jest.config.json`

### Test Environment Features
The jsdom environment provides:
- Full DOM API support (`document`, `window`, etc.)
- Event handling and manipulation
- CSS and styling support
- Local and session storage APIs
- Navigation and location APIs

## Verification
Run the verification test to ensure proper setup:
```bash
npx jest tests/jest-jsdom-verification.test.js --verbose
```

This test verifies:
- ✅ DOM API availability
- ✅ Element creation and manipulation
- ✅ DOM queries and selectors
- ✅ Event handling
- ✅ Window properties access
- ✅ CSS manipulation

## Troubleshooting

### Common Issues

1. **"jest-environment-jsdom cannot be found"**
   - Solution: Install the package separately
   - Command: `npm install --save-dev jest-environment-jsdom`

2. **Version mismatch errors**
   - Solution: Ensure jest-environment-jsdom version matches Jest version
   - Command: `npm install --save-dev jest-environment-jsdom@^30.0.0` (for Jest 30)

3. **Configuration not recognized**
   - Solution: Use full package name `jest-environment-jsdom` instead of `jsdom`
   - Update: `testEnvironment: 'jest-environment-jsdom'`

### Debugging Commands
```bash
# Check Jest version
npx jest --version

# Check installed packages
npm list jest jest-environment-jsdom

# Test specific configuration
npx jest --config tests/config/jest.config.cjs --listTests

# Run with verbose output
npx jest --verbose --no-cache
```

## Best Practices

1. **Always specify the full package name** in configuration
2. **Keep versions in sync** between Jest and jest-environment-jsdom
3. **Use explicit installation** rather than relying on default bundles
4. **Test DOM functionality** with verification tests
5. **Document environment requirements** for team members

## Migration Notes

### From Jest 27 and earlier:
- No changes needed if already using jsdom
- Environment was included by default

### From Jest 28+:
- Must install `jest-environment-jsdom` separately
- Update configuration to use full package name
- Ensure version compatibility

## References
- [Jest Configuration Documentation](https://jestjs.io/docs/configuration)
- [jest-environment-jsdom Package](https://www.npmjs.com/package/jest-environment-jsdom)
- [Jest 28 Migration Guide](https://jestjs.io/blog/2022/04/25/jest-28)

---

*Last Updated: July 21, 2025*
*Project: 3 Ball Network*
*Jest Version: 30.0.3*
