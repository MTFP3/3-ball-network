const CACHE_VERSION = 'vcedd9e4c';
const CACHE_FILES = [
  '/test-integration.html?v=33caa8fd',
  '/terms.html?v=aedede17',
  '/teamArchive.html?v=8090fc67',
  '/team.html?v=330c1496',
  '/social-hub.html?v=0cf40041',
  '/smart-input.html?v=228275bc',
  '/search.html?v=d8552f87',
  '/scout.html?v=cd9df1de',
  '/register.html?v=8952028b',
  '/recruiting-hub.html?v=3f9d3f68',
  '/privacy.html?v=11dd7a27',
  '/playerProfile.html?v=f41c8634',
  '/player.html?v=910cd3bb',
  '/overview.html?v=df03ba00',
  '/login.html?v=4cee6959',
  '/live.html?v=62b22697',
  '/live-demo.html?v=75c08536',
  '/index.html?v=8b1b608a',
  '/fan.html?v=3ab7ab97',
  '/demo-scout.html?v=580121a8',
  '/demo-player.html?v=59bf5ccb',
  '/demo-fan.html?v=f746ac5a',
  '/demo-enhanced.html?v=630152dc',
  '/demo-coach.html?v=60c2fd47',
  '/coach.html?v=262f8f57',
  '/claim-profile.html?v=0403614d',
  '/cache-clear.html?v=943be5ce',
  '/backup_overview.html?v=d41d8cd9',
  '/analytics.html?v=245b1236',
  '/analytics-dashboard.html?v=03fe310c',
  '/ai-coach.html?v=4665e4f8',
  '/admin.html?v=175859d3',
  '/about.html?v=b258b45d',
  '/assets/png/logo-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD.png?v=283ae8cd',
  '/assets/json/manifest-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_.json?v=eabaf9e7',
  '/assets/js/test-integration-BqgZrQ2D.js.map?v=3cec4873',
  '/assets/js/test-integration-BqgZrQ2D.js?v=eb9411ec',
  '/assets/js/terms-gclWeGbJ.js.map?v=efa2be53',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI.js.map?v=72a2437b',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI.js?v=9645c968',
  '/assets/js/teamArchive-CbgJZrVo.js.map?v=ee187a8e',
  '/assets/js/teamArchive-CbgJZrVo.js?v=bf971f4a',
  '/assets/js/team-CwmQUr7r.js.map?v=4a7bfa7e',
  '/assets/js/team-CwmQUr7r.js?v=0f6adcfa',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js.map?v=f2a51700',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js?v=7da25111',
  '/assets/js/social-hub-Cn5k5xZz.js.map?v=6229e103',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js.map?v=1f9be18d',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js?v=df4c9503',
  '/assets/js/smart-input-BIol0gZF.js.map?v=97ff5672',
  '/assets/js/search-C6i84px7.js.map?v=bcaf23e3',
  '/assets/js/search-C6i84px7.js?v=1203a7cc',
  '/assets/js/scout-cCglBlA4.js.map?v=67438b9e',
  '/assets/js/scout-cCglBlA4.js?v=9e338071',
  '/assets/js/register-iN-byMRi.js.map?v=9a0d3d3d',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP.js.map?v=03f043d4',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP.js?v=49a66aa5',
  '/assets/js/recruiting-hub-Bmb7fINi.js.map?v=19dfbf3d',
  '/assets/js/privacy-gclWeGbJ.js.map?v=7a20b7f8',
  '/assets/js/playerProfile-4sP-j6Hm.js.map?v=48435755',
  '/assets/js/playerProfile-4sP-j6Hm.js?v=14765e46',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw.js.map?v=01a3cd45',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw.js?v=87d4781f',
  '/assets/js/player-CWOMTXqS.js.map?v=98971d31',
  '/assets/js/player-CWOMTXqS.js?v=106feef7',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-DAV1RrA1-DAV1RrA1-DAV1RrA1-DAV1RrA1-DAV1RrA1-DAV1RrA1-DAV1RrA1.js?v=85bf46f7',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-DpocxIhM-DpocxIhM-DpocxIhM-DpocxIhM-DpocxIhM-DpocxIhM.js?v=7e620413',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-C005TVuN-C005TVuN-C005TVuN-C005TVuN-C005TVuN.js?v=3bbc2711',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bvdin3t6-Bvdin3t6-Bvdin3t6-Bvdin3t6.js?v=58f6745b',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-BpiNB33m-BpiNB33m-BpiNB33m.js?v=a8158eb0',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-gKgsdMp8.js?v=9a6dc913',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8.js.map?v=7071eef7',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8.js?v=58bbd7d8',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-BPOGcxLr-BPOGcxLr.js?v=e781bc2c',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh.js?v=d02b2671',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d.js?v=c13edce9',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js.map?v=608de0b6',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js?v=33f7984e',
  '/assets/js/overview-C5sFgmxm.js.map?v=bb3be4fe',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js.map?v=40881a27',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js?v=baf55e1f',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE.js.map?v=ffe9d14a',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE.js?v=7b1e56f2',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-yloy7H---yloy7H---yloy7H--.js.map?v=7e0946f2',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-yloy7H---yloy7H---yloy7H--.js?v=5315f78b',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-yloy7H---yloy7H---DjoxbxiN.js?v=d4ac51b4',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-yloy7H---iI10_CtW-iI10_CtW.js?v=68144ad1',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-nU8xJ6t7-nU8xJ6t7-nU8xJ6t7.js?v=eeba9568',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-CTrq4zpE-BV6YLeV5-BV6YLeV5-BV6YLeV5.js?v=4b86567f',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-B142Hfaq-B142Hfaq-B142Hfaq-B142Hfaq.js?v=9b75233b',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-CYcforwy-TPseWURc-TPseWURc.js?v=4573d329',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-CYcforwy-CYcforwy-CYcforwy.js.map?v=abc3a897',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-CYcforwy-CYcforwy-CYcforwy.js?v=14692f0b',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-CYcforwy-CYcforwy-BMalShCc.js?v=ce1674b5',
  '/assets/js/login-c1y_jzdt.js.map?v=e05399d7',
  '/assets/js/login-c1y_jzdt.js?v=146ec9e6',
  '/assets/js/live-gclWeGbJ.js.map?v=43415582',
  '/assets/js/live-demo-BNXYJLWq.js.map?v=7fc84dd0',
  '/assets/js/index-kXqEY_T-.js.map?v=c26de7aa',
  '/assets/js/index-kXqEY_T-.js?v=c4aa61ad',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km.js?v=f0dfa5ee',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY.js?v=e812ffe2',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re.js?v=57f1f542',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-C4wcfbVF-C4wcfbVF-C4wcfbVF-C4wcfbVF-C4wcfbVF.js?v=8b1cbb7d',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Dd9TIeOj-Dd9TIeOj-Dd9TIeOj-Dd9TIeOj.js?v=78d7ef09',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-BMqZK7wi-BMqZK7wi-BMqZK7wi.js?v=a77895b6',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-U-EFjld8-U-EFjld8-U-EFjld8.js?v=c7122be9',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-DqyyGzGs-DqyyGzGs.js?v=15c678b2',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-sQBoeA-1.js?v=a13e844a',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_.js.map?v=2321d52e',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_.js?v=c62c63fc',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Bsdguary-Bsdguary-Bsdguary-Bsdguary-Bsdguary-Bsdguary.js?v=be4111a9',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-4J497xUw-4J497xUw-4J497xUw-4J497xUw-4J497xUw-4J497xUw-4J497xUw.js?v=6eda6725',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z.js?v=d812716f',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo.js?v=120f41b9',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U.js?v=32558c7a',
  '/assets/js/firebaseConfig-DCH0t8Yd-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL.js?v=0303239c',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn.js.map?v=620b3284',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn.js?v=cc66fd70',
  '/assets/js/fan-BvZmkdRl.js.map?v=9d5e79ee',
  '/assets/js/fan-BvZmkdRl.js?v=ad4a6291',
  '/assets/js/demo-scout-CzbW07Gd.js.map?v=f72ebced',
  '/assets/js/demo-player-BabOhbDc.js.map?v=36fa7049',
  '/assets/js/demo-player-BabOhbDc.js?v=8a6038d0',
  '/assets/js/demo-fan-CzbW07Gd.js.map?v=a8bfbc2e',
  '/assets/js/demo-enhanced-BNXYJLWq.js.map?v=d43bda7b',
  '/assets/js/demo-coach-gRNZFpEG.js.map?v=3e917d6b',
  '/assets/js/coach-Cep9zGxp.js.map?v=71088bc8',
  '/assets/js/coach-Cep9zGxp.js?v=9eea4e0b',
  '/assets/js/claim-profile-BZpQghO7.js.map?v=32572ae8',
  '/assets/js/claim-profile-BZpQghO7.js?v=b4170653',
  '/assets/js/cache-clear-l0sNRNKZ.js.map?v=4fd7acd0',
  '/assets/js/backup_overview-l0sNRNKZ.js.map?v=c3ff31a6',
  '/assets/js/analytics-dashboard-WZrHvl07.js.map?v=c098ebad',
  '/assets/js/analytics-JA-FYkA0.js.map?v=5181975e',
  '/assets/js/analytics-JA-FYkA0.js?v=dc0b6b71',
  '/assets/js/ai-coach-Cn5k5xZz.js.map?v=feafbce2',
  '/assets/js/admin-BxNGnXE1.js.map?v=e55f6086',
  '/assets/js/admin-BxNGnXE1.js?v=5bb970c2',
  '/assets/js/about-aSduJ-Wx.js.map?v=49ea0661',
  '/assets/css/index-atMpp5Bc-atMpp5Bc-atMpp5Bc.css?v=c4a4d731',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW.css?v=b9a841df',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j.css?v=e553b98b'
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
