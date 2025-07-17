# Login Navigation Issue Debug Guide

## Issue Description

When clicking "Login" from the home page, the login page appears briefly then redirects back to the home page.

## Potential Causes & Solutions

### 1. Firebase Authentication State

**Problem**: If user is already logged in, Firebase might redirect them automatically.
**Debug**: Open browser console and check for:

```
console.log('Firebase auth state:', firebase.auth().currentUser);
```

**Solution**: Clear browser storage or sign out first:

```javascript
firebase.auth().signOut();
```

### 2. Browser Cache

**Problem**: Old JavaScript or HTML might be cached.
**Solution**: Hard refresh (Ctrl+F5 or Cmd+Shift+R) or clear browser cache.

### 3. JavaScript Errors

**Problem**: Error on login page might cause browser to go back.
**Debug**: Check browser console for errors when navigating to login page.

### 4. Network Issues

**Problem**: Firebase scripts might fail to load, causing redirect.
**Debug**: Check Network tab in browser dev tools.

### 5. Service Worker

**Problem**: Service worker might be intercepting requests.
**Debug**: Check Application tab → Service Workers in dev tools.
**Solution**: Unregister service worker if present.

## Quick Debug Steps

1. **Open browser dev tools (F12)**
2. **Go to Console tab**
3. **Navigate to home page**
4. **Click Login and watch console for:**
   - JavaScript errors
   - Firebase initialization messages
   - Redirect messages
   - Authentication state changes

## Test Commands

Run these in browser console on home page:

```javascript
// Check Firebase
console.log('Firebase available:', typeof firebase !== 'undefined');

// Check auth state
if (typeof firebase !== 'undefined' && firebase.auth) {
  console.log('Current user:', firebase.auth().currentUser);
}

// Test navigation
console.log('Login link:', document.querySelector('a[href="/login.html"]'));
```

## Clear Authentication State

If you suspect auth issues, run this in console:

```javascript
if (typeof firebase !== 'undefined' && firebase.auth) {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log('Signed out successfully');
      localStorage.clear();
      sessionStorage.clear();
    });
}
```
