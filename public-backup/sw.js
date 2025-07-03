const CACHE_VERSION = 'v73d79185';
const CACHE_FILES = [
  '/test-integration.html?v=e8e05b0e',
  '/terms.html?v=d249e69e',
  '/teamArchive.html?v=e6528d9e',
  '/team.html?v=fddaf3b8',
  '/social-hub.html?v=293ef62a',
  '/smart-input.html?v=5f26a9af',
  '/search.html?v=e15b3861',
  '/scout.html?v=c61cf001',
  '/register.html?v=d3084553',
  '/recruiting-hub.html?v=d29123ed',
  '/privacy.html?v=a8cff955',
  '/playerProfile.html?v=2d72f8e3',
  '/player.html?v=e9cbf8e2',
  '/overview.html?v=9d654024',
  '/login.html?v=8f2e01fc',
  '/live.html?v=81aaf003',
  '/live-demo.html?v=7329af13',
  '/index.html?v=6d997e96',
  '/fan.html?v=b5059d23',
  '/demo-scout.html?v=0c9cbc19',
  '/demo-player.html?v=b2fb5286',
  '/demo-fan.html?v=5790e2ea',
  '/demo-enhanced.html?v=5389ddb4',
  '/demo-coach.html?v=2e55bad3',
  '/demo-coach-final.html?v=6c1042c1',
  '/coach.html?v=8ac43625',
  '/claim-profile.html?v=eb0f4558',
  '/cache-clear.html?v=d41d8cd9',
  '/backup_overview.html?v=d41d8cd9',
  '/analytics.html?v=43cb6e09',
  '/analytics-dashboard.html?v=febb0757',
  '/ai-coach.html?v=fcc132fe',
  '/admin.html?v=09ad776c',
  '/about.html?v=0ab066a5',
  '/assets/png/logo-C3J1yCbD-C3J1yCbD.png?v=283ae8cd',
  '/assets/json/manifest-RduZY6E_-RduZY6E_.json?v=eabaf9e7',
  '/assets/js/test-integration-AXl24t5G.js.map?v=4175c926',
  '/assets/js/test-integration-AXl24t5G.js?v=08f00d53',
  '/assets/js/terms-CW5ct3-k.js.map?v=1e5048e4',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3.js.map?v=54eecd60',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3.js?v=86b85e3d',
  '/assets/js/teamArchive-D9Frtfyw.js.map?v=ae5f7eb0',
  '/assets/js/teamArchive-D9Frtfyw.js?v=b436aa0d',
  '/assets/js/team-DeWy7ccS.js.map?v=d1f3302f',
  '/assets/js/team-DeWy7ccS.js?v=0227e95e',
  '/assets/js/social-hub-C8z6d9un.js.map?v=c13c2cd1',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs.js.map?v=2031ffb6',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs.js?v=49d13957',
  '/assets/js/smart-input-DcMyZfo1.js.map?v=c998301e',
  '/assets/js/search-CYlnP4F4.js.map?v=8c4b6f92',
  '/assets/js/search-CYlnP4F4.js?v=1cee8436',
  '/assets/js/scout-C14X4RzO.js.map?v=2606a942',
  '/assets/js/scout-C14X4RzO.js?v=2ccdaf24',
  '/assets/js/register-CW5ct3-k.js.map?v=9e4a4201',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s.js.map?v=18a4ef0c',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s.js?v=89cb6db8',
  '/assets/js/recruiting-hub-BKhXC20p.js.map?v=7db9cf8a',
  '/assets/js/privacy-CW5ct3-k.js.map?v=4c85a8a2',
  '/assets/js/playerProfile-C4lJoiEi.js.map?v=404f4713',
  '/assets/js/playerProfile-C4lJoiEi.js?v=cb09756c',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw.js.map?v=e79bb739',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw.js?v=ab3e7078',
  '/assets/js/player-CAASW5Xp.js.map?v=2a1ec59d',
  '/assets/js/player-CAASW5Xp.js?v=1abeb4a2',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx.js.map?v=db34d8df',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx.js?v=bc913a8e',
  '/assets/js/overview-aKgriaNG.js.map?v=56ce0f0b',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r.js.map?v=12130e8e',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r.js?v=26557a7a',
  '/assets/js/login-CdKU8PU6.js.map?v=e8db1634',
  '/assets/js/login-CdKU8PU6.js?v=85bdeb30',
  '/assets/js/live-demo-CG4fJf9y.js.map?v=f2f86677',
  '/assets/js/live-CW5ct3-k.js.map?v=c9da5550',
  '/assets/js/index-Bm09jQhz.js.map?v=9184ca3b',
  '/assets/js/index-Bm09jQhz.js?v=756651df',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9.js.map?v=e6db9ee8',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9.js?v=32558c7a',
  '/assets/js/firebaseConfig-DCH0t8Yd-BoEIudfL.js?v=0303239c',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn.js.map?v=0e2dd47c',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn.js?v=d4177df7',
  '/assets/js/fan-Cavv95E5.js.map?v=8432b1ba',
  '/assets/js/fan-Cavv95E5.js?v=6b12d99d',
  '/assets/js/demo-scout-C8z6d9un.js.map?v=89a95fa4',
  '/assets/js/demo-player-CG4fJf9y.js.map?v=605c9fc5',
  '/assets/js/demo-fan-C8z6d9un.js.map?v=57bd9e07',
  '/assets/js/demo-enhanced-CG4fJf9y.js.map?v=540ed842',
  '/assets/js/demo-coach-final-C_tPLY5n.js.map?v=700c39c5',
  '/assets/js/demo-coach-CWdNuE-V.js.map?v=36227436',
  '/assets/js/coach-B607SaUB.js.map?v=3fa4dc97',
  '/assets/js/coach-B607SaUB.js?v=294d9ed1',
  '/assets/js/claim-profile-Dyblg7Cy.js.map?v=aaa79da0',
  '/assets/js/claim-profile-Dyblg7Cy.js?v=e21e2a7c',
  '/assets/js/cache-clear-l0sNRNKZ.js.map?v=4fd7acd0',
  '/assets/js/backup_overview-l0sNRNKZ.js.map?v=c3ff31a6',
  '/assets/js/analytics-dashboard-BWOI8U5F.js.map?v=4f744e5b',
  '/assets/js/analytics-CMDWarcw.js.map?v=728280fe',
  '/assets/js/analytics-CMDWarcw.js?v=44fa63a1',
  '/assets/js/ai-coach-C8z6d9un.js.map?v=84c587bd',
  '/assets/js/admin-DFLivpyi.js.map?v=9963a0e2',
  '/assets/js/admin-DFLivpyi.js?v=7bc27162',
  '/assets/js/about-C_tPLY5n.js.map?v=5bde3f8e',
  '/assets/css/style-atMpp5Bc-atMpp5Bc.css?v=c4a4d731',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j.css?v=e553b98b'
];

// Service Worker for 3 Ball Network PWA - NUCLEAR CACHE BUST
const CACHE_NAME = '3ball-network-v4.0-NUCLEAR-' + Date.now();
const urlsToCache = [
  '/',
  '/assets/css/style.css',
  '/assets/js/firebaseConfig.js',
  '/assets/js/firebaseAuth.js',
  '/logo.png',
  '/about.html',
  '/register.html',
  '/login.html',
  '/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
