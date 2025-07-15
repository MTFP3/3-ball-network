# 🔥 Firebase Project Setup Guide

## Setting Up Multiple Firebase Environments

This guide shows you how to properly configure Firebase projects for development, staging, and production environments.

## 1. Create Firebase Projects

### Development Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create project"
3. Project name: `3-ball-network-dev`
4. Enable Google Analytics (optional for dev)
5. Click "Create project"

### Staging Project (Optional)

1. Create another project: `3-ball-network-staging`
2. Same configuration as dev

### Production Project

1. Create project: `3-ball-network-prod` (or use your existing project)
2. Enable Google Analytics (recommended)
3. Configure custom domain if needed

## 2. Configure Each Project

For **each** Firebase project, you need to:

### Enable Authentication

1. Go to Authentication → Sign-in method
2. Enable Email/Password
3. Enable Google Sign-In (optional)
4. Configure authorized domains:
   - Development: `localhost`, `127.0.0.1`
   - Production: Your actual domain

### Set Up Firestore Database

1. Go to Firestore Database
2. Create database in production mode
3. Set location (closest to your users)
4. Deploy your security rules (use `firestore-secure.rules`)

### Enable Storage (if needed)

1. Go to Storage
2. Get started
3. Set up security rules

### Set Up Hosting (for production)

1. Go to Hosting
2. Get started
3. Install Firebase CLI: `npm install -g firebase-tools`
4. Login: `firebase login`
5. Initialize: `firebase init hosting`

## 3. Get Configuration for Each Project

For **each** project:

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web app
4. Register app name (e.g., "3 Ball Network Dev")
5. Copy the configuration object

### Example Configuration Structure

**Development Project Config:**

```javascript
{
  apiKey: "AIzaSyABC123-DEV-CONFIG-HERE",
  authDomain: "3-ball-network-dev.firebaseapp.com",
  projectId: "3-ball-network-dev",
  storageBucket: "3-ball-network-dev.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-ABCDEFGHIJ"
}
```

**Production Project Config:**

```javascript
{
  apiKey: "AIzaSyXYZ789-PROD-CONFIG-HERE",
  authDomain: "3-ball-network-prod.firebaseapp.com",
  projectId: "3-ball-network-prod",
  storageBucket: "3-ball-network-prod.appspot.com",
  messagingSenderId: "987654321",
  appId: "1:987654321:web:xyz789abc123",
  measurementId: "G-ZYXWVUTSRQ"
}
```

## 4. Set Up Environment Variables

### Local Development (.env.local)

```bash
# Development Firebase Project
VITE_FIREBASE_API_KEY=AIzaSyABC123-DEV-CONFIG-HERE
VITE_FIREBASE_AUTH_DOMAIN=3-ball-network-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=3-ball-network-dev
VITE_FIREBASE_STORAGE_BUCKET=3-ball-network-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEFGHIJ

VITE_APP_ENV=development
VITE_APP_DEBUG=true
VITE_ENABLE_ANALYTICS=false
```

### Production Deployment (.env.production)

```bash
# Production Firebase Project
VITE_FIREBASE_API_KEY=AIzaSyXYZ789-PROD-CONFIG-HERE
VITE_FIREBASE_AUTH_DOMAIN=3-ball-network-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=3-ball-network-prod
VITE_FIREBASE_STORAGE_BUCKET=3-ball-network-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321
VITE_FIREBASE_APP_ID=1:987654321:web:xyz789abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ZYXWVUTSRQ

VITE_APP_ENV=production
VITE_APP_DEBUG=false
VITE_ENABLE_ANALYTICS=true
```

## 5. Deploy Cloud Functions to Each Project

### For Development Project

```bash
# Switch to dev project
firebase use --add 3-ball-network-dev
firebase use dev

# Deploy functions
cd functions
npm install
cd ..
firebase deploy --only functions
```

### For Production Project

```bash
# Switch to production project
firebase use --add 3-ball-network-prod
firebase use prod

# Deploy functions
firebase deploy --only functions
```

## 6. Set Up Firestore Security Rules

Deploy the secure rules to each project:

```bash
# For development
firebase use dev
firebase deploy --only firestore:rules

# For production
firebase use prod
firebase deploy --only firestore:rules
```

## 7. Configure Firebase CLI for Multiple Projects

Create `.firebaserc` in your project root:

```json
{
  "projects": {
    "dev": "3-ball-network-dev",
    "staging": "3-ball-network-staging",
    "prod": "3-ball-network-prod"
  },
  "targets": {},
  "etags": {}
}
```

## 8. Hosting Environment Variables

### Vercel

1. Go to your Vercel project settings
2. Environment Variables tab
3. Add all `VITE_*` variables
4. Set different values for Preview vs Production

### Netlify

1. Go to Site settings → Environment variables
2. Add all variables
3. Use different values for branch deploys

### Firebase Hosting

1. Use Firebase Functions for environment config
2. Or build with different .env files

## 9. Security Best Practices

### API Key Security

- ✅ Firebase Web API keys are safe to expose in client code
- ✅ They identify your project, but don't grant access
- ✅ Security comes from Firestore rules and Authentication

### Environment Separation

- ✅ Different Firebase projects for different environments
- ✅ Separate databases (no dev data in production)
- ✅ Different authentication user bases
- ✅ Separate analytics tracking

### Access Control

- ✅ Use IAM roles in Firebase Console
- ✅ Different team members have access to different projects
- ✅ Production access should be limited

## 10. Testing Your Setup

### Verify Environment Variables

```bash
# Development
npm run dev
# Check console for: "🔥 Firebase Project: 3-ball-network-dev"

# Production build
npm run build
# Check for production project name
```

### Test Authentication

1. Try registering a new user
2. Verify user appears in correct Firebase project
3. Test login/logout functionality

### Test Database Access

1. Try creating/reading data
2. Verify data appears in correct Firestore project
3. Test security rules

## 11. Troubleshooting

### Common Issues

**"Firebase configuration not found"**

- Check that all required `VITE_*` environment variables are set
- Verify .env.local exists and has correct values
- Restart dev server after changing environment variables

**"Permission denied" errors**

- Check Firestore security rules
- Verify user is authenticated
- Check user has correct role in custom claims

**"Project not found"**

- Verify Firebase project ID is correct
- Check project exists in Firebase Console
- Ensure you have access to the project

### Debug Commands

```bash
# Check environment variables
npm run dev
# Look for console logs showing configuration

# Verify Firebase CLI setup
firebase projects:list
firebase use

# Test Firestore rules
firebase firestore:rules:test
```

## 12. Migration from Hardcoded Config

### Step-by-Step Migration

1. ✅ Create environment variable files
2. ✅ Update firebaseConfig.js to use env vars
3. ✅ Test locally with development project
4. ✅ Deploy to staging/production with prod config
5. ✅ Verify all functionality works
6. ✅ Remove hardcoded config from source control

### Cleanup Checklist

- [ ] Remove hardcoded API keys from all files
- [ ] Add .env.local to .gitignore (already done)
- [ ] Update deployment scripts to use environment configs
- [ ] Train team on new environment variable setup
- [ ] Document the new configuration process

---

🎉 **Congratulations!** You now have a secure, environment-based Firebase configuration that follows industry best practices.
