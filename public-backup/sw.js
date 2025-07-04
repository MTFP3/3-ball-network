const CACHE_VERSION = 'v0732ac1b';
const CACHE_FILES = [
  '/test-integration.html?v=6d14cb56',
  '/terms.html?v=bd97a59a',
  '/teamArchive.html?v=1a785210',
  '/team.html?v=658edb84',
  '/social-hub.html?v=c141434b',
  '/smart-input.html?v=b58b6ad7',
  '/search.html?v=fdb06381',
  '/scout.html?v=cd6d6aea',
  '/register.html?v=2eb4b29a',
  '/recruiting-hub.html?v=37895598',
  '/privacy.html?v=717ecee9',
  '/playerProfile.html?v=58c6c77b',
  '/player.html?v=fd086460',
  '/overview.html?v=788a9ebc',
  '/login.html?v=8ca93ceb',
  '/live.html?v=dbc59e8d',
  '/live-demo.html?v=5bb41ee5',
  '/index.html?v=423a227a',
  '/fan.html?v=ceaed853',
  '/demo-scout.html?v=ef9fb3c2',
  '/demo-player.html?v=6876b04c',
  '/demo-fan.html?v=910651ca',
  '/demo-enhanced.html?v=c4313191',
  '/demo-coach.html?v=36a2ed8e',
  '/coach.html?v=68d4c8e6',
  '/claim-profile.html?v=bd572b93',
  '/cache-clear.html?v=d41d8cd9',
  '/backup_overview.html?v=d41d8cd9',
  '/analytics.html?v=c6a445a1',
  '/analytics-dashboard.html?v=83e5c3be',
  '/ai-coach.html?v=dbaca60c',
  '/admin.html?v=bb3dae95',
  '/about.html?v=0302f25b',
  '/assets/png/logo-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD.png?v=283ae8cd',
  '/assets/json/manifest-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_.json?v=eabaf9e7',
  '/assets/js/test-integration-B5YGymmk.js.map?v=4475e4a4',
  '/assets/js/test-integration-B5YGymmk.js?v=7101b8ba',
  '/assets/js/terms-oCfm6d_D.js.map?v=b60fdb0d',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI.js.map?v=467bd352',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI.js?v=8585c52e',
  '/assets/js/teamArchive-CY15edz1.js.map?v=b4e8f5ab',
  '/assets/js/teamArchive-CY15edz1.js?v=011c4d22',
  '/assets/js/team-DMcrg39O.js.map?v=12cfe78f',
  '/assets/js/team-DMcrg39O.js?v=98e96e9b',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js.map?v=23fe530c',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js?v=2f91eb2b',
  '/assets/js/social-hub-_fExmYrt.js.map?v=76de9343',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js.map?v=2fd148b7',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js?v=0ff0b8a7',
  '/assets/js/smart-input-Dj3tkwU9.js.map?v=1db3d571',
  '/assets/js/search-CwFAAMKd.js.map?v=9a26c07f',
  '/assets/js/search-CwFAAMKd.js?v=e4618e36',
  '/assets/js/scout-CWWIrVUz.js.map?v=c2717757',
  '/assets/js/scout-CWWIrVUz.js?v=bd7d633e',
  '/assets/js/register-CcHZi2UB.js.map?v=62715b69',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s.js.map?v=5b1f2be7',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s.js?v=8c9b65c1',
  '/assets/js/recruiting-hub-JaGxctQO.js.map?v=2f8090cf',
  '/assets/js/privacy-oCfm6d_D.js.map?v=300c9ef2',
  '/assets/js/playerProfile-DhsdCZ0a.js.map?v=08774e5b',
  '/assets/js/playerProfile-DhsdCZ0a.js?v=11bf4566',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw.js.map?v=c4fe958a',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw.js?v=2d64065f',
  '/assets/js/player-CdbSkWut.js.map?v=d7a66b7f',
  '/assets/js/player-CdbSkWut.js?v=0ec26a61',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8.js.map?v=4b79258a',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8.js?v=85bf46f7',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-0j_2LXoh.js?v=d02b2671',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-B18uW48d-B18uW48d.js?v=c13edce9',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js.map?v=39a84466',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js?v=805fc99b',
  '/assets/js/overview-Bn5olkfp.js.map?v=9eb7af71',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js.map?v=6ef91698',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js?v=547c098f',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE.js.map?v=ffe9d14a',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE.js?v=7b1e56f2',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey.js.map?v=39ca428a',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey.js?v=7f8697b3',
  '/assets/js/login-nudnzM_g.js.map?v=9f7267f7',
  '/assets/js/login-nudnzM_g.js?v=6f0db02a',
  '/assets/js/live-oCfm6d_D.js.map?v=3cbec0d3',
  '/assets/js/live-demo-DMYc4_Rk.js.map?v=61a88053',
  '/assets/js/index-D_JAiDwF.js.map?v=fb5ed6c6',
  '/assets/js/index-D_JAiDwF.js?v=6b9f918b',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km.js?v=f0dfa5ee',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-CnLNGheY-CnLNGheY-CnLNGheY.js?v=e812ffe2',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-zjChy6re-zjChy6re.js?v=57f1f542',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_.js.map?v=989ca54c',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_.js?v=6eda6725',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-2GJ28q5z.js?v=d812716f',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo.js?v=120f41b9',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U.js?v=32558c7a',
  '/assets/js/firebaseConfig-DCH0t8Yd-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL.js?v=0303239c',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn.js.map?v=7a267816',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn.js?v=5374457d',
  '/assets/js/fan-BXqtpHa4.js.map?v=c581027d',
  '/assets/js/fan-BXqtpHa4.js?v=7d452cc7',
  '/assets/js/demo-scout-CFyRseLx.js.map?v=2a8e7b94',
  '/assets/js/demo-player-BmiOpqso.js.map?v=cb151ee1',
  '/assets/js/demo-player-BmiOpqso.js?v=b24d0075',
  '/assets/js/demo-fan-CFyRseLx.js.map?v=c1e6a0d5',
  '/assets/js/demo-enhanced-DMYc4_Rk.js.map?v=6ad433c1',
  '/assets/js/demo-coach-DWV0eYAG.js.map?v=727917f3',
  '/assets/js/coach-a9FDaWGs.js.map?v=00df1a62',
  '/assets/js/coach-a9FDaWGs.js?v=90ff147c',
  '/assets/js/claim-profile-DJv-5we9.js.map?v=a80c15c4',
  '/assets/js/claim-profile-DJv-5we9.js?v=09c1fc47',
  '/assets/js/cache-clear-l0sNRNKZ.js.map?v=4fd7acd0',
  '/assets/js/backup_overview-l0sNRNKZ.js.map?v=c3ff31a6',
  '/assets/js/analytics-dashboard-gFxU0P_i.js.map?v=646fecac',
  '/assets/js/analytics-CVY9_eGS.js.map?v=8d88442a',
  '/assets/js/analytics-CVY9_eGS.js?v=12f1f0b5',
  '/assets/js/ai-coach-_fExmYrt.js.map?v=b5ade608',
  '/assets/js/admin-DVXQsG96.js.map?v=35149f18',
  '/assets/js/admin-DVXQsG96.js?v=0f967999',
  '/assets/js/about-BY8jvNEF.js.map?v=22b1006a',
  '/assets/css/style-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc.css?v=c4a4d731',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-CzL5AvnW-CzL5AvnW-CzL5AvnW.css?v=b9a841df',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j.css?v=e553b98b'
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
