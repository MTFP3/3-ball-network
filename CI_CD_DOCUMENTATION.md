# 🚀 CI/CD Pipeline Documentation

## Overview

This document provides comprehensive information about the CI/CD pipeline setup for the 3 Ball Network project. Our pipeline ensures code quality, security, automated testing, and reliable deployments.

## Pipeline Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │   Pull Request  │    │   Production    │
│                 │    │   Validation    │    │   Deployment    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Code commits  │────▶│ • Lint & Format │────▶│ • Build & Test  │
│ • Local testing │    │ • Unit tests    │    │ • Security scan │
│ • Feature work  │    │ • Build check   │    │ • E2E testing   │
└─────────────────┘    │ • E2E tests     │    │ • Deploy        │
                       └─────────────────┘    │ • Monitor       │
                                              └─────────────────┘
```

## 🔧 Workflows

### 1. CI/CD Pipeline (`ci-cd-pipeline.yml`)

**Trigger:** Push to `main` branch
**Purpose:** Complete quality assurance and deployment pipeline

#### Stages:

1. **Quality Assurance**
   - Code linting with ESLint
   - Code formatting with Prettier
   - Unit and integration tests with Jest
   - Build verification

2. **Security & Performance**
   - Security vulnerability scanning
   - Performance optimization
   - Lighthouse audit
   - UX validation

3. **End-to-End Testing**
   - Multi-browser testing with Playwright
   - Cross-device compatibility
   - User flow validation

4. **Production Deployment**
   - Build production bundle
   - Deploy to Firebase
   - Post-deployment verification

5. **Monitoring & Notifications**
   - Health checks
   - Performance monitoring
   - Alert notifications

### 2. PR Validation (`pr-validation.yml`)

**Trigger:** Pull request to `main` branch
**Purpose:** Fast feedback on code quality and compatibility

#### Checks:

- ✅ Code linting and formatting
- ✅ Unit test execution
- ✅ Build verification
- ✅ Basic E2E test suite
- ✅ Security scan (basic)

### 3. E2E Testing (`e2e-testing.yml`)

**Trigger:** Schedule (daily) or manual dispatch
**Purpose:** Comprehensive end-to-end testing

#### Features:

- Multi-browser testing (Chrome, Firefox, Safari)
- Multi-device testing (Desktop, Tablet, Mobile)
- User role testing (Player, Coach, Scout, Admin)
- Critical user flows validation

### 4. Release Management (`release-management.yml`)

**Trigger:** Manual dispatch
**Purpose:** Automated release creation and deployment

#### Process:

1. Version bump (patch/minor/major)
2. Changelog generation
3. Git tag creation
4. GitHub release creation
5. Production deployment
6. Release documentation

### 5. Deployment Monitoring (`deployment-monitoring.yml`)

**Trigger:** Schedule (every 15 minutes) or manual dispatch
**Purpose:** Continuous monitoring of production deployment

#### Monitoring:

- 🌐 Website availability
- 🗄️ Database connectivity
- 🔐 Authentication service
- ⚡ Performance metrics
- 🔒 Security validation
- 📊 Uptime tracking

## 🛠️ Setup Instructions

### 1. Prerequisites

Before setting up the CI/CD pipeline, ensure you have:

- GitHub repository with appropriate permissions
- Firebase project configured
- Node.js 18+ environment
- Required secrets configured in GitHub

### 2. Required GitHub Secrets

Configure the following secrets in your GitHub repository settings:

```bash
# Firebase Configuration
FIREBASE_TOKEN=<firebase-cli-token>
FIREBASE_PROJECT_ID=<your-project-id>
FIREBASE_CLIENT_EMAIL=<service-account-email>
FIREBASE_PRIVATE_KEY=<service-account-private-key>

# Environment Variables
VITE_FIREBASE_API_KEY=<firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<firebase-auth-domain>
VITE_FIREBASE_PROJECT_ID=<firebase-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<firebase-storage-bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<firebase-messaging-sender-id>
VITE_FIREBASE_APP_ID=<firebase-app-id>

# Optional: Notifications
SLACK_WEBHOOK_URL=<slack-webhook-for-notifications>
```

### 3. Firebase Setup

1. **Install Firebase CLI:**

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**

   ```bash
   firebase login:ci
   ```

   Copy the token and add it to GitHub secrets as `FIREBASE_TOKEN`

3. **Configure Firebase projects:**
   ```bash
   firebase use --add production
   firebase use --add staging  # optional
   ```

### 4. Local Development Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd 3-ball-network
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment files:**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 📋 Available Scripts

### Development

```bash
npm run dev                 # Start development server with HMR
npm run build              # Build for production
npm run preview            # Preview production build locally
```

### Testing

```bash
npm run test               # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:e2e          # Run E2E tests
npm run test:all          # Run all test suites
```

### Quality Assurance

```bash
npm run lint              # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run quality:check    # Run all quality checks
```

### Deployment

```bash
npm run build:prod       # Build for production
npm run deploy:staging   # Deploy to staging
npm run deploy:prod      # Deploy to production
npm run deploy:verify    # Verify deployment
```

## 🔍 Quality Gates

### Code Quality

- **ESLint:** Enforces coding standards and best practices
- **Prettier:** Ensures consistent code formatting
- **Jest:** Validates unit and integration tests
- **TypeScript:** Type checking (if applicable)

### Security

- **npm audit:** Scans for known vulnerabilities
- **Firestore rules:** Server-side validation and security
- **Environment variables:** Secure configuration management
- **HTTPS enforcement:** SSL/TLS security

### Performance

- **Lighthouse:** Performance, accessibility, SEO audits
- **Bundle analysis:** JavaScript bundle size optimization
- **Core Web Vitals:** User experience metrics
- **Load time monitoring:** Page performance tracking

### Testing

- **Unit tests:** Component and function testing
- **Integration tests:** API and service testing
- **E2E tests:** User flow validation
- **Cross-browser testing:** Compatibility verification

## 🚨 Troubleshooting

### Common Issues

#### 1. Firebase Deployment Fails

```bash
# Check Firebase token
firebase projects:list

# Re-authenticate if needed
firebase login:ci

# Verify project configuration
firebase use --list
```

#### 2. E2E Tests Fail

```bash
# Run tests locally
npm run test:e2e

# Debug specific test
npx playwright test --debug tests/e2e-comprehensive.test.js

# Update browser binaries
npx playwright install
```

#### 3. Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for dependency conflicts
npm ls

# Verify environment variables
npm run build:prod
```

#### 4. Security Audit Issues

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Manual review for breaking changes
npm audit fix --force
```

### Pipeline Debugging

#### Check Workflow Status

1. Go to GitHub Actions tab
2. Select the failing workflow
3. Review logs for specific errors
4. Check environment variables and secrets

#### Local Reproduction

```bash
# Run the same commands locally
npm run lint
npm run test:all
npm run build:prod
npm run test:e2e
```

## 📊 Monitoring & Alerts

### Health Monitoring

- **Uptime:** 99.9% availability target
- **Response time:** < 3 seconds target
- **Error rate:** < 0.1% target

### Performance Monitoring

- **Lighthouse score:** > 90 target
- **Core Web Vitals:** All metrics in "Good" range
- **Bundle size:** < 500KB target

### Security Monitoring

- **SSL certificate:** Auto-renewal monitoring
- **Vulnerability scanning:** Daily security audits
- **Access logs:** Suspicious activity detection

### Alert Conditions

- 🚨 **Critical:** Site down, database unavailable
- ⚠️ **Warning:** Performance degradation, security issues
- ℹ️ **Info:** Successful deployments, scheduled reports

## 🔄 Deployment Process

### Automatic Deployment (Recommended)

1. Create feature branch
2. Make changes and commit
3. Create pull request
4. Review and approve
5. Merge to main
6. Pipeline automatically deploys

### Manual Deployment

1. Navigate to GitHub Actions
2. Select "Release Management" workflow
3. Click "Run workflow"
4. Choose release type (patch/minor/major)
5. Monitor deployment progress

### Rollback Process

1. Navigate to Firebase Console
2. Go to Hosting section
3. View release history
4. Click "Rollback" on previous version
5. Confirm rollback

## 📈 Metrics & KPIs

### Development Metrics

- **Build time:** < 5 minutes
- **Test coverage:** > 80%
- **Code quality score:** A grade
- **Deployment frequency:** Daily

### User Experience Metrics

- **Page load time:** < 3 seconds
- **Time to interactive:** < 5 seconds
- **Accessibility score:** > 95
- **SEO score:** > 90

### Reliability Metrics

- **Uptime:** 99.9%
- **Error rate:** < 0.1%
- **Recovery time:** < 15 minutes
- **Test success rate:** > 95%

## 🎯 Best Practices

### Development

- Write tests for new features
- Follow coding standards
- Use semantic commit messages
- Keep dependencies updated

### Security

- Never commit secrets
- Use environment variables
- Regular security audits
- Implement proper authentication

### Performance

- Optimize bundle size
- Use code splitting
- Implement caching strategies
- Monitor Core Web Vitals

### Deployment

- Test thoroughly before deployment
- Use feature flags for risky changes
- Monitor after deployment
- Have rollback plan ready

## 📞 Support

### Getting Help

- **Documentation:** Check this guide first
- **Issues:** Create GitHub issue for bugs
- **Questions:** Use GitHub discussions
- **Emergency:** Contact development team

### Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Last Updated:** $(date +'%Y-%m-%d')
**Version:** 1.0.0
**Maintained by:** 3 Ball Network Development Team
