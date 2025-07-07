const CACHE_VERSION = 'v4b4e44ae';
const CACHE_FILES = [
  '/test-integration.html?v=fde9e979',
  '/terms.html?v=2e46e344',
  '/teamArchive.html?v=a35856c5',
  '/team.html?v=a39098de',
  '/social-hub.html?v=05909ca4',
  '/smart-input.html?v=19e6d96f',
  '/search.html?v=519426a9',
  '/scout.html?v=cffdb013',
  '/register.html?v=e6af9588',
  '/recruiting-hub.html?v=4ff14ecc',
  '/privacy.html?v=25e8f682',
  '/playerProfile.html?v=e74a6f40',
  '/player.html?v=2d5da7f0',
  '/overview.html?v=f14922bd',
  '/login.html?v=ac3e8840',
  '/live.html?v=7d07a757',
  '/live-demo.html?v=d8438542',
  '/index.html?v=81c659e2',
  '/fan.html?v=8e66f1e6',
  '/demo-scout.html?v=1078ee3c',
  '/demo-player.html?v=01cf4868',
  '/demo-fan.html?v=afd86113',
  '/demo-enhanced.html?v=5c92bdc2',
  '/demo-coach.html?v=b9e0fe8c',
  '/coach.html?v=0198ef9b',
  '/claim-profile.html?v=23d32111',
  '/cache-clear.html?v=943be5ce',
  '/backup_overview.html?v=d41d8cd9',
  '/analytics.html?v=f90affbd',
  '/analytics-dashboard.html?v=af57fbd3',
  '/ai-coach.html?v=69b72edd',
  '/admin.html?v=335132bd',
  '/about.html?v=a14af01b',
  '/assets/png/logo-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD.png?v=283ae8cd',
  '/assets/json/manifest-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_.json?v=eabaf9e7',
  '/assets/js/test-integration-DItq3nya.js.map?v=553d8446',
  '/assets/js/test-integration-DItq3nya.js?v=fa5f15c2',
  '/assets/js/terms-D69eOhEj.js.map?v=b61aa11e',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K.js.map?v=e79fb6dc',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K.js?v=c10d9da5',
  '/assets/js/teamArchive-C1e32Gdg.js.map?v=f08d0ee0',
  '/assets/js/teamArchive-C1e32Gdg.js?v=c942d7ea',
  '/assets/js/team-B14Vzt31.js.map?v=d229bbdd',
  '/assets/js/team-B14Vzt31.js?v=64255486',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js.map?v=59ef6a36',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js?v=9199b0a9',
  '/assets/js/social-hub-CO3YzbkR.js.map?v=7bdd47b6',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js.map?v=0ced6ec3',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js?v=9730c3d0',
  '/assets/js/smart-input-CW8p-WON.js.map?v=fbaa9c86',
  '/assets/js/search-BEaUJ6ch.js.map?v=433f26be',
  '/assets/js/search-BEaUJ6ch.js?v=668c8c6f',
  '/assets/js/scout-D2LauMLr.js.map?v=b1cc7b54',
  '/assets/js/scout-D2LauMLr.js?v=be9202e6',
  '/assets/js/register-DG9WMDi5.js.map?v=1ffb6a3a',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP.js.map?v=31ba2bfe',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP.js?v=ed655b4b',
  '/assets/js/recruiting-hub-C0hgBX7Z.js.map?v=e1982f86',
  '/assets/js/privacy-D69eOhEj.js.map?v=1521bd8d',
  '/assets/js/playerProfile-CczJG_-3.js.map?v=222baefc',
  '/assets/js/playerProfile-CczJG_-3.js?v=8a1f788a',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W.js.map?v=980e5acd',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W.js?v=051f45b3',
  '/assets/js/player-CvIPDsdR.js.map?v=397dfa0e',
  '/assets/js/player-CvIPDsdR.js?v=35e23ac4',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-DAV1RrA1-DAV1RrA1-DAV1RrA1-DAV1RrA1-DAV1RrA1.js?v=85bf46f7',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-DpocxIhM-DpocxIhM-DpocxIhM-DpocxIhM.js?v=7e620413',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-C005TVuN-C005TVuN-C005TVuN.js?v=3bbc2711',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bvdin3t6-Bvdin3t6.js?v=58f6745b',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-BpiNB33m.js?v=a8158eb0',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8.js.map?v=c7cb9dc1',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8.js?v=e781bc2c',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh.js?v=d02b2671',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d.js?v=c13edce9',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js.map?v=2728d2a6',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js?v=9bd4beb4',
  '/assets/js/overview-C-We5_OM.js.map?v=54dd2c60',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js.map?v=44b0e6f9',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js?v=39185089',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-nU8xJ6t7.js?v=eeba9568',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-CTrq4zpE.js.map?v=dcf507d2',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-CTrq4zpE.js?v=4b86567f',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-B142Hfaq-B142Hfaq.js?v=9b75233b',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey.js.map?v=371bc175',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey.js?v=e1691849',
  '/assets/js/login-CvkYySGg.js.map?v=8bc24dd1',
  '/assets/js/login-CvkYySGg.js?v=a594be98',
  '/assets/js/live-demo-Ca2_L_FV.js.map?v=1745c06e',
  '/assets/js/live-D69eOhEj.js.map?v=f163a648',
  '/assets/js/index-rK8HcBcP.js.map?v=38e4735e',
  '/assets/js/index-rK8HcBcP.js?v=a10976d6',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km.js?v=f0dfa5ee',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY.js?v=e812ffe2',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re.js?v=57f1f542',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-C4wcfbVF-C4wcfbVF-C4wcfbVF.js?v=8b1cbb7d',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Dd9TIeOj-Dd9TIeOj.js?v=78d7ef09',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-BMqZK7wi.js?v=a77895b6',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI.js.map?v=96ef98cf',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI.js?v=c7122be9',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Bsdguary-Bsdguary-Bsdguary-Bsdguary.js?v=be4111a9',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-4J497xUw-4J497xUw-4J497xUw-4J497xUw-4J497xUw.js?v=6eda6725',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z.js?v=d812716f',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo.js?v=120f41b9',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U.js?v=32558c7a',
  '/assets/js/firebaseConfig-DCH0t8Yd-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL.js?v=0303239c',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW.js.map?v=032f930a',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW.js?v=5f73840d',
  '/assets/js/fan-zWEXw81R.js.map?v=867588a8',
  '/assets/js/fan-zWEXw81R.js?v=4dd8b4a0',
  '/assets/js/demo-scout-BE5Ek5wQ.js.map?v=d2b1460f',
  '/assets/js/demo-player-B87eBSI6.js.map?v=809417f1',
  '/assets/js/demo-player-B87eBSI6.js?v=738505ab',
  '/assets/js/demo-fan-BE5Ek5wQ.js.map?v=42a1f954',
  '/assets/js/demo-enhanced-Ca2_L_FV.js.map?v=9fc98ff8',
  '/assets/js/demo-coach-UaE1jcmS.js.map?v=c100ca44',
  '/assets/js/coach-bEV8PlLw.js.map?v=694c633c',
  '/assets/js/coach-bEV8PlLw.js?v=08514802',
  '/assets/js/claim-profile-BuXXkteq.js.map?v=7fea506e',
  '/assets/js/claim-profile-BuXXkteq.js?v=87ea519f',
  '/assets/js/cache-clear-l0sNRNKZ.js.map?v=4fd7acd0',
  '/assets/js/backup_overview-l0sNRNKZ.js.map?v=c3ff31a6',
  '/assets/js/analytics-dashboard-DU7C-8ZJ.js.map?v=79dd0e32',
  '/assets/js/analytics-BktdGvca.js.map?v=9e8e3e93',
  '/assets/js/analytics-BktdGvca.js?v=d6794956',
  '/assets/js/ai-coach-CO3YzbkR.js.map?v=4effed4f',
  '/assets/js/admin-C5SQ3CQc.js.map?v=34cc6441',
  '/assets/js/admin-C5SQ3CQc.js?v=1198bba6',
  '/assets/js/about-D82o9QQk.js.map?v=38048eee',
  '/assets/css/style-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc.css?v=c4a4d731',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW.css?v=b9a841df',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j.css?v=e553b98b'
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
