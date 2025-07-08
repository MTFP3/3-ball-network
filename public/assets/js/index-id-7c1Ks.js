import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js';
import './firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI.js';
import './sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js';
/* empty css                                                                                                        */ const r =
    () =>
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1' ||
      location.hostname === '0.0.0.0' ||
      location.port === '3000' ||
      location.search.includes('dev=true') ||
      sessionStorage.getItem('dev_mode') === 'true',
  n = () => typeof import.meta < 'u' && void 0;
if (r()) {
  (console.log(
    '%c🏀 3 Ball Network - Development Mode',
    'background: linear-gradient(45deg, #00b4d8, #007cba); color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold;'
  ),
    console.log('🔥 HMR Status:', 'Not Available'),
    console.log('🌍 Environment:', {
      hostname: location.hostname,
      port: location.port,
      protocol: location.protocol,
      viteHMR: n(),
    }));
  const e = document.createElement('div');
  ((e.id = 'dev-indicator'),
    (e.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(0, 180, 216, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      z-index: 9999;
      font-family: monospace;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      cursor: pointer;
    ">
      🔥 DEV 
    </div>
  `),
    document.addEventListener('DOMContentLoaded', () => {
      (document.body.appendChild(e),
        e.addEventListener('click', () => {
          (console.group('🛠️ Development Information'),
            console.log('📱 Viewport:', {
              width: window.innerWidth,
              height: window.innerHeight,
              devicePixelRatio: window.devicePixelRatio,
            }),
            console.log('🔄 HMR Features:', {
              viteHMR: n(),
              cssHMR: !!document.querySelector('style[data-vite-dev-id]'),
              jsHMR: typeof import.meta < 'u' && !1,
            }),
            console.log('📊 Performance:', {
              domContentLoaded:
                performance.timing.domContentLoadedEventEnd -
                performance.timing.navigationStart,
              loadComplete:
                performance.timing.loadEventEnd -
                performance.timing.navigationStart,
            }),
            console.groupEnd());
        }));
    }),
    window.addEventListener('load', () => {
      setTimeout(() => {
        const o = performance.getEntriesByType('navigation')[0];
        o &&
          console.log('⚡ Performance Metrics:', {
            'DOM Content Loaded': `${Math.round(o.domContentLoadedEventEnd - o.domContentLoadedEventStart)}ms`,
            'Load Complete': `${Math.round(o.loadEventEnd - o.loadEventStart)}ms`,
            'First Paint':
              performance
                .getEntriesByType('paint')
                .find(t => t.name === 'first-paint')?.startTime || 'N/A',
          });
      }, 1e3);
    }),
    window.addEventListener('error', o => {
      (console.group('❌ JavaScript Error'),
        console.error('Message:', o.message),
        console.error('File:', o.filename),
        console.error('Line:', o.lineno),
        console.error('Column:', o.colno),
        console.error('Stack:', o.error?.stack),
        console.groupEnd());
    }),
    window.addEventListener('unhandledrejection', o => {
      (console.group('❌ Unhandled Promise Rejection'),
        console.error('Reason:', o.reason),
        console.groupEnd());
    }));
}
//# sourceMappingURL=index-id-7c1Ks.js.map
