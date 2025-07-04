const CACHE_VERSION = 'v58ac0348';
const CACHE_FILES = [
  '/test-integration.html?v=363a04bb',
  '/terms.html?v=845bbe4a',
  '/teamArchive.html?v=37538027',
  '/team.html?v=b4218669',
  '/social-hub.html?v=bd8a901e',
  '/smart-input.html?v=374bd600',
  '/search.html?v=714f57d0',
  '/scout.html?v=a5b2b1fa',
  '/register.html?v=82ac11ab',
  '/recruiting-hub.html?v=ee30c4fe',
  '/privacy.html?v=43fbebb5',
  '/playerProfile.html?v=de96947a',
  '/player.html?v=39496573',
  '/overview.html?v=5419a090',
  '/login.html?v=00964787',
  '/live.html?v=4d9fe45e',
  '/live-demo.html?v=be8b4b30',
  '/index.html?v=6b8f8d0c',
  '/fan.html?v=ca64764f',
  '/demo-scout.html?v=e0120b94',
  '/demo-player.html?v=fbadef40',
  '/demo-fan.html?v=0256585a',
  '/demo-enhanced.html?v=55f06dd3',
  '/demo-coach.html?v=53c15f17',
  '/coach.html?v=8b21be9e',
  '/claim-profile.html?v=9caf0404',
  '/cache-clear.html?v=d41d8cd9',
  '/backup_overview.html?v=d41d8cd9',
  '/analytics.html?v=b0091a2d',
  '/analytics-dashboard.html?v=4882dd48',
  '/ai-coach.html?v=2cdd75de',
  '/admin.html?v=ff61a165',
  '/about.html?v=224960d6',
  '/assets/png/logo-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD.png?v=283ae8cd',
  '/assets/json/manifest-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_.json?v=eabaf9e7',
  '/assets/js/test-integration-D_txx2_e.js.map?v=638ea5e8',
  '/assets/js/test-integration-D_txx2_e.js?v=77570699',
  '/assets/js/terms-CGeOs184.js.map?v=3deb1e79',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K.js.map?v=ddd97f7a',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K.js?v=17696d67',
  '/assets/js/teamArchive-DHGXZtBz.js.map?v=6f89b068',
  '/assets/js/teamArchive-DHGXZtBz.js?v=ad1479f6',
  '/assets/js/team-zGklEDSS.js.map?v=7daec79d',
  '/assets/js/team-zGklEDSS.js?v=1654e1dd',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js.map?v=9cd7d64f',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js?v=6d5f0f90',
  '/assets/js/social-hub-CJVs5LsP.js.map?v=58d63c19',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js.map?v=a4c81aa4',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js?v=133303c9',
  '/assets/js/smart-input-BgnAC3fw.js.map?v=aab40fb6',
  '/assets/js/search-DE0B5ZRb.js.map?v=113656b6',
  '/assets/js/search-DE0B5ZRb.js?v=2e6dae87',
  '/assets/js/scout-PP2EHfzg.js.map?v=82035d72',
  '/assets/js/scout-PP2EHfzg.js?v=44f93ada',
  '/assets/js/register-DF3AGY4V.js.map?v=3c7b6865',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP.js.map?v=3720be8d',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP.js?v=5d2866f2',
  '/assets/js/recruiting-hub-CioJa9WB.js.map?v=5730f052',
  '/assets/js/privacy-CGeOs184.js.map?v=cc1e4bb1',
  '/assets/js/playerProfile-CUkT3rGy.js.map?v=acae7e11',
  '/assets/js/playerProfile-CUkT3rGy.js?v=104584fc',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W.js.map?v=8f3235ec',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W.js?v=7c46dbbd',
  '/assets/js/player-505E2zCr.js.map?v=ee2ee08d',
  '/assets/js/player-505E2zCr.js?v=26ebd9b4',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8.js.map?v=a1c1817e',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8.js?v=d02b2671',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-B18uW48d.js?v=c13edce9',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js.map?v=c7aca07f',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js?v=9b8f0066',
  '/assets/js/overview-T39ELi0g.js.map?v=0307edcd',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r.js.map?v=12130e8e',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r.js?v=26557a7a',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js.map?v=7c648ba0',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js?v=c2e0cf88',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey.js.map?v=3aade17f',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey.js?v=63271e5d',
  '/assets/js/login-CyBxW3fo.js.map?v=a0e9a46c',
  '/assets/js/login-CyBxW3fo.js?v=8b1a4bf2',
  '/assets/js/live-demo-uef9Shio.js.map?v=de274cff',
  '/assets/js/live-CGeOs184.js.map?v=1b3cc1fc',
  '/assets/js/index-DlJ4jv1D.js.map?v=912b51fd',
  '/assets/js/index-DlJ4jv1D.js?v=aa49139e',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-CmrFg6km-CmrFg6km-CmrFg6km.js?v=f0dfa5ee',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-CnLNGheY-CnLNGheY.js?v=e812ffe2',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-zjChy6re.js?v=57f1f542',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI.js.map?v=0c664aa7',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI.js?v=d812716f',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo.js?v=120f41b9',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U.js?v=32558c7a',
  '/assets/js/firebaseConfig-DCH0t8Yd-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL.js?v=0303239c',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW.js.map?v=7ed5acc2',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW.js?v=fa24bb28',
  '/assets/js/fan-Dj-ZwYQ1.js.map?v=ced3f3e9',
  '/assets/js/fan-Dj-ZwYQ1.js?v=48078941',
  '/assets/js/demo-scout-Pqvx3Gc0.js.map?v=c9baefbf',
  '/assets/js/demo-player-CEHwoORq.js.map?v=a281aba9',
  '/assets/js/demo-player-CEHwoORq.js?v=1d75433c',
  '/assets/js/demo-fan-Pqvx3Gc0.js.map?v=2cfb7319',
  '/assets/js/demo-enhanced-uef9Shio.js.map?v=18cb3646',
  '/assets/js/demo-coach-C-U5rN0z.js.map?v=91297a06',
  '/assets/js/coach-DBdV8T94.js.map?v=77b5c634',
  '/assets/js/coach-DBdV8T94.js?v=cba8df36',
  '/assets/js/claim-profile-D86r3Wq7.js.map?v=354472db',
  '/assets/js/claim-profile-D86r3Wq7.js?v=a8f8c786',
  '/assets/js/cache-clear-l0sNRNKZ.js.map?v=4fd7acd0',
  '/assets/js/backup_overview-l0sNRNKZ.js.map?v=c3ff31a6',
  '/assets/js/analytics-dashboard-D0WBfZKt.js.map?v=7616b9dc',
  '/assets/js/analytics-B7XR8O1t.js.map?v=6541afc1',
  '/assets/js/analytics-B7XR8O1t.js?v=e9026f54',
  '/assets/js/ai-coach-CJVs5LsP.js.map?v=635896cd',
  '/assets/js/admin-CgwpHXE6.js.map?v=ad5e2d12',
  '/assets/js/admin-CgwpHXE6.js?v=043e7e80',
  '/assets/js/about-C-qnpkaO.js.map?v=2b20027c',
  '/assets/css/style-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc.css?v=c4a4d731',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-CzL5AvnW-CzL5AvnW.css?v=b9a841df',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j.css?v=e553b98b'
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
