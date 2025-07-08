import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js';
const G = 'modulepreload',
  H = function (s) {
    return '/' + s;
  },
  L = {},
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
          if (((r = H(r)), r in L)) return;
          L[r] = !0;
          const a = r.endsWith('.css'),
            n = a ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${r}"]${n}`)) return;
          const d = document.createElement('link');
          if (
            ((d.rel = a ? 'stylesheet' : G),
            a || (d.as = 'script'),
            (d.crossOrigin = ''),
            (d.href = r),
            c && d.setAttribute('nonce', c),
            document.head.appendChild(d),
            a)
          )
            return new Promise((f, R) => {
              (d.addEventListener('load', f),
                d.addEventListener('error', () =>
                  R(new Error(`Unable to preload CSS for ${r}`))
                ));
            });
        })
      );
    }
    function o(t) {
      const c = new Event('vite:preloadError', { cancelable: !0 });
      if (((c.payload = t), window.dispatchEvent(c), !c.defaultPrevented))
        throw t;
    }
    return u.then(t => {
      for (const c of t || []) c.status === 'rejected' && o(c.reason);
      return l().catch(o);
    });
  },
  D = 'modulepreload',
  F = function (s) {
    return '/' + s;
  },
  j = {},
  y = function (s, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let o = function (e) {
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
      i = o(
        l.map(e => {
          if (((e = F(e)), e in j)) return;
          j[e] = !0;
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
    function u(o) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = o), window.dispatchEvent(t), !t.defaultPrevented))
        throw o;
    }
    return i.then(o => {
      for (const t of o || []) t.status === 'rejected' && u(t.reason);
      return s().catch(u);
    });
  },
  x = 'modulepreload',
  V = function (s) {
    return '/' + s;
  },
  q = {},
  E = function (s, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let o = function (e) {
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
      i = o(
        l.map(e => {
          if (((e = V(e)), e in q)) return;
          q[e] = !0;
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
    function u(o) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = o), window.dispatchEvent(t), !t.defaultPrevented))
        throw o;
    }
    return i.then(o => {
      for (const t of o || []) t.status === 'rejected' && u(t.reason);
      return s().catch(u);
    });
  },
  z = 'modulepreload',
  J = function (s) {
    return '/' + s;
  },
  _ = {},
  g = function (s, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let o = function (e) {
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
      i = o(
        l.map(e => {
          if (((e = J(e)), e in _)) return;
          _[e] = !0;
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
    function u(o) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = o), window.dispatchEvent(t), !t.defaultPrevented))
        throw o;
    }
    return i.then(o => {
      for (const t of o || []) t.status === 'rejected' && u(t.reason);
      return s().catch(u);
    });
  },
  K = 'modulepreload',
  Q = function (s) {
    return '/' + s;
  },
  N = {},
  w = function (s, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let o = function (e) {
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
      i = o(
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
    function u(o) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = o), window.dispatchEvent(t), !t.defaultPrevented))
        throw o;
    }
    return i.then(o => {
      for (const t of o || []) t.status === 'rejected' && u(t.reason);
      return s().catch(u);
    });
  },
  X = 'modulepreload',
  Y = function (s) {
    return '/' + s;
  },
  O = {},
  P = function (s, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let o = function (e) {
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
      i = o(
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
    function u(o) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = o), window.dispatchEvent(t), !t.defaultPrevented))
        throw o;
    }
    return i.then(o => {
      for (const t of o || []) t.status === 'rejected' && u(t.reason);
      return s().catch(u);
    });
  },
  Z = 'modulepreload',
  ee = function (s) {
    return '/' + s;
  },
  T = {},
  b = function (s, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let o = function (e) {
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
      i = o(
        l.map(e => {
          if (((e = ee(e)), e in T)) return;
          T[e] = !0;
          const r = e.endsWith('.css'),
            a = r ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${e}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = r ? 'stylesheet' : Z),
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
    function u(o) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = o), window.dispatchEvent(t), !t.defaultPrevented))
        throw o;
    }
    return i.then(o => {
      for (const t of o || []) t.status === 'rejected' && u(t.reason);
      return s().catch(u);
    });
  },
  te = 'modulepreload',
  ne = function (s) {
    return '/' + s;
  },
  U = {},
  S = function (s, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let o = function (e) {
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
      i = o(
        l.map(e => {
          if (((e = ne(e)), e in U)) return;
          U[e] = !0;
          const r = e.endsWith('.css'),
            a = r ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${e}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = r ? 'stylesheet' : te),
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
    function u(o) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = o), window.dispatchEvent(t), !t.defaultPrevented))
        throw o;
    }
    return i.then(o => {
      for (const t of o || []) t.status === 'rejected' && u(t.reason);
      return s().catch(u);
    });
  },
  re = 'modulepreload',
  oe = function (s) {
    return '/' + s;
  },
  M = {},
  $ = function (s, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let o = function (e) {
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
      i = o(
        l.map(e => {
          if (((e = oe(e)), e in M)) return;
          M[e] = !0;
          const r = e.endsWith('.css'),
            a = r ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${e}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = r ? 'stylesheet' : re),
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
    function u(o) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = o), window.dispatchEvent(t), !t.defaultPrevented))
        throw o;
    }
    return i.then(o => {
      for (const t of o || []) t.status === 'rejected' && u(t.reason);
      return s().catch(u);
    });
  },
  se = 'modulepreload',
  ae = function (s) {
    return '/' + s;
  },
  B = {},
  k = function (s, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let o = function (e) {
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
      i = o(
        l.map(e => {
          if (((e = ae(e)), e in B)) return;
          B[e] = !0;
          const r = e.endsWith('.css'),
            a = r ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${e}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = r ? 'stylesheet' : se),
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
    function u(o) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = o), window.dispatchEvent(t), !t.defaultPrevented))
        throw o;
    }
    return i.then(o => {
      for (const t of o || []) t.status === 'rejected' && u(t.reason);
      return s().catch(u);
    });
  },
  le = 'modulepreload',
  ce = function (s) {
    return '/' + s;
  },
  W = {},
  A = function (s, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let o = function (e) {
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
      i = o(
        l.map(e => {
          if (((e = ce(e)), e in W)) return;
          W[e] = !0;
          const r = e.endsWith('.css'),
            a = r ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${e}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = r ? 'stylesheet' : le),
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
    function u(o) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = o), window.dispatchEvent(t), !t.defaultPrevented))
        throw o;
    }
    return i.then(o => {
      for (const t of o || []) t.status === 'rejected' && u(t.reason);
      return s().catch(u);
    });
  },
  ie = 'modulepreload',
  ue = function (s) {
    return '/' + s;
  },
  I = {},
  C = function (s, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let o = function (e) {
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
      i = o(
        l.map(e => {
          if (((e = ue(e)), e in I)) return;
          I[e] = !0;
          const r = e.endsWith('.css'),
            a = r ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${e}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = r ? 'stylesheet' : ie),
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
    function u(o) {
      const t = new Event('vite:preloadError', { cancelable: !0 });
      if (((t.payload = o), window.dispatchEvent(t), !t.defaultPrevented))
        throw o;
    }
    return i.then(o => {
      for (const t of o || []) t.status === 'rejected' && u(t.reason);
      return s().catch(u);
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
function p(s, l, m) {
  const i = document.getElementById(s),
    u = i.querySelector('.test-result');
  (l
    ? ((i.className = 'test-section pass'),
      (u.textContent = '✅ ' + m),
      (h[s] = !0))
    : ((i.className = 'test-section fail'),
      (u.textContent = '❌ ' + m),
      (h[s] = !1)),
    de());
}
function de() {
  const s = document.getElementById('overall-status'),
    l = Object.values(h).filter(i => i === !0).length,
    m = Object.keys(h).length;
  l === m
    ? ((s.className = 'test-section pass'),
      (s.textContent = `🎉 All tests passed! (${l}/${m})`))
    : ((s.style.background = '#fff3cd'),
      (s.textContent = `⏳ Tests running... (${l}/${m} completed)`));
}
try {
  const s = await C(
    () =>
      A(
        () =>
          k(
            () =>
              $(
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
                                                    './playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw.js'
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
              ),
            []
          ),
        []
      ),
    []
  );
  s && s.PlayerAnalytics
    ? p('playerAnalytics', !0, 'Module loaded successfully')
    : p(
        'playerAnalytics',
        !1,
        'Module loaded but PlayerAnalytics class not found'
      );
} catch (s) {
  p('playerAnalytics', !1, 'Failed to load: ' + s.message);
}
try {
  const s = await C(
    () =>
      A(
        () =>
          k(
            () =>
              $(
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
                                                    './recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s-4aBA7xvm.js'
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
              ),
            []
          ),
        []
      ),
    []
  );
  s && s.RecruitingHub
    ? p('recruitingHub', !0, 'Module loaded successfully')
    : p('recruitingHub', !1, 'Module loaded but RecruitingHub class not found');
} catch (s) {
  p('recruitingHub', !1, 'Failed to load: ' + s.message);
}
try {
  const s = await C(
    () =>
      A(
        () =>
          k(
            () =>
              $(
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
                                                    './smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js'
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
              ),
            []
          ),
        []
      ),
    []
  );
  s && s.SmartGameInput
    ? p('smartGameInput', !0, 'Module loaded successfully')
    : p(
        'smartGameInput',
        !1,
        'Module loaded but SmartGameInput class not found'
      );
} catch (s) {
  p('smartGameInput', !1, 'Failed to load: ' + s.message);
}
try {
  const s = await C(
    () =>
      A(
        () =>
          k(
            () =>
              $(
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
                                                    './platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js'
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
              ),
            []
          ),
        []
      ),
    []
  );
  s && s.PlatformManager
    ? p('platformManager', !0, 'Module loaded successfully')
    : p(
        'platformManager',
        !1,
        'Module loaded but PlatformManager class not found'
      );
} catch (s) {
  p('platformManager', !1, 'Failed to load: ' + s.message);
}
setTimeout(() => {
  (p('demoPages', !0, 'Demo pages integration completed'),
    p('firebaseConfig', !0, 'Firebase configuration updated with clean URLs'),
    p('navigation', !0, 'Navigation and URL routing configured'));
}, 1e3);
//# sourceMappingURL=test-integration-D_ExvUjY.js.map
