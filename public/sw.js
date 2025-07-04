const CACHE_VERSION = 'v10023156';
const CACHE_FILES = [
  '/test-integration.html?v=1fd77ed4',
  '/terms.html?v=c3a0fb3d',
  '/teamArchive.html?v=40976dd1',
  '/team.html?v=ac0e3e93',
  '/social-hub.html?v=b53104fd',
  '/smart-input.html?v=cdd4de66',
  '/search.html?v=45ea7a08',
  '/scout.html?v=52a75b8f',
  '/register.html?v=9adcf56c',
  '/recruiting-hub.html?v=fbc248a5',
  '/privacy.html?v=771d2b0e',
  '/playerProfile.html?v=0931684a',
  '/player.html?v=548dc453',
  '/overview.html?v=9ca3b7c4',
  '/login.html?v=96a82e9b',
  '/live.html?v=88dea799',
  '/live-demo.html?v=4cf9c17a',
  '/index.html?v=b20265d1',
  '/fan.html?v=b49c7960',
  '/demo-scout.html?v=80b94c41',
  '/demo-player.html?v=c6eace92',
  '/demo-fan.html?v=53131689',
  '/demo-enhanced.html?v=8c19df80',
  '/demo-coach.html?v=4bd73ca2',
  '/coach.html?v=3062abc6',
  '/claim-profile.html?v=e6abdbf0',
  '/cache-clear.html?v=d41d8cd9',
  '/backup_overview.html?v=d41d8cd9',
  '/analytics.html?v=22721216',
  '/analytics-dashboard.html?v=ed9e94f5',
  '/ai-coach.html?v=5d1ec381',
  '/admin.html?v=276842a3',
  '/about.html?v=0097ef7e',
  '/assets/png/logo-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD.png?v=283ae8cd',
  '/assets/json/manifest-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_.json?v=eabaf9e7',
  '/assets/js/test-integration-DNJxumgv.js.map?v=e25dacfd',
  '/assets/js/test-integration-DNJxumgv.js?v=3a3bbcf3',
  '/assets/js/terms-06evUDeK.js.map?v=2b9b0658',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K.js.map?v=409ede87',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K.js?v=98934256',
  '/assets/js/teamArchive-QdSQr4Rd.js.map?v=b9e19435',
  '/assets/js/teamArchive-QdSQr4Rd.js?v=b153ebc0',
  '/assets/js/team-CBx5tgqF.js.map?v=d8b52c18',
  '/assets/js/team-CBx5tgqF.js?v=2366b13d',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js.map?v=8fb77ed6',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js?v=60209caa',
  '/assets/js/social-hub-DTCMaEJR.js.map?v=b869eff9',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js.map?v=0fd89298',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js?v=9e137b9f',
  '/assets/js/smart-input-CQ7KbRCc.js.map?v=c4399c78',
  '/assets/js/search-CTAF_Kah.js.map?v=5247c1a5',
  '/assets/js/search-CTAF_Kah.js?v=5ea12f9d',
  '/assets/js/scout-DuO_TMES.js.map?v=841b63f3',
  '/assets/js/scout-DuO_TMES.js?v=7d077216',
  '/assets/js/register-CoCSauWJ.js.map?v=788c62dc',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm.js.map?v=f1d3e807',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm.js?v=90b3cd3c',
  '/assets/js/recruiting-hub-C36qI1v6.js.map?v=01ee5057',
  '/assets/js/privacy-06evUDeK.js.map?v=21fafae3',
  '/assets/js/playerProfile-BeYlvNRh.js.map?v=e8ba0ab9',
  '/assets/js/playerProfile-BeYlvNRh.js?v=891ff33c',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W.js.map?v=d2ed3c8d',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W.js?v=ccd58d17',
  '/assets/js/player-et7ku3B7.js.map?v=ad89bd23',
  '/assets/js/player-et7ku3B7.js?v=ffd7d1d8',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-DAV1RrA1.js?v=85bf46f7',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8.js.map?v=dcdbe4ca',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8.js?v=7e620413',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-0j_2LXoh-0j_2LXoh.js?v=d02b2671',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-B18uW48d-B18uW48d-B18uW48d.js?v=c13edce9',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js.map?v=ab940bef',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js?v=80bb070e',
  '/assets/js/overview-iaWVGKut.js.map?v=68002e64',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js.map?v=363e8787',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js?v=d55de92c',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF.js.map?v=950769f7',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF.js?v=b76a0d62',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey.js.map?v=ee48f8c2',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey.js?v=5c084284',
  '/assets/js/login-C9ePDpuj.js.map?v=bff50e46',
  '/assets/js/login-C9ePDpuj.js?v=900cb947',
  '/assets/js/live-demo-ClYMYR5O.js.map?v=af0dbbb2',
  '/assets/js/live-06evUDeK.js.map?v=26c93028',
  '/assets/js/index-BDHhcq93.js.map?v=88713b8f',
  '/assets/js/index-BDHhcq93.js?v=6440ce8c',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km.js?v=f0dfa5ee',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY.js?v=e812ffe2',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-zjChy6re-zjChy6re-zjChy6re.js?v=57f1f542',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI.js.map?v=199d6024',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI.js?v=be4111a9',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-4J497xUw.js?v=6eda6725',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-2GJ28q5z-2GJ28q5z.js?v=d812716f',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo.js?v=120f41b9',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U.js?v=32558c7a',
  '/assets/js/firebaseConfig-DCH0t8Yd-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL.js?v=0303239c',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW.js.map?v=316b6e4b',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW.js?v=d42e68dc',
  '/assets/js/fan-DM2F5Y4S.js.map?v=5b82bf67',
  '/assets/js/fan-DM2F5Y4S.js?v=e7e526ce',
  '/assets/js/demo-scout-C9LlXcCZ.js.map?v=e95eaa0c',
  '/assets/js/demo-player-CgdcIbbJ.js.map?v=4d626e01',
  '/assets/js/demo-player-CgdcIbbJ.js?v=012ed85b',
  '/assets/js/demo-fan-C9LlXcCZ.js.map?v=9c386c4c',
  '/assets/js/demo-enhanced-ClYMYR5O.js.map?v=10cb35ae',
  '/assets/js/demo-coach-CVTGXK5l.js.map?v=828090d6',
  '/assets/js/coach-B5_w2ZXf.js.map?v=c6d4a5c4',
  '/assets/js/coach-B5_w2ZXf.js?v=6750cce0',
  '/assets/js/claim-profile-3z2MKZ1C.js.map?v=518b0b26',
  '/assets/js/claim-profile-3z2MKZ1C.js?v=735526a8',
  '/assets/js/cache-clear-l0sNRNKZ.js.map?v=4fd7acd0',
  '/assets/js/backup_overview-l0sNRNKZ.js.map?v=c3ff31a6',
  '/assets/js/analytics-dashboard-z1CpiBUy.js.map?v=a73717cf',
  '/assets/js/analytics-BKwACPJd.js.map?v=9de73771',
  '/assets/js/analytics-BKwACPJd.js?v=456289e1',
  '/assets/js/ai-coach-DTCMaEJR.js.map?v=5ec006e5',
  '/assets/js/admin-CVtX1N13.js.map?v=89bd74fd',
  '/assets/js/admin-CVtX1N13.js?v=09bfa98f',
  '/assets/js/about-CLM6StGl.js.map?v=b67d9c1d',
  '/assets/css/style-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc.css?v=c4a4d731',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW.css?v=b9a841df',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j.css?v=e553b98b'
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
      .then(() => {
        // Enable navigation preloading if supported for faster page loads
        if ('navigationPreload' in self.registration) {
          return self.registration.navigationPreload.enable();
        }
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
      // Use navigation preload if available for a speed boost
      event.preloadResponse
        .then(preloadedResponse => {
          if (preloadedResponse) {
            return preloadedResponse;
          }
          // Otherwise, fetch from the network as usual
          return fetch(request);
        })
        .then(networkResponse => {
          // Cache the fresh response for offline access
          const responseClone = networkResponse.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(error => {
          // If the network fails, serve the cached version
          console.log('Fetch failed; returning from cache.', error);
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
