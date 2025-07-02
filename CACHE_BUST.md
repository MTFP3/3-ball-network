# 🚀 GUARANTEED CACHE-BUSTING SOLUTION

## Problem: Website updates don't show immediately after deployment

## Solution: Use this command sequence EVERY TIME after making changes:

```bash
# 1. Update service worker cache version (increment the number)
# Edit public/sw.js and change: '3ball-network-v3.0-final-cleanup' to '3ball-network-v3.1-update'

# 2. Add a cache-busting comment to index.html
# Add: <!-- Cache bust: $(date) -->

# 3. Commit and deploy with force
git add .
git commit -m "Cache bust: $(date)"
git push origin main
firebase deploy --project ball-network-web --force

# 4. Verify deployment
curl -I https://3ballnetwork.com/ | grep -i "last-modified\|cache\|etag"
```

## Alternative: Quick JavaScript Cache Bust

Add this to any HTML file that needs immediate updates:

```html
<script>
  // Force cache reload
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
  // Force page reload without cache
  window.location.reload(true);
</script>
```

## Browser Testing:

1. Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
2. Incognito/Private browsing window
3. Clear browser data for the site
4. Add ?v=timestamp to URL: https://3ballnetwork.com/?v=20250701

## Firebase-Specific:

- Firebase CDN caches for 1 hour by default
- Use `--force` flag with deploy
- Check Firebase Console for deployment status
- Wait 2-3 minutes for global propagation
