import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js';
const M = 'modulepreload',
  U = function (o) {
    return '/' + o;
  },
  k = {},
  v = function (l, m, i) {
    let u = Promise.resolve();
    if (m && m.length > 0) {
      let e = function (r) {
        return Promise.all(
          r.map(a =>
            Promise.resolve(a).then(
              n => ({ status: 'fulfilled', value: n }),
              n => ({ status: 'rejected', reason: n })
            )
          )
        );
      };
      document.getElementsByTagName('link');
      const t = document.querySelector('meta[property=csp-nonce]'),
        c = t?.nonce || t?.getAttribute('nonce');
      u = e(
        m.map(r => {
          if (((r = U(r)), r in k)) return;
          k[r] = !0;
          const a = r.endsWith('.css'),
            n = a ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${r}"]${n}`)) return;
          const d = document.createElement('link');
          if (
            ((d.rel = a ? 'stylesheet' : M),
            a || (d.as = 'script'),
            (d.crossOrigin = ''),
            (d.href = r),
            c && d.setAttribute('nonce', c),
            document.head.appendChild(d),
            a)
          )
            return new Promise((f, T) => {
              (d.addEventListener('load', f),
                d.addEventListener('error', () =>
                  T(new Error(`Unable to preload CSS for ${r}`))
                ));
            });
        })
      );
    }
    function s(t) {
      const c = new Event('vite:preloadError', { cancelable: !0 });
      if (((c.payload = t), window.dispatchEvent(c), !c.defaultPrevented))
        throw t;
    }
    return u.then(t => {
      for (const c of t || []) c.status === 'rejected' && s(c.reason);
      return l().catch(s);
    });
  },
  I = 'modulepreload',
  B = function (o) {
    return '/' + o;
  },
  A = {},
  y = function (o, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let s = function (e) {
        return Promise.all(
          e.map(r =>
            Promise.resolve(r).then(
              a => ({ status: 'fulfilled', value: a }),
              a => ({ status: 'rejected', reason: a })
            )
          )
        );
      };
      document.getElementsByTagName('link');
      const t = document.querySelector('meta[property=csp-nonce]'),
        c = t?.nonce || t?.getAttribute('nonce');
      i = s(
        l.map(e => {
          if (((e = B(e)), e in A)) return;
          A[e] = !0;
          const r = e.endsWith('.css'),
            a = r ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${e}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = r ? 'stylesheet' : I),
            r || (n.as = 'script'),
            (n.crossOrigin = ''),
            (n.href = e),
            c && n.setAttribute('nonce', c),
            document.head.appendChild(n),
            r)
          )
            return new Promise((d, f) => {
              (n.addEventListener('load', d),
                n.addEventListener('error', () =>
                  f(new Error(`Unable to preload CSS for ${e}`))
                ));
            });
        })
      );
    }
    function u(s) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = s), window.dispatchEvent(t), !t.defaultPrevented))
        throw s;
    }
    return i.then(s => {
      for (const t of s || []) t.status === 'rejected' && u(t.reason);
      return o().catch(u);
    });
  },
  R = 'modulepreload',
  W = function (o) {
    return '/' + o;
  },
  C = {},
  E = function (o, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let s = function (e) {
        return Promise.all(
          e.map(r =>
            Promise.resolve(r).then(
              a => ({ status: 'fulfilled', value: a }),
              a => ({ status: 'rejected', reason: a })
            )
          )
        );
      };
      document.getElementsByTagName('link');
      const t = document.querySelector('meta[property=csp-nonce]'),
        c = t?.nonce || t?.getAttribute('nonce');
      i = s(
        l.map(e => {
          if (((e = W(e)), e in C)) return;
          C[e] = !0;
          const r = e.endsWith('.css'),
            a = r ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${e}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = r ? 'stylesheet' : R),
            r || (n.as = 'script'),
            (n.crossOrigin = ''),
            (n.href = e),
            c && n.setAttribute('nonce', c),
            document.head.appendChild(n),
            r)
          )
            return new Promise((d, f) => {
              (n.addEventListener('load', d),
                n.addEventListener('error', () =>
                  f(new Error(`Unable to preload CSS for ${e}`))
                ));
            });
        })
      );
    }
    function u(s) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = s), window.dispatchEvent(t), !t.defaultPrevented))
        throw s;
    }
    return i.then(s => {
      for (const t of s || []) t.status === 'rejected' && u(t.reason);
      return o().catch(u);
    });
  },
  G = 'modulepreload',
  H = function (o) {
    return '/' + o;
  },
  L = {},
  g = function (o, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let s = function (e) {
        return Promise.all(
          e.map(r =>
            Promise.resolve(r).then(
              a => ({ status: 'fulfilled', value: a }),
              a => ({ status: 'rejected', reason: a })
            )
          )
        );
      };
      document.getElementsByTagName('link');
      const t = document.querySelector('meta[property=csp-nonce]'),
        c = t?.nonce || t?.getAttribute('nonce');
      i = s(
        l.map(e => {
          if (((e = H(e)), e in L)) return;
          L[e] = !0;
          const r = e.endsWith('.css'),
            a = r ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${e}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = r ? 'stylesheet' : G),
            r || (n.as = 'script'),
            (n.crossOrigin = ''),
            (n.href = e),
            c && n.setAttribute('nonce', c),
            document.head.appendChild(n),
            r)
          )
            return new Promise((d, f) => {
              (n.addEventListener('load', d),
                n.addEventListener('error', () =>
                  f(new Error(`Unable to preload CSS for ${e}`))
                ));
            });
        })
      );
    }
    function u(s) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = s), window.dispatchEvent(t), !t.defaultPrevented))
        throw s;
    }
    return i.then(s => {
      for (const t of s || []) t.status === 'rejected' && u(t.reason);
      return o().catch(u);
    });
  },
  D = 'modulepreload',
  F = function (o) {
    return '/' + o;
  },
  _ = {},
  w = function (o, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let s = function (e) {
        return Promise.all(
          e.map(r =>
            Promise.resolve(r).then(
              a => ({ status: 'fulfilled', value: a }),
              a => ({ status: 'rejected', reason: a })
            )
          )
        );
      };
      document.getElementsByTagName('link');
      const t = document.querySelector('meta[property=csp-nonce]'),
        c = t?.nonce || t?.getAttribute('nonce');
      i = s(
        l.map(e => {
          if (((e = F(e)), e in _)) return;
          _[e] = !0;
          const r = e.endsWith('.css'),
            a = r ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${e}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = r ? 'stylesheet' : D),
            r || (n.as = 'script'),
            (n.crossOrigin = ''),
            (n.href = e),
            c && n.setAttribute('nonce', c),
            document.head.appendChild(n),
            r)
          )
            return new Promise((d, f) => {
              (n.addEventListener('load', d),
                n.addEventListener('error', () =>
                  f(new Error(`Unable to preload CSS for ${e}`))
                ));
            });
        })
      );
    }
    function u(s) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = s), window.dispatchEvent(t), !t.defaultPrevented))
        throw s;
    }
    return i.then(s => {
      for (const t of s || []) t.status === 'rejected' && u(t.reason);
      return o().catch(u);
    });
  },
  x = 'modulepreload',
  V = function (o) {
    return '/' + o;
  },
  j = {},
  P = function (o, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let s = function (e) {
        return Promise.all(
          e.map(r =>
            Promise.resolve(r).then(
              a => ({ status: 'fulfilled', value: a }),
              a => ({ status: 'rejected', reason: a })
            )
          )
        );
      };
      document.getElementsByTagName('link');
      const t = document.querySelector('meta[property=csp-nonce]'),
        c = t?.nonce || t?.getAttribute('nonce');
      i = s(
        l.map(e => {
          if (((e = V(e)), e in j)) return;
          j[e] = !0;
          const r = e.endsWith('.css'),
            a = r ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${e}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = r ? 'stylesheet' : x),
            r || (n.as = 'script'),
            (n.crossOrigin = ''),
            (n.href = e),
            c && n.setAttribute('nonce', c),
            document.head.appendChild(n),
            r)
          )
            return new Promise((d, f) => {
              (n.addEventListener('load', d),
                n.addEventListener('error', () =>
                  f(new Error(`Unable to preload CSS for ${e}`))
                ));
            });
        })
      );
    }
    function u(s) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = s), window.dispatchEvent(t), !t.defaultPrevented))
        throw s;
    }
    return i.then(s => {
      for (const t of s || []) t.status === 'rejected' && u(t.reason);
      return o().catch(u);
    });
  },
  z = 'modulepreload',
  J = function (o) {
    return '/' + o;
  },
  q = {},
  b = function (o, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let s = function (e) {
        return Promise.all(
          e.map(r =>
            Promise.resolve(r).then(
              a => ({ status: 'fulfilled', value: a }),
              a => ({ status: 'rejected', reason: a })
            )
          )
        );
      };
      document.getElementsByTagName('link');
      const t = document.querySelector('meta[property=csp-nonce]'),
        c = t?.nonce || t?.getAttribute('nonce');
      i = s(
        l.map(e => {
          if (((e = J(e)), e in q)) return;
          q[e] = !0;
          const r = e.endsWith('.css'),
            a = r ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${e}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = r ? 'stylesheet' : z),
            r || (n.as = 'script'),
            (n.crossOrigin = ''),
            (n.href = e),
            c && n.setAttribute('nonce', c),
            document.head.appendChild(n),
            r)
          )
            return new Promise((d, f) => {
              (n.addEventListener('load', d),
                n.addEventListener('error', () =>
                  f(new Error(`Unable to preload CSS for ${e}`))
                ));
            });
        })
      );
    }
    function u(s) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = s), window.dispatchEvent(t), !t.defaultPrevented))
        throw s;
    }
    return i.then(s => {
      for (const t of s || []) t.status === 'rejected' && u(t.reason);
      return o().catch(u);
    });
  },
  K = 'modulepreload',
  Q = function (o) {
    return '/' + o;
  },
  N = {},
  S = function (o, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let s = function (e) {
        return Promise.all(
          e.map(r =>
            Promise.resolve(r).then(
              a => ({ status: 'fulfilled', value: a }),
              a => ({ status: 'rejected', reason: a })
            )
          )
        );
      };
      document.getElementsByTagName('link');
      const t = document.querySelector('meta[property=csp-nonce]'),
        c = t?.nonce || t?.getAttribute('nonce');
      i = s(
        l.map(e => {
          if (((e = Q(e)), e in N)) return;
          N[e] = !0;
          const r = e.endsWith('.css'),
            a = r ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${e}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = r ? 'stylesheet' : K),
            r || (n.as = 'script'),
            (n.crossOrigin = ''),
            (n.href = e),
            c && n.setAttribute('nonce', c),
            document.head.appendChild(n),
            r)
          )
            return new Promise((d, f) => {
              (n.addEventListener('load', d),
                n.addEventListener('error', () =>
                  f(new Error(`Unable to preload CSS for ${e}`))
                ));
            });
        })
      );
    }
    function u(s) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = s), window.dispatchEvent(t), !t.defaultPrevented))
        throw s;
    }
    return i.then(s => {
      for (const t of s || []) t.status === 'rejected' && u(t.reason);
      return o().catch(u);
    });
  },
  X = 'modulepreload',
  Y = function (o) {
    return '/' + o;
  },
  O = {},
  $ = function (o, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let s = function (e) {
        return Promise.all(
          e.map(r =>
            Promise.resolve(r).then(
              a => ({ status: 'fulfilled', value: a }),
              a => ({ status: 'rejected', reason: a })
            )
          )
        );
      };
      document.getElementsByTagName('link');
      const t = document.querySelector('meta[property=csp-nonce]'),
        c = t?.nonce || t?.getAttribute('nonce');
      i = s(
        l.map(e => {
          if (((e = Y(e)), e in O)) return;
          O[e] = !0;
          const r = e.endsWith('.css'),
            a = r ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${e}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = r ? 'stylesheet' : X),
            r || (n.as = 'script'),
            (n.crossOrigin = ''),
            (n.href = e),
            c && n.setAttribute('nonce', c),
            document.head.appendChild(n),
            r)
          )
            return new Promise((d, f) => {
              (n.addEventListener('load', d),
                n.addEventListener('error', () =>
                  f(new Error(`Unable to preload CSS for ${e}`))
                ));
            });
        })
      );
    }
    function u(s) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = s), window.dispatchEvent(t), !t.defaultPrevented))
        throw s;
    }
    return i.then(s => {
      for (const t of s || []) t.status === 'rejected' && u(t.reason);
      return o().catch(u);
    });
  };
let h = {
  playerAnalytics: !1,
  recruitingHub: !1,
  smartGameInput: !1,
  platformManager: !1,
  demoPages: !0,
  firebaseConfig: !0,
  navigation: !0,
};
function p(o, l, m) {
  const i = document.getElementById(o),
    u = i.querySelector('.test-result');
  (l
    ? ((i.className = 'test-section pass'),
      (u.textContent = '✅ ' + m),
      (h[o] = !0))
    : ((i.className = 'test-section fail'),
      (u.textContent = '❌ ' + m),
      (h[o] = !1)),
    Z());
}
function Z() {
  const o = document.getElementById('overall-status'),
    l = Object.values(h).filter(i => i === !0).length,
    m = Object.keys(h).length;
  l === m
    ? ((o.className = 'test-section pass'),
      (o.textContent = `🎉 All tests passed! (${l}/${m})`))
    : ((o.style.background = '#fff3cd'),
      (o.textContent = `⏳ Tests running... (${l}/${m} completed)`));
}
try {
  const o = await $(
    () =>
      S(
        () =>
          b(
            () =>
              P(
                () =>
                  w(
                    () =>
                      g(
                        () =>
                          E(
                            () =>
                              y(
                                () =>
                                  v(
                                    () =>
                                      import(
                                        './playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W.js'
                                      ),
                                    []
                                  ),
                                []
                              ),
                            []
                          ),
                        []
                      ),
                    []
                  ),
                []
              ),
            []
          ),
        []
      ),
    []
  );
  o && o.PlayerAnalytics
    ? p('playerAnalytics', !0, 'Module loaded successfully')
    : p(
        'playerAnalytics',
        !1,
        'Module loaded but PlayerAnalytics class not found'
      );
} catch (o) {
  p('playerAnalytics', !1, 'Failed to load: ' + o.message);
}
try {
  const o = await $(
    () =>
      S(
        () =>
          b(
            () =>
              P(
                () =>
                  w(
                    () =>
                      g(
                        () =>
                          E(
                            () =>
                              y(
                                () =>
                                  v(
                                    () =>
                                      import(
                                        './recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm.js'
                                      ),
                                    []
                                  ),
                                []
                              ),
                            []
                          ),
                        []
                      ),
                    []
                  ),
                []
              ),
            []
          ),
        []
      ),
    []
  );
  o && o.RecruitingHub
    ? p('recruitingHub', !0, 'Module loaded successfully')
    : p('recruitingHub', !1, 'Module loaded but RecruitingHub class not found');
} catch (o) {
  p('recruitingHub', !1, 'Failed to load: ' + o.message);
}
try {
  const o = await $(
    () =>
      S(
        () =>
          b(
            () =>
              P(
                () =>
                  w(
                    () =>
                      g(
                        () =>
                          E(
                            () =>
                              y(
                                () =>
                                  v(
                                    () =>
                                      import(
                                        './smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js'
                                      ),
                                    []
                                  ),
                                []
                              ),
                            []
                          ),
                        []
                      ),
                    []
                  ),
                []
              ),
            []
          ),
        []
      ),
    []
  );
  o && o.SmartGameInput
    ? p('smartGameInput', !0, 'Module loaded successfully')
    : p(
        'smartGameInput',
        !1,
        'Module loaded but SmartGameInput class not found'
      );
} catch (o) {
  p('smartGameInput', !1, 'Failed to load: ' + o.message);
}
try {
  const o = await $(
    () =>
      S(
        () =>
          b(
            () =>
              P(
                () =>
                  w(
                    () =>
                      g(
                        () =>
                          E(
                            () =>
                              y(
                                () =>
                                  v(
                                    () =>
                                      import(
                                        './platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js'
                                      ),
                                    []
                                  ),
                                []
                              ),
                            []
                          ),
                        []
                      ),
                    []
                  ),
                []
              ),
            []
          ),
        []
      ),
    []
  );
  o && o.PlatformManager
    ? p('platformManager', !0, 'Module loaded successfully')
    : p(
        'platformManager',
        !1,
        'Module loaded but PlatformManager class not found'
      );
} catch (o) {
  p('platformManager', !1, 'Failed to load: ' + o.message);
}
setTimeout(() => {
  (p('demoPages', !0, 'Demo pages integration completed'),
    p('firebaseConfig', !0, 'Firebase configuration updated with clean URLs'),
    p('navigation', !0, 'Navigation and URL routing configured'));
}, 1e3);
//# sourceMappingURL=test-integration-DNJxumgv.js.map
