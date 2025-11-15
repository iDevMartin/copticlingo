# PWA (Progressive Web App) Setup

CopticLingo is now configured as a Progressive Web App, which means users can install it on their mobile devices and use it offline!

## What's Included

### 1. Service Worker (`public/service-worker.js`)
- Caches essential app files for offline use
- Implements a cache-first strategy for fast loading
- Automatically updates when new versions are deployed
- Current cache version: `copticlingo-v1`

### 2. Web App Manifest (`public/manifest.json`)
- Defines app metadata (name, description, colors)
- Configures app icons for home screen
- Sets display mode to `standalone` (full-screen, app-like)
- Theme color: `#10B981` (CopticLingo green)

### 3. Custom HTML Template (`public/index.html`)
- Registers the service worker on page load
- Links to the manifest file
- Includes PWA meta tags for iOS compatibility
- Apple-specific meta tags for better iOS experience

### 4. App Icons
- **icon-192.svg**: 192x192 icon for mobile home screens
- **icon-512.svg**: 512x512 icon for splash screens and larger displays
- Simple "CL" logo with green background (#10B981)

## How It Works

### For Users:
1. **Visit the website** on a mobile browser (Chrome, Safari, Firefox)
2. **Add to Home Screen** using the browser's "Add to Home Screen" option
3. **Launch the app** from the home screen icon - it opens in full-screen mode
4. **Works offline** - previously loaded lessons and content are cached

### For Developers:

#### Service Worker Lifecycle
```javascript
// Install - Cache essential files
self.addEventListener('install', (event) => {
  // Caches app shell (HTML, JS, CSS)
});

// Activate - Clean up old caches
self.addEventListener('activate', (event) => {
  // Removes outdated cache versions
});

// Fetch - Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Cache-first strategy with network fallback
});
```

#### Updating the Cache
When you update the app, change the cache version in `service-worker.js`:
```javascript
const CACHE_NAME = 'copticlingo-v2'; // Increment version number
```

This will force the service worker to re-cache all files.

## Browser Support

- ✅ Chrome (Android & Desktop)
- ✅ Safari (iOS & macOS)
- ✅ Firefox (Android & Desktop)
- ✅ Edge (Desktop)
- ✅ Samsung Internet (Android)

## Testing PWA

### Chrome DevTools (Desktop)
1. Open DevTools (F12)
2. Go to **Application** tab
3. Check **Manifest** section - should show app info
4. Check **Service Workers** - should show registered worker
5. Check **Cache Storage** - should show cached files

### Chrome (Android)
1. Visit the site in Chrome
2. Tap menu (⋮) → **Add to Home screen**
3. App icon will appear on home screen
4. Launch from home screen to test standalone mode

### Safari (iOS)
1. Visit the site in Safari
2. Tap Share button → **Add to Home Screen**
3. App icon will appear on home screen
4. Launch to test (may need to dismiss browser UI)

## Offline Behavior

The app will work offline after the first visit:
- ✅ Home screen and lesson tree
- ✅ Completed lessons (if previously loaded)
- ✅ Progress data (stored in AsyncStorage)
- ❌ Audio files (only if previously cached)
- ❌ New lessons (require network for first load)

## Customization

### Change App Icons
Replace `icon-192.svg` and `icon-512.svg` with your own designs. You can also use PNG format:
1. Create `icon-192.png` and `icon-512.png`
2. Update `manifest.json` to reference `.png` instead of `.svg`

### Change Theme Color
Edit `manifest.json`:
```json
{
  "theme_color": "#YourColorHere",
  "background_color": "#YourBackgroundColor"
}
```

### Add More Files to Cache
Edit `service-worker.js` and add to `CACHE_URLS`:
```javascript
const CACHE_URLS = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/your-new-file.css', // Add here
];
```

## Deployment

Ensure these files are served with correct MIME types:
- `manifest.json` → `application/manifest+json`
- `service-worker.js` → `application/javascript` or `text/javascript`
- `*.svg` → `image/svg+xml`

The service worker must be served over HTTPS (or localhost for development).

## Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Ensure HTTPS is enabled (or localhost)
- Check that `service-worker.js` is accessible at `/service-worker.js`

### Manifest Not Loading
- Verify `<link rel="manifest" href="/manifest.json">` in HTML
- Check Network tab in DevTools
- Validate JSON syntax in manifest

### Icons Not Showing
- Ensure icon files exist in `/public` folder
- Check browser console for 404 errors
- Verify icon paths in `manifest.json`

### Cache Not Updating
- Increment cache version in `service-worker.js`
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Unregister old service worker in DevTools

## Next Steps

Consider adding:
- **Push Notifications** for daily reminders
- **Background Sync** for offline progress syncing
- **App Shortcuts** for quick access to favorite lessons
- **Share Target** to share Coptic words/phrases
