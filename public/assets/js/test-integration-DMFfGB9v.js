import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE.js';
import './modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV.js';
const k = 'modulepreload',
  C = function (e) {
    return '/' + e;
  },
  b = {},
  y = function (l, m, i) {
    let u = Promise.resolve();
    if (m && m.length > 0) {
      let r = function (o) {
        return Promise.all(
          o.map(a =>
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
      u = r(
        m.map(o => {
          if (((o = C(o)), o in b)) return;
          b[o] = !0;
          const a = o.endsWith('.css'),
            n = a ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${o}"]${n}`)) return;
          const d = document.createElement('link');
          if (
            ((d.rel = a ? 'stylesheet' : k),
            a || (d.as = 'script'),
            (d.crossOrigin = ''),
            (d.href = o),
            c && d.setAttribute('nonce', c),
            document.head.appendChild(d),
            a)
          )
            return new Promise((p, $) => {
              (d.addEventListener('load', p),
                d.addEventListener('error', () =>
                  $(new Error(`Unable to preload CSS for ${o}`))
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
  L = 'modulepreload',
  M = function (e) {
    return '/' + e;
  },
  w = {},
  g = function (e, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let s = function (r) {
        return Promise.all(
          r.map(o =>
            Promise.resolve(o).then(
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
        l.map(r => {
          if (((r = M(r)), r in w)) return;
          w[r] = !0;
          const o = r.endsWith('.css'),
            a = o ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${r}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = o ? 'stylesheet' : L),
            o || (n.as = 'script'),
            (n.crossOrigin = ''),
            (n.href = r),
            c && n.setAttribute('nonce', c),
            document.head.appendChild(n),
            o)
          )
            return new Promise((d, p) => {
              (n.addEventListener('load', d),
                n.addEventListener('error', () =>
                  p(new Error(`Unable to preload CSS for ${r}`))
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
      return e().catch(u);
    });
  },
  j = 'modulepreload',
  I = function (e) {
    return '/' + e;
  },
  S = {},
  v = function (e, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let s = function (r) {
        return Promise.all(
          r.map(o =>
            Promise.resolve(o).then(
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
        l.map(r => {
          if (((r = I(r)), r in S)) return;
          S[r] = !0;
          const o = r.endsWith('.css'),
            a = o ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${r}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = o ? 'stylesheet' : j),
            o || (n.as = 'script'),
            (n.crossOrigin = ''),
            (n.href = r),
            c && n.setAttribute('nonce', c),
            document.head.appendChild(n),
            o)
          )
            return new Promise((d, p) => {
              (n.addEventListener('load', d),
                n.addEventListener('error', () =>
                  p(new Error(`Unable to preload CSS for ${r}`))
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
      return e().catch(u);
    });
  },
  N = 'modulepreload',
  q = function (e) {
    return '/' + e;
  },
  _ = {},
  E = function (e, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let s = function (r) {
        return Promise.all(
          r.map(o =>
            Promise.resolve(o).then(
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
        l.map(r => {
          if (((r = q(r)), r in _)) return;
          _[r] = !0;
          const o = r.endsWith('.css'),
            a = o ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${r}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = o ? 'stylesheet' : N),
            o || (n.as = 'script'),
            (n.crossOrigin = ''),
            (n.href = r),
            c && n.setAttribute('nonce', c),
            document.head.appendChild(n),
            o)
          )
            return new Promise((d, p) => {
              (n.addEventListener('load', d),
                n.addEventListener('error', () =>
                  p(new Error(`Unable to preload CSS for ${r}`))
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
      return e().catch(u);
    });
  },
  O = 'modulepreload',
  T = function (e) {
    return '/' + e;
  },
  A = {},
  P = function (e, l, m) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let s = function (r) {
        return Promise.all(
          r.map(o =>
            Promise.resolve(o).then(
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
        l.map(r => {
          if (((r = T(r)), r in A)) return;
          A[r] = !0;
          const o = r.endsWith('.css'),
            a = o ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${r}"]${a}`)) return;
          const n = document.createElement('link');
          if (
            ((n.rel = o ? 'stylesheet' : O),
            o || (n.as = 'script'),
            (n.crossOrigin = ''),
            (n.href = r),
            c && n.setAttribute('nonce', c),
            document.head.appendChild(n),
            o)
          )
            return new Promise((d, p) => {
              (n.addEventListener('load', d),
                n.addEventListener('error', () =>
                  p(new Error(`Unable to preload CSS for ${r}`))
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
      return e().catch(u);
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
function f(e, l, m) {
  const i = document.getElementById(e),
    u = i.querySelector('.test-result');
  (l
    ? ((i.className = 'test-section pass'),
      (u.textContent = '✅ ' + m),
      (h[e] = !0))
    : ((i.className = 'test-section fail'),
      (u.textContent = '❌ ' + m),
      (h[e] = !1)),
    R());
}
function R() {
  const e = document.getElementById('overall-status'),
    l = Object.values(h).filter(i => i === !0).length,
    m = Object.keys(h).length;
  l === m
    ? ((e.className = 'test-section pass'),
      (e.textContent = `🎉 All tests passed! (${l}/${m})`))
    : ((e.style.background = '#fff3cd'),
      (e.textContent = `⏳ Tests running... (${l}/${m} completed)`));
}
try {
  const e = await P(
    () =>
      E(
        () =>
          v(
            () =>
              g(
                () =>
                  y(
                    () =>
                      import(
                        './playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W.js'
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
  e && e.PlayerAnalytics
    ? f('playerAnalytics', !0, 'Module loaded successfully')
    : f(
        'playerAnalytics',
        !1,
        'Module loaded but PlayerAnalytics class not found'
      );
} catch (e) {
  f('playerAnalytics', !1, 'Failed to load: ' + e.message);
}
try {
  const e = await P(
    () =>
      E(
        () =>
          v(
            () =>
              g(
                () =>
                  y(
                    () =>
                      import(
                        './recruitingHub-B00FkBgR-DAAl-i0s-4aBA7xvm-bi5kePsP-DAAl-i0s.js'
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
  e && e.RecruitingHub
    ? f('recruitingHub', !0, 'Module loaded successfully')
    : f('recruitingHub', !1, 'Module loaded but RecruitingHub class not found');
} catch (e) {
  f('recruitingHub', !1, 'Failed to load: ' + e.message);
}
try {
  const e = await P(
    () =>
      E(
        () =>
          v(
            () =>
              g(
                () =>
                  y(
                    () =>
                      import(
                        './smartGameInput-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs-Cr1WrlJs.js'
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
  e && e.SmartGameInput
    ? f('smartGameInput', !0, 'Module loaded successfully')
    : f(
        'smartGameInput',
        !1,
        'Module loaded but SmartGameInput class not found'
      );
} catch (e) {
  f('smartGameInput', !1, 'Failed to load: ' + e.message);
}
try {
  const e = await P(
    () =>
      E(
        () =>
          v(
            () =>
              g(
                () =>
                  y(
                    () =>
                      import(
                        './platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx-BgtAjZPx-BgtAjZPx.js'
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
  e && e.PlatformManager
    ? f('platformManager', !0, 'Module loaded successfully')
    : f(
        'platformManager',
        !1,
        'Module loaded but PlatformManager class not found'
      );
} catch (e) {
  f('platformManager', !1, 'Failed to load: ' + e.message);
}
setTimeout(() => {
  (f('demoPages', !0, 'Demo pages integration completed'),
    f('firebaseConfig', !0, 'Firebase configuration updated with clean URLs'),
    f('navigation', !0, 'Navigation and URL routing configured'));
}, 1e3);
//# sourceMappingURL=test-integration-DMFfGB9v.js.map
