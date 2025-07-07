const CACHE_VERSION = 'v3c7f4e72';
const CACHE_FILES = [
  '/test-integration.html?v=b80b6538',
  '/terms.html?v=4d5f844a',
  '/teamArchive.html?v=61c67dc6',
  '/team.html?v=66796444',
  '/social-hub.html?v=c3b3a096',
  '/smart-input.html?v=3b6c05cc',
  '/search.html?v=3b9462b8',
  '/scout.html?v=dfcdf620',
  '/register.html?v=32f9cfc2',
  '/recruiting-hub.html?v=825825c6',
  '/privacy.html?v=57552231',
  '/playerProfile.html?v=0e37e03a',
  '/player.html?v=aca49482',
  '/overview.html?v=863ab7e2',
  '/login.html?v=010f2238',
  '/live.html?v=ab0db19b',
  '/live-demo.html?v=613ca415',
  '/index.html?v=b43a7612',
  '/fan.html?v=8bed965e',
  '/demo-scout.html?v=01bd68f1',
  '/demo-player.html?v=be3c979b',
  '/demo-fan.html?v=8d790396',
  '/demo-enhanced.html?v=02fe2073',
  '/demo-coach.html?v=5a3a48ae',
  '/coach.html?v=5dae5424',
  '/claim-profile.html?v=7bf99bf9',
  '/cache-clear.html?v=943be5ce',
  '/backup_overview.html?v=d41d8cd9',
  '/analytics.html?v=25adb1e8',
  '/analytics-dashboard.html?v=42175112',
  '/ai-coach.html?v=15ba9bcf',
  '/admin.html?v=4332aa0d',
  '/about.html?v=3795fa56',
  '/assets/png/logo-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD.png?v=283ae8cd',
  '/assets/json/manifest-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_.json?v=eabaf9e7',
  '/assets/js/test-integration-DO2U55hK.js.map?v=0909b5c6',
  '/assets/js/test-integration-DO2U55hK.js?v=3637fd81',
  '/assets/js/terms-7ZisbY8y.js.map?v=8698eea8',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K.js.map?v=a8d786fd',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K.js?v=c0e721ea',
  '/assets/js/teamArchive-BXnih3C7.js.map?v=62ee7cfb',
  '/assets/js/teamArchive-BXnih3C7.js?v=97d67c5c',
  '/assets/js/team-BLCyJC63.js.map?v=48cba996',
  '/assets/js/team-BLCyJC63.js?v=09dbee1e',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js.map?v=c3ec86eb',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js?v=abfd19d1',
  '/assets/js/social-hub-B_PdHcrY.js.map?v=ad2101b3',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js.map?v=da6480f1',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js?v=03768027',
  '/assets/js/smart-input-B4k8kXef.js.map?v=1c8d1d78',
  '/assets/js/search-_QuSzHua.js.map?v=391f8d61',
  '/assets/js/search-_QuSzHua.js?v=711a4d7c',
  '/assets/js/scout-yufMHnwX.js.map?v=36a476bf',
  '/assets/js/scout-yufMHnwX.js?v=252ebd8f',
  '/assets/js/register-BjzVpdgo.js.map?v=e62005ed',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s.js.map?v=9acf78b2',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s.js?v=2f342923',
  '/assets/js/recruiting-hub-DjXJaAcw.js.map?v=ebb959ce',
  '/assets/js/privacy-7ZisbY8y.js.map?v=de224d11',
  '/assets/js/playerProfile-CfpWj8Gl.js.map?v=b579a319',
  '/assets/js/playerProfile-CfpWj8Gl.js?v=d853c2dd',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W.js.map?v=28fea965',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W.js?v=ce0f3f75',
  '/assets/js/player-BHN0eul5.js.map?v=08560b83',
  '/assets/js/player-BHN0eul5.js?v=aed587c1',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-DAV1RrA1-DAV1RrA1-DAV1RrA1.js?v=85bf46f7',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-DpocxIhM-DpocxIhM.js?v=7e620413',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-C005TVuN.js?v=3bbc2711',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8.js.map?v=b9ec052e',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8.js?v=58f6745b',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh.js?v=d02b2671',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d.js?v=c13edce9',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js.map?v=d96d1de9',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js?v=3f66d369',
  '/assets/js/overview-blJ9qBla.js.map?v=dc74d17a',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js.map?v=b1f618e7',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js?v=3ed25fb6',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a.js.map?v=46ae43ec',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a.js?v=9b75233b',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey.js.map?v=3c95b23c',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey.js?v=ca921b98',
  '/assets/js/login-p3rpCM80.js.map?v=fd7c18a1',
  '/assets/js/login-p3rpCM80.js?v=d039215e',
  '/assets/js/live-demo-NAkZklur.js.map?v=df24fc88',
  '/assets/js/live-7ZisbY8y.js.map?v=b5279a57',
  '/assets/js/index-id-7c1Ks.js.map?v=06005982',
  '/assets/js/index-id-7c1Ks.js?v=46fb00c7',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km.js?v=f0dfa5ee',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY.js?v=e812ffe2',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re.js?v=57f1f542',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-C4wcfbVF.js?v=8b1cbb7d',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI.js.map?v=7315908d',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI.js?v=78d7ef09',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Bsdguary-Bsdguary.js?v=be4111a9',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-4J497xUw-4J497xUw-4J497xUw.js?v=6eda6725',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z.js?v=d812716f',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo.js?v=120f41b9',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U.js?v=32558c7a',
  '/assets/js/firebaseConfig-DCH0t8Yd-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL.js?v=0303239c',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW.js.map?v=a038cd28',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW.js?v=f0683f90',
  '/assets/js/fan-CgapMSLu.js.map?v=0279ed58',
  '/assets/js/fan-CgapMSLu.js?v=9d769b1b',
  '/assets/js/demo-scout-BUD6_29W.js.map?v=523e9d3a',
  '/assets/js/demo-player-CH298bO6.js.map?v=7caf8ff4',
  '/assets/js/demo-player-CH298bO6.js?v=8d40d919',
  '/assets/js/demo-fan-BUD6_29W.js.map?v=8fcf385a',
  '/assets/js/demo-enhanced-NAkZklur.js.map?v=3f03f66d',
  '/assets/js/demo-coach-ClNGxFD6.js.map?v=c953ca32',
  '/assets/js/coach-CuRcMZl8.js.map?v=defbcce4',
  '/assets/js/coach-CuRcMZl8.js?v=86a0ad94',
  '/assets/js/claim-profile-D8qU_j8X.js.map?v=3ed0b797',
  '/assets/js/claim-profile-D8qU_j8X.js?v=1b6f221b',
  '/assets/js/cache-clear-l0sNRNKZ.js.map?v=4fd7acd0',
  '/assets/js/backup_overview-l0sNRNKZ.js.map?v=c3ff31a6',
  '/assets/js/analytics-dashboard-BwmZ_B9U.js.map?v=10c8c77b',
  '/assets/js/analytics-CiavzH3j.js.map?v=0fd7f230',
  '/assets/js/analytics-CiavzH3j.js?v=fe3add15',
  '/assets/js/ai-coach-B_PdHcrY.js.map?v=283ec469',
  '/assets/js/admin-CrAJrcMo.js.map?v=64721221',
  '/assets/js/admin-CrAJrcMo.js?v=8b3f300a',
  '/assets/js/about-C_BhXfMz.js.map?v=74e65975',
  '/assets/css/style-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc.css?v=c4a4d731',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW.css?v=b9a841df',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j.css?v=e553b98b'
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
          caches
            .open(CACHE_VERSION)
            .then(cache => cache.put(request, responseClone));
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
