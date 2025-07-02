# 3 Ball Network - File Hashing Build System

## Overview

The 3 Ball Network now includes a sophisticated file hashing (cache busting) build system that automatically generates content-based hashes for static assets. This ensures optimal browser caching and prevents stale asset issues during deployments.

## What is File Hashing?

File hashing, also known as cache busting or fingerprinting, adds unique content-based hashes to static asset filenames. For example:

- `style.css` becomes `style.3a428583.css`
- `logo.png` becomes `logo.283ae8cd.png`
- `firebaseConfig.js` becomes `firebaseConfig.1c453b00.js`

## Benefits

### 🚀 **Cache Optimization**

- Unchanged files can be cached indefinitely (1 year cache headers)
- Changed files are automatically fetched with new hash
- Eliminates cache invalidation issues

### ⚡ **Performance**

- Faster load times for returning users
- Optimal CDN and browser caching
- Reduced bandwidth usage

### 🛡️ **Deployment Reliability**

- No stale cached assets after deployments
- Automatic cache invalidation when content changes
- Consistent user experience across updates

## Build Commands

### Development

```bash
npm run dev              # Watch mode with live CSS compilation
npm run serve           # Serve from public/ directory
```

### Production Build

```bash
npm run build           # Full production build with hashing
npm run build:hash      # Same as above (explicit)
npm run build:clean     # Clean all build artifacts
```

### Deployment

```bash
npm run deploy          # Build + deploy to Firebase
bash deploy-enhanced.sh # Enhanced deployment script
```

## Build Process

The build system performs the following steps:

1. **Clean** - Removes previous build artifacts
2. **Copy** - Copies public/ directory to dist/
3. **Build CSS** - Processes CSS with PostCSS and autoprefixer
4. **Hash Assets** - Generates content-based hashes for:
   - CSS files (`.css`)
   - JavaScript files (`.js`)
   - Images (`.png`, `.jpg`, `.jpeg`, `.svg`, `.ico`)
   - Fonts and other static assets
5. **Update References** - Updates all HTML file references to hashed versions
6. **Update Service Worker** - Updates PWA service worker with new asset paths
7. **Cleanup** - Removes original unhashed files
8. **Generate Manifest** - Creates asset manifest for reference

## Output Structure

```
dist/
├── assets/
│   ├── css/
│   │   ├── style.min.3a428583.css
│   │   └── demo-enhancements.a7670555.css
│   └── js/
│       ├── firebaseConfig.1c453b00.js
│       ├── playerDashboard.9207b562.js
│       └── ...
├── logo.283ae8cd.png
├── asset-manifest.json
└── *.html (with updated references)
```

## Firebase Hosting Configuration

The system uses two Firebase configurations:

- **Development**: `firebase.json` (serves from `public/`)
- **Production**: `firebase.prod.json` (serves from `dist/`)

Production configuration includes optimized caching headers:

- Static assets: 1 year cache (`max-age=31536000, immutable`)
- HTML files: 1 hour cache (`max-age=3600`)
- Service worker: No cache (`no-cache`)

## Asset Manifest

The build generates `asset-manifest.json` with mappings:

```json
{
  "assets/css/style.min.css": "assets/css/style.min.3a428583.css",
  "assets/js/firebaseConfig.js": "assets/js/firebaseConfig.1c453b00.js",
  "logo.png": "logo.283ae8cd.png"
}
```

## Development Workflow

### For Development

```bash
git pull origin main
npm install
npm run dev
# Work on files in public/ directory
```

### For Production Deployment

```bash
git add .
git commit -m "Your changes"
git push origin main
bash deploy-enhanced.sh
```

## File Structure

```
scripts/
├── build-with-hash.js   # Main build script
└── clean-build.js       # Cleanup script

firebase.json            # Development config
firebase.prod.json       # Production config (with dist/)
package.json            # Updated with hash build scripts
```

## Environment Variables

No additional environment variables required. The build system uses:

- Node.js built-in `crypto` module for hashing
- `fs-extra` for file operations
- `glob` for file pattern matching

## Troubleshooting

### Build Fails

```bash
npm run build:clean     # Clean previous build
npm install             # Reinstall dependencies
npm run build:hash      # Try build again
```

### Assets Not Updating

- Verify all HTML files reference assets with `/` prefix
- Check browser developer tools for 404 errors
- Clear browser cache and hard refresh

### Service Worker Issues

- Update service worker after each deployment
- Check that `sw.js` references are updated with hashed paths

## Performance Metrics

After implementing file hashing, you should see:

- ✅ Reduced server requests for unchanged assets
- ✅ Faster page load times for returning users
- ✅ Lower bandwidth usage
- ✅ Better Lighthouse performance scores
- ✅ Improved Core Web Vitals

## Security Benefits

- Content-based hashing prevents asset tampering
- Immutable assets with long cache headers
- Automatic invalidation of compromised files
- Consistent deployment integrity

---

Built for the 3 Ball Network by hoopers, for hoopers. 🏀🚀
