const CACHE_VERSION = 'vb77e8b31';
const CACHE_FILES = [
  '/test-integration.html?v=05a259c9',
  '/terms.html?v=e7976ed7',
  '/teamArchive.html?v=59106f30',
  '/team.html?v=bbcff275',
  '/social-hub.html?v=d0c2e502',
  '/smart-input.html?v=004e6c32',
  '/search.html?v=280d7ee9',
  '/scout.html?v=dbc9648d',
  '/register.html?v=dd40c100',
  '/recruiting-hub.html?v=cb7ae2c3',
  '/privacy.html?v=8992cef6',
  '/playerProfile.html?v=a91057ab',
  '/player.html?v=7573a722',
  '/overview.html?v=fa095338',
  '/login.html?v=bcfb7ee2',
  '/live.html?v=3649581f',
  '/live-demo.html?v=62f88c66',
  '/index.html?v=6d50fad5',
  '/fan.html?v=a0720309',
  '/demo-scout.html?v=677819f0',
  '/demo-player.html?v=e829e313',
  '/demo-fan.html?v=783d78e6',
  '/demo-enhanced.html?v=be27bb0b',
  '/demo-coach.html?v=9a1b772b',
  '/coach.html?v=a18aec02',
  '/claim-profile.html?v=42d862ab',
  '/cache-clear.html?v=d41d8cd9',
  '/backup_overview.html?v=d41d8cd9',
  '/analytics.html?v=94e03172',
  '/analytics-dashboard.html?v=21a70af8',
  '/ai-coach.html?v=bfeae4c0',
  '/admin.html?v=a21943c5',
  '/about.html?v=55fad83e',
  '/assets/png/logo-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD.png?v=283ae8cd',
  '/assets/json/manifest-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_.json?v=eabaf9e7',
  '/assets/js/test-integration-EJXxm0XY.js.map?v=c473ae20',
  '/assets/js/test-integration-EJXxm0XY.js?v=d9cd5a4e',
  '/assets/js/terms-B5tRU3aT.js.map?v=8ef77504',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI.js.map?v=0bccf89c',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI.js?v=d6a5f5e2',
  '/assets/js/teamArchive-sU0qGrs3.js.map?v=8823f9a4',
  '/assets/js/teamArchive-sU0qGrs3.js?v=90e3ea8b',
  '/assets/js/team-0llmvBIR.js.map?v=9028fbe8',
  '/assets/js/team-0llmvBIR.js?v=6f071b74',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js.map?v=fa28cb1c',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js?v=d5835dc7',
  '/assets/js/social-hub-C_xChFkc.js.map?v=ea49d386',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js.map?v=88229c28',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js?v=cc081b18',
  '/assets/js/smart-input-D3O5w21B.js.map?v=57cfb1c4',
  '/assets/js/search-CTFvt_wR.js.map?v=f49cb974',
  '/assets/js/search-CTFvt_wR.js?v=0e7b127d',
  '/assets/js/scout-Bn-ruSd2.js.map?v=f159a4d6',
  '/assets/js/scout-Bn-ruSd2.js?v=a736ab40',
  '/assets/js/register-CzbOl3iv.js.map?v=14abb958',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm.js.map?v=2f61db81',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm.js?v=c65d4910',
  '/assets/js/recruiting-hub-DDrSIgUe.js.map?v=8a251f96',
  '/assets/js/privacy-B5tRU3aT.js.map?v=ba58e71c',
  '/assets/js/playerProfile-DTG_w4a2.js.map?v=5aaa175f',
  '/assets/js/playerProfile-DTG_w4a2.js?v=31c07198',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw.js.map?v=d2c7c14f',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw.js?v=333e3ae5',
  '/assets/js/player-kneXtoAp.js.map?v=b9ee0676',
  '/assets/js/player-kneXtoAp.js?v=f07d97c3',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S.js.map?v=e81626fc',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S.js?v=c13edce9',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js.map?v=385ffe4c',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js?v=0bff532a',
  '/assets/js/overview-e0T3rFte.js.map?v=3870a742',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX.js.map?v=9c443851',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX.js?v=9ef11379',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js.map?v=f3044706',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js?v=6afa9c9d',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey.js.map?v=990f470e',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey.js?v=68609646',
  '/assets/js/login-Bt7t2JrT.js.map?v=5b2445b2',
  '/assets/js/login-Bt7t2JrT.js?v=36046489',
  '/assets/js/live-demo-s3o_oUh4.js.map?v=cc560e70',
  '/assets/js/live-B5tRU3aT.js.map?v=7c094cd0',
  '/assets/js/index-jgEZtLqQ.js.map?v=8c976cdd',
  '/assets/js/index-jgEZtLqQ.js?v=074a896f',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-CmrFg6km-CmrFg6km.js?v=f0dfa5ee',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-CnLNGheY.js?v=e812ffe2',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_.js.map?v=48af0069',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_.js?v=57f1f542',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-BjvTU3wo-BjvTU3wo-BjvTU3wo.js?v=120f41b9',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U.js?v=32558c7a',
  '/assets/js/firebaseConfig-DCH0t8Yd-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL.js?v=0303239c',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn.js.map?v=cd3975e7',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn.js?v=15165261',
  '/assets/js/fan-AFNB-IpY.js.map?v=baa85565',
  '/assets/js/fan-AFNB-IpY.js?v=5f8ef2a6',
  '/assets/js/demo-scout-CpncXvmb.js.map?v=ef4879ef',
  '/assets/js/demo-player-lhNj6CWE.js.map?v=6620bf17',
  '/assets/js/demo-player-lhNj6CWE.js?v=c981ac46',
  '/assets/js/demo-fan-CpncXvmb.js.map?v=df5ada2c',
  '/assets/js/demo-enhanced-s3o_oUh4.js.map?v=246da81a',
  '/assets/js/demo-coach-C14agdIx.js.map?v=e4f991a2',
  '/assets/js/coach-Bj-EETK2.js.map?v=be3d459d',
  '/assets/js/coach-Bj-EETK2.js?v=cdc0a14a',
  '/assets/js/claim-profile-CHCz8HmD.js.map?v=b4f812ad',
  '/assets/js/claim-profile-CHCz8HmD.js?v=b3d2ce2e',
  '/assets/js/cache-clear-l0sNRNKZ.js.map?v=4fd7acd0',
  '/assets/js/backup_overview-l0sNRNKZ.js.map?v=c3ff31a6',
  '/assets/js/analytics-dashboard-Bwq9_wab.js.map?v=83433e37',
  '/assets/js/analytics-BxP910gN.js.map?v=cdf0bcbd',
  '/assets/js/analytics-BxP910gN.js?v=6a9a3426',
  '/assets/js/ai-coach-C_xChFkc.js.map?v=d29548f5',
  '/assets/js/admin-aT8t-ZJ1.js.map?v=0e6948d1',
  '/assets/js/admin-aT8t-ZJ1.js?v=1a04ffb3',
  '/assets/js/about-BM4Jl-Gd.js.map?v=bdfe9957',
  '/assets/css/style-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc.css?v=c4a4d731',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-CzL5AvnW.css?v=b9a841df',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j.css?v=e553b98b'
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
