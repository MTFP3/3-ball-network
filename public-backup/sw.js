const CACHE_VERSION = 'vd9d98fff';
const CACHE_FILES = [
  '/test-integration.html?v=c02aa5ca',
  '/terms.html?v=024b3d40',
  '/teamArchive.html?v=ed15f92d',
  '/team.html?v=da51b44c',
  '/social-hub.html?v=3ede8e39',
  '/smart-input.html?v=4d2e6448',
  '/search.html?v=59029d51',
  '/scout.html?v=59f2b19c',
  '/register.html?v=0bcd3a5f',
  '/recruiting-hub.html?v=5c3ac633',
  '/privacy.html?v=2efcf846',
  '/playerProfile.html?v=54be7df2',
  '/player.html?v=e1d73b68',
  '/overview.html?v=91bfe04f',
  '/login.html?v=0bb8cf6b',
  '/live.html?v=39a6e824',
  '/live-demo.html?v=ecbf96ad',
  '/index.html?v=4e6e57a1',
  '/fan.html?v=a1d061b5',
  '/demo-scout.html?v=72c6f33b',
  '/demo-player.html?v=669dd012',
  '/demo-fan.html?v=18c59dd4',
  '/demo-enhanced.html?v=2f2c09c6',
  '/demo-coach.html?v=9e76bd05',
  '/demo-coach-final.html?v=3e1e13db',
  '/coach.html?v=348b90e6',
  '/claim-profile.html?v=ddea6540',
  '/cache-clear.html?v=d41d8cd9',
  '/backup_overview.html?v=d41d8cd9',
  '/analytics.html?v=7bbe7be6',
  '/analytics-dashboard.html?v=a871c72d',
  '/ai-coach.html?v=c5d5916d',
  '/admin.html?v=55435648',
  '/about.html?v=a6e06eaa',
  '/assets/png/logo-C3J1yCbD-C3J1yCbD-C3J1yCbD.png?v=283ae8cd',
  '/assets/json/manifest-RduZY6E_-RduZY6E_-RduZY6E_.json?v=eabaf9e7',
  '/assets/js/test-integration-CuuLF-Qg.js.map?v=4b88fffb',
  '/assets/js/test-integration-CuuLF-Qg.js?v=334e1319',
  '/assets/js/terms-i_X2zzPV.js.map?v=aa4c067d',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K.js.map?v=d9fd5681',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K.js?v=82f801d6',
  '/assets/js/teamArchive-CQEqX9CX.js.map?v=56dacd4a',
  '/assets/js/teamArchive-CQEqX9CX.js?v=dd62aff7',
  '/assets/js/team-Daj8G-x5.js.map?v=ea7fa701',
  '/assets/js/team-Daj8G-x5.js?v=430e6ee6',
  '/assets/js/sw-manager--CjsvoUl.js.map?v=5052a91b',
  '/assets/js/sw-manager--CjsvoUl.js?v=a83a6ec5',
  '/assets/js/social-hub-Dk_fPaly.js.map?v=cbf3c29d',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js.map?v=b59d8d3e',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js?v=b59ce06b',
  '/assets/js/smart-input-CF0PLGU0.js.map?v=d30fe694',
  '/assets/js/search-D2qrMaX6.js.map?v=9fbc81a4',
  '/assets/js/search-D2qrMaX6.js?v=2a349cc0',
  '/assets/js/scout-BYmsCeuo.js.map?v=e6c8ef98',
  '/assets/js/scout-BYmsCeuo.js?v=6eb50175',
  '/assets/js/register-CBsuiAmX.js.map?v=95629fd8',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm.js.map?v=aaa06e3e',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm.js?v=22d2ccc1',
  '/assets/js/recruiting-hub-DggufzSl.js.map?v=e88a75d5',
  '/assets/js/privacy-i_X2zzPV.js.map?v=af13f490',
  '/assets/js/playerProfile-CyGiqRi0.js.map?v=d0cd09ce',
  '/assets/js/playerProfile-CyGiqRi0.js?v=c6155687',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W.js.map?v=938787b0',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W.js?v=2ff82e56',
  '/assets/js/player-DZn68FfT.js.map?v=4d27d611',
  '/assets/js/player-DZn68FfT.js?v=d34bfd31',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx.js.map?v=89b08d88',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx.js?v=df48eb0a',
  '/assets/js/overview-DPlul7c4.js.map?v=1b9d9f3a',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX.js.map?v=9c443851',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX.js?v=9ef11379',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV.js.map?v=d5dd8154',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV.js?v=f23f4f85',
  '/assets/js/login-DKUnYUWV.js.map?v=123b5016',
  '/assets/js/login-DKUnYUWV.js?v=06a7f93d',
  '/assets/js/live-i_X2zzPV.js.map?v=387969de',
  '/assets/js/live-demo-CsR1hzNv.js.map?v=4fa48f19',
  '/assets/js/index-CruUIKno.js.map?v=6f1c1c3f',
  '/assets/js/index-CruUIKno.js?v=0a807204',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy.js.map?v=64156abb',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy.js?v=120f41b9',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmUL_U9U.js?v=32558c7a',
  '/assets/js/firebaseConfig-DCH0t8Yd-BoEIudfL-BoEIudfL.js?v=0303239c',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW.js.map?v=5272d058',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW.js?v=1e020acd',
  '/assets/js/fan--bDFohDB.js.map?v=ae57ac4a',
  '/assets/js/fan--bDFohDB.js?v=93fd41e1',
  '/assets/js/demo-scout-Dk_fPaly.js.map?v=0029622c',
  '/assets/js/demo-player-CsR1hzNv.js.map?v=dcd61051',
  '/assets/js/demo-fan-Dk_fPaly.js.map?v=cca9746a',
  '/assets/js/demo-enhanced-CsR1hzNv.js.map?v=9a53056e',
  '/assets/js/demo-coach-final-4C-_bKyH.js.map?v=8da8de4f',
  '/assets/js/demo-coach-DH-UuzP6.js.map?v=9e679a73',
  '/assets/js/coach-CQmmuChx.js.map?v=e2600a6f',
  '/assets/js/coach-CQmmuChx.js?v=e224aff2',
  '/assets/js/claim-profile-2e4TpLJq.js.map?v=fdfc2086',
  '/assets/js/claim-profile-2e4TpLJq.js?v=e5281969',
  '/assets/js/cache-clear-l0sNRNKZ.js.map?v=4fd7acd0',
  '/assets/js/backup_overview-l0sNRNKZ.js.map?v=c3ff31a6',
  '/assets/js/analytics-dashboard-BL4qz4A-.js.map?v=182e1549',
  '/assets/js/analytics-BQ0ICsrz.js.map?v=e463482f',
  '/assets/js/analytics-BQ0ICsrz.js?v=922a6460',
  '/assets/js/ai-coach-Dk_fPaly.js.map?v=13a75272',
  '/assets/js/admin-D_c-tV7p.js.map?v=2a833592',
  '/assets/js/admin-D_c-tV7p.js?v=7e7486ff',
  '/assets/js/about-DJ1oLCLo.js.map?v=2304c0fe',
  '/assets/css/style-atMpp5Bc-atMpp5Bc-atMpp5Bc.css?v=c4a4d731',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j.css?v=e553b98b'
];

// Service Worker for 3 Ball Network PWA - ADVANCED CACHE BUSTING

// Install event - cache versioned files
self.addEventListener('install', event => {
  console.log('Service Worker installing, version:', CACHE_VERSION);
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then(cache => {
        console.log('Opened cache version:', CACHE_VERSION);
        return cache.addAll(CACHE_FILES);
      })
      .then(() => {
        // Force immediate activation
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating, version:', CACHE_VERSION);
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_VERSION) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - network-first for HTML, cache-first for assets
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // For HTML pages, always try network first to get latest content
  if (
    request.destination === 'document' ||
    request.headers.get('accept')?.includes('text/html') ||
    url.pathname.endsWith('.html') ||
    url.pathname === '/'
  ) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response to cache it
          const responseClone = response.clone();
          caches.open(CACHE_VERSION).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
  }
  // For assets, use cache-first with version checking
  else {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, fetch from network and cache
        return fetch(request).then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_VERSION).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
  }
});

// Listen for messages from the client to force refresh
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(name => caches.delete(name)));
      })
    );
  }
});
