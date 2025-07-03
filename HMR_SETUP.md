# Hot Module Replacement (HMR) Setup for 3 Ball Network

## 🔥 What is HMR?

Hot Module Replacement allows you to update your code in real-time without losing application state. Changes to CSS, JavaScript, and HTML are reflected immediately in the browser without a full page refresh.

## 🚀 Quick Start

### Development with HMR

```bash
# Start HMR development server
npm run dev

# Alternative Vite-only command
npm run dev:vite

# Legacy development mode (without HMR)
npm run dev:legacy
```

### Building for Production

```bash
# Build with Vite + HMR optimizations
npm run build:vite

# Traditional build with file hashing
npm run build

# Deploy Vite-optimized build
npm run deploy:vite
```

## 🛠️ How It Works

### File Watching

- **CSS Files**: Instant hot reload without page refresh
- **JavaScript Modules**: Hot reload with state preservation
- **HTML Files**: Full page reload (necessary for structure changes)
- **Firebase Config**: Full reload when configuration changes

### Development Features

- 🔄 **Real-time updates**: See changes instantly
- 📱 **State preservation**: Form data and app state maintained during updates
- 🎨 **CSS injection**: Styles update without flash
- 📊 **Performance monitoring**: Built-in development metrics
- 🚨 **Error overlay**: Enhanced error reporting with stack traces
- 📝 **Development notifications**: Visual feedback for updates

## 🏗️ Architecture

### Core Components

1. **Vite Development Server** (`vite.config.js`)
   - Multi-page application support
   - Auto-discovery of HTML files
   - Asset optimization
   - Source maps for debugging

2. **Enhanced Dev Server** (`scripts/dev-server.js`)
   - Custom file watching
   - Firebase config monitoring
   - Graceful shutdown handling
   - Enhanced logging

3. **HMR Helper** (`public/assets/js/hmr-helper.js`)
   - Client-side HMR enhancements
   - State preservation utilities
   - Error overlay system
   - Development notifications

4. **Environment Detection** (`public/assets/js/dev-env.js`)
   - Automatic development mode detection
   - Performance monitoring
   - Enhanced error handling

### File Structure

```
3-ball-network/
├── vite.config.js              # Vite configuration
├── scripts/
│   ├── dev-server.js           # Enhanced development server
│   └── build-vite-hmr.js       # HMR-optimized build script
└── public/
    └── assets/
        └── js/
            ├── hmr-helper.js   # Client-side HMR utilities
            └── dev-env.js      # Development environment detection
```

## 🎯 Features

### CSS Hot Reload

- Changes to CSS files are injected without page refresh
- Maintains scroll position and form state
- Source maps for easy debugging

### JavaScript Hot Reload

- Module updates without losing application state
- Chart.js instances are automatically reinitialized
- Dashboard modules preserve user data

### State Preservation

- Form data is automatically saved and restored
- User preferences maintained across updates
- Active tabs and modal states preserved

### Enhanced Error Handling

- Visual error overlay with stack traces
- Console grouping for better error organization
- Unhandled promise rejection tracking

### Performance Monitoring

- Real-time performance metrics
- DOM load time tracking
- First paint timing
- Development indicator in corner

## 🔧 Configuration

### Vite Configuration (`vite.config.js`)

```javascript
export default defineConfig({
  root: 'public',
  server: {
    port: 3000,
    hmr: {
      port: 24678,
      overlay: true,
    },
  },
  // ... additional configuration
});
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "node scripts/dev-server.js", // Enhanced HMR server
    "dev:vite": "vite", // Basic Vite server
    "dev:hmr": "npm run dev", // Alias for HMR
    "build:vite": "vite build", // Vite production build
    "deploy:vite": "npm run build:vite && firebase deploy"
  }
}
```

## 🎮 Usage Examples

### Basic Development

```bash
# Start development with HMR
npm run dev

# Your browser opens to http://localhost:3000
# Make changes to any file and see them update instantly
```

### CSS Development

```css
/* public/assets/css/style.css */
.demo-section {
  background: linear-gradient(135deg, #007cba 0%, #00b4d8 100%);
  /* Changes appear instantly without page reload */
}
```

### JavaScript Development

```javascript
// public/assets/js/playerDashboard.js
export function updatePlayerStats(data) {
  // Function updates are hot-reloaded
  // Application state is preserved
}
```

### HTML Development

```html
<!-- public/index.html -->
<!-- HTML changes trigger a full page reload -->
<!-- But form state is preserved automatically -->
```

## 🐛 Troubleshooting

### Common Issues

1. **HMR Not Working**

   ```bash
   # Check if running on correct port
   lsof -ti:3000

   # Restart development server
   npm run dev
   ```

2. **CSS Not Hot Reloading**
   - Check if CSS file is properly linked
   - Verify Vite is detecting the file changes
   - Check browser console for errors

3. **JavaScript Errors**
   - Check the error overlay
   - Look at browser console
   - Verify module imports are correct

4. **Performance Issues**
   - Close unused browser tabs
   - Clear browser cache
   - Restart development server

### Debug Mode

```javascript
// Enable verbose logging
sessionStorage.setItem('dev_mode', 'true');
location.reload();
```

## 🚀 Advanced Features

### Custom HMR Accept Handlers

```javascript
if (import.meta.hot) {
  import.meta.hot.accept('./my-module.js', newModule => {
    // Custom handling for module updates
  });
}
```

### State Preservation API

```javascript
import { preserveAppState, restoreAppState } from './hmr-helper.js';

// Manually preserve state before updates
preserveAppState();

// Restore state after updates
restoreAppState();
```

### Development Notifications

```javascript
// Show custom development notifications
if (window.showDevNotification) {
  showDevNotification('Custom message', 'success');
}
```

## 📈 Performance Benefits

- ⚡ **Faster Development**: No more manual refreshes
- 🎯 **Better DX**: Immediate feedback on changes
- 💾 **State Preservation**: No lost work during development
- 🔍 **Better Debugging**: Source maps and error overlays
- 📊 **Performance Insights**: Built-in monitoring

## 🔄 Integration with Existing Workflow

### Firebase Integration

- Firebase config changes trigger full reload
- Service worker updates are handled automatically
- Authentication state is preserved

### PWA Features

- Service worker updates work with HMR
- Manifest changes are detected
- App installation prompts remain functional

### Analytics Integration

- Chart.js instances are automatically reinitialized
- Dashboard state is preserved
- Real-time data connections maintained

## 🎉 Getting Started

1. **Install dependencies** (already done):

   ```bash
   npm install
   ```

2. **Start development**:

   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:3000`

4. **Make changes** to any file and watch them update instantly!

5. **Check the development indicator** in the bottom-left corner

6. **Use the browser console** to see HMR status and performance metrics

---

**Happy Coding! 🏀🔥**

The HMR setup is now fully integrated into your 3 Ball Network development workflow. Enjoy the enhanced development experience!
