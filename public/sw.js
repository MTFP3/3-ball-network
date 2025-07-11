/**
 * 🚀 3 Ball Network - Service Worker
 *
 * Advanced PWA service worker with intelligent caching strategies:
 * - Network-first for HTML pages (always fresh content)
 * - Cache-first for static assets (performance optimization)
 * - Comprehensive cache busting and versioning
 * - Background sync and offline support
 * - Automatic cache cleanup and management
 *
 * @version 3.0.0
 * @author 3 Ball Network Team
 */

const CACHE_VERSION = 'v3c50a0ef';
const CACHE_FILES = [
  '/test-integration.html?v=733121c7',
  '/terms.html?v=55c222c0',
  '/teamArchive.html?v=5946d0cb',
  '/team.html?v=49737a66',
  '/social-hub.html?v=c6751539',
  '/smart-input.html?v=01b4fcd3',
  '/search.html?v=cf62b94e',
  '/scout.html?v=8bea0d52',
  '/register.html?v=dc14a295',
  '/recruiting-hub.html?v=b3fa8fcb',
  '/privacy.html?v=786b51a7',
  '/playerProfile.html?v=e45c87e8',
  '/player.html?v=8606b224',
  '/overview.html?v=8e450406',
  '/login.html?v=d649cba9',
  '/live.html?v=583b752b',
  '/live-demo.html?v=9d9c1f4f',
  '/index.html?v=9a7846c6',
  '/fan.html?v=4c651f7a',
  '/demo-scout.html?v=c1b4ddc0',
  '/demo-player.html?v=a2672f2f',
  '/demo-fan.html?v=441f659d',
  '/demo-enhanced.html?v=9f9432ee',
  '/demo-coach.html?v=e31657dc',
  '/coach.html?v=6b69dcfb',
  '/claim-profile.html?v=94f617af',
  '/cache-clear.html?v=943be5ce',
  '/analytics.html?v=a6eaa3a6',
  '/analytics-dashboard.html?v=29ee6f4e',
  '/ai-coach.html?v=0f2273c6',
  '/admin.html?v=71bc81f4',
  '/about.html?v=5b149853',
  '/assets/png/logo-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD.png?v=283ae8cd',
  '/assets/json/manifest-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_.json?v=eabaf9e7',
  '/assets/js/test-integration-DVq9zUjX.js.map?v=660141f8',
  '/assets/js/test-integration-DVq9zUjX.js?v=96ba51ae',
  '/assets/js/terms-Xj5BCKv-.js.map?v=8abba28a',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K.js.map?v=b1fc3af8',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K.js?v=638bbad1',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-DAPzmdju.js?v=909d1285',
  '/assets/js/teamArchive-CttafJcO.js.map?v=2f4777e8',
  '/assets/js/teamArchive-CttafJcO.js?v=bf25039f',
  '/assets/js/team-Cj3x0Moo.js.map?v=41f2edb7',
  '/assets/js/team-Cj3x0Moo.js?v=7cfd9dc6',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js.map?v=0f98f39f',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js?v=3164ebaa',
  '/assets/js/social-hub-B56GZe8n.js.map?v=eb56a58a',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js.map?v=ce6c6dbf',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js?v=2c63c94d',
  '/assets/js/smart-input-BKWBG5WH.js.map?v=09d40ae5',
  '/assets/js/search-B_yPGDa3.js.map?v=e9d56266',
  '/assets/js/search-B_yPGDa3.js?v=ee15ce40',
  '/assets/js/scout-DtOGAsOc.js.map?v=87f2e4b5',
  '/assets/js/scout-DtOGAsOc.js?v=76a8c032',
  '/assets/js/register-Cczdp7yZ.js.map?v=b0f787ae',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s.js.map?v=749f3da1',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s.js?v=19c07000',
  '/assets/js/recruiting-hub-B0XeX0hU.js.map?v=d0662a72',
  '/assets/js/privacy-Xj5BCKv-.js.map?v=e21c3696',
  '/assets/js/playerProfile-CMU9EjkY.js.map?v=2710516c',
  '/assets/js/playerProfile-CMU9EjkY.js?v=6e14dc58',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W.js.map?v=159c4f3d',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W.js?v=f20e2064',
  '/assets/js/player-BkO6mR3T.js.map?v=74afed4a',
  '/assets/js/player-BkO6mR3T.js?v=8f77ff0c',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-DAV1RrA1-DAV1RrA1-DAV1RrA1-DAV1RrA1-DAV1RrA1-DAV1RrA1-DAV1RrA1-JVRntdH9.js?v=241e63dd',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-DpocxIhM-DpocxIhM-DpocxIhM-DpocxIhM-DpocxIhM-DpocxIhM-B4Ehg4gA.js?v=b8f0eb35',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-C005TVuN-C005TVuN-C005TVuN-C005TVuN-C005TVuN-8droooaP.js?v=ae2bad05',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bvdin3t6-Bvdin3t6-Bvdin3t6-Bvdin3t6-Dh2LTHj9.js?v=7cc3f4f6',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-BpiNB33m-BpiNB33m-BpiNB33m-DZaRoQqh.js?v=06e84b9a',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-gKgsdMp8-DOXTs-WI.js?v=2b419637',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8.js.map?v=09ec5f91',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8.js?v=a04ebe4a',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-B9ciSY_J.js?v=9e9d264b',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-BPOGcxLr-BPOGcxLr-Dte6F16m.js?v=135cde31',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh-C5W5Tc3C.js?v=ac45c960',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d-CwB3Sn7D.js?v=1177ea26',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js.map?v=6ab3ba39',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js?v=2c8925fc',
  '/assets/js/overview-CgLlvlHE.js.map?v=e5df7497',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js.map?v=0dd7c559',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js?v=c3c69071',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF.js.map?v=add9ef24',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF.js?v=b76a0d62',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-yloy7H---yloy7H---yloy7H---yloy7H--.js.map?v=1bab3e2e',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-yloy7H---yloy7H---yloy7H---yloy7H--.js?v=00eb0c32',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-yloy7H---yloy7H---yloy7H---FDx9IcjA.js?v=dcbcc5de',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-yloy7H---yloy7H---DjoxbxiN-w1FnOpE8.js?v=e09f3828',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-yloy7H---iI10_CtW-iI10_CtW-DJHSbOwT.js?v=1a2b0774',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-nU8xJ6t7-nU8xJ6t7-nU8xJ6t7-DFPxcyfF.js?v=7d66bad4',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-CTrq4zpE-BV6YLeV5-BV6YLeV5-BV6YLeV5-shOBG8sm.js?v=cfb3e41f',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-B142Hfaq-B142Hfaq-B142Hfaq-B142Hfaq-D1iTSTs7.js?v=b3d0b7f7',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-CYcforwy-TPseWURc-TPseWURc-Cap1MjHN.js?v=dcdd57ac',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-CYcforwy-CYcforwy-CYcforwy-CYcforwy.js.map?v=15bb5670',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-CYcforwy-CYcforwy-CYcforwy-CYcforwy.js?v=187c0e60',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-CYcforwy-CYcforwy-CYcforwy-Bv4D76qD.js?v=946568ec',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-CYcforwy-CYcforwy-BMalShCc-D1BTAn5h.js?v=51170756',
  '/assets/js/login-BEgn-H0u.js.map?v=01e49626',
  '/assets/js/login-BEgn-H0u.js?v=d289432c',
  '/assets/js/live-demo-vgDuZAy0.js.map?v=e03e808d',
  '/assets/js/live-Xj5BCKv-.js.map?v=8cc99878',
  '/assets/js/index-CJRk6woo.js.map?v=bbee5afe',
  '/assets/js/index-CJRk6woo.js?v=6914eeb7',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-Db1pYxPG.js?v=5d5391d5',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-D5mo3p-v.js?v=05fa295f',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re--fNv2eh1.js?v=d62abf50',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-C4wcfbVF-C4wcfbVF-C4wcfbVF-C4wcfbVF-C4wcfbVF-oPV_No2D.js?v=33f9d9e3',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Dd9TIeOj-Dd9TIeOj-Dd9TIeOj-Dd9TIeOj-CkWZhRMq.js?v=cccc8710',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-BMqZK7wi-BMqZK7wi-BMqZK7wi-a6nQr4s8.js?v=4e31f269',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-U-EFjld8-U-EFjld8-U-EFjld8-Co7ZlCCI.js?v=d0f397a0',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-DqyyGzGs-DqyyGzGs-BXqlJ2dW.js?v=a969e600',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-sQBoeA-1-DNwsjx8-.js?v=c1461fd4',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-72mneLfG.js.map?v=ac6bc81f',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-72mneLfG.js?v=5ad4bc99',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-1ViDTsUR.js?v=5ec0da88',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Bsdguary-Bsdguary-Bsdguary-Bsdguary-Bsdguary-Bsdguary-naDMphJq.js?v=13853390',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-4J497xUw-4J497xUw-4J497xUw-4J497xUw-4J497xUw-4J497xUw-4J497xUw-CBIpcmwG.js?v=5689ab53',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z-C44Dp5eu.js?v=91160345',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-Dqo7eTDs.js?v=be18a010',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BrKUtuDq.js?v=3d34cf14',
  '/assets/js/firebaseConfig-DCH0t8Yd-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-DUgeFxYc.js?v=146b6f36',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW.js.map?v=2e6e3a6c',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW.js?v=38b59acd',
  '/assets/js/fan-BIjekOKD.js.map?v=a249f3db',
  '/assets/js/fan-BIjekOKD.js?v=bcc38594',
  '/assets/js/demo-scout-Bd5h5WGf.js.map?v=19ab4f2c',
  '/assets/js/demo-player-Dbv3k6Az.js.map?v=7708bb69',
  '/assets/js/demo-player-Dbv3k6Az.js?v=e6c765c1',
  '/assets/js/demo-fan-Bd5h5WGf.js.map?v=7ba6b352',
  '/assets/js/demo-enhanced-vgDuZAy0.js.map?v=c55b7340',
  '/assets/js/demo-coach-BVka8Zrk.js.map?v=dabec754',
  '/assets/js/coach-yNAeG83P.js.map?v=0ba1b20b',
  '/assets/js/coach-yNAeG83P.js?v=010f28de',
  '/assets/js/claim-profile-5QXnLCVS.js.map?v=335f084e',
  '/assets/js/claim-profile-5QXnLCVS.js?v=cdec3938',
  '/assets/js/cache-clear-l0sNRNKZ.js.map?v=4fd7acd0',
  '/assets/js/analytics-dashboard-iz53jYd6.js.map?v=f21b1f8f',
  '/assets/js/analytics-UiVXSquR.js.map?v=2a2ad513',
  '/assets/js/analytics-UiVXSquR.js?v=77f02d50',
  '/assets/js/ai-coach-B56GZe8n.js.map?v=396eaea8',
  '/assets/js/admin-DMT7NsiK.js.map?v=fa0abdc8',
  '/assets/js/admin-DMT7NsiK.js?v=851f14f9',
  '/assets/js/about-bKEWkBi2.js.map?v=169a20aa',
  '/assets/css/index-atMpp5Bc-atMpp5Bc-atMpp5Bc-atMpp5Bc.css?v=c4a4d731',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW.css?v=b9a841df',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j.css?v=e553b98b',
];

/**
 * Service Worker Event Handlers
 */

// Install event - cache versioned files
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then(cache => {
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
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_VERSION) {
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

/**
 * Fetch Strategy: Network-first for HTML, Cache-first for assets
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Network-first strategy for HTML pages (always fresh content)
  if (
    request.destination === 'document' ||
    request.headers.get('accept')?.includes('text/html') ||
    url.pathname.endsWith('.html') ||
    url.pathname === '/'
  ) {
    event.respondWith(
      // Use navigation preload if available for speed boost
      event.preloadResponse
        .then(preloadedResponse => {
          if (preloadedResponse) {
            return preloadedResponse;
          }
          // Otherwise, fetch from network as usual
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
        .catch(() => {
          // If network fails, serve cached version
          return caches.match(request);
        })
    );
  } else {
    // Cache-first strategy for static assets (performance optimization)
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

/**
 * Message Handler - Client communication
 */
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
