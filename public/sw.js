const CACHE_VERSION = 'v66cb563f';
const CACHE_FILES = [
  '/test-integration.html?v=120b7a1a',
  '/terms.html?v=6d7cfa63',
  '/teamArchive.html?v=1eb3f493',
  '/team.html?v=12de1266',
  '/social-hub.html?v=61a3bbae',
  '/smart-input.html?v=920e0ad1',
  '/search.html?v=b4c6b77d',
  '/scout.html?v=42baffde',
  '/register.html?v=852d0172',
  '/recruiting-hub.html?v=51a6a9a5',
  '/privacy.html?v=0a0a4262',
  '/playerProfile.html?v=933c0ebb',
  '/player.html?v=9b5f3676',
  '/overview.html?v=1474393e',
  '/login.html?v=beeaa3ed',
  '/live.html?v=e8278e91',
  '/live-demo.html?v=66ee1b18',
  '/index.html?v=58c900d4',
  '/fan.html?v=9fc95cd2',
  '/demo-scout.html?v=211ca080',
  '/demo-player.html?v=9b1708da',
  '/demo-fan.html?v=9a4d4df5',
  '/demo-enhanced.html?v=1dd920b9',
  '/demo-coach.html?v=08a84390',
  '/coach.html?v=872e5a43',
  '/claim-profile.html?v=bddd9e0a',
  '/cache-clear.html?v=943be5ce',
  '/backup_overview.html?v=d41d8cd9',
  '/analytics.html?v=4e0b0398',
  '/analytics-dashboard.html?v=3c708fe7',
  '/ai-coach.html?v=27f45f7c',
  '/admin.html?v=1f032327',
  '/about.html?v=5d5ac19a',
  '/assets/png/logo-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD-C3J1yCbD.png?v=283ae8cd',
  '/assets/json/manifest-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_-RduZY6E_.json?v=eabaf9e7',
  '/assets/js/test-integration-DXpipAmx.js.map?v=2bc596cc',
  '/assets/js/test-integration-DXpipAmx.js?v=ee6917dc',
  '/assets/js/terms-BWVzUUBx.js.map?v=640aea14',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K.js.map?v=09d234f9',
  '/assets/js/teamComparison-DkPk5Wsi-DTB9EFa3-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K-DNi_jEUI-P9lX6k0K.js?v=18e79c9d',
  '/assets/js/teamArchive-CAQ6OmEU.js.map?v=8bf83fa3',
  '/assets/js/teamArchive-CAQ6OmEU.js?v=3036f153',
  '/assets/js/team-C_mECD16.js.map?v=5405d3db',
  '/assets/js/team-C_mECD16.js?v=ab9c477d',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js.map?v=0b181f5d',
  '/assets/js/sw-manager--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl--CjsvoUl.js?v=e225e7c3',
  '/assets/js/social-hub-CjZj4P7Q.js.map?v=d6bbcae9',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js.map?v=c4e33e29',
  '/assets/js/smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js?v=d6114960',
  '/assets/js/smart-input-w2FJUExv.js.map?v=dbf39c93',
  '/assets/js/search-DvIAvkRr.js.map?v=e76a733f',
  '/assets/js/search-DvIAvkRr.js?v=3c42067b',
  '/assets/js/scout-CFO5mb3z.js.map?v=eab76c96',
  '/assets/js/scout-CFO5mb3z.js?v=c0c2f6b9',
  '/assets/js/register-DxYVgjCv.js.map?v=4cd25593',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm.js.map?v=9c27cc9a',
  '/assets/js/recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm.js?v=95768c0a',
  '/assets/js/recruiting-hub-Cq5TZRse.js.map?v=eddf011a',
  '/assets/js/privacy-BWVzUUBx.js.map?v=a2bd3fe6',
  '/assets/js/playerProfile-C5smEsyJ.js.map?v=497fa628',
  '/assets/js/playerProfile-C5smEsyJ.js?v=daf2aed5',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W.js.map?v=b6345eb8',
  '/assets/js/playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W.js?v=b62b5626',
  '/assets/js/player-C1JJi3-V.js.map?v=a8318eca',
  '/assets/js/player-C1JJi3-V.js?v=e26e1cf5',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-DAV1RrA1-DAV1RrA1-DAV1RrA1-DAV1RrA1-DAV1RrA1-DAV1RrA1.js?v=85bf46f7',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-DpocxIhM-DpocxIhM-DpocxIhM-DpocxIhM-DpocxIhM.js?v=7e620413',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-C005TVuN-C005TVuN-C005TVuN-C005TVuN.js?v=3bbc2711',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bvdin3t6-Bvdin3t6-Bvdin3t6.js?v=58f6745b',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-BpiNB33m-BpiNB33m.js?v=a8158eb0',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8.js.map?v=6c785060',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8.js?v=9a6dc913',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-Bf_eaMq8-BPOGcxLr.js?v=e781bc2c',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-Bf_eaMq8-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh-0j_2LXoh.js?v=d02b2671',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-ChYnJq5S-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d-B18uW48d.js?v=c13edce9',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js.map?v=e9ab5ec2',
  '/assets/js/platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js?v=97a9883e',
  '/assets/js/overview-BNh-JqyZ.js.map?v=5a9f87f5',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r.js.map?v=12130e8e',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r.js?v=26557a7a',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js.map?v=0a2eaafb',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js?v=78b0f37e',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-yloy7H---yloy7H--.js.map?v=eca94170',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-yloy7H---yloy7H--.js?v=d4ac51b4',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-yloy7H---iI10_CtW.js?v=68144ad1',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-nU8xJ6t7-nU8xJ6t7.js?v=eeba9568',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-CTrq4zpE-BV6YLeV5-BV6YLeV5.js?v=4b86567f',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-B142Hfaq-B142Hfaq-B142Hfaq.js?v=9b75233b',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-CYcforwy-TPseWURc.js?v=4573d329',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-CYcforwy-CYcforwy.js.map?v=e05e7006',
  '/assets/js/modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-CYcforwy-CYcforwy.js?v=ce1674b5',
  '/assets/js/login-DgkDx1K-.js.map?v=fce805c5',
  '/assets/js/login-DgkDx1K-.js?v=fe190bab',
  '/assets/js/live-demo-CBkVXmRl.js.map?v=1965f70f',
  '/assets/js/live-BWVzUUBx.js.map?v=2234b452',
  '/assets/js/index-CMmvONJd.js.map?v=504d43c7',
  '/assets/js/index-CMmvONJd.js?v=a5ba2713',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km-CmrFg6km.js?v=f0dfa5ee',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY-CnLNGheY.js?v=e812ffe2',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re-zjChy6re.js?v=57f1f542',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-C4wcfbVF-C4wcfbVF-C4wcfbVF-C4wcfbVF.js?v=8b1cbb7d',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Dd9TIeOj-Dd9TIeOj-Dd9TIeOj.js?v=78d7ef09',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-BMqZK7wi-BMqZK7wi.js?v=a77895b6',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-U-EFjld8-U-EFjld8.js?v=c7122be9',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-DqyyGzGs.js?v=15c678b2',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI.js.map?v=8b6b77bd',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI.js?v=a13e844a',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Bsdguary-Bsdguary-Bsdguary-Bsdguary-Bsdguary.js?v=be4111a9',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-4J497xUw-4J497xUw-4J497xUw-4J497xUw-4J497xUw-4J497xUw.js?v=6eda6725',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI-Cf6bMmA_-B8D1IVXI-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z-2GJ28q5z.js?v=d812716f',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo-BjvTU3wo.js?v=120f41b9',
  '/assets/js/firebaseConfig-DCH0t8Yd-CLd0mPF9-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U-BmUL_U9U.js?v=32558c7a',
  '/assets/js/firebaseConfig-DCH0t8Yd-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL-BoEIudfL.js?v=0303239c',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW.js.map?v=7eaf8cf2',
  '/assets/js/fanFollow-Bh7dTXqa-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW-BOIUMshn-UU82LnyW.js?v=3d76cf1a',
  '/assets/js/fan-CDDkrCv_.js.map?v=3baca759',
  '/assets/js/fan-CDDkrCv_.js?v=60dc4cab',
  '/assets/js/demo-scout-C6sWq33u.js.map?v=36e6f34a',
  '/assets/js/demo-player-B-yVCP1m.js.map?v=346dfda7',
  '/assets/js/demo-player-B-yVCP1m.js?v=764f13f5',
  '/assets/js/demo-fan-C6sWq33u.js.map?v=7a72f08b',
  '/assets/js/demo-enhanced-CBkVXmRl.js.map?v=65998a1d',
  '/assets/js/demo-coach-DOqk-VdY.js.map?v=cf41d59f',
  '/assets/js/coach-72hJFcl3.js.map?v=aa8b15e5',
  '/assets/js/coach-72hJFcl3.js?v=26555db2',
  '/assets/js/claim-profile-CDz9WkXZ.js.map?v=56364025',
  '/assets/js/claim-profile-CDz9WkXZ.js?v=afaf583e',
  '/assets/js/cache-clear-l0sNRNKZ.js.map?v=4fd7acd0',
  '/assets/js/backup_overview-l0sNRNKZ.js.map?v=c3ff31a6',
  '/assets/js/analytics-dashboard-B0N-6tW4.js.map?v=adc94f5a',
  '/assets/js/analytics-CnKsPqrd.js.map?v=cfd48612',
  '/assets/js/analytics-CnKsPqrd.js?v=d55461d6',
  '/assets/js/ai-coach-CjZj4P7Q.js.map?v=06c37d9a',
  '/assets/js/admin-CzgtKZGk.js.map?v=cb112b10',
  '/assets/js/admin-CzgtKZGk.js?v=b879ecfb',
  '/assets/js/about-C_F_7Dh9.js.map?v=75d46707',
  '/assets/css/index-atMpp5Bc-atMpp5Bc.css?v=c4a4d731',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW-CzL5AvnW.css?v=b9a841df',
  '/assets/css/demo-enhancements-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j-BVQ53G1j.css?v=e553b98b'
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
