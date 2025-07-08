var Cr = {};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const _s = function (n) {
    const e = [];
    let i = 0;
    for (let r = 0; r < n.length; r++) {
      let o = n.charCodeAt(r);
      o < 128
        ? (e[i++] = o)
        : o < 2048
          ? ((e[i++] = (o >> 6) | 192), (e[i++] = (o & 63) | 128))
          : (o & 64512) === 55296 &&
              r + 1 < n.length &&
              (n.charCodeAt(r + 1) & 64512) === 56320
            ? ((o = 65536 + ((o & 1023) << 10) + (n.charCodeAt(++r) & 1023)),
              (e[i++] = (o >> 18) | 240),
              (e[i++] = ((o >> 12) & 63) | 128),
              (e[i++] = ((o >> 6) & 63) | 128),
              (e[i++] = (o & 63) | 128))
            : ((e[i++] = (o >> 12) | 224),
              (e[i++] = ((o >> 6) & 63) | 128),
              (e[i++] = (o & 63) | 128));
    }
    return e;
  },
  Ta = function (n) {
    const e = [];
    let i = 0,
      r = 0;
    for (; i < n.length; ) {
      const o = n[i++];
      if (o < 128) e[r++] = String.fromCharCode(o);
      else if (o > 191 && o < 224) {
        const c = n[i++];
        e[r++] = String.fromCharCode(((o & 31) << 6) | (c & 63));
      } else if (o > 239 && o < 365) {
        const c = n[i++],
          h = n[i++],
          p = n[i++],
          v =
            (((o & 7) << 18) | ((c & 63) << 12) | ((h & 63) << 6) | (p & 63)) -
            65536;
        ((e[r++] = String.fromCharCode(55296 + (v >> 10))),
          (e[r++] = String.fromCharCode(56320 + (v & 1023))));
      } else {
        const c = n[i++],
          h = n[i++];
        e[r++] = String.fromCharCode(
          ((o & 15) << 12) | ((c & 63) << 6) | (h & 63)
        );
      }
    }
    return e.join('');
  },
  Is = {
    byteToCharMap_: null,
    charToByteMap_: null,
    byteToCharMapWebSafe_: null,
    charToByteMapWebSafe_: null,
    ENCODED_VALS_BASE:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    get ENCODED_VALS() {
      return this.ENCODED_VALS_BASE + '+/=';
    },
    get ENCODED_VALS_WEBSAFE() {
      return this.ENCODED_VALS_BASE + '-_.';
    },
    HAS_NATIVE_SUPPORT: typeof atob == 'function',
    encodeByteArray(n, e) {
      if (!Array.isArray(n))
        throw Error('encodeByteArray takes an array as a parameter');
      this.init_();
      const i = e ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
        r = [];
      for (let o = 0; o < n.length; o += 3) {
        const c = n[o],
          h = o + 1 < n.length,
          p = h ? n[o + 1] : 0,
          v = o + 2 < n.length,
          T = v ? n[o + 2] : 0,
          A = c >> 2,
          S = ((c & 3) << 4) | (p >> 4);
        let k = ((p & 15) << 2) | (T >> 6),
          N = T & 63;
        (v || ((N = 64), h || (k = 64)), r.push(i[A], i[S], i[k], i[N]));
      }
      return r.join('');
    },
    encodeString(n, e) {
      return this.HAS_NATIVE_SUPPORT && !e
        ? btoa(n)
        : this.encodeByteArray(_s(n), e);
    },
    decodeString(n, e) {
      return this.HAS_NATIVE_SUPPORT && !e
        ? atob(n)
        : Ta(this.decodeStringToByteArray(n, e));
    },
    decodeStringToByteArray(n, e) {
      this.init_();
      const i = e ? this.charToByteMapWebSafe_ : this.charToByteMap_,
        r = [];
      for (let o = 0; o < n.length; ) {
        const c = i[n.charAt(o++)],
          p = o < n.length ? i[n.charAt(o)] : 0;
        ++o;
        const T = o < n.length ? i[n.charAt(o)] : 64;
        ++o;
        const S = o < n.length ? i[n.charAt(o)] : 64;
        if ((++o, c == null || p == null || T == null || S == null))
          throw new Ea();
        const k = (c << 2) | (p >> 4);
        if ((r.push(k), T !== 64)) {
          const N = ((p << 4) & 240) | (T >> 2);
          if ((r.push(N), S !== 64)) {
            const C = ((T << 6) & 192) | S;
            r.push(C);
          }
        }
      }
      return r;
    },
    init_() {
      if (!this.byteToCharMap_) {
        ((this.byteToCharMap_ = {}),
          (this.charToByteMap_ = {}),
          (this.byteToCharMapWebSafe_ = {}),
          (this.charToByteMapWebSafe_ = {}));
        for (let n = 0; n < this.ENCODED_VALS.length; n++)
          ((this.byteToCharMap_[n] = this.ENCODED_VALS.charAt(n)),
            (this.charToByteMap_[this.byteToCharMap_[n]] = n),
            (this.byteToCharMapWebSafe_[n] =
              this.ENCODED_VALS_WEBSAFE.charAt(n)),
            (this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]] = n),
            n >= this.ENCODED_VALS_BASE.length &&
              ((this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)] = n),
              (this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)] = n)));
      }
    },
  };
class Ea extends Error {
  constructor() {
    (super(...arguments), (this.name = 'DecodeBase64StringError'));
  }
}
const Aa = function (n) {
    const e = _s(n);
    return Is.encodeByteArray(e, !0);
  },
  tn = function (n) {
    return Aa(n).replace(/\./g, '');
  },
  ws = function (n) {
    try {
      return Is.decodeString(n, !0);
    } catch (e) {
      console.error('base64Decode failed: ', e);
    }
    return null;
  };
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function ba() {
  if (typeof self < 'u') return self;
  if (typeof window < 'u') return window;
  if (typeof global < 'u') return global;
  throw new Error('Unable to locate global object.');
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Sa = () => ba().__FIREBASE_DEFAULTS__,
  ka = () => {
    if (typeof process > 'u' || typeof Cr > 'u') return;
    const n = Cr.__FIREBASE_DEFAULTS__;
    if (n) return JSON.parse(n);
  },
  Ra = () => {
    if (typeof document > 'u') return;
    let n;
    try {
      n = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
    } catch {
      return;
    }
    const e = n && ws(n[1]);
    return e && JSON.parse(e);
  },
  li = () => {
    try {
      return Sa() || ka() || Ra();
    } catch (n) {
      console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);
      return;
    }
  },
  Ts = n => {
    var e, i;
    return (i =
      (e = li()) === null || e === void 0 ? void 0 : e.emulatorHosts) ===
      null || i === void 0
      ? void 0
      : i[n];
  },
  Ca = n => {
    const e = Ts(n);
    if (!e) return;
    const i = e.lastIndexOf(':');
    if (i <= 0 || i + 1 === e.length)
      throw new Error(`Invalid host ${e} with no separate hostname and port!`);
    const r = parseInt(e.substring(i + 1), 10);
    return e[0] === '[' ? [e.substring(1, i - 1), r] : [e.substring(0, i), r];
  },
  Es = () => {
    var n;
    return (n = li()) === null || n === void 0 ? void 0 : n.config;
  },
  As = n => {
    var e;
    return (e = li()) === null || e === void 0 ? void 0 : e[`_${n}`];
  };
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Pa {
  constructor() {
    ((this.reject = () => {}),
      (this.resolve = () => {}),
      (this.promise = new Promise((e, i) => {
        ((this.resolve = e), (this.reject = i));
      })));
  }
  wrapCallback(e) {
    return (i, r) => {
      (i ? this.reject(i) : this.resolve(r),
        typeof e == 'function' &&
          (this.promise.catch(() => {}), e.length === 1 ? e(i) : e(i, r)));
    };
  }
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Oa(n, e) {
  if (n.uid)
    throw new Error(
      'The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.'
    );
  const i = { alg: 'none', type: 'JWT' },
    r = e || 'demo-project',
    o = n.iat || 0,
    c = n.sub || n.user_id;
  if (!c)
    throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
  const h = Object.assign(
    {
      iss: `https://securetoken.google.com/${r}`,
      aud: r,
      iat: o,
      exp: o + 3600,
      auth_time: o,
      sub: c,
      user_id: c,
      firebase: { sign_in_provider: 'custom', identities: {} },
    },
    n
  );
  return [tn(JSON.stringify(i)), tn(JSON.stringify(h)), ''].join('.');
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function q() {
  return typeof navigator < 'u' && typeof navigator.userAgent == 'string'
    ? navigator.userAgent
    : '';
}
function Da() {
  return (
    typeof window < 'u' &&
    !!(window.cordova || window.phonegap || window.PhoneGap) &&
    /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(q())
  );
}
function Na() {
  return typeof navigator < 'u' && navigator.userAgent === 'Cloudflare-Workers';
}
function bs() {
  const n =
    typeof chrome == 'object'
      ? chrome.runtime
      : typeof browser == 'object'
        ? browser.runtime
        : void 0;
  return typeof n == 'object' && n.id !== void 0;
}
function La() {
  return typeof navigator == 'object' && navigator.product === 'ReactNative';
}
function Ma() {
  const n = q();
  return n.indexOf('MSIE ') >= 0 || n.indexOf('Trident/') >= 0;
}
function Ss() {
  try {
    return typeof indexedDB == 'object';
  } catch {
    return !1;
  }
}
function ks() {
  return new Promise((n, e) => {
    try {
      let i = !0;
      const r = 'validate-browser-context-for-indexeddb-analytics-module',
        o = self.indexedDB.open(r);
      ((o.onsuccess = () => {
        (o.result.close(), i || self.indexedDB.deleteDatabase(r), n(!0));
      }),
        (o.onupgradeneeded = () => {
          i = !1;
        }),
        (o.onerror = () => {
          var c;
          e(
            ((c = o.error) === null || c === void 0 ? void 0 : c.message) || ''
          );
        }));
    } catch (i) {
      e(i);
    }
  });
}
function Ua() {
  return !(typeof navigator > 'u' || !navigator.cookieEnabled);
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const xa = 'FirebaseError';
class oe extends Error {
  constructor(e, i, r) {
    (super(i),
      (this.code = e),
      (this.customData = r),
      (this.name = xa),
      Object.setPrototypeOf(this, oe.prototype),
      Error.captureStackTrace &&
        Error.captureStackTrace(this, He.prototype.create));
  }
}
class He {
  constructor(e, i, r) {
    ((this.service = e), (this.serviceName = i), (this.errors = r));
  }
  create(e, ...i) {
    const r = i[0] || {},
      o = `${this.service}/${e}`,
      c = this.errors[e],
      h = c ? Fa(c, r) : 'Error',
      p = `${this.serviceName}: ${h} (${o}).`;
    return new oe(o, p, r);
  }
}
function Fa(n, e) {
  return n.replace(ja, (i, r) => {
    const o = e[r];
    return o != null ? String(o) : `<${r}?>`;
  });
}
const ja = /\{\$([^}]+)}/g;
function Ba(n) {
  for (const e in n) if (Object.prototype.hasOwnProperty.call(n, e)) return !1;
  return !0;
}
function bt(n, e) {
  if (n === e) return !0;
  const i = Object.keys(n),
    r = Object.keys(e);
  for (const o of i) {
    if (!r.includes(o)) return !1;
    const c = n[o],
      h = e[o];
    if (Pr(c) && Pr(h)) {
      if (!bt(c, h)) return !1;
    } else if (c !== h) return !1;
  }
  for (const o of r) if (!i.includes(o)) return !1;
  return !0;
}
function Pr(n) {
  return n !== null && typeof n == 'object';
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Rt(n) {
  const e = [];
  for (const [i, r] of Object.entries(n))
    Array.isArray(r)
      ? r.forEach(o => {
          e.push(encodeURIComponent(i) + '=' + encodeURIComponent(o));
        })
      : e.push(encodeURIComponent(i) + '=' + encodeURIComponent(r));
  return e.length ? '&' + e.join('&') : '';
}
function $a(n, e) {
  const i = new Va(n, e);
  return i.subscribe.bind(i);
}
class Va {
  constructor(e, i) {
    ((this.observers = []),
      (this.unsubscribes = []),
      (this.observerCount = 0),
      (this.task = Promise.resolve()),
      (this.finalized = !1),
      (this.onNoObservers = i),
      this.task
        .then(() => {
          e(this);
        })
        .catch(r => {
          this.error(r);
        }));
  }
  next(e) {
    this.forEachObserver(i => {
      i.next(e);
    });
  }
  error(e) {
    (this.forEachObserver(i => {
      i.error(e);
    }),
      this.close(e));
  }
  complete() {
    (this.forEachObserver(e => {
      e.complete();
    }),
      this.close());
  }
  subscribe(e, i, r) {
    let o;
    if (e === void 0 && i === void 0 && r === void 0)
      throw new Error('Missing Observer.');
    (Ha(e, ['next', 'error', 'complete'])
      ? (o = e)
      : (o = { next: e, error: i, complete: r }),
      o.next === void 0 && (o.next = Hn),
      o.error === void 0 && (o.error = Hn),
      o.complete === void 0 && (o.complete = Hn));
    const c = this.unsubscribeOne.bind(this, this.observers.length);
    return (
      this.finalized &&
        this.task.then(() => {
          try {
            this.finalError ? o.error(this.finalError) : o.complete();
          } catch {}
        }),
      this.observers.push(o),
      c
    );
  }
  unsubscribeOne(e) {
    this.observers === void 0 ||
      this.observers[e] === void 0 ||
      (delete this.observers[e],
      (this.observerCount -= 1),
      this.observerCount === 0 &&
        this.onNoObservers !== void 0 &&
        this.onNoObservers(this));
  }
  forEachObserver(e) {
    if (!this.finalized)
      for (let i = 0; i < this.observers.length; i++) this.sendOne(i, e);
  }
  sendOne(e, i) {
    this.task.then(() => {
      if (this.observers !== void 0 && this.observers[e] !== void 0)
        try {
          i(this.observers[e]);
        } catch (r) {
          typeof console < 'u' && console.error && console.error(r);
        }
    });
  }
  close(e) {
    this.finalized ||
      ((this.finalized = !0),
      e !== void 0 && (this.finalError = e),
      this.task.then(() => {
        ((this.observers = void 0), (this.onNoObservers = void 0));
      }));
  }
}
function Ha(n, e) {
  if (typeof n != 'object' || n === null) return !1;
  for (const i of e) if (i in n && typeof n[i] == 'function') return !0;
  return !1;
}
function Hn() {}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const za = 1e3,
  Ga = 2,
  Wa = 4 * 60 * 60 * 1e3,
  qa = 0.5;
function Or(n, e = za, i = Ga) {
  const r = e * Math.pow(i, n),
    o = Math.round(qa * r * (Math.random() - 0.5) * 2);
  return Math.min(Wa, r + o);
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function De(n) {
  return n && n._delegate ? n._delegate : n;
}
class se {
  constructor(e, i, r) {
    ((this.name = e),
      (this.instanceFactory = i),
      (this.type = r),
      (this.multipleInstances = !1),
      (this.serviceProps = {}),
      (this.instantiationMode = 'LAZY'),
      (this.onInstanceCreated = null));
  }
  setInstantiationMode(e) {
    return ((this.instantiationMode = e), this);
  }
  setMultipleInstances(e) {
    return ((this.multipleInstances = e), this);
  }
  setServiceProps(e) {
    return ((this.serviceProps = e), this);
  }
  setInstanceCreatedCallback(e) {
    return ((this.onInstanceCreated = e), this);
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const xe = '[DEFAULT]';
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Ka {
  constructor(e, i) {
    ((this.name = e),
      (this.container = i),
      (this.component = null),
      (this.instances = new Map()),
      (this.instancesDeferred = new Map()),
      (this.instancesOptions = new Map()),
      (this.onInitCallbacks = new Map()));
  }
  get(e) {
    const i = this.normalizeInstanceIdentifier(e);
    if (!this.instancesDeferred.has(i)) {
      const r = new Pa();
      if (
        (this.instancesDeferred.set(i, r),
        this.isInitialized(i) || this.shouldAutoInitialize())
      )
        try {
          const o = this.getOrInitializeService({ instanceIdentifier: i });
          o && r.resolve(o);
        } catch {}
    }
    return this.instancesDeferred.get(i).promise;
  }
  getImmediate(e) {
    var i;
    const r = this.normalizeInstanceIdentifier(e?.identifier),
      o = (i = e?.optional) !== null && i !== void 0 ? i : !1;
    if (this.isInitialized(r) || this.shouldAutoInitialize())
      try {
        return this.getOrInitializeService({ instanceIdentifier: r });
      } catch (c) {
        if (o) return null;
        throw c;
      }
    else {
      if (o) return null;
      throw Error(`Service ${this.name} is not available`);
    }
  }
  getComponent() {
    return this.component;
  }
  setComponent(e) {
    if (e.name !== this.name)
      throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);
    if (this.component)
      throw Error(`Component for ${this.name} has already been provided`);
    if (((this.component = e), !!this.shouldAutoInitialize())) {
      if (Xa(e))
        try {
          this.getOrInitializeService({ instanceIdentifier: xe });
        } catch {}
      for (const [i, r] of this.instancesDeferred.entries()) {
        const o = this.normalizeInstanceIdentifier(i);
        try {
          const c = this.getOrInitializeService({ instanceIdentifier: o });
          r.resolve(c);
        } catch {}
      }
    }
  }
  clearInstance(e = xe) {
    (this.instancesDeferred.delete(e),
      this.instancesOptions.delete(e),
      this.instances.delete(e));
  }
  async delete() {
    const e = Array.from(this.instances.values());
    await Promise.all([
      ...e.filter(i => 'INTERNAL' in i).map(i => i.INTERNAL.delete()),
      ...e.filter(i => '_delete' in i).map(i => i._delete()),
    ]);
  }
  isComponentSet() {
    return this.component != null;
  }
  isInitialized(e = xe) {
    return this.instances.has(e);
  }
  getOptions(e = xe) {
    return this.instancesOptions.get(e) || {};
  }
  initialize(e = {}) {
    const { options: i = {} } = e,
      r = this.normalizeInstanceIdentifier(e.instanceIdentifier);
    if (this.isInitialized(r))
      throw Error(`${this.name}(${r}) has already been initialized`);
    if (!this.isComponentSet())
      throw Error(`Component ${this.name} has not been registered yet`);
    const o = this.getOrInitializeService({
      instanceIdentifier: r,
      options: i,
    });
    for (const [c, h] of this.instancesDeferred.entries()) {
      const p = this.normalizeInstanceIdentifier(c);
      r === p && h.resolve(o);
    }
    return o;
  }
  onInit(e, i) {
    var r;
    const o = this.normalizeInstanceIdentifier(i),
      c =
        (r = this.onInitCallbacks.get(o)) !== null && r !== void 0
          ? r
          : new Set();
    (c.add(e), this.onInitCallbacks.set(o, c));
    const h = this.instances.get(o);
    return (
      h && e(h, o),
      () => {
        c.delete(e);
      }
    );
  }
  invokeOnInitCallbacks(e, i) {
    const r = this.onInitCallbacks.get(i);
    if (r)
      for (const o of r)
        try {
          o(e, i);
        } catch {}
  }
  getOrInitializeService({ instanceIdentifier: e, options: i = {} }) {
    let r = this.instances.get(e);
    if (
      !r &&
      this.component &&
      ((r = this.component.instanceFactory(this.container, {
        instanceIdentifier: Ja(e),
        options: i,
      })),
      this.instances.set(e, r),
      this.instancesOptions.set(e, i),
      this.invokeOnInitCallbacks(r, e),
      this.component.onInstanceCreated)
    )
      try {
        this.component.onInstanceCreated(this.container, e, r);
      } catch {}
    return r || null;
  }
  normalizeInstanceIdentifier(e = xe) {
    return this.component ? (this.component.multipleInstances ? e : xe) : e;
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== 'EXPLICIT';
  }
}
function Ja(n) {
  return n === xe ? void 0 : n;
}
function Xa(n) {
  return n.instantiationMode === 'EAGER';
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Ya {
  constructor(e) {
    ((this.name = e), (this.providers = new Map()));
  }
  addComponent(e) {
    const i = this.getProvider(e.name);
    if (i.isComponentSet())
      throw new Error(
        `Component ${e.name} has already been registered with ${this.name}`
      );
    i.setComponent(e);
  }
  addOrOverwriteComponent(e) {
    (this.getProvider(e.name).isComponentSet() && this.providers.delete(e.name),
      this.addComponent(e));
  }
  getProvider(e) {
    if (this.providers.has(e)) return this.providers.get(e);
    const i = new Ka(e, this);
    return (this.providers.set(e, i), i);
  }
  getProviders() {
    return Array.from(this.providers.values());
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var O;
(function (n) {
  ((n[(n.DEBUG = 0)] = 'DEBUG'),
    (n[(n.VERBOSE = 1)] = 'VERBOSE'),
    (n[(n.INFO = 2)] = 'INFO'),
    (n[(n.WARN = 3)] = 'WARN'),
    (n[(n.ERROR = 4)] = 'ERROR'),
    (n[(n.SILENT = 5)] = 'SILENT'));
})(O || (O = {}));
const Qa = {
    debug: O.DEBUG,
    verbose: O.VERBOSE,
    info: O.INFO,
    warn: O.WARN,
    error: O.ERROR,
    silent: O.SILENT,
  },
  Za = O.INFO,
  ec = {
    [O.DEBUG]: 'log',
    [O.VERBOSE]: 'log',
    [O.INFO]: 'info',
    [O.WARN]: 'warn',
    [O.ERROR]: 'error',
  },
  tc = (n, e, ...i) => {
    if (e < n.logLevel) return;
    const r = new Date().toISOString(),
      o = ec[e];
    if (o) console[o](`[${r}]  ${n.name}:`, ...i);
    else
      throw new Error(
        `Attempted to log a message with an invalid logType (value: ${e})`
      );
  };
class dn {
  constructor(e) {
    ((this.name = e),
      (this._logLevel = Za),
      (this._logHandler = tc),
      (this._userLogHandler = null));
  }
  get logLevel() {
    return this._logLevel;
  }
  set logLevel(e) {
    if (!(e in O))
      throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
    this._logLevel = e;
  }
  setLogLevel(e) {
    this._logLevel = typeof e == 'string' ? Qa[e] : e;
  }
  get logHandler() {
    return this._logHandler;
  }
  set logHandler(e) {
    if (typeof e != 'function')
      throw new TypeError('Value assigned to `logHandler` must be a function');
    this._logHandler = e;
  }
  get userLogHandler() {
    return this._userLogHandler;
  }
  set userLogHandler(e) {
    this._userLogHandler = e;
  }
  debug(...e) {
    (this._userLogHandler && this._userLogHandler(this, O.DEBUG, ...e),
      this._logHandler(this, O.DEBUG, ...e));
  }
  log(...e) {
    (this._userLogHandler && this._userLogHandler(this, O.VERBOSE, ...e),
      this._logHandler(this, O.VERBOSE, ...e));
  }
  info(...e) {
    (this._userLogHandler && this._userLogHandler(this, O.INFO, ...e),
      this._logHandler(this, O.INFO, ...e));
  }
  warn(...e) {
    (this._userLogHandler && this._userLogHandler(this, O.WARN, ...e),
      this._logHandler(this, O.WARN, ...e));
  }
  error(...e) {
    (this._userLogHandler && this._userLogHandler(this, O.ERROR, ...e),
      this._logHandler(this, O.ERROR, ...e));
  }
}
const nc = (n, e) => e.some(i => n instanceof i);
let Dr, Nr;
function ic() {
  return (
    Dr ||
    (Dr = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])
  );
}
function rc() {
  return (
    Nr ||
    (Nr = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey,
    ])
  );
}
const Rs = new WeakMap(),
  ei = new WeakMap(),
  Cs = new WeakMap(),
  zn = new WeakMap(),
  hi = new WeakMap();
function sc(n) {
  const e = new Promise((i, r) => {
    const o = () => {
        (n.removeEventListener('success', c),
          n.removeEventListener('error', h));
      },
      c = () => {
        (i(Pe(n.result)), o());
      },
      h = () => {
        (r(n.error), o());
      };
    (n.addEventListener('success', c), n.addEventListener('error', h));
  });
  return (
    e
      .then(i => {
        i instanceof IDBCursor && Rs.set(i, n);
      })
      .catch(() => {}),
    hi.set(e, n),
    e
  );
}
function oc(n) {
  if (ei.has(n)) return;
  const e = new Promise((i, r) => {
    const o = () => {
        (n.removeEventListener('complete', c),
          n.removeEventListener('error', h),
          n.removeEventListener('abort', h));
      },
      c = () => {
        (i(), o());
      },
      h = () => {
        (r(n.error || new DOMException('AbortError', 'AbortError')), o());
      };
    (n.addEventListener('complete', c),
      n.addEventListener('error', h),
      n.addEventListener('abort', h));
  });
  ei.set(n, e);
}
let ti = {
  get(n, e, i) {
    if (n instanceof IDBTransaction) {
      if (e === 'done') return ei.get(n);
      if (e === 'objectStoreNames') return n.objectStoreNames || Cs.get(n);
      if (e === 'store')
        return i.objectStoreNames[1]
          ? void 0
          : i.objectStore(i.objectStoreNames[0]);
    }
    return Pe(n[e]);
  },
  set(n, e, i) {
    return ((n[e] = i), !0);
  },
  has(n, e) {
    return n instanceof IDBTransaction && (e === 'done' || e === 'store')
      ? !0
      : e in n;
  },
};
function ac(n) {
  ti = n(ti);
}
function cc(n) {
  return n === IDBDatabase.prototype.transaction &&
    !('objectStoreNames' in IDBTransaction.prototype)
    ? function (e, ...i) {
        const r = n.call(Gn(this), e, ...i);
        return (Cs.set(r, e.sort ? e.sort() : [e]), Pe(r));
      }
    : rc().includes(n)
      ? function (...e) {
          return (n.apply(Gn(this), e), Pe(Rs.get(this)));
        }
      : function (...e) {
          return Pe(n.apply(Gn(this), e));
        };
}
function lc(n) {
  return typeof n == 'function'
    ? cc(n)
    : (n instanceof IDBTransaction && oc(n),
      nc(n, ic()) ? new Proxy(n, ti) : n);
}
function Pe(n) {
  if (n instanceof IDBRequest) return sc(n);
  if (zn.has(n)) return zn.get(n);
  const e = lc(n);
  return (e !== n && (zn.set(n, e), hi.set(e, n)), e);
}
const Gn = n => hi.get(n);
function Ps(n, e, { blocked: i, upgrade: r, blocking: o, terminated: c } = {}) {
  const h = indexedDB.open(n, e),
    p = Pe(h);
  return (
    r &&
      h.addEventListener('upgradeneeded', v => {
        r(Pe(h.result), v.oldVersion, v.newVersion, Pe(h.transaction), v);
      }),
    i && h.addEventListener('blocked', v => i(v.oldVersion, v.newVersion, v)),
    p
      .then(v => {
        (c && v.addEventListener('close', () => c()),
          o &&
            v.addEventListener('versionchange', T =>
              o(T.oldVersion, T.newVersion, T)
            ));
      })
      .catch(() => {}),
    p
  );
}
const hc = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'],
  uc = ['put', 'add', 'delete', 'clear'],
  Wn = new Map();
function Lr(n, e) {
  if (!(n instanceof IDBDatabase && !(e in n) && typeof e == 'string')) return;
  if (Wn.get(e)) return Wn.get(e);
  const i = e.replace(/FromIndex$/, ''),
    r = e !== i,
    o = uc.includes(i);
  if (
    !(i in (r ? IDBIndex : IDBObjectStore).prototype) ||
    !(o || hc.includes(i))
  )
    return;
  const c = async function (h, ...p) {
    const v = this.transaction(h, o ? 'readwrite' : 'readonly');
    let T = v.store;
    return (
      r && (T = T.index(p.shift())),
      (await Promise.all([T[i](...p), o && v.done]))[0]
    );
  };
  return (Wn.set(e, c), c);
}
ac(n => ({
  ...n,
  get: (e, i, r) => Lr(e, i) || n.get(e, i, r),
  has: (e, i) => !!Lr(e, i) || n.has(e, i),
}));
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class dc {
  constructor(e) {
    this.container = e;
  }
  getPlatformInfoString() {
    return this.container
      .getProviders()
      .map(i => {
        if (fc(i)) {
          const r = i.getImmediate();
          return `${r.library}/${r.version}`;
        } else return null;
      })
      .filter(i => i)
      .join(' ');
  }
}
function fc(n) {
  const e = n.getComponent();
  return e?.type === 'VERSION';
}
const ni = '@firebase/app',
  Mr = '0.10.13';
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const ve = new dn('@firebase/app'),
  pc = '@firebase/app-compat',
  gc = '@firebase/analytics-compat',
  mc = '@firebase/analytics',
  vc = '@firebase/app-check-compat',
  yc = '@firebase/app-check',
  _c = '@firebase/auth',
  Ic = '@firebase/auth-compat',
  wc = '@firebase/database',
  Tc = '@firebase/data-connect',
  Ec = '@firebase/database-compat',
  Ac = '@firebase/functions',
  bc = '@firebase/functions-compat',
  Sc = '@firebase/installations',
  kc = '@firebase/installations-compat',
  Rc = '@firebase/messaging',
  Cc = '@firebase/messaging-compat',
  Pc = '@firebase/performance',
  Oc = '@firebase/performance-compat',
  Dc = '@firebase/remote-config',
  Nc = '@firebase/remote-config-compat',
  Lc = '@firebase/storage',
  Mc = '@firebase/storage-compat',
  Uc = '@firebase/firestore',
  xc = '@firebase/vertexai-preview',
  Fc = '@firebase/firestore-compat',
  jc = 'firebase',
  Bc = '10.14.1';
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const ii = '[DEFAULT]',
  $c = {
    [ni]: 'fire-core',
    [pc]: 'fire-core-compat',
    [mc]: 'fire-analytics',
    [gc]: 'fire-analytics-compat',
    [yc]: 'fire-app-check',
    [vc]: 'fire-app-check-compat',
    [_c]: 'fire-auth',
    [Ic]: 'fire-auth-compat',
    [wc]: 'fire-rtdb',
    [Tc]: 'fire-data-connect',
    [Ec]: 'fire-rtdb-compat',
    [Ac]: 'fire-fn',
    [bc]: 'fire-fn-compat',
    [Sc]: 'fire-iid',
    [kc]: 'fire-iid-compat',
    [Rc]: 'fire-fcm',
    [Cc]: 'fire-fcm-compat',
    [Pc]: 'fire-perf',
    [Oc]: 'fire-perf-compat',
    [Dc]: 'fire-rc',
    [Nc]: 'fire-rc-compat',
    [Lc]: 'fire-gcs',
    [Mc]: 'fire-gcs-compat',
    [Uc]: 'fire-fst',
    [Fc]: 'fire-fst-compat',
    [xc]: 'fire-vertex',
    'fire-js': 'fire-js',
    [jc]: 'fire-js-all',
  };
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const nn = new Map(),
  Vc = new Map(),
  ri = new Map();
function Ur(n, e) {
  try {
    n.container.addComponent(e);
  } catch (i) {
    ve.debug(
      `Component ${e.name} failed to register with FirebaseApp ${n.name}`,
      i
    );
  }
}
function le(n) {
  const e = n.name;
  if (ri.has(e))
    return (
      ve.debug(`There were multiple attempts to register component ${e}.`),
      !1
    );
  ri.set(e, n);
  for (const i of nn.values()) Ur(i, n);
  for (const i of Vc.values()) Ur(i, n);
  return !0;
}
function ze(n, e) {
  const i = n.container.getProvider('heartbeat').getImmediate({ optional: !0 });
  return (i && i.triggerHeartbeat(), n.container.getProvider(e));
}
function Ce(n) {
  return n.settings !== void 0;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Hc = {
    'no-app':
      "No Firebase App '{$appName}' has been created - call initializeApp() first",
    'bad-app-name': "Illegal App name: '{$appName}'",
    'duplicate-app':
      "Firebase App named '{$appName}' already exists with different options or config",
    'app-deleted': "Firebase App named '{$appName}' already deleted",
    'server-app-deleted': 'Firebase Server App has been deleted',
    'no-options':
      'Need to provide options, when not being deployed to hosting via source.',
    'invalid-app-argument':
      'firebase.{$appName}() takes either no argument or a Firebase App instance.',
    'invalid-log-argument':
      'First argument to `onLog` must be null or a function.',
    'idb-open':
      'Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.',
    'idb-get':
      'Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.',
    'idb-set':
      'Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.',
    'idb-delete':
      'Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.',
    'finalization-registry-not-supported':
      'FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.',
    'invalid-server-app-environment':
      'FirebaseServerApp is not for use in browser environments.',
  },
  Oe = new He('app', 'Firebase', Hc);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class zc {
  constructor(e, i, r) {
    ((this._isDeleted = !1),
      (this._options = Object.assign({}, e)),
      (this._config = Object.assign({}, i)),
      (this._name = i.name),
      (this._automaticDataCollectionEnabled = i.automaticDataCollectionEnabled),
      (this._container = r),
      this.container.addComponent(new se('app', () => this, 'PUBLIC')));
  }
  get automaticDataCollectionEnabled() {
    return (this.checkDestroyed(), this._automaticDataCollectionEnabled);
  }
  set automaticDataCollectionEnabled(e) {
    (this.checkDestroyed(), (this._automaticDataCollectionEnabled = e));
  }
  get name() {
    return (this.checkDestroyed(), this._name);
  }
  get options() {
    return (this.checkDestroyed(), this._options);
  }
  get config() {
    return (this.checkDestroyed(), this._config);
  }
  get container() {
    return this._container;
  }
  get isDeleted() {
    return this._isDeleted;
  }
  set isDeleted(e) {
    this._isDeleted = e;
  }
  checkDestroyed() {
    if (this.isDeleted) throw Oe.create('app-deleted', { appName: this._name });
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const nt = Bc;
function Os(n, e = {}) {
  let i = n;
  typeof e != 'object' && (e = { name: e });
  const r = Object.assign({ name: ii, automaticDataCollectionEnabled: !1 }, e),
    o = r.name;
  if (typeof o != 'string' || !o)
    throw Oe.create('bad-app-name', { appName: String(o) });
  if ((i || (i = Es()), !i)) throw Oe.create('no-options');
  const c = nn.get(o);
  if (c) {
    if (bt(i, c.options) && bt(r, c.config)) return c;
    throw Oe.create('duplicate-app', { appName: o });
  }
  const h = new Ya(o);
  for (const v of ri.values()) h.addComponent(v);
  const p = new zc(i, r, h);
  return (nn.set(o, p), p);
}
function ui(n = ii) {
  const e = nn.get(n);
  if (!e && n === ii && Es()) return Os();
  if (!e) throw Oe.create('no-app', { appName: n });
  return e;
}
function te(n, e, i) {
  var r;
  let o = (r = $c[n]) !== null && r !== void 0 ? r : n;
  i && (o += `-${i}`);
  const c = o.match(/\s|\//),
    h = e.match(/\s|\//);
  if (c || h) {
    const p = [`Unable to register library "${o}" with version "${e}":`];
    (c &&
      p.push(
        `library name "${o}" contains illegal characters (whitespace or "/")`
      ),
      c && h && p.push('and'),
      h &&
        p.push(
          `version name "${e}" contains illegal characters (whitespace or "/")`
        ),
      ve.warn(p.join(' ')));
    return;
  }
  le(new se(`${o}-version`, () => ({ library: o, version: e }), 'VERSION'));
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Gc = 'firebase-heartbeat-database',
  Wc = 1,
  St = 'firebase-heartbeat-store';
let qn = null;
function Ds() {
  return (
    qn ||
      (qn = Ps(Gc, Wc, {
        upgrade: (n, e) => {
          switch (e) {
            case 0:
              try {
                n.createObjectStore(St);
              } catch (i) {
                console.warn(i);
              }
          }
        },
      }).catch(n => {
        throw Oe.create('idb-open', { originalErrorMessage: n.message });
      })),
    qn
  );
}
async function qc(n) {
  try {
    const i = (await Ds()).transaction(St),
      r = await i.objectStore(St).get(Ns(n));
    return (await i.done, r);
  } catch (e) {
    if (e instanceof oe) ve.warn(e.message);
    else {
      const i = Oe.create('idb-get', { originalErrorMessage: e?.message });
      ve.warn(i.message);
    }
  }
}
async function xr(n, e) {
  try {
    const r = (await Ds()).transaction(St, 'readwrite');
    (await r.objectStore(St).put(e, Ns(n)), await r.done);
  } catch (i) {
    if (i instanceof oe) ve.warn(i.message);
    else {
      const r = Oe.create('idb-set', { originalErrorMessage: i?.message });
      ve.warn(r.message);
    }
  }
}
function Ns(n) {
  return `${n.name}!${n.options.appId}`;
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Kc = 1024,
  Jc = 30 * 24 * 60 * 60 * 1e3;
class Xc {
  constructor(e) {
    ((this.container = e), (this._heartbeatsCache = null));
    const i = this.container.getProvider('app').getImmediate();
    ((this._storage = new Qc(i)),
      (this._heartbeatsCachePromise = this._storage
        .read()
        .then(r => ((this._heartbeatsCache = r), r))));
  }
  async triggerHeartbeat() {
    var e, i;
    try {
      const o = this.container
          .getProvider('platform-logger')
          .getImmediate()
          .getPlatformInfoString(),
        c = Fr();
      return (((e = this._heartbeatsCache) === null || e === void 0
        ? void 0
        : e.heartbeats) == null &&
        ((this._heartbeatsCache = await this._heartbeatsCachePromise),
        ((i = this._heartbeatsCache) === null || i === void 0
          ? void 0
          : i.heartbeats) == null)) ||
        this._heartbeatsCache.lastSentHeartbeatDate === c ||
        this._heartbeatsCache.heartbeats.some(h => h.date === c)
        ? void 0
        : (this._heartbeatsCache.heartbeats.push({ date: c, agent: o }),
          (this._heartbeatsCache.heartbeats =
            this._heartbeatsCache.heartbeats.filter(h => {
              const p = new Date(h.date).valueOf();
              return Date.now() - p <= Jc;
            })),
          this._storage.overwrite(this._heartbeatsCache));
    } catch (r) {
      ve.warn(r);
    }
  }
  async getHeartbeatsHeader() {
    var e;
    try {
      if (
        (this._heartbeatsCache === null && (await this._heartbeatsCachePromise),
        ((e = this._heartbeatsCache) === null || e === void 0
          ? void 0
          : e.heartbeats) == null ||
          this._heartbeatsCache.heartbeats.length === 0)
      )
        return '';
      const i = Fr(),
        { heartbeatsToSend: r, unsentEntries: o } = Yc(
          this._heartbeatsCache.heartbeats
        ),
        c = tn(JSON.stringify({ version: 2, heartbeats: r }));
      return (
        (this._heartbeatsCache.lastSentHeartbeatDate = i),
        o.length > 0
          ? ((this._heartbeatsCache.heartbeats = o),
            await this._storage.overwrite(this._heartbeatsCache))
          : ((this._heartbeatsCache.heartbeats = []),
            this._storage.overwrite(this._heartbeatsCache)),
        c
      );
    } catch (i) {
      return (ve.warn(i), '');
    }
  }
}
function Fr() {
  return new Date().toISOString().substring(0, 10);
}
function Yc(n, e = Kc) {
  const i = [];
  let r = n.slice();
  for (const o of n) {
    const c = i.find(h => h.agent === o.agent);
    if (c) {
      if ((c.dates.push(o.date), jr(i) > e)) {
        c.dates.pop();
        break;
      }
    } else if ((i.push({ agent: o.agent, dates: [o.date] }), jr(i) > e)) {
      i.pop();
      break;
    }
    r = r.slice(1);
  }
  return { heartbeatsToSend: i, unsentEntries: r };
}
class Qc {
  constructor(e) {
    ((this.app = e),
      (this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck()));
  }
  async runIndexedDBEnvironmentCheck() {
    return Ss()
      ? ks()
          .then(() => !0)
          .catch(() => !1)
      : !1;
  }
  async read() {
    if (await this._canUseIndexedDBPromise) {
      const i = await qc(this.app);
      return i?.heartbeats ? i : { heartbeats: [] };
    } else return { heartbeats: [] };
  }
  async overwrite(e) {
    var i;
    if (await this._canUseIndexedDBPromise) {
      const o = await this.read();
      return xr(this.app, {
        lastSentHeartbeatDate:
          (i = e.lastSentHeartbeatDate) !== null && i !== void 0
            ? i
            : o.lastSentHeartbeatDate,
        heartbeats: e.heartbeats,
      });
    } else return;
  }
  async add(e) {
    var i;
    if (await this._canUseIndexedDBPromise) {
      const o = await this.read();
      return xr(this.app, {
        lastSentHeartbeatDate:
          (i = e.lastSentHeartbeatDate) !== null && i !== void 0
            ? i
            : o.lastSentHeartbeatDate,
        heartbeats: [...o.heartbeats, ...e.heartbeats],
      });
    } else return;
  }
}
function jr(n) {
  return tn(JSON.stringify({ version: 2, heartbeats: n })).length;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Zc(n) {
  (le(new se('platform-logger', e => new dc(e), 'PRIVATE')),
    le(new se('heartbeat', e => new Xc(e), 'PRIVATE')),
    te(ni, Mr, n),
    te(ni, Mr, 'esm2017'),
    te('fire-js', ''));
}
Zc('');
var el = 'firebase',
  tl = '10.14.1';
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ te(el, tl, 'app');
const Ls = '@firebase/installations',
  di = '0.6.9';
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Ms = 1e4,
  Us = `w:${di}`,
  xs = 'FIS_v2',
  nl = 'https://firebaseinstallations.googleapis.com/v1',
  il = 60 * 60 * 1e3,
  rl = 'installations',
  sl = 'Installations';
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const ol = {
    'missing-app-config-values':
      'Missing App configuration value: "{$valueName}"',
    'not-registered': 'Firebase Installation is not registered.',
    'installation-not-found': 'Firebase Installation not found.',
    'request-failed':
      '{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',
    'app-offline': 'Could not process request. Application offline.',
    'delete-pending-registration':
      "Can't delete installation while there is a pending registration request.",
  },
  Be = new He(rl, sl, ol);
function Fs(n) {
  return n instanceof oe && n.code.includes('request-failed');
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function js({ projectId: n }) {
  return `${nl}/projects/${n}/installations`;
}
function Bs(n) {
  return {
    token: n.token,
    requestStatus: 2,
    expiresIn: cl(n.expiresIn),
    creationTime: Date.now(),
  };
}
async function $s(n, e) {
  const r = (await e.json()).error;
  return Be.create('request-failed', {
    requestName: n,
    serverCode: r.code,
    serverMessage: r.message,
    serverStatus: r.status,
  });
}
function Vs({ apiKey: n }) {
  return new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-goog-api-key': n,
  });
}
function al(n, { refreshToken: e }) {
  const i = Vs(n);
  return (i.append('Authorization', ll(e)), i);
}
async function Hs(n) {
  const e = await n();
  return e.status >= 500 && e.status < 600 ? n() : e;
}
function cl(n) {
  return Number(n.replace('s', '000'));
}
function ll(n) {
  return `${xs} ${n}`;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function hl(
  { appConfig: n, heartbeatServiceProvider: e },
  { fid: i }
) {
  const r = js(n),
    o = Vs(n),
    c = e.getImmediate({ optional: !0 });
  if (c) {
    const T = await c.getHeartbeatsHeader();
    T && o.append('x-firebase-client', T);
  }
  const h = { fid: i, authVersion: xs, appId: n.appId, sdkVersion: Us },
    p = { method: 'POST', headers: o, body: JSON.stringify(h) },
    v = await Hs(() => fetch(r, p));
  if (v.ok) {
    const T = await v.json();
    return {
      fid: T.fid || i,
      registrationStatus: 2,
      refreshToken: T.refreshToken,
      authToken: Bs(T.authToken),
    };
  } else throw await $s('Create Installation', v);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function zs(n) {
  return new Promise(e => {
    setTimeout(e, n);
  });
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function ul(n) {
  return btoa(String.fromCharCode(...n))
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const dl = /^[cdef][\w-]{21}$/,
  si = '';
function fl() {
  try {
    const n = new Uint8Array(17);
    ((self.crypto || self.msCrypto).getRandomValues(n),
      (n[0] = 112 + (n[0] % 16)));
    const i = pl(n);
    return dl.test(i) ? i : si;
  } catch {
    return si;
  }
}
function pl(n) {
  return ul(n).substr(0, 22);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function fn(n) {
  return `${n.appName}!${n.appId}`;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Gs = new Map();
function Ws(n, e) {
  const i = fn(n);
  (qs(i, e), gl(i, e));
}
function qs(n, e) {
  const i = Gs.get(n);
  if (i) for (const r of i) r(e);
}
function gl(n, e) {
  const i = ml();
  (i && i.postMessage({ key: n, fid: e }), vl());
}
let Fe = null;
function ml() {
  return (
    !Fe &&
      'BroadcastChannel' in self &&
      ((Fe = new BroadcastChannel('[Firebase] FID Change')),
      (Fe.onmessage = n => {
        qs(n.data.key, n.data.fid);
      })),
    Fe
  );
}
function vl() {
  Gs.size === 0 && Fe && (Fe.close(), (Fe = null));
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const yl = 'firebase-installations-database',
  _l = 1,
  $e = 'firebase-installations-store';
let Kn = null;
function fi() {
  return (
    Kn ||
      (Kn = Ps(yl, _l, {
        upgrade: (n, e) => {
          switch (e) {
            case 0:
              n.createObjectStore($e);
          }
        },
      })),
    Kn
  );
}
async function rn(n, e) {
  const i = fn(n),
    o = (await fi()).transaction($e, 'readwrite'),
    c = o.objectStore($e),
    h = await c.get(i);
  return (
    await c.put(e, i),
    await o.done,
    (!h || h.fid !== e.fid) && Ws(n, e.fid),
    e
  );
}
async function Ks(n) {
  const e = fn(n),
    r = (await fi()).transaction($e, 'readwrite');
  (await r.objectStore($e).delete(e), await r.done);
}
async function pn(n, e) {
  const i = fn(n),
    o = (await fi()).transaction($e, 'readwrite'),
    c = o.objectStore($e),
    h = await c.get(i),
    p = e(h);
  return (
    p === void 0 ? await c.delete(i) : await c.put(p, i),
    await o.done,
    p && (!h || h.fid !== p.fid) && Ws(n, p.fid),
    p
  );
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function pi(n) {
  let e;
  const i = await pn(n.appConfig, r => {
    const o = Il(r),
      c = wl(n, o);
    return ((e = c.registrationPromise), c.installationEntry);
  });
  return i.fid === si
    ? { installationEntry: await e }
    : { installationEntry: i, registrationPromise: e };
}
function Il(n) {
  const e = n || { fid: fl(), registrationStatus: 0 };
  return Js(e);
}
function wl(n, e) {
  if (e.registrationStatus === 0) {
    if (!navigator.onLine) {
      const o = Promise.reject(Be.create('app-offline'));
      return { installationEntry: e, registrationPromise: o };
    }
    const i = {
        fid: e.fid,
        registrationStatus: 1,
        registrationTime: Date.now(),
      },
      r = Tl(n, i);
    return { installationEntry: i, registrationPromise: r };
  } else
    return e.registrationStatus === 1
      ? { installationEntry: e, registrationPromise: El(n) }
      : { installationEntry: e };
}
async function Tl(n, e) {
  try {
    const i = await hl(n, e);
    return rn(n.appConfig, i);
  } catch (i) {
    throw (
      Fs(i) && i.customData.serverCode === 409
        ? await Ks(n.appConfig)
        : await rn(n.appConfig, { fid: e.fid, registrationStatus: 0 }),
      i
    );
  }
}
async function El(n) {
  let e = await Br(n.appConfig);
  for (; e.registrationStatus === 1; )
    (await zs(100), (e = await Br(n.appConfig)));
  if (e.registrationStatus === 0) {
    const { installationEntry: i, registrationPromise: r } = await pi(n);
    return r || i;
  }
  return e;
}
function Br(n) {
  return pn(n, e => {
    if (!e) throw Be.create('installation-not-found');
    return Js(e);
  });
}
function Js(n) {
  return Al(n) ? { fid: n.fid, registrationStatus: 0 } : n;
}
function Al(n) {
  return n.registrationStatus === 1 && n.registrationTime + Ms < Date.now();
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function bl({ appConfig: n, heartbeatServiceProvider: e }, i) {
  const r = Sl(n, i),
    o = al(n, i),
    c = e.getImmediate({ optional: !0 });
  if (c) {
    const T = await c.getHeartbeatsHeader();
    T && o.append('x-firebase-client', T);
  }
  const h = { installation: { sdkVersion: Us, appId: n.appId } },
    p = { method: 'POST', headers: o, body: JSON.stringify(h) },
    v = await Hs(() => fetch(r, p));
  if (v.ok) {
    const T = await v.json();
    return Bs(T);
  } else throw await $s('Generate Auth Token', v);
}
function Sl(n, { fid: e }) {
  return `${js(n)}/${e}/authTokens:generate`;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function gi(n, e = !1) {
  let i;
  const r = await pn(n.appConfig, c => {
    if (!Xs(c)) throw Be.create('not-registered');
    const h = c.authToken;
    if (!e && Cl(h)) return c;
    if (h.requestStatus === 1) return ((i = kl(n, e)), c);
    {
      if (!navigator.onLine) throw Be.create('app-offline');
      const p = Ol(c);
      return ((i = Rl(n, p)), p);
    }
  });
  return i ? await i : r.authToken;
}
async function kl(n, e) {
  let i = await $r(n.appConfig);
  for (; i.authToken.requestStatus === 1; )
    (await zs(100), (i = await $r(n.appConfig)));
  const r = i.authToken;
  return r.requestStatus === 0 ? gi(n, e) : r;
}
function $r(n) {
  return pn(n, e => {
    if (!Xs(e)) throw Be.create('not-registered');
    const i = e.authToken;
    return Dl(i)
      ? Object.assign(Object.assign({}, e), { authToken: { requestStatus: 0 } })
      : e;
  });
}
async function Rl(n, e) {
  try {
    const i = await bl(n, e),
      r = Object.assign(Object.assign({}, e), { authToken: i });
    return (await rn(n.appConfig, r), i);
  } catch (i) {
    if (
      Fs(i) &&
      (i.customData.serverCode === 401 || i.customData.serverCode === 404)
    )
      await Ks(n.appConfig);
    else {
      const r = Object.assign(Object.assign({}, e), {
        authToken: { requestStatus: 0 },
      });
      await rn(n.appConfig, r);
    }
    throw i;
  }
}
function Xs(n) {
  return n !== void 0 && n.registrationStatus === 2;
}
function Cl(n) {
  return n.requestStatus === 2 && !Pl(n);
}
function Pl(n) {
  const e = Date.now();
  return e < n.creationTime || n.creationTime + n.expiresIn < e + il;
}
function Ol(n) {
  const e = { requestStatus: 1, requestTime: Date.now() };
  return Object.assign(Object.assign({}, n), { authToken: e });
}
function Dl(n) {
  return n.requestStatus === 1 && n.requestTime + Ms < Date.now();
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function Nl(n) {
  const e = n,
    { installationEntry: i, registrationPromise: r } = await pi(e);
  return (r ? r.catch(console.error) : gi(e).catch(console.error), i.fid);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function Ll(n, e = !1) {
  const i = n;
  return (await Ml(i), (await gi(i, e)).token);
}
async function Ml(n) {
  const { registrationPromise: e } = await pi(n);
  e && (await e);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Ul(n) {
  if (!n || !n.options) throw Jn('App Configuration');
  if (!n.name) throw Jn('App Name');
  const e = ['projectId', 'apiKey', 'appId'];
  for (const i of e) if (!n.options[i]) throw Jn(i);
  return {
    appName: n.name,
    projectId: n.options.projectId,
    apiKey: n.options.apiKey,
    appId: n.options.appId,
  };
}
function Jn(n) {
  return Be.create('missing-app-config-values', { valueName: n });
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Ys = 'installations',
  xl = 'installations-internal',
  Fl = n => {
    const e = n.getProvider('app').getImmediate(),
      i = Ul(e),
      r = ze(e, 'heartbeat');
    return {
      app: e,
      appConfig: i,
      heartbeatServiceProvider: r,
      _delete: () => Promise.resolve(),
    };
  },
  jl = n => {
    const e = n.getProvider('app').getImmediate(),
      i = ze(e, Ys).getImmediate();
    return { getId: () => Nl(i), getToken: o => Ll(i, o) };
  };
function Bl() {
  (le(new se(Ys, Fl, 'PUBLIC')), le(new se(xl, jl, 'PRIVATE')));
}
Bl();
te(Ls, di);
te(Ls, di, 'esm2017');
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const sn = 'analytics',
  $l = 'firebase_id',
  Vl = 'origin',
  Hl = 60 * 1e3,
  zl =
    'https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig',
  mi = 'https://www.googletagmanager.com/gtag/js';
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Y = new dn('@firebase/analytics');
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Gl = {
    'already-exists':
      'A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.',
    'already-initialized':
      'initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.',
    'already-initialized-settings':
      'Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.',
    'interop-component-reg-failed':
      'Firebase Analytics Interop Component failed to instantiate: {$reason}',
    'invalid-analytics-context':
      'Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}',
    'indexeddb-unavailable':
      'IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}',
    'fetch-throttle':
      'The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.',
    'config-fetch-failed':
      'Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}',
    'no-api-key':
      'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',
    'no-app-id':
      'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',
    'no-client-id': 'The "client_id" field is empty.',
    'invalid-gtag-resource':
      'Trusted Types detected an invalid gtag resource: {$gtagURL}.',
  },
  Z = new He('analytics', 'Analytics', Gl);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Wl(n) {
  if (!n.startsWith(mi)) {
    const e = Z.create('invalid-gtag-resource', { gtagURL: n });
    return (Y.warn(e.message), '');
  }
  return n;
}
function Qs(n) {
  return Promise.all(n.map(e => e.catch(i => i)));
}
function ql(n, e) {
  let i;
  return (
    window.trustedTypes && (i = window.trustedTypes.createPolicy(n, e)),
    i
  );
}
function Kl(n, e) {
  const i = ql('firebase-js-sdk-policy', { createScriptURL: Wl }),
    r = document.createElement('script'),
    o = `${mi}?l=${n}&id=${e}`;
  ((r.src = i ? i?.createScriptURL(o) : o),
    (r.async = !0),
    document.head.appendChild(r));
}
function Jl(n) {
  let e = [];
  return (Array.isArray(window[n]) ? (e = window[n]) : (window[n] = e), e);
}
async function Xl(n, e, i, r, o, c) {
  const h = r[o];
  try {
    if (h) await e[h];
    else {
      const v = (await Qs(i)).find(T => T.measurementId === o);
      v && (await e[v.appId]);
    }
  } catch (p) {
    Y.error(p);
  }
  n('config', o, c);
}
async function Yl(n, e, i, r, o) {
  try {
    let c = [];
    if (o && o.send_to) {
      let h = o.send_to;
      Array.isArray(h) || (h = [h]);
      const p = await Qs(i);
      for (const v of h) {
        const T = p.find(S => S.measurementId === v),
          A = T && e[T.appId];
        if (A) c.push(A);
        else {
          c = [];
          break;
        }
      }
    }
    (c.length === 0 && (c = Object.values(e)),
      await Promise.all(c),
      n('event', r, o || {}));
  } catch (c) {
    Y.error(c);
  }
}
function Ql(n, e, i, r) {
  async function o(c, ...h) {
    try {
      if (c === 'event') {
        const [p, v] = h;
        await Yl(n, e, i, p, v);
      } else if (c === 'config') {
        const [p, v] = h;
        await Xl(n, e, i, r, p, v);
      } else if (c === 'consent') {
        const [p, v] = h;
        n('consent', p, v);
      } else if (c === 'get') {
        const [p, v, T] = h;
        n('get', p, v, T);
      } else if (c === 'set') {
        const [p] = h;
        n('set', p);
      } else n(c, ...h);
    } catch (p) {
      Y.error(p);
    }
  }
  return o;
}
function Zl(n, e, i, r, o) {
  let c = function (...h) {
    window[r].push(arguments);
  };
  return (
    window[o] && typeof window[o] == 'function' && (c = window[o]),
    (window[o] = Ql(c, n, e, i)),
    { gtagCore: c, wrappedGtag: window[o] }
  );
}
function eh(n) {
  const e = window.document.getElementsByTagName('script');
  for (const i of Object.values(e))
    if (i.src && i.src.includes(mi) && i.src.includes(n)) return i;
  return null;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const th = 30,
  nh = 1e3;
class ih {
  constructor(e = {}, i = nh) {
    ((this.throttleMetadata = e), (this.intervalMillis = i));
  }
  getThrottleMetadata(e) {
    return this.throttleMetadata[e];
  }
  setThrottleMetadata(e, i) {
    this.throttleMetadata[e] = i;
  }
  deleteThrottleMetadata(e) {
    delete this.throttleMetadata[e];
  }
}
const Zs = new ih();
function rh(n) {
  return new Headers({ Accept: 'application/json', 'x-goog-api-key': n });
}
async function sh(n) {
  var e;
  const { appId: i, apiKey: r } = n,
    o = { method: 'GET', headers: rh(r) },
    c = zl.replace('{app-id}', i),
    h = await fetch(c, o);
  if (h.status !== 200 && h.status !== 304) {
    let p = '';
    try {
      const v = await h.json();
      !((e = v.error) === null || e === void 0) &&
        e.message &&
        (p = v.error.message);
    } catch {}
    throw Z.create('config-fetch-failed', {
      httpStatus: h.status,
      responseMessage: p,
    });
  }
  return h.json();
}
async function oh(n, e = Zs, i) {
  const { appId: r, apiKey: o, measurementId: c } = n.options;
  if (!r) throw Z.create('no-app-id');
  if (!o) {
    if (c) return { measurementId: c, appId: r };
    throw Z.create('no-api-key');
  }
  const h = e.getThrottleMetadata(r) || {
      backoffCount: 0,
      throttleEndTimeMillis: Date.now(),
    },
    p = new lh();
  return (
    setTimeout(async () => {
      p.abort();
    }, Hl),
    eo({ appId: r, apiKey: o, measurementId: c }, h, p, e)
  );
}
async function eo(n, { throttleEndTimeMillis: e, backoffCount: i }, r, o = Zs) {
  var c;
  const { appId: h, measurementId: p } = n;
  try {
    await ah(r, e);
  } catch (v) {
    if (p)
      return (
        Y.warn(
          `Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${p} provided in the "measurementId" field in the local Firebase config. [${v?.message}]`
        ),
        { appId: h, measurementId: p }
      );
    throw v;
  }
  try {
    const v = await sh(n);
    return (o.deleteThrottleMetadata(h), v);
  } catch (v) {
    const T = v;
    if (!ch(T)) {
      if ((o.deleteThrottleMetadata(h), p))
        return (
          Y.warn(
            `Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${p} provided in the "measurementId" field in the local Firebase config. [${T?.message}]`
          ),
          { appId: h, measurementId: p }
        );
      throw v;
    }
    const A =
        Number(
          (c = T?.customData) === null || c === void 0 ? void 0 : c.httpStatus
        ) === 503
          ? Or(i, o.intervalMillis, th)
          : Or(i, o.intervalMillis),
      S = { throttleEndTimeMillis: Date.now() + A, backoffCount: i + 1 };
    return (
      o.setThrottleMetadata(h, S),
      Y.debug(`Calling attemptFetch again in ${A} millis`),
      eo(n, S, r, o)
    );
  }
}
function ah(n, e) {
  return new Promise((i, r) => {
    const o = Math.max(e - Date.now(), 0),
      c = setTimeout(i, o);
    n.addEventListener(() => {
      (clearTimeout(c),
        r(Z.create('fetch-throttle', { throttleEndTimeMillis: e })));
    });
  });
}
function ch(n) {
  if (!(n instanceof oe) || !n.customData) return !1;
  const e = Number(n.customData.httpStatus);
  return e === 429 || e === 500 || e === 503 || e === 504;
}
class lh {
  constructor() {
    this.listeners = [];
  }
  addEventListener(e) {
    this.listeners.push(e);
  }
  abort() {
    this.listeners.forEach(e => e());
  }
}
async function hh(n, e, i, r, o) {
  if (o && o.global) {
    n('event', i, r);
    return;
  } else {
    const c = await e,
      h = Object.assign(Object.assign({}, r), { send_to: c });
    n('event', i, h);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function uh() {
  if (Ss())
    try {
      await ks();
    } catch (n) {
      return (
        Y.warn(
          Z.create('indexeddb-unavailable', { errorInfo: n?.toString() })
            .message
        ),
        !1
      );
    }
  else
    return (
      Y.warn(
        Z.create('indexeddb-unavailable', {
          errorInfo: 'IndexedDB is not available in this environment.',
        }).message
      ),
      !1
    );
  return !0;
}
async function dh(n, e, i, r, o, c, h) {
  var p;
  const v = oh(n);
  (v
    .then(N => {
      ((i[N.measurementId] = N.appId),
        n.options.measurementId &&
          N.measurementId !== n.options.measurementId &&
          Y.warn(
            `The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${N.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`
          ));
    })
    .catch(N => Y.error(N)),
    e.push(v));
  const T = uh().then(N => {
      if (N) return r.getId();
    }),
    [A, S] = await Promise.all([v, T]);
  (eh(c) || Kl(c, A.measurementId), o('js', new Date()));
  const k = (p = h?.config) !== null && p !== void 0 ? p : {};
  return (
    (k[Vl] = 'firebase'),
    (k.update = !0),
    S != null && (k[$l] = S),
    o('config', A.measurementId, k),
    A.measurementId
  );
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class fh {
  constructor(e) {
    this.app = e;
  }
  _delete() {
    return (delete wt[this.app.options.appId], Promise.resolve());
  }
}
let wt = {},
  Vr = [];
const Hr = {};
let Xn = 'dataLayer',
  ph = 'gtag',
  zr,
  to,
  Gr = !1;
function gh() {
  const n = [];
  if (
    (bs() && n.push('This is a browser extension environment.'),
    Ua() || n.push('Cookies are not available.'),
    n.length > 0)
  ) {
    const e = n.map((r, o) => `(${o + 1}) ${r}`).join(' '),
      i = Z.create('invalid-analytics-context', { errorInfo: e });
    Y.warn(i.message);
  }
}
function mh(n, e, i) {
  gh();
  const r = n.options.appId;
  if (!r) throw Z.create('no-app-id');
  if (!n.options.apiKey)
    if (n.options.measurementId)
      Y.warn(
        `The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`
      );
    else throw Z.create('no-api-key');
  if (wt[r] != null) throw Z.create('already-exists', { id: r });
  if (!Gr) {
    Jl(Xn);
    const { wrappedGtag: c, gtagCore: h } = Zl(wt, Vr, Hr, Xn, ph);
    ((to = c), (zr = h), (Gr = !0));
  }
  return ((wt[r] = dh(n, Vr, Hr, e, zr, Xn, i)), new fh(n));
}
function vh(n = ui()) {
  n = De(n);
  const e = ze(n, sn);
  return e.isInitialized() ? e.getImmediate() : yh(n);
}
function yh(n, e = {}) {
  const i = ze(n, sn);
  if (i.isInitialized()) {
    const o = i.getImmediate();
    if (bt(e, i.getOptions())) return o;
    throw Z.create('already-initialized');
  }
  return i.initialize({ options: e });
}
function _h(n, e, i, r) {
  ((n = De(n)),
    hh(to, wt[n.app.options.appId], e, i, r).catch(o => Y.error(o)));
}
const Wr = '@firebase/analytics',
  qr = '0.10.8';
function Ih() {
  (le(
    new se(
      sn,
      (e, { options: i }) => {
        const r = e.getProvider('app').getImmediate(),
          o = e.getProvider('installations-internal').getImmediate();
        return mh(r, o, i);
      },
      'PUBLIC'
    )
  ),
    le(new se('analytics-internal', n, 'PRIVATE')),
    te(Wr, qr),
    te(Wr, qr, 'esm2017'));
  function n(e) {
    try {
      const i = e.getProvider(sn).getImmediate();
      return { logEvent: (r, o, c) => _h(i, r, o, c) };
    } catch (i) {
      throw Z.create('interop-component-reg-failed', { reason: i });
    }
  }
}
Ih();
function vi(n, e) {
  var i = {};
  for (var r in n)
    Object.prototype.hasOwnProperty.call(n, r) &&
      e.indexOf(r) < 0 &&
      (i[r] = n[r]);
  if (n != null && typeof Object.getOwnPropertySymbols == 'function')
    for (var o = 0, r = Object.getOwnPropertySymbols(n); o < r.length; o++)
      e.indexOf(r[o]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(n, r[o]) &&
        (i[r[o]] = n[r[o]]);
  return i;
}
function no() {
  return {
    'dependent-sdk-initialized-before-auth':
      'Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.',
  };
}
const wh = no,
  io = new He('auth', 'Firebase', no());
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const on = new dn('@firebase/auth');
function Th(n, ...e) {
  on.logLevel <= O.WARN && on.warn(`Auth (${nt}): ${n}`, ...e);
}
function Yt(n, ...e) {
  on.logLevel <= O.ERROR && on.error(`Auth (${nt}): ${n}`, ...e);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function ye(n, ...e) {
  throw yi(n, ...e);
}
function ae(n, ...e) {
  return yi(n, ...e);
}
function ro(n, e, i) {
  const r = Object.assign(Object.assign({}, wh()), { [e]: i });
  return new He('auth', 'Firebase', r).create(e, { appName: n.name });
}
function je(n) {
  return ro(
    n,
    'operation-not-supported-in-this-environment',
    'Operations that alter the current user are not supported in conjunction with FirebaseServerApp'
  );
}
function yi(n, ...e) {
  if (typeof n != 'string') {
    const i = e[0],
      r = [...e.slice(1)];
    return (r[0] && (r[0].appName = n.name), n._errorFactory.create(i, ...r));
  }
  return io.create(n, ...e);
}
function b(n, e, ...i) {
  if (!n) throw yi(e, ...i);
}
function pe(n) {
  const e = 'INTERNAL ASSERTION FAILED: ' + n;
  throw (Yt(e), new Error(e));
}
function _e(n, e) {
  n || pe(e);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function oi() {
  var n;
  return (
    (typeof self < 'u' &&
      ((n = self.location) === null || n === void 0 ? void 0 : n.href)) ||
    ''
  );
}
function Eh() {
  return Kr() === 'http:' || Kr() === 'https:';
}
function Kr() {
  var n;
  return (
    (typeof self < 'u' &&
      ((n = self.location) === null || n === void 0 ? void 0 : n.protocol)) ||
    null
  );
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Ah() {
  return typeof navigator < 'u' &&
    navigator &&
    'onLine' in navigator &&
    typeof navigator.onLine == 'boolean' &&
    (Eh() || bs() || 'connection' in navigator)
    ? navigator.onLine
    : !0;
}
function bh() {
  if (typeof navigator > 'u') return null;
  const n = navigator;
  return (n.languages && n.languages[0]) || n.language || null;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Ct {
  constructor(e, i) {
    ((this.shortDelay = e),
      (this.longDelay = i),
      _e(i > e, 'Short delay should be less than long delay!'),
      (this.isMobile = Da() || La()));
  }
  get() {
    return Ah()
      ? this.isMobile
        ? this.longDelay
        : this.shortDelay
      : Math.min(5e3, this.shortDelay);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function _i(n, e) {
  _e(n.emulator, 'Emulator should always be set here');
  const { url: i } = n.emulator;
  return e ? `${i}${e.startsWith('/') ? e.slice(1) : e}` : i;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class so {
  static initialize(e, i, r) {
    ((this.fetchImpl = e),
      i && (this.headersImpl = i),
      r && (this.responseImpl = r));
  }
  static fetch() {
    if (this.fetchImpl) return this.fetchImpl;
    if (typeof self < 'u' && 'fetch' in self) return self.fetch;
    if (typeof globalThis < 'u' && globalThis.fetch) return globalThis.fetch;
    if (typeof fetch < 'u') return fetch;
    pe(
      'Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
    );
  }
  static headers() {
    if (this.headersImpl) return this.headersImpl;
    if (typeof self < 'u' && 'Headers' in self) return self.Headers;
    if (typeof globalThis < 'u' && globalThis.Headers)
      return globalThis.Headers;
    if (typeof Headers < 'u') return Headers;
    pe(
      'Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
    );
  }
  static response() {
    if (this.responseImpl) return this.responseImpl;
    if (typeof self < 'u' && 'Response' in self) return self.Response;
    if (typeof globalThis < 'u' && globalThis.Response)
      return globalThis.Response;
    if (typeof Response < 'u') return Response;
    pe(
      'Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
    );
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Sh = {
  CREDENTIAL_MISMATCH: 'custom-token-mismatch',
  MISSING_CUSTOM_TOKEN: 'internal-error',
  INVALID_IDENTIFIER: 'invalid-email',
  MISSING_CONTINUE_URI: 'internal-error',
  INVALID_PASSWORD: 'wrong-password',
  MISSING_PASSWORD: 'missing-password',
  INVALID_LOGIN_CREDENTIALS: 'invalid-credential',
  EMAIL_EXISTS: 'email-already-in-use',
  PASSWORD_LOGIN_DISABLED: 'operation-not-allowed',
  INVALID_IDP_RESPONSE: 'invalid-credential',
  INVALID_PENDING_TOKEN: 'invalid-credential',
  FEDERATED_USER_ID_ALREADY_LINKED: 'credential-already-in-use',
  MISSING_REQ_TYPE: 'internal-error',
  EMAIL_NOT_FOUND: 'user-not-found',
  RESET_PASSWORD_EXCEED_LIMIT: 'too-many-requests',
  EXPIRED_OOB_CODE: 'expired-action-code',
  INVALID_OOB_CODE: 'invalid-action-code',
  MISSING_OOB_CODE: 'internal-error',
  CREDENTIAL_TOO_OLD_LOGIN_AGAIN: 'requires-recent-login',
  INVALID_ID_TOKEN: 'invalid-user-token',
  TOKEN_EXPIRED: 'user-token-expired',
  USER_NOT_FOUND: 'user-token-expired',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'too-many-requests',
  PASSWORD_DOES_NOT_MEET_REQUIREMENTS: 'password-does-not-meet-requirements',
  INVALID_CODE: 'invalid-verification-code',
  INVALID_SESSION_INFO: 'invalid-verification-id',
  INVALID_TEMPORARY_PROOF: 'invalid-credential',
  MISSING_SESSION_INFO: 'missing-verification-id',
  SESSION_EXPIRED: 'code-expired',
  MISSING_ANDROID_PACKAGE_NAME: 'missing-android-pkg-name',
  UNAUTHORIZED_DOMAIN: 'unauthorized-continue-uri',
  INVALID_OAUTH_CLIENT_ID: 'invalid-oauth-client-id',
  ADMIN_ONLY_OPERATION: 'admin-restricted-operation',
  INVALID_MFA_PENDING_CREDENTIAL: 'invalid-multi-factor-session',
  MFA_ENROLLMENT_NOT_FOUND: 'multi-factor-info-not-found',
  MISSING_MFA_ENROLLMENT_ID: 'missing-multi-factor-info',
  MISSING_MFA_PENDING_CREDENTIAL: 'missing-multi-factor-session',
  SECOND_FACTOR_EXISTS: 'second-factor-already-in-use',
  SECOND_FACTOR_LIMIT_EXCEEDED: 'maximum-second-factor-count-exceeded',
  BLOCKING_FUNCTION_ERROR_RESPONSE: 'internal-error',
  RECAPTCHA_NOT_ENABLED: 'recaptcha-not-enabled',
  MISSING_RECAPTCHA_TOKEN: 'missing-recaptcha-token',
  INVALID_RECAPTCHA_TOKEN: 'invalid-recaptcha-token',
  INVALID_RECAPTCHA_ACTION: 'invalid-recaptcha-action',
  MISSING_CLIENT_TYPE: 'missing-client-type',
  MISSING_RECAPTCHA_VERSION: 'missing-recaptcha-version',
  INVALID_RECAPTCHA_VERSION: 'invalid-recaptcha-version',
  INVALID_REQ_TYPE: 'invalid-req-type',
};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const kh = new Ct(3e4, 6e4);
function Ii(n, e) {
  return n.tenantId && !e.tenantId
    ? Object.assign(Object.assign({}, e), { tenantId: n.tenantId })
    : e;
}
async function it(n, e, i, r, o = {}) {
  return oo(n, o, async () => {
    let c = {},
      h = {};
    r && (e === 'GET' ? (h = r) : (c = { body: JSON.stringify(r) }));
    const p = Rt(Object.assign({ key: n.config.apiKey }, h)).slice(1),
      v = await n._getAdditionalHeaders();
    ((v['Content-Type'] = 'application/json'),
      n.languageCode && (v['X-Firebase-Locale'] = n.languageCode));
    const T = Object.assign({ method: e, headers: v }, c);
    return (
      Na() || (T.referrerPolicy = 'no-referrer'),
      so.fetch()(ao(n, n.config.apiHost, i, p), T)
    );
  });
}
async function oo(n, e, i) {
  n._canInitEmulator = !1;
  const r = Object.assign(Object.assign({}, Sh), e);
  try {
    const o = new Ch(n),
      c = await Promise.race([i(), o.promise]);
    o.clearNetworkTimeout();
    const h = await c.json();
    if ('needConfirmation' in h)
      throw Jt(n, 'account-exists-with-different-credential', h);
    if (c.ok && !('errorMessage' in h)) return h;
    {
      const p = c.ok ? h.errorMessage : h.error.message,
        [v, T] = p.split(' : ');
      if (v === 'FEDERATED_USER_ID_ALREADY_LINKED')
        throw Jt(n, 'credential-already-in-use', h);
      if (v === 'EMAIL_EXISTS') throw Jt(n, 'email-already-in-use', h);
      if (v === 'USER_DISABLED') throw Jt(n, 'user-disabled', h);
      const A = r[v] || v.toLowerCase().replace(/[_\s]+/g, '-');
      if (T) throw ro(n, A, T);
      ye(n, A);
    }
  } catch (o) {
    if (o instanceof oe) throw o;
    ye(n, 'network-request-failed', { message: String(o) });
  }
}
async function Rh(n, e, i, r, o = {}) {
  const c = await it(n, e, i, r, o);
  return (
    'mfaPendingCredential' in c &&
      ye(n, 'multi-factor-auth-required', { _serverResponse: c }),
    c
  );
}
function ao(n, e, i, r) {
  const o = `${e}${i}?${r}`;
  return n.config.emulator ? _i(n.config, o) : `${n.config.apiScheme}://${o}`;
}
class Ch {
  constructor(e) {
    ((this.auth = e),
      (this.timer = null),
      (this.promise = new Promise((i, r) => {
        this.timer = setTimeout(
          () => r(ae(this.auth, 'network-request-failed')),
          kh.get()
        );
      })));
  }
  clearNetworkTimeout() {
    clearTimeout(this.timer);
  }
}
function Jt(n, e, i) {
  const r = { appName: n.name };
  (i.email && (r.email = i.email),
    i.phoneNumber && (r.phoneNumber = i.phoneNumber));
  const o = ae(n, e, r);
  return ((o.customData._tokenResponse = i), o);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function Ph(n, e) {
  return it(n, 'POST', '/v1/accounts:delete', e);
}
async function co(n, e) {
  return it(n, 'POST', '/v1/accounts:lookup', e);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Tt(n) {
  if (n)
    try {
      const e = new Date(Number(n));
      if (!isNaN(e.getTime())) return e.toUTCString();
    } catch {}
}
async function Oh(n, e = !1) {
  const i = De(n),
    r = await i.getIdToken(e),
    o = wi(r);
  b(o && o.exp && o.auth_time && o.iat, i.auth, 'internal-error');
  const c = typeof o.firebase == 'object' ? o.firebase : void 0,
    h = c?.sign_in_provider;
  return {
    claims: o,
    token: r,
    authTime: Tt(Yn(o.auth_time)),
    issuedAtTime: Tt(Yn(o.iat)),
    expirationTime: Tt(Yn(o.exp)),
    signInProvider: h || null,
    signInSecondFactor: c?.sign_in_second_factor || null,
  };
}
function Yn(n) {
  return Number(n) * 1e3;
}
function wi(n) {
  const [e, i, r] = n.split('.');
  if (e === void 0 || i === void 0 || r === void 0)
    return (Yt('JWT malformed, contained fewer than 3 sections'), null);
  try {
    const o = ws(i);
    return o
      ? JSON.parse(o)
      : (Yt('Failed to decode base64 JWT payload'), null);
  } catch (o) {
    return (
      Yt('Caught error parsing JWT payload as JSON', o?.toString()),
      null
    );
  }
}
function Jr(n) {
  const e = wi(n);
  return (
    b(e, 'internal-error'),
    b(typeof e.exp < 'u', 'internal-error'),
    b(typeof e.iat < 'u', 'internal-error'),
    Number(e.exp) - Number(e.iat)
  );
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function kt(n, e, i = !1) {
  if (i) return e;
  try {
    return await e;
  } catch (r) {
    throw (
      r instanceof oe &&
        Dh(r) &&
        n.auth.currentUser === n &&
        (await n.auth.signOut()),
      r
    );
  }
}
function Dh({ code: n }) {
  return n === 'auth/user-disabled' || n === 'auth/user-token-expired';
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Nh {
  constructor(e) {
    ((this.user = e),
      (this.isRunning = !1),
      (this.timerId = null),
      (this.errorBackoff = 3e4));
  }
  _start() {
    this.isRunning || ((this.isRunning = !0), this.schedule());
  }
  _stop() {
    this.isRunning &&
      ((this.isRunning = !1),
      this.timerId !== null && clearTimeout(this.timerId));
  }
  getInterval(e) {
    var i;
    if (e) {
      const r = this.errorBackoff;
      return ((this.errorBackoff = Math.min(this.errorBackoff * 2, 96e4)), r);
    } else {
      this.errorBackoff = 3e4;
      const o =
        ((i = this.user.stsTokenManager.expirationTime) !== null && i !== void 0
          ? i
          : 0) -
        Date.now() -
        3e5;
      return Math.max(0, o);
    }
  }
  schedule(e = !1) {
    if (!this.isRunning) return;
    const i = this.getInterval(e);
    this.timerId = setTimeout(async () => {
      await this.iteration();
    }, i);
  }
  async iteration() {
    try {
      await this.user.getIdToken(!0);
    } catch (e) {
      e?.code === 'auth/network-request-failed' && this.schedule(!0);
      return;
    }
    this.schedule();
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class ai {
  constructor(e, i) {
    ((this.createdAt = e), (this.lastLoginAt = i), this._initializeTime());
  }
  _initializeTime() {
    ((this.lastSignInTime = Tt(this.lastLoginAt)),
      (this.creationTime = Tt(this.createdAt)));
  }
  _copy(e) {
    ((this.createdAt = e.createdAt),
      (this.lastLoginAt = e.lastLoginAt),
      this._initializeTime());
  }
  toJSON() {
    return { createdAt: this.createdAt, lastLoginAt: this.lastLoginAt };
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function an(n) {
  var e;
  const i = n.auth,
    r = await n.getIdToken(),
    o = await kt(n, co(i, { idToken: r }));
  b(o?.users.length, i, 'internal-error');
  const c = o.users[0];
  n._notifyReloadListener(c);
  const h =
      !((e = c.providerUserInfo) === null || e === void 0) && e.length
        ? lo(c.providerUserInfo)
        : [],
    p = Mh(n.providerData, h),
    v = n.isAnonymous,
    T = !(n.email && c.passwordHash) && !p?.length,
    A = v ? T : !1,
    S = {
      uid: c.localId,
      displayName: c.displayName || null,
      photoURL: c.photoUrl || null,
      email: c.email || null,
      emailVerified: c.emailVerified || !1,
      phoneNumber: c.phoneNumber || null,
      tenantId: c.tenantId || null,
      providerData: p,
      metadata: new ai(c.createdAt, c.lastLoginAt),
      isAnonymous: A,
    };
  Object.assign(n, S);
}
async function Lh(n) {
  const e = De(n);
  (await an(e),
    await e.auth._persistUserIfCurrent(e),
    e.auth._notifyListenersIfCurrent(e));
}
function Mh(n, e) {
  return [...n.filter(r => !e.some(o => o.providerId === r.providerId)), ...e];
}
function lo(n) {
  return n.map(e => {
    var { providerId: i } = e,
      r = vi(e, ['providerId']);
    return {
      providerId: i,
      uid: r.rawId || '',
      displayName: r.displayName || null,
      email: r.email || null,
      phoneNumber: r.phoneNumber || null,
      photoURL: r.photoUrl || null,
    };
  });
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function Uh(n, e) {
  const i = await oo(n, {}, async () => {
    const r = Rt({ grant_type: 'refresh_token', refresh_token: e }).slice(1),
      { tokenApiHost: o, apiKey: c } = n.config,
      h = ao(n, o, '/v1/token', `key=${c}`),
      p = await n._getAdditionalHeaders();
    return (
      (p['Content-Type'] = 'application/x-www-form-urlencoded'),
      so.fetch()(h, { method: 'POST', headers: p, body: r })
    );
  });
  return {
    accessToken: i.access_token,
    expiresIn: i.expires_in,
    refreshToken: i.refresh_token,
  };
}
async function xh(n, e) {
  return it(n, 'POST', '/v2/accounts:revokeToken', Ii(n, e));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Ye {
  constructor() {
    ((this.refreshToken = null),
      (this.accessToken = null),
      (this.expirationTime = null));
  }
  get isExpired() {
    return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
  }
  updateFromServerResponse(e) {
    (b(e.idToken, 'internal-error'),
      b(typeof e.idToken < 'u', 'internal-error'),
      b(typeof e.refreshToken < 'u', 'internal-error'));
    const i =
      'expiresIn' in e && typeof e.expiresIn < 'u'
        ? Number(e.expiresIn)
        : Jr(e.idToken);
    this.updateTokensAndExpiration(e.idToken, e.refreshToken, i);
  }
  updateFromIdToken(e) {
    b(e.length !== 0, 'internal-error');
    const i = Jr(e);
    this.updateTokensAndExpiration(e, null, i);
  }
  async getToken(e, i = !1) {
    return !i && this.accessToken && !this.isExpired
      ? this.accessToken
      : (b(this.refreshToken, e, 'user-token-expired'),
        this.refreshToken
          ? (await this.refresh(e, this.refreshToken), this.accessToken)
          : null);
  }
  clearRefreshToken() {
    this.refreshToken = null;
  }
  async refresh(e, i) {
    const { accessToken: r, refreshToken: o, expiresIn: c } = await Uh(e, i);
    this.updateTokensAndExpiration(r, o, Number(c));
  }
  updateTokensAndExpiration(e, i, r) {
    ((this.refreshToken = i || null),
      (this.accessToken = e || null),
      (this.expirationTime = Date.now() + r * 1e3));
  }
  static fromJSON(e, i) {
    const { refreshToken: r, accessToken: o, expirationTime: c } = i,
      h = new Ye();
    return (
      r &&
        (b(typeof r == 'string', 'internal-error', { appName: e }),
        (h.refreshToken = r)),
      o &&
        (b(typeof o == 'string', 'internal-error', { appName: e }),
        (h.accessToken = o)),
      c &&
        (b(typeof c == 'number', 'internal-error', { appName: e }),
        (h.expirationTime = c)),
      h
    );
  }
  toJSON() {
    return {
      refreshToken: this.refreshToken,
      accessToken: this.accessToken,
      expirationTime: this.expirationTime,
    };
  }
  _assign(e) {
    ((this.accessToken = e.accessToken),
      (this.refreshToken = e.refreshToken),
      (this.expirationTime = e.expirationTime));
  }
  _clone() {
    return Object.assign(new Ye(), this.toJSON());
  }
  _performRefresh() {
    return pe('not implemented');
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Ae(n, e) {
  b(typeof n == 'string' || typeof n > 'u', 'internal-error', { appName: e });
}
class ge {
  constructor(e) {
    var { uid: i, auth: r, stsTokenManager: o } = e,
      c = vi(e, ['uid', 'auth', 'stsTokenManager']);
    ((this.providerId = 'firebase'),
      (this.proactiveRefresh = new Nh(this)),
      (this.reloadUserInfo = null),
      (this.reloadListener = null),
      (this.uid = i),
      (this.auth = r),
      (this.stsTokenManager = o),
      (this.accessToken = o.accessToken),
      (this.displayName = c.displayName || null),
      (this.email = c.email || null),
      (this.emailVerified = c.emailVerified || !1),
      (this.phoneNumber = c.phoneNumber || null),
      (this.photoURL = c.photoURL || null),
      (this.isAnonymous = c.isAnonymous || !1),
      (this.tenantId = c.tenantId || null),
      (this.providerData = c.providerData ? [...c.providerData] : []),
      (this.metadata = new ai(c.createdAt || void 0, c.lastLoginAt || void 0)));
  }
  async getIdToken(e) {
    const i = await kt(this, this.stsTokenManager.getToken(this.auth, e));
    return (
      b(i, this.auth, 'internal-error'),
      this.accessToken !== i &&
        ((this.accessToken = i),
        await this.auth._persistUserIfCurrent(this),
        this.auth._notifyListenersIfCurrent(this)),
      i
    );
  }
  getIdTokenResult(e) {
    return Oh(this, e);
  }
  reload() {
    return Lh(this);
  }
  _assign(e) {
    this !== e &&
      (b(this.uid === e.uid, this.auth, 'internal-error'),
      (this.displayName = e.displayName),
      (this.photoURL = e.photoURL),
      (this.email = e.email),
      (this.emailVerified = e.emailVerified),
      (this.phoneNumber = e.phoneNumber),
      (this.isAnonymous = e.isAnonymous),
      (this.tenantId = e.tenantId),
      (this.providerData = e.providerData.map(i => Object.assign({}, i))),
      this.metadata._copy(e.metadata),
      this.stsTokenManager._assign(e.stsTokenManager));
  }
  _clone(e) {
    const i = new ge(
      Object.assign(Object.assign({}, this), {
        auth: e,
        stsTokenManager: this.stsTokenManager._clone(),
      })
    );
    return (i.metadata._copy(this.metadata), i);
  }
  _onReload(e) {
    (b(!this.reloadListener, this.auth, 'internal-error'),
      (this.reloadListener = e),
      this.reloadUserInfo &&
        (this._notifyReloadListener(this.reloadUserInfo),
        (this.reloadUserInfo = null)));
  }
  _notifyReloadListener(e) {
    this.reloadListener ? this.reloadListener(e) : (this.reloadUserInfo = e);
  }
  _startProactiveRefresh() {
    this.proactiveRefresh._start();
  }
  _stopProactiveRefresh() {
    this.proactiveRefresh._stop();
  }
  async _updateTokensIfNecessary(e, i = !1) {
    let r = !1;
    (e.idToken &&
      e.idToken !== this.stsTokenManager.accessToken &&
      (this.stsTokenManager.updateFromServerResponse(e), (r = !0)),
      i && (await an(this)),
      await this.auth._persistUserIfCurrent(this),
      r && this.auth._notifyListenersIfCurrent(this));
  }
  async delete() {
    if (Ce(this.auth.app)) return Promise.reject(je(this.auth));
    const e = await this.getIdToken();
    return (
      await kt(this, Ph(this.auth, { idToken: e })),
      this.stsTokenManager.clearRefreshToken(),
      this.auth.signOut()
    );
  }
  toJSON() {
    return Object.assign(
      Object.assign(
        {
          uid: this.uid,
          email: this.email || void 0,
          emailVerified: this.emailVerified,
          displayName: this.displayName || void 0,
          isAnonymous: this.isAnonymous,
          photoURL: this.photoURL || void 0,
          phoneNumber: this.phoneNumber || void 0,
          tenantId: this.tenantId || void 0,
          providerData: this.providerData.map(e => Object.assign({}, e)),
          stsTokenManager: this.stsTokenManager.toJSON(),
          _redirectEventId: this._redirectEventId,
        },
        this.metadata.toJSON()
      ),
      { apiKey: this.auth.config.apiKey, appName: this.auth.name }
    );
  }
  get refreshToken() {
    return this.stsTokenManager.refreshToken || '';
  }
  static _fromJSON(e, i) {
    var r, o, c, h, p, v, T, A;
    const S = (r = i.displayName) !== null && r !== void 0 ? r : void 0,
      k = (o = i.email) !== null && o !== void 0 ? o : void 0,
      N = (c = i.phoneNumber) !== null && c !== void 0 ? c : void 0,
      C = (h = i.photoURL) !== null && h !== void 0 ? h : void 0,
      x = (p = i.tenantId) !== null && p !== void 0 ? p : void 0,
      M = (v = i._redirectEventId) !== null && v !== void 0 ? v : void 0,
      he = (T = i.createdAt) !== null && T !== void 0 ? T : void 0,
      Q = (A = i.lastLoginAt) !== null && A !== void 0 ? A : void 0,
      {
        uid: j,
        emailVerified: ne,
        isAnonymous: Ne,
        providerData: K,
        stsTokenManager: y,
      } = i;
    b(j && y, e, 'internal-error');
    const u = Ye.fromJSON(this.name, y);
    (b(typeof j == 'string', e, 'internal-error'),
      Ae(S, e.name),
      Ae(k, e.name),
      b(typeof ne == 'boolean', e, 'internal-error'),
      b(typeof Ne == 'boolean', e, 'internal-error'),
      Ae(N, e.name),
      Ae(C, e.name),
      Ae(x, e.name),
      Ae(M, e.name),
      Ae(he, e.name),
      Ae(Q, e.name));
    const f = new ge({
      uid: j,
      auth: e,
      email: k,
      emailVerified: ne,
      displayName: S,
      isAnonymous: Ne,
      photoURL: C,
      phoneNumber: N,
      tenantId: x,
      stsTokenManager: u,
      createdAt: he,
      lastLoginAt: Q,
    });
    return (
      K &&
        Array.isArray(K) &&
        (f.providerData = K.map(g => Object.assign({}, g))),
      M && (f._redirectEventId = M),
      f
    );
  }
  static async _fromIdTokenResponse(e, i, r = !1) {
    const o = new Ye();
    o.updateFromServerResponse(i);
    const c = new ge({
      uid: i.localId,
      auth: e,
      stsTokenManager: o,
      isAnonymous: r,
    });
    return (await an(c), c);
  }
  static async _fromGetAccountInfoResponse(e, i, r) {
    const o = i.users[0];
    b(o.localId !== void 0, 'internal-error');
    const c = o.providerUserInfo !== void 0 ? lo(o.providerUserInfo) : [],
      h = !(o.email && o.passwordHash) && !c?.length,
      p = new Ye();
    p.updateFromIdToken(r);
    const v = new ge({
        uid: o.localId,
        auth: e,
        stsTokenManager: p,
        isAnonymous: h,
      }),
      T = {
        uid: o.localId,
        displayName: o.displayName || null,
        photoURL: o.photoUrl || null,
        email: o.email || null,
        emailVerified: o.emailVerified || !1,
        phoneNumber: o.phoneNumber || null,
        tenantId: o.tenantId || null,
        providerData: c,
        metadata: new ai(o.createdAt, o.lastLoginAt),
        isAnonymous: !(o.email && o.passwordHash) && !c?.length,
      };
    return (Object.assign(v, T), v);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Xr = new Map();
function me(n) {
  _e(n instanceof Function, 'Expected a class definition');
  let e = Xr.get(n);
  return e
    ? (_e(e instanceof n, 'Instance stored in cache mismatched with class'), e)
    : ((e = new n()), Xr.set(n, e), e);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class ho {
  constructor() {
    ((this.type = 'NONE'), (this.storage = {}));
  }
  async _isAvailable() {
    return !0;
  }
  async _set(e, i) {
    this.storage[e] = i;
  }
  async _get(e) {
    const i = this.storage[e];
    return i === void 0 ? null : i;
  }
  async _remove(e) {
    delete this.storage[e];
  }
  _addListener(e, i) {}
  _removeListener(e, i) {}
}
ho.type = 'NONE';
const Yr = ho;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Qt(n, e, i) {
  return `firebase:${n}:${e}:${i}`;
}
class Qe {
  constructor(e, i, r) {
    ((this.persistence = e), (this.auth = i), (this.userKey = r));
    const { config: o, name: c } = this.auth;
    ((this.fullUserKey = Qt(this.userKey, o.apiKey, c)),
      (this.fullPersistenceKey = Qt('persistence', o.apiKey, c)),
      (this.boundEventHandler = i._onStorageEvent.bind(i)),
      this.persistence._addListener(this.fullUserKey, this.boundEventHandler));
  }
  setCurrentUser(e) {
    return this.persistence._set(this.fullUserKey, e.toJSON());
  }
  async getCurrentUser() {
    const e = await this.persistence._get(this.fullUserKey);
    return e ? ge._fromJSON(this.auth, e) : null;
  }
  removeCurrentUser() {
    return this.persistence._remove(this.fullUserKey);
  }
  savePersistenceForRedirect() {
    return this.persistence._set(
      this.fullPersistenceKey,
      this.persistence.type
    );
  }
  async setPersistence(e) {
    if (this.persistence === e) return;
    const i = await this.getCurrentUser();
    if ((await this.removeCurrentUser(), (this.persistence = e), i))
      return this.setCurrentUser(i);
  }
  delete() {
    this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
  }
  static async create(e, i, r = 'authUser') {
    if (!i.length) return new Qe(me(Yr), e, r);
    const o = (
      await Promise.all(
        i.map(async T => {
          if (await T._isAvailable()) return T;
        })
      )
    ).filter(T => T);
    let c = o[0] || me(Yr);
    const h = Qt(r, e.config.apiKey, e.name);
    let p = null;
    for (const T of i)
      try {
        const A = await T._get(h);
        if (A) {
          const S = ge._fromJSON(e, A);
          (T !== c && (p = S), (c = T));
          break;
        }
      } catch {}
    const v = o.filter(T => T._shouldAllowMigration);
    return !c._shouldAllowMigration || !v.length
      ? new Qe(c, e, r)
      : ((c = v[0]),
        p && (await c._set(h, p.toJSON())),
        await Promise.all(
          i.map(async T => {
            if (T !== c)
              try {
                await T._remove(h);
              } catch {}
          })
        ),
        new Qe(c, e, r));
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Qr(n) {
  const e = n.toLowerCase();
  if (e.includes('opera/') || e.includes('opr/') || e.includes('opios/'))
    return 'Opera';
  if (go(e)) return 'IEMobile';
  if (e.includes('msie') || e.includes('trident/')) return 'IE';
  if (e.includes('edge/')) return 'Edge';
  if (uo(e)) return 'Firefox';
  if (e.includes('silk/')) return 'Silk';
  if (vo(e)) return 'Blackberry';
  if (yo(e)) return 'Webos';
  if (fo(e)) return 'Safari';
  if ((e.includes('chrome/') || po(e)) && !e.includes('edge/')) return 'Chrome';
  if (mo(e)) return 'Android';
  {
    const i = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,
      r = n.match(i);
    if (r?.length === 2) return r[1];
  }
  return 'Other';
}
function uo(n = q()) {
  return /firefox\//i.test(n);
}
function fo(n = q()) {
  const e = n.toLowerCase();
  return (
    e.includes('safari/') &&
    !e.includes('chrome/') &&
    !e.includes('crios/') &&
    !e.includes('android')
  );
}
function po(n = q()) {
  return /crios\//i.test(n);
}
function go(n = q()) {
  return /iemobile/i.test(n);
}
function mo(n = q()) {
  return /android/i.test(n);
}
function vo(n = q()) {
  return /blackberry/i.test(n);
}
function yo(n = q()) {
  return /webos/i.test(n);
}
function Ti(n = q()) {
  return (
    /iphone|ipad|ipod/i.test(n) || (/macintosh/i.test(n) && /mobile/i.test(n))
  );
}
function Fh(n = q()) {
  var e;
  return (
    Ti(n) &&
    !!(!((e = window.navigator) === null || e === void 0) && e.standalone)
  );
}
function jh() {
  return Ma() && document.documentMode === 10;
}
function _o(n = q()) {
  return Ti(n) || mo(n) || yo(n) || vo(n) || /windows phone/i.test(n) || go(n);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Io(n, e = []) {
  let i;
  switch (n) {
    case 'Browser':
      i = Qr(q());
      break;
    case 'Worker':
      i = `${Qr(q())}-${n}`;
      break;
    default:
      i = n;
  }
  const r = e.length ? e.join(',') : 'FirebaseCore-web';
  return `${i}/JsCore/${nt}/${r}`;
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Bh {
  constructor(e) {
    ((this.auth = e), (this.queue = []));
  }
  pushCallback(e, i) {
    const r = c =>
      new Promise((h, p) => {
        try {
          const v = e(c);
          h(v);
        } catch (v) {
          p(v);
        }
      });
    ((r.onAbort = i), this.queue.push(r));
    const o = this.queue.length - 1;
    return () => {
      this.queue[o] = () => Promise.resolve();
    };
  }
  async runMiddleware(e) {
    if (this.auth.currentUser === e) return;
    const i = [];
    try {
      for (const r of this.queue) (await r(e), r.onAbort && i.push(r.onAbort));
    } catch (r) {
      i.reverse();
      for (const o of i)
        try {
          o();
        } catch {}
      throw this.auth._errorFactory.create('login-blocked', {
        originalMessage: r?.message,
      });
    }
  }
}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function $h(n, e = {}) {
  return it(n, 'GET', '/v2/passwordPolicy', Ii(n, e));
}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Vh = 6;
class Hh {
  constructor(e) {
    var i, r, o, c;
    const h = e.customStrengthOptions;
    ((this.customStrengthOptions = {}),
      (this.customStrengthOptions.minPasswordLength =
        (i = h.minPasswordLength) !== null && i !== void 0 ? i : Vh),
      h.maxPasswordLength &&
        (this.customStrengthOptions.maxPasswordLength = h.maxPasswordLength),
      h.containsLowercaseCharacter !== void 0 &&
        (this.customStrengthOptions.containsLowercaseLetter =
          h.containsLowercaseCharacter),
      h.containsUppercaseCharacter !== void 0 &&
        (this.customStrengthOptions.containsUppercaseLetter =
          h.containsUppercaseCharacter),
      h.containsNumericCharacter !== void 0 &&
        (this.customStrengthOptions.containsNumericCharacter =
          h.containsNumericCharacter),
      h.containsNonAlphanumericCharacter !== void 0 &&
        (this.customStrengthOptions.containsNonAlphanumericCharacter =
          h.containsNonAlphanumericCharacter),
      (this.enforcementState = e.enforcementState),
      this.enforcementState === 'ENFORCEMENT_STATE_UNSPECIFIED' &&
        (this.enforcementState = 'OFF'),
      (this.allowedNonAlphanumericCharacters =
        (o =
          (r = e.allowedNonAlphanumericCharacters) === null || r === void 0
            ? void 0
            : r.join('')) !== null && o !== void 0
          ? o
          : ''),
      (this.forceUpgradeOnSignin =
        (c = e.forceUpgradeOnSignin) !== null && c !== void 0 ? c : !1),
      (this.schemaVersion = e.schemaVersion));
  }
  validatePassword(e) {
    var i, r, o, c, h, p;
    const v = { isValid: !0, passwordPolicy: this };
    return (
      this.validatePasswordLengthOptions(e, v),
      this.validatePasswordCharacterOptions(e, v),
      v.isValid &&
        (v.isValid =
          (i = v.meetsMinPasswordLength) !== null && i !== void 0 ? i : !0),
      v.isValid &&
        (v.isValid =
          (r = v.meetsMaxPasswordLength) !== null && r !== void 0 ? r : !0),
      v.isValid &&
        (v.isValid =
          (o = v.containsLowercaseLetter) !== null && o !== void 0 ? o : !0),
      v.isValid &&
        (v.isValid =
          (c = v.containsUppercaseLetter) !== null && c !== void 0 ? c : !0),
      v.isValid &&
        (v.isValid =
          (h = v.containsNumericCharacter) !== null && h !== void 0 ? h : !0),
      v.isValid &&
        (v.isValid =
          (p = v.containsNonAlphanumericCharacter) !== null && p !== void 0
            ? p
            : !0),
      v
    );
  }
  validatePasswordLengthOptions(e, i) {
    const r = this.customStrengthOptions.minPasswordLength,
      o = this.customStrengthOptions.maxPasswordLength;
    (r && (i.meetsMinPasswordLength = e.length >= r),
      o && (i.meetsMaxPasswordLength = e.length <= o));
  }
  validatePasswordCharacterOptions(e, i) {
    this.updatePasswordCharacterOptionsStatuses(i, !1, !1, !1, !1);
    let r;
    for (let o = 0; o < e.length; o++)
      ((r = e.charAt(o)),
        this.updatePasswordCharacterOptionsStatuses(
          i,
          r >= 'a' && r <= 'z',
          r >= 'A' && r <= 'Z',
          r >= '0' && r <= '9',
          this.allowedNonAlphanumericCharacters.includes(r)
        ));
  }
  updatePasswordCharacterOptionsStatuses(e, i, r, o, c) {
    (this.customStrengthOptions.containsLowercaseLetter &&
      (e.containsLowercaseLetter || (e.containsLowercaseLetter = i)),
      this.customStrengthOptions.containsUppercaseLetter &&
        (e.containsUppercaseLetter || (e.containsUppercaseLetter = r)),
      this.customStrengthOptions.containsNumericCharacter &&
        (e.containsNumericCharacter || (e.containsNumericCharacter = o)),
      this.customStrengthOptions.containsNonAlphanumericCharacter &&
        (e.containsNonAlphanumericCharacter ||
          (e.containsNonAlphanumericCharacter = c)));
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class zh {
  constructor(e, i, r, o) {
    ((this.app = e),
      (this.heartbeatServiceProvider = i),
      (this.appCheckServiceProvider = r),
      (this.config = o),
      (this.currentUser = null),
      (this.emulatorConfig = null),
      (this.operations = Promise.resolve()),
      (this.authStateSubscription = new Zr(this)),
      (this.idTokenSubscription = new Zr(this)),
      (this.beforeStateQueue = new Bh(this)),
      (this.redirectUser = null),
      (this.isProactiveRefreshEnabled = !1),
      (this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1),
      (this._canInitEmulator = !0),
      (this._isInitialized = !1),
      (this._deleted = !1),
      (this._initializationPromise = null),
      (this._popupRedirectResolver = null),
      (this._errorFactory = io),
      (this._agentRecaptchaConfig = null),
      (this._tenantRecaptchaConfigs = {}),
      (this._projectPasswordPolicy = null),
      (this._tenantPasswordPolicies = {}),
      (this.lastNotifiedUid = void 0),
      (this.languageCode = null),
      (this.tenantId = null),
      (this.settings = { appVerificationDisabledForTesting: !1 }),
      (this.frameworks = []),
      (this.name = e.name),
      (this.clientVersion = o.sdkClientVersion));
  }
  _initializeWithPersistence(e, i) {
    return (
      i && (this._popupRedirectResolver = me(i)),
      (this._initializationPromise = this.queue(async () => {
        var r, o;
        if (
          !this._deleted &&
          ((this.persistenceManager = await Qe.create(this, e)), !this._deleted)
        ) {
          if (
            !((r = this._popupRedirectResolver) === null || r === void 0) &&
            r._shouldInitProactively
          )
            try {
              await this._popupRedirectResolver._initialize(this);
            } catch {}
          (await this.initializeCurrentUser(i),
            (this.lastNotifiedUid =
              ((o = this.currentUser) === null || o === void 0
                ? void 0
                : o.uid) || null),
            !this._deleted && (this._isInitialized = !0));
        }
      })),
      this._initializationPromise
    );
  }
  async _onStorageEvent() {
    if (this._deleted) return;
    const e = await this.assertedPersistence.getCurrentUser();
    if (!(!this.currentUser && !e)) {
      if (this.currentUser && e && this.currentUser.uid === e.uid) {
        (this._currentUser._assign(e), await this.currentUser.getIdToken());
        return;
      }
      await this._updateCurrentUser(e, !0);
    }
  }
  async initializeCurrentUserFromIdToken(e) {
    try {
      const i = await co(this, { idToken: e }),
        r = await ge._fromGetAccountInfoResponse(this, i, e);
      await this.directlySetCurrentUser(r);
    } catch (i) {
      (console.warn(
        'FirebaseServerApp could not login user with provided authIdToken: ',
        i
      ),
        await this.directlySetCurrentUser(null));
    }
  }
  async initializeCurrentUser(e) {
    var i;
    if (Ce(this.app)) {
      const h = this.app.settings.authIdToken;
      return h
        ? new Promise(p => {
            setTimeout(() =>
              this.initializeCurrentUserFromIdToken(h).then(p, p)
            );
          })
        : this.directlySetCurrentUser(null);
    }
    const r = await this.assertedPersistence.getCurrentUser();
    let o = r,
      c = !1;
    if (e && this.config.authDomain) {
      await this.getOrInitRedirectPersistenceManager();
      const h =
          (i = this.redirectUser) === null || i === void 0
            ? void 0
            : i._redirectEventId,
        p = o?._redirectEventId,
        v = await this.tryRedirectSignIn(e);
      (!h || h === p) && v?.user && ((o = v.user), (c = !0));
    }
    if (!o) return this.directlySetCurrentUser(null);
    if (!o._redirectEventId) {
      if (c)
        try {
          await this.beforeStateQueue.runMiddleware(o);
        } catch (h) {
          ((o = r),
            this._popupRedirectResolver._overrideRedirectResult(this, () =>
              Promise.reject(h)
            ));
        }
      return o
        ? this.reloadAndSetCurrentUserOrClear(o)
        : this.directlySetCurrentUser(null);
    }
    return (
      b(this._popupRedirectResolver, this, 'argument-error'),
      await this.getOrInitRedirectPersistenceManager(),
      this.redirectUser &&
      this.redirectUser._redirectEventId === o._redirectEventId
        ? this.directlySetCurrentUser(o)
        : this.reloadAndSetCurrentUserOrClear(o)
    );
  }
  async tryRedirectSignIn(e) {
    let i = null;
    try {
      i = await this._popupRedirectResolver._completeRedirectFn(this, e, !0);
    } catch {
      await this._setRedirectUser(null);
    }
    return i;
  }
  async reloadAndSetCurrentUserOrClear(e) {
    try {
      await an(e);
    } catch (i) {
      if (i?.code !== 'auth/network-request-failed')
        return this.directlySetCurrentUser(null);
    }
    return this.directlySetCurrentUser(e);
  }
  useDeviceLanguage() {
    this.languageCode = bh();
  }
  async _delete() {
    this._deleted = !0;
  }
  async updateCurrentUser(e) {
    if (Ce(this.app)) return Promise.reject(je(this));
    const i = e ? De(e) : null;
    return (
      i &&
        b(
          i.auth.config.apiKey === this.config.apiKey,
          this,
          'invalid-user-token'
        ),
      this._updateCurrentUser(i && i._clone(this))
    );
  }
  async _updateCurrentUser(e, i = !1) {
    if (!this._deleted)
      return (
        e && b(this.tenantId === e.tenantId, this, 'tenant-id-mismatch'),
        i || (await this.beforeStateQueue.runMiddleware(e)),
        this.queue(async () => {
          (await this.directlySetCurrentUser(e), this.notifyAuthListeners());
        })
      );
  }
  async signOut() {
    return Ce(this.app)
      ? Promise.reject(je(this))
      : (await this.beforeStateQueue.runMiddleware(null),
        (this.redirectPersistenceManager || this._popupRedirectResolver) &&
          (await this._setRedirectUser(null)),
        this._updateCurrentUser(null, !0));
  }
  setPersistence(e) {
    return Ce(this.app)
      ? Promise.reject(je(this))
      : this.queue(async () => {
          await this.assertedPersistence.setPersistence(me(e));
        });
  }
  _getRecaptchaConfig() {
    return this.tenantId == null
      ? this._agentRecaptchaConfig
      : this._tenantRecaptchaConfigs[this.tenantId];
  }
  async validatePassword(e) {
    this._getPasswordPolicyInternal() || (await this._updatePasswordPolicy());
    const i = this._getPasswordPolicyInternal();
    return i.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION
      ? Promise.reject(
          this._errorFactory.create(
            'unsupported-password-policy-schema-version',
            {}
          )
        )
      : i.validatePassword(e);
  }
  _getPasswordPolicyInternal() {
    return this.tenantId === null
      ? this._projectPasswordPolicy
      : this._tenantPasswordPolicies[this.tenantId];
  }
  async _updatePasswordPolicy() {
    const e = await $h(this),
      i = new Hh(e);
    this.tenantId === null
      ? (this._projectPasswordPolicy = i)
      : (this._tenantPasswordPolicies[this.tenantId] = i);
  }
  _getPersistence() {
    return this.assertedPersistence.persistence.type;
  }
  _updateErrorMap(e) {
    this._errorFactory = new He('auth', 'Firebase', e());
  }
  onAuthStateChanged(e, i, r) {
    return this.registerStateListener(this.authStateSubscription, e, i, r);
  }
  beforeAuthStateChanged(e, i) {
    return this.beforeStateQueue.pushCallback(e, i);
  }
  onIdTokenChanged(e, i, r) {
    return this.registerStateListener(this.idTokenSubscription, e, i, r);
  }
  authStateReady() {
    return new Promise((e, i) => {
      if (this.currentUser) e();
      else {
        const r = this.onAuthStateChanged(() => {
          (r(), e());
        }, i);
      }
    });
  }
  async revokeAccessToken(e) {
    if (this.currentUser) {
      const i = await this.currentUser.getIdToken(),
        r = {
          providerId: 'apple.com',
          tokenType: 'ACCESS_TOKEN',
          token: e,
          idToken: i,
        };
      (this.tenantId != null && (r.tenantId = this.tenantId),
        await xh(this, r));
    }
  }
  toJSON() {
    var e;
    return {
      apiKey: this.config.apiKey,
      authDomain: this.config.authDomain,
      appName: this.name,
      currentUser:
        (e = this._currentUser) === null || e === void 0 ? void 0 : e.toJSON(),
    };
  }
  async _setRedirectUser(e, i) {
    const r = await this.getOrInitRedirectPersistenceManager(i);
    return e === null ? r.removeCurrentUser() : r.setCurrentUser(e);
  }
  async getOrInitRedirectPersistenceManager(e) {
    if (!this.redirectPersistenceManager) {
      const i = (e && me(e)) || this._popupRedirectResolver;
      (b(i, this, 'argument-error'),
        (this.redirectPersistenceManager = await Qe.create(
          this,
          [me(i._redirectPersistence)],
          'redirectUser'
        )),
        (this.redirectUser =
          await this.redirectPersistenceManager.getCurrentUser()));
    }
    return this.redirectPersistenceManager;
  }
  async _redirectUserForId(e) {
    var i, r;
    return (
      this._isInitialized && (await this.queue(async () => {})),
      ((i = this._currentUser) === null || i === void 0
        ? void 0
        : i._redirectEventId) === e
        ? this._currentUser
        : ((r = this.redirectUser) === null || r === void 0
              ? void 0
              : r._redirectEventId) === e
          ? this.redirectUser
          : null
    );
  }
  async _persistUserIfCurrent(e) {
    if (e === this.currentUser)
      return this.queue(async () => this.directlySetCurrentUser(e));
  }
  _notifyListenersIfCurrent(e) {
    e === this.currentUser && this.notifyAuthListeners();
  }
  _key() {
    return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
  }
  _startProactiveRefresh() {
    ((this.isProactiveRefreshEnabled = !0),
      this.currentUser && this._currentUser._startProactiveRefresh());
  }
  _stopProactiveRefresh() {
    ((this.isProactiveRefreshEnabled = !1),
      this.currentUser && this._currentUser._stopProactiveRefresh());
  }
  get _currentUser() {
    return this.currentUser;
  }
  notifyAuthListeners() {
    var e, i;
    if (!this._isInitialized) return;
    this.idTokenSubscription.next(this.currentUser);
    const r =
      (i = (e = this.currentUser) === null || e === void 0 ? void 0 : e.uid) !==
        null && i !== void 0
        ? i
        : null;
    this.lastNotifiedUid !== r &&
      ((this.lastNotifiedUid = r),
      this.authStateSubscription.next(this.currentUser));
  }
  registerStateListener(e, i, r, o) {
    if (this._deleted) return () => {};
    const c = typeof i == 'function' ? i : i.next.bind(i);
    let h = !1;
    const p = this._isInitialized
      ? Promise.resolve()
      : this._initializationPromise;
    if (
      (b(p, this, 'internal-error'),
      p.then(() => {
        h || c(this.currentUser);
      }),
      typeof i == 'function')
    ) {
      const v = e.addObserver(i, r, o);
      return () => {
        ((h = !0), v());
      };
    } else {
      const v = e.addObserver(i);
      return () => {
        ((h = !0), v());
      };
    }
  }
  async directlySetCurrentUser(e) {
    (this.currentUser &&
      this.currentUser !== e &&
      this._currentUser._stopProactiveRefresh(),
      e && this.isProactiveRefreshEnabled && e._startProactiveRefresh(),
      (this.currentUser = e),
      e
        ? await this.assertedPersistence.setCurrentUser(e)
        : await this.assertedPersistence.removeCurrentUser());
  }
  queue(e) {
    return ((this.operations = this.operations.then(e, e)), this.operations);
  }
  get assertedPersistence() {
    return (
      b(this.persistenceManager, this, 'internal-error'),
      this.persistenceManager
    );
  }
  _logFramework(e) {
    !e ||
      this.frameworks.includes(e) ||
      (this.frameworks.push(e),
      this.frameworks.sort(),
      (this.clientVersion = Io(
        this.config.clientPlatform,
        this._getFrameworks()
      )));
  }
  _getFrameworks() {
    return this.frameworks;
  }
  async _getAdditionalHeaders() {
    var e;
    const i = { 'X-Client-Version': this.clientVersion };
    this.app.options.appId && (i['X-Firebase-gmpid'] = this.app.options.appId);
    const r = await ((e = this.heartbeatServiceProvider.getImmediate({
      optional: !0,
    })) === null || e === void 0
      ? void 0
      : e.getHeartbeatsHeader());
    r && (i['X-Firebase-Client'] = r);
    const o = await this._getAppCheckToken();
    return (o && (i['X-Firebase-AppCheck'] = o), i);
  }
  async _getAppCheckToken() {
    var e;
    const i = await ((e = this.appCheckServiceProvider.getImmediate({
      optional: !0,
    })) === null || e === void 0
      ? void 0
      : e.getToken());
    return (
      i?.error && Th(`Error while retrieving App Check token: ${i.error}`),
      i?.token
    );
  }
}
function Ei(n) {
  return De(n);
}
class Zr {
  constructor(e) {
    ((this.auth = e),
      (this.observer = null),
      (this.addObserver = $a(i => (this.observer = i))));
  }
  get next() {
    return (
      b(this.observer, this.auth, 'internal-error'),
      this.observer.next.bind(this.observer)
    );
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ let Ai = {
  async loadJS() {
    throw new Error('Unable to load external scripts');
  },
  recaptchaV2Script: '',
  recaptchaEnterpriseScript: '',
  gapiScript: '',
};
function Gh(n) {
  Ai = n;
}
function Wh(n) {
  return Ai.loadJS(n);
}
function qh() {
  return Ai.gapiScript;
}
function Kh(n) {
  return `__${n}${Math.floor(Math.random() * 1e6)}`;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Jh(n, e) {
  const i = ze(n, 'auth');
  if (i.isInitialized()) {
    const o = i.getImmediate(),
      c = i.getOptions();
    if (bt(c, e ?? {})) return o;
    ye(o, 'already-initialized');
  }
  return i.initialize({ options: e });
}
function Xh(n, e) {
  const i = e?.persistence || [],
    r = (Array.isArray(i) ? i : [i]).map(me);
  (e?.errorMap && n._updateErrorMap(e.errorMap),
    n._initializeWithPersistence(r, e?.popupRedirectResolver));
}
function Yh(n, e, i) {
  const r = Ei(n);
  (b(r._canInitEmulator, r, 'emulator-config-failed'),
    b(/^https?:\/\//.test(e), r, 'invalid-emulator-scheme'));
  const o = !1,
    c = wo(e),
    { host: h, port: p } = Qh(e),
    v = p === null ? '' : `:${p}`;
  ((r.config.emulator = { url: `${c}//${h}${v}/` }),
    (r.settings.appVerificationDisabledForTesting = !0),
    (r.emulatorConfig = Object.freeze({
      host: h,
      port: p,
      protocol: c.replace(':', ''),
      options: Object.freeze({ disableWarnings: o }),
    })),
    Zh());
}
function wo(n) {
  const e = n.indexOf(':');
  return e < 0 ? '' : n.substr(0, e + 1);
}
function Qh(n) {
  const e = wo(n),
    i = /(\/\/)?([^?#/]+)/.exec(n.substr(e.length));
  if (!i) return { host: '', port: null };
  const r = i[2].split('@').pop() || '',
    o = /^(\[[^\]]+\])(:|$)/.exec(r);
  if (o) {
    const c = o[1];
    return { host: c, port: es(r.substr(c.length + 1)) };
  } else {
    const [c, h] = r.split(':');
    return { host: c, port: es(h) };
  }
}
function es(n) {
  if (!n) return null;
  const e = Number(n);
  return isNaN(e) ? null : e;
}
function Zh() {
  function n() {
    const e = document.createElement('p'),
      i = e.style;
    ((e.innerText =
      'Running in emulator mode. Do not use with production credentials.'),
      (i.position = 'fixed'),
      (i.width = '100%'),
      (i.backgroundColor = '#ffffff'),
      (i.border = '.1em solid #000000'),
      (i.color = '#b50000'),
      (i.bottom = '0px'),
      (i.left = '0px'),
      (i.margin = '0px'),
      (i.zIndex = '10000'),
      (i.textAlign = 'center'),
      e.classList.add('firebase-emulator-warning'),
      document.body.appendChild(e));
  }
  (typeof console < 'u' &&
    typeof console.info == 'function' &&
    console.info(
      'WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.'
    ),
    typeof window < 'u' &&
      typeof document < 'u' &&
      (document.readyState === 'loading'
        ? window.addEventListener('DOMContentLoaded', n)
        : n()));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class To {
  constructor(e, i) {
    ((this.providerId = e), (this.signInMethod = i));
  }
  toJSON() {
    return pe('not implemented');
  }
  _getIdTokenResponse(e) {
    return pe('not implemented');
  }
  _linkToIdToken(e, i) {
    return pe('not implemented');
  }
  _getReauthenticationResolver(e) {
    return pe('not implemented');
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function Ze(n, e) {
  return Rh(n, 'POST', '/v1/accounts:signInWithIdp', Ii(n, e));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const eu = 'http://localhost';
class Ve extends To {
  constructor() {
    (super(...arguments), (this.pendingToken = null));
  }
  static _fromParams(e) {
    const i = new Ve(e.providerId, e.signInMethod);
    return (
      e.idToken || e.accessToken
        ? (e.idToken && (i.idToken = e.idToken),
          e.accessToken && (i.accessToken = e.accessToken),
          e.nonce && !e.pendingToken && (i.nonce = e.nonce),
          e.pendingToken && (i.pendingToken = e.pendingToken))
        : e.oauthToken && e.oauthTokenSecret
          ? ((i.accessToken = e.oauthToken), (i.secret = e.oauthTokenSecret))
          : ye('argument-error'),
      i
    );
  }
  toJSON() {
    return {
      idToken: this.idToken,
      accessToken: this.accessToken,
      secret: this.secret,
      nonce: this.nonce,
      pendingToken: this.pendingToken,
      providerId: this.providerId,
      signInMethod: this.signInMethod,
    };
  }
  static fromJSON(e) {
    const i = typeof e == 'string' ? JSON.parse(e) : e,
      { providerId: r, signInMethod: o } = i,
      c = vi(i, ['providerId', 'signInMethod']);
    if (!r || !o) return null;
    const h = new Ve(r, o);
    return (
      (h.idToken = c.idToken || void 0),
      (h.accessToken = c.accessToken || void 0),
      (h.secret = c.secret),
      (h.nonce = c.nonce),
      (h.pendingToken = c.pendingToken || null),
      h
    );
  }
  _getIdTokenResponse(e) {
    const i = this.buildRequest();
    return Ze(e, i);
  }
  _linkToIdToken(e, i) {
    const r = this.buildRequest();
    return ((r.idToken = i), Ze(e, r));
  }
  _getReauthenticationResolver(e) {
    const i = this.buildRequest();
    return ((i.autoCreate = !1), Ze(e, i));
  }
  buildRequest() {
    const e = { requestUri: eu, returnSecureToken: !0 };
    if (this.pendingToken) e.pendingToken = this.pendingToken;
    else {
      const i = {};
      (this.idToken && (i.id_token = this.idToken),
        this.accessToken && (i.access_token = this.accessToken),
        this.secret && (i.oauth_token_secret = this.secret),
        (i.providerId = this.providerId),
        this.nonce && !this.pendingToken && (i.nonce = this.nonce),
        (e.postBody = Rt(i)));
    }
    return e;
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Eo {
  constructor(e) {
    ((this.providerId = e),
      (this.defaultLanguageCode = null),
      (this.customParameters = {}));
  }
  setDefaultLanguage(e) {
    this.defaultLanguageCode = e;
  }
  setCustomParameters(e) {
    return ((this.customParameters = e), this);
  }
  getCustomParameters() {
    return this.customParameters;
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Pt extends Eo {
  constructor() {
    (super(...arguments), (this.scopes = []));
  }
  addScope(e) {
    return (this.scopes.includes(e) || this.scopes.push(e), this);
  }
  getScopes() {
    return [...this.scopes];
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class be extends Pt {
  constructor() {
    super('facebook.com');
  }
  static credential(e) {
    return Ve._fromParams({
      providerId: be.PROVIDER_ID,
      signInMethod: be.FACEBOOK_SIGN_IN_METHOD,
      accessToken: e,
    });
  }
  static credentialFromResult(e) {
    return be.credentialFromTaggedObject(e);
  }
  static credentialFromError(e) {
    return be.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: e }) {
    if (!e || !('oauthAccessToken' in e) || !e.oauthAccessToken) return null;
    try {
      return be.credential(e.oauthAccessToken);
    } catch {
      return null;
    }
  }
}
be.FACEBOOK_SIGN_IN_METHOD = 'facebook.com';
be.PROVIDER_ID = 'facebook.com';
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Se extends Pt {
  constructor() {
    (super('google.com'), this.addScope('profile'));
  }
  static credential(e, i) {
    return Ve._fromParams({
      providerId: Se.PROVIDER_ID,
      signInMethod: Se.GOOGLE_SIGN_IN_METHOD,
      idToken: e,
      accessToken: i,
    });
  }
  static credentialFromResult(e) {
    return Se.credentialFromTaggedObject(e);
  }
  static credentialFromError(e) {
    return Se.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: e }) {
    if (!e) return null;
    const { oauthIdToken: i, oauthAccessToken: r } = e;
    if (!i && !r) return null;
    try {
      return Se.credential(i, r);
    } catch {
      return null;
    }
  }
}
Se.GOOGLE_SIGN_IN_METHOD = 'google.com';
Se.PROVIDER_ID = 'google.com';
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class ke extends Pt {
  constructor() {
    super('github.com');
  }
  static credential(e) {
    return Ve._fromParams({
      providerId: ke.PROVIDER_ID,
      signInMethod: ke.GITHUB_SIGN_IN_METHOD,
      accessToken: e,
    });
  }
  static credentialFromResult(e) {
    return ke.credentialFromTaggedObject(e);
  }
  static credentialFromError(e) {
    return ke.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: e }) {
    if (!e || !('oauthAccessToken' in e) || !e.oauthAccessToken) return null;
    try {
      return ke.credential(e.oauthAccessToken);
    } catch {
      return null;
    }
  }
}
ke.GITHUB_SIGN_IN_METHOD = 'github.com';
ke.PROVIDER_ID = 'github.com';
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Re extends Pt {
  constructor() {
    super('twitter.com');
  }
  static credential(e, i) {
    return Ve._fromParams({
      providerId: Re.PROVIDER_ID,
      signInMethod: Re.TWITTER_SIGN_IN_METHOD,
      oauthToken: e,
      oauthTokenSecret: i,
    });
  }
  static credentialFromResult(e) {
    return Re.credentialFromTaggedObject(e);
  }
  static credentialFromError(e) {
    return Re.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: e }) {
    if (!e) return null;
    const { oauthAccessToken: i, oauthTokenSecret: r } = e;
    if (!i || !r) return null;
    try {
      return Re.credential(i, r);
    } catch {
      return null;
    }
  }
}
Re.TWITTER_SIGN_IN_METHOD = 'twitter.com';
Re.PROVIDER_ID = 'twitter.com';
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class et {
  constructor(e) {
    ((this.user = e.user),
      (this.providerId = e.providerId),
      (this._tokenResponse = e._tokenResponse),
      (this.operationType = e.operationType));
  }
  static async _fromIdTokenResponse(e, i, r, o = !1) {
    const c = await ge._fromIdTokenResponse(e, r, o),
      h = ts(r);
    return new et({
      user: c,
      providerId: h,
      _tokenResponse: r,
      operationType: i,
    });
  }
  static async _forOperation(e, i, r) {
    await e._updateTokensIfNecessary(r, !0);
    const o = ts(r);
    return new et({
      user: e,
      providerId: o,
      _tokenResponse: r,
      operationType: i,
    });
  }
}
function ts(n) {
  return n.providerId ? n.providerId : 'phoneNumber' in n ? 'phone' : null;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class cn extends oe {
  constructor(e, i, r, o) {
    var c;
    (super(i.code, i.message),
      (this.operationType = r),
      (this.user = o),
      Object.setPrototypeOf(this, cn.prototype),
      (this.customData = {
        appName: e.name,
        tenantId: (c = e.tenantId) !== null && c !== void 0 ? c : void 0,
        _serverResponse: i.customData._serverResponse,
        operationType: r,
      }));
  }
  static _fromErrorAndOperation(e, i, r, o) {
    return new cn(e, i, r, o);
  }
}
function Ao(n, e, i, r) {
  return (
    e === 'reauthenticate'
      ? i._getReauthenticationResolver(n)
      : i._getIdTokenResponse(n)
  ).catch(c => {
    throw c.code === 'auth/multi-factor-auth-required'
      ? cn._fromErrorAndOperation(n, c, e, r)
      : c;
  });
}
async function tu(n, e, i = !1) {
  const r = await kt(n, e._linkToIdToken(n.auth, await n.getIdToken()), i);
  return et._forOperation(n, 'link', r);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function nu(n, e, i = !1) {
  const { auth: r } = n;
  if (Ce(r.app)) return Promise.reject(je(r));
  const o = 'reauthenticate';
  try {
    const c = await kt(n, Ao(r, o, e, n), i);
    b(c.idToken, r, 'internal-error');
    const h = wi(c.idToken);
    b(h, r, 'internal-error');
    const { sub: p } = h;
    return (b(n.uid === p, r, 'user-mismatch'), et._forOperation(n, o, c));
  } catch (c) {
    throw (c?.code === 'auth/user-not-found' && ye(r, 'user-mismatch'), c);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function iu(n, e, i = !1) {
  if (Ce(n.app)) return Promise.reject(je(n));
  const r = 'signIn',
    o = await Ao(n, r, e),
    c = await et._fromIdTokenResponse(n, r, o);
  return (i || (await n._updateCurrentUser(c.user)), c);
}
function ru(n, e, i, r) {
  return De(n).onIdTokenChanged(e, i, r);
}
function su(n, e, i) {
  return De(n).beforeAuthStateChanged(e, i);
}
const ln = '__sak';
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class bo {
  constructor(e, i) {
    ((this.storageRetriever = e), (this.type = i));
  }
  _isAvailable() {
    try {
      return this.storage
        ? (this.storage.setItem(ln, '1'),
          this.storage.removeItem(ln),
          Promise.resolve(!0))
        : Promise.resolve(!1);
    } catch {
      return Promise.resolve(!1);
    }
  }
  _set(e, i) {
    return (this.storage.setItem(e, JSON.stringify(i)), Promise.resolve());
  }
  _get(e) {
    const i = this.storage.getItem(e);
    return Promise.resolve(i ? JSON.parse(i) : null);
  }
  _remove(e) {
    return (this.storage.removeItem(e), Promise.resolve());
  }
  get storage() {
    return this.storageRetriever();
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const ou = 1e3,
  au = 10;
class So extends bo {
  constructor() {
    (super(() => window.localStorage, 'LOCAL'),
      (this.boundEventHandler = (e, i) => this.onStorageEvent(e, i)),
      (this.listeners = {}),
      (this.localCache = {}),
      (this.pollTimer = null),
      (this.fallbackToPolling = _o()),
      (this._shouldAllowMigration = !0));
  }
  forAllChangedKeys(e) {
    for (const i of Object.keys(this.listeners)) {
      const r = this.storage.getItem(i),
        o = this.localCache[i];
      r !== o && e(i, o, r);
    }
  }
  onStorageEvent(e, i = !1) {
    if (!e.key) {
      this.forAllChangedKeys((h, p, v) => {
        this.notifyListeners(h, v);
      });
      return;
    }
    const r = e.key;
    i ? this.detachListener() : this.stopPolling();
    const o = () => {
        const h = this.storage.getItem(r);
        (!i && this.localCache[r] === h) || this.notifyListeners(r, h);
      },
      c = this.storage.getItem(r);
    jh() && c !== e.newValue && e.newValue !== e.oldValue
      ? setTimeout(o, au)
      : o();
  }
  notifyListeners(e, i) {
    this.localCache[e] = i;
    const r = this.listeners[e];
    if (r) for (const o of Array.from(r)) o(i && JSON.parse(i));
  }
  startPolling() {
    (this.stopPolling(),
      (this.pollTimer = setInterval(() => {
        this.forAllChangedKeys((e, i, r) => {
          this.onStorageEvent(
            new StorageEvent('storage', { key: e, oldValue: i, newValue: r }),
            !0
          );
        });
      }, ou)));
  }
  stopPolling() {
    this.pollTimer && (clearInterval(this.pollTimer), (this.pollTimer = null));
  }
  attachListener() {
    window.addEventListener('storage', this.boundEventHandler);
  }
  detachListener() {
    window.removeEventListener('storage', this.boundEventHandler);
  }
  _addListener(e, i) {
    (Object.keys(this.listeners).length === 0 &&
      (this.fallbackToPolling ? this.startPolling() : this.attachListener()),
      this.listeners[e] ||
        ((this.listeners[e] = new Set()),
        (this.localCache[e] = this.storage.getItem(e))),
      this.listeners[e].add(i));
  }
  _removeListener(e, i) {
    (this.listeners[e] &&
      (this.listeners[e].delete(i),
      this.listeners[e].size === 0 && delete this.listeners[e]),
      Object.keys(this.listeners).length === 0 &&
        (this.detachListener(), this.stopPolling()));
  }
  async _set(e, i) {
    (await super._set(e, i), (this.localCache[e] = JSON.stringify(i)));
  }
  async _get(e) {
    const i = await super._get(e);
    return ((this.localCache[e] = JSON.stringify(i)), i);
  }
  async _remove(e) {
    (await super._remove(e), delete this.localCache[e]);
  }
}
So.type = 'LOCAL';
const cu = So;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class ko extends bo {
  constructor() {
    super(() => window.sessionStorage, 'SESSION');
  }
  _addListener(e, i) {}
  _removeListener(e, i) {}
}
ko.type = 'SESSION';
const Ro = ko;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function lu(n) {
  return Promise.all(
    n.map(async e => {
      try {
        return { fulfilled: !0, value: await e };
      } catch (i) {
        return { fulfilled: !1, reason: i };
      }
    })
  );
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class gn {
  constructor(e) {
    ((this.eventTarget = e),
      (this.handlersMap = {}),
      (this.boundEventHandler = this.handleEvent.bind(this)));
  }
  static _getInstance(e) {
    const i = this.receivers.find(o => o.isListeningto(e));
    if (i) return i;
    const r = new gn(e);
    return (this.receivers.push(r), r);
  }
  isListeningto(e) {
    return this.eventTarget === e;
  }
  async handleEvent(e) {
    const i = e,
      { eventId: r, eventType: o, data: c } = i.data,
      h = this.handlersMap[o];
    if (!h?.size) return;
    i.ports[0].postMessage({ status: 'ack', eventId: r, eventType: o });
    const p = Array.from(h).map(async T => T(i.origin, c)),
      v = await lu(p);
    i.ports[0].postMessage({
      status: 'done',
      eventId: r,
      eventType: o,
      response: v,
    });
  }
  _subscribe(e, i) {
    (Object.keys(this.handlersMap).length === 0 &&
      this.eventTarget.addEventListener('message', this.boundEventHandler),
      this.handlersMap[e] || (this.handlersMap[e] = new Set()),
      this.handlersMap[e].add(i));
  }
  _unsubscribe(e, i) {
    (this.handlersMap[e] && i && this.handlersMap[e].delete(i),
      (!i || this.handlersMap[e].size === 0) && delete this.handlersMap[e],
      Object.keys(this.handlersMap).length === 0 &&
        this.eventTarget.removeEventListener(
          'message',
          this.boundEventHandler
        ));
  }
}
gn.receivers = [];
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function bi(n = '', e = 10) {
  let i = '';
  for (let r = 0; r < e; r++) i += Math.floor(Math.random() * 10);
  return n + i;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class hu {
  constructor(e) {
    ((this.target = e), (this.handlers = new Set()));
  }
  removeMessageHandler(e) {
    (e.messageChannel &&
      (e.messageChannel.port1.removeEventListener('message', e.onMessage),
      e.messageChannel.port1.close()),
      this.handlers.delete(e));
  }
  async _send(e, i, r = 50) {
    const o = typeof MessageChannel < 'u' ? new MessageChannel() : null;
    if (!o) throw new Error('connection_unavailable');
    let c, h;
    return new Promise((p, v) => {
      const T = bi('', 20);
      o.port1.start();
      const A = setTimeout(() => {
        v(new Error('unsupported_event'));
      }, r);
      ((h = {
        messageChannel: o,
        onMessage(S) {
          const k = S;
          if (k.data.eventId === T)
            switch (k.data.status) {
              case 'ack':
                (clearTimeout(A),
                  (c = setTimeout(() => {
                    v(new Error('timeout'));
                  }, 3e3)));
                break;
              case 'done':
                (clearTimeout(c), p(k.data.response));
                break;
              default:
                (clearTimeout(A),
                  clearTimeout(c),
                  v(new Error('invalid_response')));
                break;
            }
        },
      }),
        this.handlers.add(h),
        o.port1.addEventListener('message', h.onMessage),
        this.target.postMessage({ eventType: e, eventId: T, data: i }, [
          o.port2,
        ]));
    }).finally(() => {
      h && this.removeMessageHandler(h);
    });
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function ce() {
  return window;
}
function uu(n) {
  ce().location.href = n;
}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Co() {
  return (
    typeof ce().WorkerGlobalScope < 'u' &&
    typeof ce().importScripts == 'function'
  );
}
async function du() {
  if (!navigator?.serviceWorker) return null;
  try {
    return (await navigator.serviceWorker.ready).active;
  } catch {
    return null;
  }
}
function fu() {
  var n;
  return (
    ((n = navigator?.serviceWorker) === null || n === void 0
      ? void 0
      : n.controller) || null
  );
}
function pu() {
  return Co() ? self : null;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Po = 'firebaseLocalStorageDb',
  gu = 1,
  hn = 'firebaseLocalStorage',
  Oo = 'fbase_key';
class Ot {
  constructor(e) {
    this.request = e;
  }
  toPromise() {
    return new Promise((e, i) => {
      (this.request.addEventListener('success', () => {
        e(this.request.result);
      }),
        this.request.addEventListener('error', () => {
          i(this.request.error);
        }));
    });
  }
}
function mn(n, e) {
  return n.transaction([hn], e ? 'readwrite' : 'readonly').objectStore(hn);
}
function mu() {
  const n = indexedDB.deleteDatabase(Po);
  return new Ot(n).toPromise();
}
function ci() {
  const n = indexedDB.open(Po, gu);
  return new Promise((e, i) => {
    (n.addEventListener('error', () => {
      i(n.error);
    }),
      n.addEventListener('upgradeneeded', () => {
        const r = n.result;
        try {
          r.createObjectStore(hn, { keyPath: Oo });
        } catch (o) {
          i(o);
        }
      }),
      n.addEventListener('success', async () => {
        const r = n.result;
        r.objectStoreNames.contains(hn)
          ? e(r)
          : (r.close(), await mu(), e(await ci()));
      }));
  });
}
async function ns(n, e, i) {
  const r = mn(n, !0).put({ [Oo]: e, value: i });
  return new Ot(r).toPromise();
}
async function vu(n, e) {
  const i = mn(n, !1).get(e),
    r = await new Ot(i).toPromise();
  return r === void 0 ? null : r.value;
}
function is(n, e) {
  const i = mn(n, !0).delete(e);
  return new Ot(i).toPromise();
}
const yu = 800,
  _u = 3;
class Do {
  constructor() {
    ((this.type = 'LOCAL'),
      (this._shouldAllowMigration = !0),
      (this.listeners = {}),
      (this.localCache = {}),
      (this.pollTimer = null),
      (this.pendingWrites = 0),
      (this.receiver = null),
      (this.sender = null),
      (this.serviceWorkerReceiverAvailable = !1),
      (this.activeServiceWorker = null),
      (this._workerInitializationPromise =
        this.initializeServiceWorkerMessaging().then(
          () => {},
          () => {}
        )));
  }
  async _openDb() {
    return this.db ? this.db : ((this.db = await ci()), this.db);
  }
  async _withRetries(e) {
    let i = 0;
    for (;;)
      try {
        const r = await this._openDb();
        return await e(r);
      } catch (r) {
        if (i++ > _u) throw r;
        this.db && (this.db.close(), (this.db = void 0));
      }
  }
  async initializeServiceWorkerMessaging() {
    return Co() ? this.initializeReceiver() : this.initializeSender();
  }
  async initializeReceiver() {
    ((this.receiver = gn._getInstance(pu())),
      this.receiver._subscribe('keyChanged', async (e, i) => ({
        keyProcessed: (await this._poll()).includes(i.key),
      })),
      this.receiver._subscribe('ping', async (e, i) => ['keyChanged']));
  }
  async initializeSender() {
    var e, i;
    if (((this.activeServiceWorker = await du()), !this.activeServiceWorker))
      return;
    this.sender = new hu(this.activeServiceWorker);
    const r = await this.sender._send('ping', {}, 800);
    r &&
      !((e = r[0]) === null || e === void 0) &&
      e.fulfilled &&
      !((i = r[0]) === null || i === void 0) &&
      i.value.includes('keyChanged') &&
      (this.serviceWorkerReceiverAvailable = !0);
  }
  async notifyServiceWorker(e) {
    if (
      !(
        !this.sender ||
        !this.activeServiceWorker ||
        fu() !== this.activeServiceWorker
      )
    )
      try {
        await this.sender._send(
          'keyChanged',
          { key: e },
          this.serviceWorkerReceiverAvailable ? 800 : 50
        );
      } catch {}
  }
  async _isAvailable() {
    try {
      if (!indexedDB) return !1;
      const e = await ci();
      return (await ns(e, ln, '1'), await is(e, ln), !0);
    } catch {}
    return !1;
  }
  async _withPendingWrite(e) {
    this.pendingWrites++;
    try {
      await e();
    } finally {
      this.pendingWrites--;
    }
  }
  async _set(e, i) {
    return this._withPendingWrite(
      async () => (
        await this._withRetries(r => ns(r, e, i)),
        (this.localCache[e] = i),
        this.notifyServiceWorker(e)
      )
    );
  }
  async _get(e) {
    const i = await this._withRetries(r => vu(r, e));
    return ((this.localCache[e] = i), i);
  }
  async _remove(e) {
    return this._withPendingWrite(
      async () => (
        await this._withRetries(i => is(i, e)),
        delete this.localCache[e],
        this.notifyServiceWorker(e)
      )
    );
  }
  async _poll() {
    const e = await this._withRetries(o => {
      const c = mn(o, !1).getAll();
      return new Ot(c).toPromise();
    });
    if (!e) return [];
    if (this.pendingWrites !== 0) return [];
    const i = [],
      r = new Set();
    if (e.length !== 0)
      for (const { fbase_key: o, value: c } of e)
        (r.add(o),
          JSON.stringify(this.localCache[o]) !== JSON.stringify(c) &&
            (this.notifyListeners(o, c), i.push(o)));
    for (const o of Object.keys(this.localCache))
      this.localCache[o] &&
        !r.has(o) &&
        (this.notifyListeners(o, null), i.push(o));
    return i;
  }
  notifyListeners(e, i) {
    this.localCache[e] = i;
    const r = this.listeners[e];
    if (r) for (const o of Array.from(r)) o(i);
  }
  startPolling() {
    (this.stopPolling(),
      (this.pollTimer = setInterval(async () => this._poll(), yu)));
  }
  stopPolling() {
    this.pollTimer && (clearInterval(this.pollTimer), (this.pollTimer = null));
  }
  _addListener(e, i) {
    (Object.keys(this.listeners).length === 0 && this.startPolling(),
      this.listeners[e] || ((this.listeners[e] = new Set()), this._get(e)),
      this.listeners[e].add(i));
  }
  _removeListener(e, i) {
    (this.listeners[e] &&
      (this.listeners[e].delete(i),
      this.listeners[e].size === 0 && delete this.listeners[e]),
      Object.keys(this.listeners).length === 0 && this.stopPolling());
  }
}
Do.type = 'LOCAL';
const Iu = Do;
new Ct(3e4, 6e4);
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function wu(n, e) {
  return e
    ? me(e)
    : (b(n._popupRedirectResolver, n, 'argument-error'),
      n._popupRedirectResolver);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Si extends To {
  constructor(e) {
    (super('custom', 'custom'), (this.params = e));
  }
  _getIdTokenResponse(e) {
    return Ze(e, this._buildIdpRequest());
  }
  _linkToIdToken(e, i) {
    return Ze(e, this._buildIdpRequest(i));
  }
  _getReauthenticationResolver(e) {
    return Ze(e, this._buildIdpRequest());
  }
  _buildIdpRequest(e) {
    const i = {
      requestUri: this.params.requestUri,
      sessionId: this.params.sessionId,
      postBody: this.params.postBody,
      tenantId: this.params.tenantId,
      pendingToken: this.params.pendingToken,
      returnSecureToken: !0,
      returnIdpCredential: !0,
    };
    return (e && (i.idToken = e), i);
  }
}
function Tu(n) {
  return iu(n.auth, new Si(n), n.bypassAuthState);
}
function Eu(n) {
  const { auth: e, user: i } = n;
  return (b(i, e, 'internal-error'), nu(i, new Si(n), n.bypassAuthState));
}
async function Au(n) {
  const { auth: e, user: i } = n;
  return (b(i, e, 'internal-error'), tu(i, new Si(n), n.bypassAuthState));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class No {
  constructor(e, i, r, o, c = !1) {
    ((this.auth = e),
      (this.resolver = r),
      (this.user = o),
      (this.bypassAuthState = c),
      (this.pendingPromise = null),
      (this.eventManager = null),
      (this.filter = Array.isArray(i) ? i : [i]));
  }
  execute() {
    return new Promise(async (e, i) => {
      this.pendingPromise = { resolve: e, reject: i };
      try {
        ((this.eventManager = await this.resolver._initialize(this.auth)),
          await this.onExecution(),
          this.eventManager.registerConsumer(this));
      } catch (r) {
        this.reject(r);
      }
    });
  }
  async onAuthEvent(e) {
    const {
      urlResponse: i,
      sessionId: r,
      postBody: o,
      tenantId: c,
      error: h,
      type: p,
    } = e;
    if (h) {
      this.reject(h);
      return;
    }
    const v = {
      auth: this.auth,
      requestUri: i,
      sessionId: r,
      tenantId: c || void 0,
      postBody: o || void 0,
      user: this.user,
      bypassAuthState: this.bypassAuthState,
    };
    try {
      this.resolve(await this.getIdpTask(p)(v));
    } catch (T) {
      this.reject(T);
    }
  }
  onError(e) {
    this.reject(e);
  }
  getIdpTask(e) {
    switch (e) {
      case 'signInViaPopup':
      case 'signInViaRedirect':
        return Tu;
      case 'linkViaPopup':
      case 'linkViaRedirect':
        return Au;
      case 'reauthViaPopup':
      case 'reauthViaRedirect':
        return Eu;
      default:
        ye(this.auth, 'internal-error');
    }
  }
  resolve(e) {
    (_e(this.pendingPromise, 'Pending promise was never set'),
      this.pendingPromise.resolve(e),
      this.unregisterAndCleanUp());
  }
  reject(e) {
    (_e(this.pendingPromise, 'Pending promise was never set'),
      this.pendingPromise.reject(e),
      this.unregisterAndCleanUp());
  }
  unregisterAndCleanUp() {
    (this.eventManager && this.eventManager.unregisterConsumer(this),
      (this.pendingPromise = null),
      this.cleanUp());
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const bu = new Ct(2e3, 1e4);
class Xe extends No {
  constructor(e, i, r, o, c) {
    (super(e, i, o, c),
      (this.provider = r),
      (this.authWindow = null),
      (this.pollId = null),
      Xe.currentPopupAction && Xe.currentPopupAction.cancel(),
      (Xe.currentPopupAction = this));
  }
  async executeNotNull() {
    const e = await this.execute();
    return (b(e, this.auth, 'internal-error'), e);
  }
  async onExecution() {
    _e(this.filter.length === 1, 'Popup operations only handle one event');
    const e = bi();
    ((this.authWindow = await this.resolver._openPopup(
      this.auth,
      this.provider,
      this.filter[0],
      e
    )),
      (this.authWindow.associatedEvent = e),
      this.resolver._originValidation(this.auth).catch(i => {
        this.reject(i);
      }),
      this.resolver._isIframeWebStorageSupported(this.auth, i => {
        i || this.reject(ae(this.auth, 'web-storage-unsupported'));
      }),
      this.pollUserCancellation());
  }
  get eventId() {
    var e;
    return (
      ((e = this.authWindow) === null || e === void 0
        ? void 0
        : e.associatedEvent) || null
    );
  }
  cancel() {
    this.reject(ae(this.auth, 'cancelled-popup-request'));
  }
  cleanUp() {
    (this.authWindow && this.authWindow.close(),
      this.pollId && window.clearTimeout(this.pollId),
      (this.authWindow = null),
      (this.pollId = null),
      (Xe.currentPopupAction = null));
  }
  pollUserCancellation() {
    const e = () => {
      var i, r;
      if (
        !(
          (r =
            (i = this.authWindow) === null || i === void 0
              ? void 0
              : i.window) === null || r === void 0
        ) &&
        r.closed
      ) {
        this.pollId = window.setTimeout(() => {
          ((this.pollId = null),
            this.reject(ae(this.auth, 'popup-closed-by-user')));
        }, 8e3);
        return;
      }
      this.pollId = window.setTimeout(e, bu.get());
    };
    e();
  }
}
Xe.currentPopupAction = null;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Su = 'pendingRedirect',
  Zt = new Map();
class ku extends No {
  constructor(e, i, r = !1) {
    (super(
      e,
      ['signInViaRedirect', 'linkViaRedirect', 'reauthViaRedirect', 'unknown'],
      i,
      void 0,
      r
    ),
      (this.eventId = null));
  }
  async execute() {
    let e = Zt.get(this.auth._key());
    if (!e) {
      try {
        const r = (await Ru(this.resolver, this.auth))
          ? await super.execute()
          : null;
        e = () => Promise.resolve(r);
      } catch (i) {
        e = () => Promise.reject(i);
      }
      Zt.set(this.auth._key(), e);
    }
    return (
      this.bypassAuthState ||
        Zt.set(this.auth._key(), () => Promise.resolve(null)),
      e()
    );
  }
  async onAuthEvent(e) {
    if (e.type === 'signInViaRedirect') return super.onAuthEvent(e);
    if (e.type === 'unknown') {
      this.resolve(null);
      return;
    }
    if (e.eventId) {
      const i = await this.auth._redirectUserForId(e.eventId);
      if (i) return ((this.user = i), super.onAuthEvent(e));
      this.resolve(null);
    }
  }
  async onExecution() {}
  cleanUp() {}
}
async function Ru(n, e) {
  const i = Ou(e),
    r = Pu(n);
  if (!(await r._isAvailable())) return !1;
  const o = (await r._get(i)) === 'true';
  return (await r._remove(i), o);
}
function Cu(n, e) {
  Zt.set(n._key(), e);
}
function Pu(n) {
  return me(n._redirectPersistence);
}
function Ou(n) {
  return Qt(Su, n.config.apiKey, n.name);
}
async function Du(n, e, i = !1) {
  if (Ce(n.app)) return Promise.reject(je(n));
  const r = Ei(n),
    o = wu(r, e),
    h = await new ku(r, o, i).execute();
  return (
    h &&
      !i &&
      (delete h.user._redirectEventId,
      await r._persistUserIfCurrent(h.user),
      await r._setRedirectUser(null, e)),
    h
  );
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Nu = 10 * 60 * 1e3;
class Lu {
  constructor(e) {
    ((this.auth = e),
      (this.cachedEventUids = new Set()),
      (this.consumers = new Set()),
      (this.queuedRedirectEvent = null),
      (this.hasHandledPotentialRedirect = !1),
      (this.lastProcessedEventTime = Date.now()));
  }
  registerConsumer(e) {
    (this.consumers.add(e),
      this.queuedRedirectEvent &&
        this.isEventForConsumer(this.queuedRedirectEvent, e) &&
        (this.sendToConsumer(this.queuedRedirectEvent, e),
        this.saveEventToCache(this.queuedRedirectEvent),
        (this.queuedRedirectEvent = null)));
  }
  unregisterConsumer(e) {
    this.consumers.delete(e);
  }
  onEvent(e) {
    if (this.hasEventBeenHandled(e)) return !1;
    let i = !1;
    return (
      this.consumers.forEach(r => {
        this.isEventForConsumer(e, r) &&
          ((i = !0), this.sendToConsumer(e, r), this.saveEventToCache(e));
      }),
      this.hasHandledPotentialRedirect ||
        !Mu(e) ||
        ((this.hasHandledPotentialRedirect = !0),
        i || ((this.queuedRedirectEvent = e), (i = !0))),
      i
    );
  }
  sendToConsumer(e, i) {
    var r;
    if (e.error && !Lo(e)) {
      const o =
        ((r = e.error.code) === null || r === void 0
          ? void 0
          : r.split('auth/')[1]) || 'internal-error';
      i.onError(ae(this.auth, o));
    } else i.onAuthEvent(e);
  }
  isEventForConsumer(e, i) {
    const r = i.eventId === null || (!!e.eventId && e.eventId === i.eventId);
    return i.filter.includes(e.type) && r;
  }
  hasEventBeenHandled(e) {
    return (
      Date.now() - this.lastProcessedEventTime >= Nu &&
        this.cachedEventUids.clear(),
      this.cachedEventUids.has(rs(e))
    );
  }
  saveEventToCache(e) {
    (this.cachedEventUids.add(rs(e)),
      (this.lastProcessedEventTime = Date.now()));
  }
}
function rs(n) {
  return [n.type, n.eventId, n.sessionId, n.tenantId].filter(e => e).join('-');
}
function Lo({ type: n, error: e }) {
  return n === 'unknown' && e?.code === 'auth/no-auth-event';
}
function Mu(n) {
  switch (n.type) {
    case 'signInViaRedirect':
    case 'linkViaRedirect':
    case 'reauthViaRedirect':
      return !0;
    case 'unknown':
      return Lo(n);
    default:
      return !1;
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function Uu(n, e = {}) {
  return it(n, 'GET', '/v1/projects', e);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const xu = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  Fu = /^https?/;
async function ju(n) {
  if (n.config.emulator) return;
  const { authorizedDomains: e } = await Uu(n);
  for (const i of e)
    try {
      if (Bu(i)) return;
    } catch {}
  ye(n, 'unauthorized-domain');
}
function Bu(n) {
  const e = oi(),
    { protocol: i, hostname: r } = new URL(e);
  if (n.startsWith('chrome-extension://')) {
    const h = new URL(n);
    return h.hostname === '' && r === ''
      ? i === 'chrome-extension:' &&
          n.replace('chrome-extension://', '') ===
            e.replace('chrome-extension://', '')
      : i === 'chrome-extension:' && h.hostname === r;
  }
  if (!Fu.test(i)) return !1;
  if (xu.test(n)) return r === n;
  const o = n.replace(/\./g, '\\.');
  return new RegExp('^(.+\\.' + o + '|' + o + ')$', 'i').test(r);
}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const $u = new Ct(3e4, 6e4);
function ss() {
  const n = ce().___jsl;
  if (n?.H) {
    for (const e of Object.keys(n.H))
      if (
        ((n.H[e].r = n.H[e].r || []),
        (n.H[e].L = n.H[e].L || []),
        (n.H[e].r = [...n.H[e].L]),
        n.CP)
      )
        for (let i = 0; i < n.CP.length; i++) n.CP[i] = null;
  }
}
function Vu(n) {
  return new Promise((e, i) => {
    var r, o, c;
    function h() {
      (ss(),
        gapi.load('gapi.iframes', {
          callback: () => {
            e(gapi.iframes.getContext());
          },
          ontimeout: () => {
            (ss(), i(ae(n, 'network-request-failed')));
          },
          timeout: $u.get(),
        }));
    }
    if (
      !(
        (o = (r = ce().gapi) === null || r === void 0 ? void 0 : r.iframes) ===
          null || o === void 0
      ) &&
      o.Iframe
    )
      e(gapi.iframes.getContext());
    else if (!((c = ce().gapi) === null || c === void 0) && c.load) h();
    else {
      const p = Kh('iframefcb');
      return (
        (ce()[p] = () => {
          gapi.load ? h() : i(ae(n, 'network-request-failed'));
        }),
        Wh(`${qh()}?onload=${p}`).catch(v => i(v))
      );
    }
  }).catch(e => {
    throw ((en = null), e);
  });
}
let en = null;
function Hu(n) {
  return ((en = en || Vu(n)), en);
}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const zu = new Ct(5e3, 15e3),
  Gu = '__/auth/iframe',
  Wu = 'emulator/auth/iframe',
  qu = {
    style: { position: 'absolute', top: '-100px', width: '1px', height: '1px' },
    'aria-hidden': 'true',
    tabindex: '-1',
  },
  Ku = new Map([
    ['identitytoolkit.googleapis.com', 'p'],
    ['staging-identitytoolkit.sandbox.googleapis.com', 's'],
    ['test-identitytoolkit.sandbox.googleapis.com', 't'],
  ]);
function Ju(n) {
  const e = n.config;
  b(e.authDomain, n, 'auth-domain-config-required');
  const i = e.emulator ? _i(e, Wu) : `https://${n.config.authDomain}/${Gu}`,
    r = { apiKey: e.apiKey, appName: n.name, v: nt },
    o = Ku.get(n.config.apiHost);
  o && (r.eid = o);
  const c = n._getFrameworks();
  return (c.length && (r.fw = c.join(',')), `${i}?${Rt(r).slice(1)}`);
}
async function Xu(n) {
  const e = await Hu(n),
    i = ce().gapi;
  return (
    b(i, n, 'internal-error'),
    e.open(
      {
        where: document.body,
        url: Ju(n),
        messageHandlersFilter: i.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
        attributes: qu,
        dontclear: !0,
      },
      r =>
        new Promise(async (o, c) => {
          await r.restyle({ setHideOnLeave: !1 });
          const h = ae(n, 'network-request-failed'),
            p = ce().setTimeout(() => {
              c(h);
            }, zu.get());
          function v() {
            (ce().clearTimeout(p), o(r));
          }
          r.ping(v).then(v, () => {
            c(h);
          });
        })
    )
  );
}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Yu = {
    location: 'yes',
    resizable: 'yes',
    statusbar: 'yes',
    toolbar: 'no',
  },
  Qu = 500,
  Zu = 600,
  ed = '_blank',
  td = 'http://localhost';
class os {
  constructor(e) {
    ((this.window = e), (this.associatedEvent = null));
  }
  close() {
    if (this.window)
      try {
        this.window.close();
      } catch {}
  }
}
function nd(n, e, i, r = Qu, o = Zu) {
  const c = Math.max((window.screen.availHeight - o) / 2, 0).toString(),
    h = Math.max((window.screen.availWidth - r) / 2, 0).toString();
  let p = '';
  const v = Object.assign(Object.assign({}, Yu), {
      width: r.toString(),
      height: o.toString(),
      top: c,
      left: h,
    }),
    T = q().toLowerCase();
  (i && (p = po(T) ? ed : i), uo(T) && ((e = e || td), (v.scrollbars = 'yes')));
  const A = Object.entries(v).reduce((k, [N, C]) => `${k}${N}=${C},`, '');
  if (Fh(T) && p !== '_self') return (id(e || '', p), new os(null));
  const S = window.open(e || '', p, A);
  b(S, n, 'popup-blocked');
  try {
    S.focus();
  } catch {}
  return new os(S);
}
function id(n, e) {
  const i = document.createElement('a');
  ((i.href = n), (i.target = e));
  const r = document.createEvent('MouseEvent');
  (r.initMouseEvent(
    'click',
    !0,
    !0,
    window,
    1,
    0,
    0,
    0,
    0,
    !1,
    !1,
    !1,
    !1,
    1,
    null
  ),
    i.dispatchEvent(r));
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const rd = '__/auth/handler',
  sd = 'emulator/auth/handler',
  od = encodeURIComponent('fac');
async function as(n, e, i, r, o, c) {
  (b(n.config.authDomain, n, 'auth-domain-config-required'),
    b(n.config.apiKey, n, 'invalid-api-key'));
  const h = {
    apiKey: n.config.apiKey,
    appName: n.name,
    authType: i,
    redirectUrl: r,
    v: nt,
    eventId: o,
  };
  if (e instanceof Eo) {
    (e.setDefaultLanguage(n.languageCode),
      (h.providerId = e.providerId || ''),
      Ba(e.getCustomParameters()) ||
        (h.customParameters = JSON.stringify(e.getCustomParameters())));
    for (const [A, S] of Object.entries({})) h[A] = S;
  }
  if (e instanceof Pt) {
    const A = e.getScopes().filter(S => S !== '');
    A.length > 0 && (h.scopes = A.join(','));
  }
  n.tenantId && (h.tid = n.tenantId);
  const p = h;
  for (const A of Object.keys(p)) p[A] === void 0 && delete p[A];
  const v = await n._getAppCheckToken(),
    T = v ? `#${od}=${encodeURIComponent(v)}` : '';
  return `${ad(n)}?${Rt(p).slice(1)}${T}`;
}
function ad({ config: n }) {
  return n.emulator ? _i(n, sd) : `https://${n.authDomain}/${rd}`;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Qn = 'webStorageSupport';
class cd {
  constructor() {
    ((this.eventManagers = {}),
      (this.iframes = {}),
      (this.originValidationPromises = {}),
      (this._redirectPersistence = Ro),
      (this._completeRedirectFn = Du),
      (this._overrideRedirectResult = Cu));
  }
  async _openPopup(e, i, r, o) {
    var c;
    _e(
      (c = this.eventManagers[e._key()]) === null || c === void 0
        ? void 0
        : c.manager,
      '_initialize() not called before _openPopup()'
    );
    const h = await as(e, i, r, oi(), o);
    return nd(e, h, bi());
  }
  async _openRedirect(e, i, r, o) {
    await this._originValidation(e);
    const c = await as(e, i, r, oi(), o);
    return (uu(c), new Promise(() => {}));
  }
  _initialize(e) {
    const i = e._key();
    if (this.eventManagers[i]) {
      const { manager: o, promise: c } = this.eventManagers[i];
      return o
        ? Promise.resolve(o)
        : (_e(c, 'If manager is not set, promise should be'), c);
    }
    const r = this.initAndGetManager(e);
    return (
      (this.eventManagers[i] = { promise: r }),
      r.catch(() => {
        delete this.eventManagers[i];
      }),
      r
    );
  }
  async initAndGetManager(e) {
    const i = await Xu(e),
      r = new Lu(e);
    return (
      i.register(
        'authEvent',
        o => (
          b(o?.authEvent, e, 'invalid-auth-event'),
          { status: r.onEvent(o.authEvent) ? 'ACK' : 'ERROR' }
        ),
        gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER
      ),
      (this.eventManagers[e._key()] = { manager: r }),
      (this.iframes[e._key()] = i),
      r
    );
  }
  _isIframeWebStorageSupported(e, i) {
    this.iframes[e._key()].send(
      Qn,
      { type: Qn },
      o => {
        var c;
        const h = (c = o?.[0]) === null || c === void 0 ? void 0 : c[Qn];
        (h !== void 0 && i(!!h), ye(e, 'internal-error'));
      },
      gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER
    );
  }
  _originValidation(e) {
    const i = e._key();
    return (
      this.originValidationPromises[i] ||
        (this.originValidationPromises[i] = ju(e)),
      this.originValidationPromises[i]
    );
  }
  get _shouldInitProactively() {
    return _o() || fo() || Ti();
  }
}
const ld = cd;
var cs = '@firebase/auth',
  ls = '1.7.9';
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class hd {
  constructor(e) {
    ((this.auth = e), (this.internalListeners = new Map()));
  }
  getUid() {
    var e;
    return (
      this.assertAuthConfigured(),
      ((e = this.auth.currentUser) === null || e === void 0 ? void 0 : e.uid) ||
        null
    );
  }
  async getToken(e) {
    return (
      this.assertAuthConfigured(),
      await this.auth._initializationPromise,
      this.auth.currentUser
        ? { accessToken: await this.auth.currentUser.getIdToken(e) }
        : null
    );
  }
  addAuthTokenListener(e) {
    if ((this.assertAuthConfigured(), this.internalListeners.has(e))) return;
    const i = this.auth.onIdTokenChanged(r => {
      e(r?.stsTokenManager.accessToken || null);
    });
    (this.internalListeners.set(e, i), this.updateProactiveRefresh());
  }
  removeAuthTokenListener(e) {
    this.assertAuthConfigured();
    const i = this.internalListeners.get(e);
    i && (this.internalListeners.delete(e), i(), this.updateProactiveRefresh());
  }
  assertAuthConfigured() {
    b(
      this.auth._initializationPromise,
      'dependent-sdk-initialized-before-auth'
    );
  }
  updateProactiveRefresh() {
    this.internalListeners.size > 0
      ? this.auth._startProactiveRefresh()
      : this.auth._stopProactiveRefresh();
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function ud(n) {
  switch (n) {
    case 'Node':
      return 'node';
    case 'ReactNative':
      return 'rn';
    case 'Worker':
      return 'webworker';
    case 'Cordova':
      return 'cordova';
    case 'WebExtension':
      return 'web-extension';
    default:
      return;
  }
}
function dd(n) {
  (le(
    new se(
      'auth',
      (e, { options: i }) => {
        const r = e.getProvider('app').getImmediate(),
          o = e.getProvider('heartbeat'),
          c = e.getProvider('app-check-internal'),
          { apiKey: h, authDomain: p } = r.options;
        b(h && !h.includes(':'), 'invalid-api-key', { appName: r.name });
        const v = {
            apiKey: h,
            authDomain: p,
            clientPlatform: n,
            apiHost: 'identitytoolkit.googleapis.com',
            tokenApiHost: 'securetoken.googleapis.com',
            apiScheme: 'https',
            sdkClientVersion: Io(n),
          },
          T = new zh(r, o, c, v);
        return (Xh(T, i), T);
      },
      'PUBLIC'
    )
      .setInstantiationMode('EXPLICIT')
      .setInstanceCreatedCallback((e, i, r) => {
        e.getProvider('auth-internal').initialize();
      })
  ),
    le(
      new se(
        'auth-internal',
        e => {
          const i = Ei(e.getProvider('auth').getImmediate());
          return (r => new hd(r))(i);
        },
        'PRIVATE'
      ).setInstantiationMode('EXPLICIT')
    ),
    te(cs, ls, ud(n)),
    te(cs, ls, 'esm2017'));
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const fd = 5 * 60,
  pd = As('authIdTokenMaxAge') || fd;
let hs = null;
const gd = n => async e => {
  const i = e && (await e.getIdTokenResult()),
    r = i && (new Date().getTime() - Date.parse(i.issuedAtTime)) / 1e3;
  if (r && r > pd) return;
  const o = i?.token;
  hs !== o &&
    ((hs = o),
    await fetch(n, {
      method: o ? 'POST' : 'DELETE',
      headers: o ? { Authorization: `Bearer ${o}` } : {},
    }));
};
function md(n = ui()) {
  const e = ze(n, 'auth');
  if (e.isInitialized()) return e.getImmediate();
  const i = Jh(n, { popupRedirectResolver: ld, persistence: [Iu, cu, Ro] }),
    r = As('authTokenSyncURL');
  if (r && typeof isSecureContext == 'boolean' && isSecureContext) {
    const c = new URL(r, location.origin);
    if (location.origin === c.origin) {
      const h = gd(c.toString());
      (su(i, h, () => h(i.currentUser)), ru(i, p => h(p)));
    }
  }
  const o = Ts('auth');
  return (o && Yh(i, `http://${o}`), i);
}
function vd() {
  var n, e;
  return (e =
    (n = document.getElementsByTagName('head')) === null || n === void 0
      ? void 0
      : n[0]) !== null && e !== void 0
    ? e
    : document;
}
Gh({
  loadJS(n) {
    return new Promise((e, i) => {
      const r = document.createElement('script');
      (r.setAttribute('src', n),
        (r.onload = e),
        (r.onerror = o => {
          const c = ae('internal-error');
          ((c.customData = o), i(c));
        }),
        (r.type = 'text/javascript'),
        (r.charset = 'UTF-8'),
        vd().appendChild(r));
    });
  },
  gapiScript: 'https://apis.google.com/js/api.js',
  recaptchaV2Script: 'https://www.google.com/recaptcha/api.js',
  recaptchaEnterpriseScript:
    'https://www.google.com/recaptcha/enterprise.js?render=',
});
dd('Browser');
var us =
  typeof globalThis < 'u'
    ? globalThis
    : typeof window < 'u'
      ? window
      : typeof global < 'u'
        ? global
        : typeof self < 'u'
          ? self
          : {};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/ var Mo;
(function () {
  var n;
  /** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/ function e(y, u) {
    function f() {}
    ((f.prototype = u.prototype),
      (y.D = u.prototype),
      (y.prototype = new f()),
      (y.prototype.constructor = y),
      (y.C = function (g, m, I) {
        for (
          var d = Array(arguments.length - 2), ue = 2;
          ue < arguments.length;
          ue++
        )
          d[ue - 2] = arguments[ue];
        return u.prototype[m].apply(g, d);
      }));
  }
  function i() {
    this.blockSize = -1;
  }
  function r() {
    ((this.blockSize = -1),
      (this.blockSize = 64),
      (this.g = Array(4)),
      (this.B = Array(this.blockSize)),
      (this.o = this.h = 0),
      this.s());
  }
  (e(r, i),
    (r.prototype.s = function () {
      ((this.g[0] = 1732584193),
        (this.g[1] = 4023233417),
        (this.g[2] = 2562383102),
        (this.g[3] = 271733878),
        (this.o = this.h = 0));
    }));
  function o(y, u, f) {
    f || (f = 0);
    var g = Array(16);
    if (typeof u == 'string')
      for (var m = 0; 16 > m; ++m)
        g[m] =
          u.charCodeAt(f++) |
          (u.charCodeAt(f++) << 8) |
          (u.charCodeAt(f++) << 16) |
          (u.charCodeAt(f++) << 24);
    else
      for (m = 0; 16 > m; ++m)
        g[m] = u[f++] | (u[f++] << 8) | (u[f++] << 16) | (u[f++] << 24);
    ((u = y.g[0]), (f = y.g[1]), (m = y.g[2]));
    var I = y.g[3],
      d = (u + (I ^ (f & (m ^ I))) + g[0] + 3614090360) & 4294967295;
    ((u = f + (((d << 7) & 4294967295) | (d >>> 25))),
      (d = (I + (m ^ (u & (f ^ m))) + g[1] + 3905402710) & 4294967295),
      (I = u + (((d << 12) & 4294967295) | (d >>> 20))),
      (d = (m + (f ^ (I & (u ^ f))) + g[2] + 606105819) & 4294967295),
      (m = I + (((d << 17) & 4294967295) | (d >>> 15))),
      (d = (f + (u ^ (m & (I ^ u))) + g[3] + 3250441966) & 4294967295),
      (f = m + (((d << 22) & 4294967295) | (d >>> 10))),
      (d = (u + (I ^ (f & (m ^ I))) + g[4] + 4118548399) & 4294967295),
      (u = f + (((d << 7) & 4294967295) | (d >>> 25))),
      (d = (I + (m ^ (u & (f ^ m))) + g[5] + 1200080426) & 4294967295),
      (I = u + (((d << 12) & 4294967295) | (d >>> 20))),
      (d = (m + (f ^ (I & (u ^ f))) + g[6] + 2821735955) & 4294967295),
      (m = I + (((d << 17) & 4294967295) | (d >>> 15))),
      (d = (f + (u ^ (m & (I ^ u))) + g[7] + 4249261313) & 4294967295),
      (f = m + (((d << 22) & 4294967295) | (d >>> 10))),
      (d = (u + (I ^ (f & (m ^ I))) + g[8] + 1770035416) & 4294967295),
      (u = f + (((d << 7) & 4294967295) | (d >>> 25))),
      (d = (I + (m ^ (u & (f ^ m))) + g[9] + 2336552879) & 4294967295),
      (I = u + (((d << 12) & 4294967295) | (d >>> 20))),
      (d = (m + (f ^ (I & (u ^ f))) + g[10] + 4294925233) & 4294967295),
      (m = I + (((d << 17) & 4294967295) | (d >>> 15))),
      (d = (f + (u ^ (m & (I ^ u))) + g[11] + 2304563134) & 4294967295),
      (f = m + (((d << 22) & 4294967295) | (d >>> 10))),
      (d = (u + (I ^ (f & (m ^ I))) + g[12] + 1804603682) & 4294967295),
      (u = f + (((d << 7) & 4294967295) | (d >>> 25))),
      (d = (I + (m ^ (u & (f ^ m))) + g[13] + 4254626195) & 4294967295),
      (I = u + (((d << 12) & 4294967295) | (d >>> 20))),
      (d = (m + (f ^ (I & (u ^ f))) + g[14] + 2792965006) & 4294967295),
      (m = I + (((d << 17) & 4294967295) | (d >>> 15))),
      (d = (f + (u ^ (m & (I ^ u))) + g[15] + 1236535329) & 4294967295),
      (f = m + (((d << 22) & 4294967295) | (d >>> 10))),
      (d = (u + (m ^ (I & (f ^ m))) + g[1] + 4129170786) & 4294967295),
      (u = f + (((d << 5) & 4294967295) | (d >>> 27))),
      (d = (I + (f ^ (m & (u ^ f))) + g[6] + 3225465664) & 4294967295),
      (I = u + (((d << 9) & 4294967295) | (d >>> 23))),
      (d = (m + (u ^ (f & (I ^ u))) + g[11] + 643717713) & 4294967295),
      (m = I + (((d << 14) & 4294967295) | (d >>> 18))),
      (d = (f + (I ^ (u & (m ^ I))) + g[0] + 3921069994) & 4294967295),
      (f = m + (((d << 20) & 4294967295) | (d >>> 12))),
      (d = (u + (m ^ (I & (f ^ m))) + g[5] + 3593408605) & 4294967295),
      (u = f + (((d << 5) & 4294967295) | (d >>> 27))),
      (d = (I + (f ^ (m & (u ^ f))) + g[10] + 38016083) & 4294967295),
      (I = u + (((d << 9) & 4294967295) | (d >>> 23))),
      (d = (m + (u ^ (f & (I ^ u))) + g[15] + 3634488961) & 4294967295),
      (m = I + (((d << 14) & 4294967295) | (d >>> 18))),
      (d = (f + (I ^ (u & (m ^ I))) + g[4] + 3889429448) & 4294967295),
      (f = m + (((d << 20) & 4294967295) | (d >>> 12))),
      (d = (u + (m ^ (I & (f ^ m))) + g[9] + 568446438) & 4294967295),
      (u = f + (((d << 5) & 4294967295) | (d >>> 27))),
      (d = (I + (f ^ (m & (u ^ f))) + g[14] + 3275163606) & 4294967295),
      (I = u + (((d << 9) & 4294967295) | (d >>> 23))),
      (d = (m + (u ^ (f & (I ^ u))) + g[3] + 4107603335) & 4294967295),
      (m = I + (((d << 14) & 4294967295) | (d >>> 18))),
      (d = (f + (I ^ (u & (m ^ I))) + g[8] + 1163531501) & 4294967295),
      (f = m + (((d << 20) & 4294967295) | (d >>> 12))),
      (d = (u + (m ^ (I & (f ^ m))) + g[13] + 2850285829) & 4294967295),
      (u = f + (((d << 5) & 4294967295) | (d >>> 27))),
      (d = (I + (f ^ (m & (u ^ f))) + g[2] + 4243563512) & 4294967295),
      (I = u + (((d << 9) & 4294967295) | (d >>> 23))),
      (d = (m + (u ^ (f & (I ^ u))) + g[7] + 1735328473) & 4294967295),
      (m = I + (((d << 14) & 4294967295) | (d >>> 18))),
      (d = (f + (I ^ (u & (m ^ I))) + g[12] + 2368359562) & 4294967295),
      (f = m + (((d << 20) & 4294967295) | (d >>> 12))),
      (d = (u + (f ^ m ^ I) + g[5] + 4294588738) & 4294967295),
      (u = f + (((d << 4) & 4294967295) | (d >>> 28))),
      (d = (I + (u ^ f ^ m) + g[8] + 2272392833) & 4294967295),
      (I = u + (((d << 11) & 4294967295) | (d >>> 21))),
      (d = (m + (I ^ u ^ f) + g[11] + 1839030562) & 4294967295),
      (m = I + (((d << 16) & 4294967295) | (d >>> 16))),
      (d = (f + (m ^ I ^ u) + g[14] + 4259657740) & 4294967295),
      (f = m + (((d << 23) & 4294967295) | (d >>> 9))),
      (d = (u + (f ^ m ^ I) + g[1] + 2763975236) & 4294967295),
      (u = f + (((d << 4) & 4294967295) | (d >>> 28))),
      (d = (I + (u ^ f ^ m) + g[4] + 1272893353) & 4294967295),
      (I = u + (((d << 11) & 4294967295) | (d >>> 21))),
      (d = (m + (I ^ u ^ f) + g[7] + 4139469664) & 4294967295),
      (m = I + (((d << 16) & 4294967295) | (d >>> 16))),
      (d = (f + (m ^ I ^ u) + g[10] + 3200236656) & 4294967295),
      (f = m + (((d << 23) & 4294967295) | (d >>> 9))),
      (d = (u + (f ^ m ^ I) + g[13] + 681279174) & 4294967295),
      (u = f + (((d << 4) & 4294967295) | (d >>> 28))),
      (d = (I + (u ^ f ^ m) + g[0] + 3936430074) & 4294967295),
      (I = u + (((d << 11) & 4294967295) | (d >>> 21))),
      (d = (m + (I ^ u ^ f) + g[3] + 3572445317) & 4294967295),
      (m = I + (((d << 16) & 4294967295) | (d >>> 16))),
      (d = (f + (m ^ I ^ u) + g[6] + 76029189) & 4294967295),
      (f = m + (((d << 23) & 4294967295) | (d >>> 9))),
      (d = (u + (f ^ m ^ I) + g[9] + 3654602809) & 4294967295),
      (u = f + (((d << 4) & 4294967295) | (d >>> 28))),
      (d = (I + (u ^ f ^ m) + g[12] + 3873151461) & 4294967295),
      (I = u + (((d << 11) & 4294967295) | (d >>> 21))),
      (d = (m + (I ^ u ^ f) + g[15] + 530742520) & 4294967295),
      (m = I + (((d << 16) & 4294967295) | (d >>> 16))),
      (d = (f + (m ^ I ^ u) + g[2] + 3299628645) & 4294967295),
      (f = m + (((d << 23) & 4294967295) | (d >>> 9))),
      (d = (u + (m ^ (f | ~I)) + g[0] + 4096336452) & 4294967295),
      (u = f + (((d << 6) & 4294967295) | (d >>> 26))),
      (d = (I + (f ^ (u | ~m)) + g[7] + 1126891415) & 4294967295),
      (I = u + (((d << 10) & 4294967295) | (d >>> 22))),
      (d = (m + (u ^ (I | ~f)) + g[14] + 2878612391) & 4294967295),
      (m = I + (((d << 15) & 4294967295) | (d >>> 17))),
      (d = (f + (I ^ (m | ~u)) + g[5] + 4237533241) & 4294967295),
      (f = m + (((d << 21) & 4294967295) | (d >>> 11))),
      (d = (u + (m ^ (f | ~I)) + g[12] + 1700485571) & 4294967295),
      (u = f + (((d << 6) & 4294967295) | (d >>> 26))),
      (d = (I + (f ^ (u | ~m)) + g[3] + 2399980690) & 4294967295),
      (I = u + (((d << 10) & 4294967295) | (d >>> 22))),
      (d = (m + (u ^ (I | ~f)) + g[10] + 4293915773) & 4294967295),
      (m = I + (((d << 15) & 4294967295) | (d >>> 17))),
      (d = (f + (I ^ (m | ~u)) + g[1] + 2240044497) & 4294967295),
      (f = m + (((d << 21) & 4294967295) | (d >>> 11))),
      (d = (u + (m ^ (f | ~I)) + g[8] + 1873313359) & 4294967295),
      (u = f + (((d << 6) & 4294967295) | (d >>> 26))),
      (d = (I + (f ^ (u | ~m)) + g[15] + 4264355552) & 4294967295),
      (I = u + (((d << 10) & 4294967295) | (d >>> 22))),
      (d = (m + (u ^ (I | ~f)) + g[6] + 2734768916) & 4294967295),
      (m = I + (((d << 15) & 4294967295) | (d >>> 17))),
      (d = (f + (I ^ (m | ~u)) + g[13] + 1309151649) & 4294967295),
      (f = m + (((d << 21) & 4294967295) | (d >>> 11))),
      (d = (u + (m ^ (f | ~I)) + g[4] + 4149444226) & 4294967295),
      (u = f + (((d << 6) & 4294967295) | (d >>> 26))),
      (d = (I + (f ^ (u | ~m)) + g[11] + 3174756917) & 4294967295),
      (I = u + (((d << 10) & 4294967295) | (d >>> 22))),
      (d = (m + (u ^ (I | ~f)) + g[2] + 718787259) & 4294967295),
      (m = I + (((d << 15) & 4294967295) | (d >>> 17))),
      (d = (f + (I ^ (m | ~u)) + g[9] + 3951481745) & 4294967295),
      (y.g[0] = (y.g[0] + u) & 4294967295),
      (y.g[1] =
        (y.g[1] + (m + (((d << 21) & 4294967295) | (d >>> 11)))) & 4294967295),
      (y.g[2] = (y.g[2] + m) & 4294967295),
      (y.g[3] = (y.g[3] + I) & 4294967295));
  }
  ((r.prototype.u = function (y, u) {
    u === void 0 && (u = y.length);
    for (var f = u - this.blockSize, g = this.B, m = this.h, I = 0; I < u; ) {
      if (m == 0) for (; I <= f; ) (o(this, y, I), (I += this.blockSize));
      if (typeof y == 'string') {
        for (; I < u; )
          if (((g[m++] = y.charCodeAt(I++)), m == this.blockSize)) {
            (o(this, g), (m = 0));
            break;
          }
      } else
        for (; I < u; )
          if (((g[m++] = y[I++]), m == this.blockSize)) {
            (o(this, g), (m = 0));
            break;
          }
    }
    ((this.h = m), (this.o += u));
  }),
    (r.prototype.v = function () {
      var y = Array(
        (56 > this.h ? this.blockSize : 2 * this.blockSize) - this.h
      );
      y[0] = 128;
      for (var u = 1; u < y.length - 8; ++u) y[u] = 0;
      var f = 8 * this.o;
      for (u = y.length - 8; u < y.length; ++u) ((y[u] = f & 255), (f /= 256));
      for (this.u(y), y = Array(16), u = f = 0; 4 > u; ++u)
        for (var g = 0; 32 > g; g += 8) y[f++] = (this.g[u] >>> g) & 255;
      return y;
    }));
  function c(y, u) {
    var f = p;
    return Object.prototype.hasOwnProperty.call(f, y) ? f[y] : (f[y] = u(y));
  }
  function h(y, u) {
    this.h = u;
    for (var f = [], g = !0, m = y.length - 1; 0 <= m; m--) {
      var I = y[m] | 0;
      (g && I == u) || ((f[m] = I), (g = !1));
    }
    this.g = f;
  }
  var p = {};
  function v(y) {
    return -128 <= y && 128 > y
      ? c(y, function (u) {
          return new h([u | 0], 0 > u ? -1 : 0);
        })
      : new h([y | 0], 0 > y ? -1 : 0);
  }
  function T(y) {
    if (isNaN(y) || !isFinite(y)) return S;
    if (0 > y) return M(T(-y));
    for (var u = [], f = 1, g = 0; y >= f; g++)
      ((u[g] = (y / f) | 0), (f *= 4294967296));
    return new h(u, 0);
  }
  function A(y, u) {
    if (y.length == 0) throw Error('number format error: empty string');
    if (((u = u || 10), 2 > u || 36 < u))
      throw Error('radix out of range: ' + u);
    if (y.charAt(0) == '-') return M(A(y.substring(1), u));
    if (0 <= y.indexOf('-'))
      throw Error('number format error: interior "-" character');
    for (var f = T(Math.pow(u, 8)), g = S, m = 0; m < y.length; m += 8) {
      var I = Math.min(8, y.length - m),
        d = parseInt(y.substring(m, m + I), u);
      8 > I
        ? ((I = T(Math.pow(u, I))), (g = g.j(I).add(T(d))))
        : ((g = g.j(f)), (g = g.add(T(d))));
    }
    return g;
  }
  var S = v(0),
    k = v(1),
    N = v(16777216);
  ((n = h.prototype),
    (n.m = function () {
      if (x(this)) return -M(this).m();
      for (var y = 0, u = 1, f = 0; f < this.g.length; f++) {
        var g = this.i(f);
        ((y += (0 <= g ? g : 4294967296 + g) * u), (u *= 4294967296));
      }
      return y;
    }),
    (n.toString = function (y) {
      if (((y = y || 10), 2 > y || 36 < y))
        throw Error('radix out of range: ' + y);
      if (C(this)) return '0';
      if (x(this)) return '-' + M(this).toString(y);
      for (var u = T(Math.pow(y, 6)), f = this, g = ''; ; ) {
        var m = ne(f, u).g;
        f = he(f, m.j(u));
        var I = ((0 < f.g.length ? f.g[0] : f.h) >>> 0).toString(y);
        if (((f = m), C(f))) return I + g;
        for (; 6 > I.length; ) I = '0' + I;
        g = I + g;
      }
    }),
    (n.i = function (y) {
      return 0 > y ? 0 : y < this.g.length ? this.g[y] : this.h;
    }));
  function C(y) {
    if (y.h != 0) return !1;
    for (var u = 0; u < y.g.length; u++) if (y.g[u] != 0) return !1;
    return !0;
  }
  function x(y) {
    return y.h == -1;
  }
  n.l = function (y) {
    return ((y = he(this, y)), x(y) ? -1 : C(y) ? 0 : 1);
  };
  function M(y) {
    for (var u = y.g.length, f = [], g = 0; g < u; g++) f[g] = ~y.g[g];
    return new h(f, ~y.h).add(k);
  }
  ((n.abs = function () {
    return x(this) ? M(this) : this;
  }),
    (n.add = function (y) {
      for (
        var u = Math.max(this.g.length, y.g.length), f = [], g = 0, m = 0;
        m <= u;
        m++
      ) {
        var I = g + (this.i(m) & 65535) + (y.i(m) & 65535),
          d = (I >>> 16) + (this.i(m) >>> 16) + (y.i(m) >>> 16);
        ((g = d >>> 16), (I &= 65535), (d &= 65535), (f[m] = (d << 16) | I));
      }
      return new h(f, f[f.length - 1] & -2147483648 ? -1 : 0);
    }));
  function he(y, u) {
    return y.add(M(u));
  }
  n.j = function (y) {
    if (C(this) || C(y)) return S;
    if (x(this)) return x(y) ? M(this).j(M(y)) : M(M(this).j(y));
    if (x(y)) return M(this.j(M(y)));
    if (0 > this.l(N) && 0 > y.l(N)) return T(this.m() * y.m());
    for (var u = this.g.length + y.g.length, f = [], g = 0; g < 2 * u; g++)
      f[g] = 0;
    for (g = 0; g < this.g.length; g++)
      for (var m = 0; m < y.g.length; m++) {
        var I = this.i(g) >>> 16,
          d = this.i(g) & 65535,
          ue = y.i(m) >>> 16,
          rt = y.i(m) & 65535;
        ((f[2 * g + 2 * m] += d * rt),
          Q(f, 2 * g + 2 * m),
          (f[2 * g + 2 * m + 1] += I * rt),
          Q(f, 2 * g + 2 * m + 1),
          (f[2 * g + 2 * m + 1] += d * ue),
          Q(f, 2 * g + 2 * m + 1),
          (f[2 * g + 2 * m + 2] += I * ue),
          Q(f, 2 * g + 2 * m + 2));
      }
    for (g = 0; g < u; g++) f[g] = (f[2 * g + 1] << 16) | f[2 * g];
    for (g = u; g < 2 * u; g++) f[g] = 0;
    return new h(f, 0);
  };
  function Q(y, u) {
    for (; (y[u] & 65535) != y[u]; )
      ((y[u + 1] += y[u] >>> 16), (y[u] &= 65535), u++);
  }
  function j(y, u) {
    ((this.g = y), (this.h = u));
  }
  function ne(y, u) {
    if (C(u)) throw Error('division by zero');
    if (C(y)) return new j(S, S);
    if (x(y)) return ((u = ne(M(y), u)), new j(M(u.g), M(u.h)));
    if (x(u)) return ((u = ne(y, M(u))), new j(M(u.g), u.h));
    if (30 < y.g.length) {
      if (x(y) || x(u))
        throw Error('slowDivide_ only works with positive integers.');
      for (var f = k, g = u; 0 >= g.l(y); ) ((f = Ne(f)), (g = Ne(g)));
      var m = K(f, 1),
        I = K(g, 1);
      for (g = K(g, 2), f = K(f, 2); !C(g); ) {
        var d = I.add(g);
        (0 >= d.l(y) && ((m = m.add(f)), (I = d)),
          (g = K(g, 1)),
          (f = K(f, 1)));
      }
      return ((u = he(y, m.j(u))), new j(m, u));
    }
    for (m = S; 0 <= y.l(u); ) {
      for (
        f = Math.max(1, Math.floor(y.m() / u.m())),
          g = Math.ceil(Math.log(f) / Math.LN2),
          g = 48 >= g ? 1 : Math.pow(2, g - 48),
          I = T(f),
          d = I.j(u);
        x(d) || 0 < d.l(y);

      )
        ((f -= g), (I = T(f)), (d = I.j(u)));
      (C(I) && (I = k), (m = m.add(I)), (y = he(y, d)));
    }
    return new j(m, y);
  }
  ((n.A = function (y) {
    return ne(this, y).h;
  }),
    (n.and = function (y) {
      for (
        var u = Math.max(this.g.length, y.g.length), f = [], g = 0;
        g < u;
        g++
      )
        f[g] = this.i(g) & y.i(g);
      return new h(f, this.h & y.h);
    }),
    (n.or = function (y) {
      for (
        var u = Math.max(this.g.length, y.g.length), f = [], g = 0;
        g < u;
        g++
      )
        f[g] = this.i(g) | y.i(g);
      return new h(f, this.h | y.h);
    }),
    (n.xor = function (y) {
      for (
        var u = Math.max(this.g.length, y.g.length), f = [], g = 0;
        g < u;
        g++
      )
        f[g] = this.i(g) ^ y.i(g);
      return new h(f, this.h ^ y.h);
    }));
  function Ne(y) {
    for (var u = y.g.length + 1, f = [], g = 0; g < u; g++)
      f[g] = (y.i(g) << 1) | (y.i(g - 1) >>> 31);
    return new h(f, y.h);
  }
  function K(y, u) {
    var f = u >> 5;
    u %= 32;
    for (var g = y.g.length - f, m = [], I = 0; I < g; I++)
      m[I] =
        0 < u ? (y.i(I + f) >>> u) | (y.i(I + f + 1) << (32 - u)) : y.i(I + f);
    return new h(m, y.h);
  }
  ((r.prototype.digest = r.prototype.v),
    (r.prototype.reset = r.prototype.s),
    (r.prototype.update = r.prototype.u),
    (h.prototype.add = h.prototype.add),
    (h.prototype.multiply = h.prototype.j),
    (h.prototype.modulo = h.prototype.A),
    (h.prototype.compare = h.prototype.l),
    (h.prototype.toNumber = h.prototype.m),
    (h.prototype.toString = h.prototype.toString),
    (h.prototype.getBits = h.prototype.i),
    (h.fromNumber = T),
    (h.fromString = A),
    (Mo = h));
}).apply(
  typeof us < 'u'
    ? us
    : typeof self < 'u'
      ? self
      : typeof window < 'u'
        ? window
        : {}
);
var Xt =
  typeof globalThis < 'u'
    ? globalThis
    : typeof window < 'u'
      ? window
      : typeof global < 'u'
        ? global
        : typeof self < 'u'
          ? self
          : {};
(function () {
  var n,
    e =
      typeof Object.defineProperties == 'function'
        ? Object.defineProperty
        : function (t, s, a) {
            return (
              t == Array.prototype || t == Object.prototype || (t[s] = a.value),
              t
            );
          };
  function i(t) {
    t = [
      typeof globalThis == 'object' && globalThis,
      t,
      typeof window == 'object' && window,
      typeof self == 'object' && self,
      typeof Xt == 'object' && Xt,
    ];
    for (var s = 0; s < t.length; ++s) {
      var a = t[s];
      if (a && a.Math == Math) return a;
    }
    throw Error('Cannot find global object');
  }
  var r = i(this);
  function o(t, s) {
    if (s)
      e: {
        var a = r;
        t = t.split('.');
        for (var l = 0; l < t.length - 1; l++) {
          var _ = t[l];
          if (!(_ in a)) break e;
          a = a[_];
        }
        ((t = t[t.length - 1]),
          (l = a[t]),
          (s = s(l)),
          s != l &&
            s != null &&
            e(a, t, { configurable: !0, writable: !0, value: s }));
      }
  }
  function c(t, s) {
    t instanceof String && (t += '');
    var a = 0,
      l = !1,
      _ = {
        next: function () {
          if (!l && a < t.length) {
            var w = a++;
            return { value: s(w, t[w]), done: !1 };
          }
          return ((l = !0), { done: !0, value: void 0 });
        },
      };
    return (
      (_[Symbol.iterator] = function () {
        return _;
      }),
      _
    );
  }
  o('Array.prototype.values', function (t) {
    return (
      t ||
      function () {
        return c(this, function (s, a) {
          return a;
        });
      }
    );
  });
  /** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/ var h = h || {},
    p = this || self;
  function v(t) {
    var s = typeof t;
    return (
      (s = s != 'object' ? s : t ? (Array.isArray(t) ? 'array' : s) : 'null'),
      s == 'array' || (s == 'object' && typeof t.length == 'number')
    );
  }
  function T(t) {
    var s = typeof t;
    return (s == 'object' && t != null) || s == 'function';
  }
  function A(t, s, a) {
    return t.call.apply(t.bind, arguments);
  }
  function S(t, s, a) {
    if (!t) throw Error();
    if (2 < arguments.length) {
      var l = Array.prototype.slice.call(arguments, 2);
      return function () {
        var _ = Array.prototype.slice.call(arguments);
        return (Array.prototype.unshift.apply(_, l), t.apply(s, _));
      };
    }
    return function () {
      return t.apply(s, arguments);
    };
  }
  function k(t, s, a) {
    return (
      (k =
        Function.prototype.bind &&
        Function.prototype.bind.toString().indexOf('native code') != -1
          ? A
          : S),
      k.apply(null, arguments)
    );
  }
  function N(t, s) {
    var a = Array.prototype.slice.call(arguments, 1);
    return function () {
      var l = a.slice();
      return (l.push.apply(l, arguments), t.apply(this, l));
    };
  }
  function C(t, s) {
    function a() {}
    ((a.prototype = s.prototype),
      (t.aa = s.prototype),
      (t.prototype = new a()),
      (t.prototype.constructor = t),
      (t.Qb = function (l, _, w) {
        for (
          var E = Array(arguments.length - 2), D = 2;
          D < arguments.length;
          D++
        )
          E[D - 2] = arguments[D];
        return s.prototype[_].apply(l, E);
      }));
  }
  function x(t) {
    const s = t.length;
    if (0 < s) {
      const a = Array(s);
      for (let l = 0; l < s; l++) a[l] = t[l];
      return a;
    }
    return [];
  }
  function M(t, s) {
    for (let a = 1; a < arguments.length; a++) {
      const l = arguments[a];
      if (v(l)) {
        const _ = t.length || 0,
          w = l.length || 0;
        t.length = _ + w;
        for (let E = 0; E < w; E++) t[_ + E] = l[E];
      } else t.push(l);
    }
  }
  class he {
    constructor(s, a) {
      ((this.i = s), (this.j = a), (this.h = 0), (this.g = null));
    }
    get() {
      let s;
      return (
        0 < this.h
          ? (this.h--, (s = this.g), (this.g = s.next), (s.next = null))
          : (s = this.i()),
        s
      );
    }
  }
  function Q(t) {
    return /^[\s\xa0]*$/.test(t);
  }
  function j() {
    var t = p.navigator;
    return t && (t = t.userAgent) ? t : '';
  }
  function ne(t) {
    return (ne[' '](t), t);
  }
  ne[' '] = function () {};
  var Ne =
    j().indexOf('Gecko') != -1 &&
    !(j().toLowerCase().indexOf('webkit') != -1 && j().indexOf('Edge') == -1) &&
    !(j().indexOf('Trident') != -1 || j().indexOf('MSIE') != -1) &&
    j().indexOf('Edge') == -1;
  function K(t, s, a) {
    for (const l in t) s.call(a, t[l], l, t);
  }
  function y(t, s) {
    for (const a in t) s.call(void 0, t[a], a, t);
  }
  function u(t) {
    const s = {};
    for (const a in t) s[a] = t[a];
    return s;
  }
  const f =
    'constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf'.split(
      ' '
    );
  function g(t, s) {
    let a, l;
    for (let _ = 1; _ < arguments.length; _++) {
      l = arguments[_];
      for (a in l) t[a] = l[a];
      for (let w = 0; w < f.length; w++)
        ((a = f[w]),
          Object.prototype.hasOwnProperty.call(l, a) && (t[a] = l[a]));
    }
  }
  function m(t) {
    var s = 1;
    t = t.split(':');
    const a = [];
    for (; 0 < s && t.length; ) (a.push(t.shift()), s--);
    return (t.length && a.push(t.join(':')), a);
  }
  function I(t) {
    p.setTimeout(() => {
      throw t;
    }, 0);
  }
  function d() {
    var t = vn;
    let s = null;
    return (
      t.g &&
        ((s = t.g), (t.g = t.g.next), t.g || (t.h = null), (s.next = null)),
      s
    );
  }
  class ue {
    constructor() {
      this.h = this.g = null;
    }
    add(s, a) {
      const l = rt.get();
      (l.set(s, a), this.h ? (this.h.next = l) : (this.g = l), (this.h = l));
    }
  }
  var rt = new he(
    () => new jo(),
    t => t.reset()
  );
  class jo {
    constructor() {
      this.next = this.g = this.h = null;
    }
    set(s, a) {
      ((this.h = s), (this.g = a), (this.next = null));
    }
    reset() {
      this.next = this.g = this.h = null;
    }
  }
  let st,
    ot = !1,
    vn = new ue(),
    Oi = () => {
      const t = p.Promise.resolve(void 0);
      st = () => {
        t.then(Bo);
      };
    };
  var Bo = () => {
    for (var t; (t = d()); ) {
      try {
        t.h.call(t.g);
      } catch (a) {
        I(a);
      }
      var s = rt;
      (s.j(t), 100 > s.h && (s.h++, (t.next = s.g), (s.g = t)));
    }
    ot = !1;
  };
  function Ie() {
    ((this.s = this.s), (this.C = this.C));
  }
  ((Ie.prototype.s = !1),
    (Ie.prototype.ma = function () {
      this.s || ((this.s = !0), this.N());
    }),
    (Ie.prototype.N = function () {
      if (this.C) for (; this.C.length; ) this.C.shift()();
    }));
  function B(t, s) {
    ((this.type = t), (this.g = this.target = s), (this.defaultPrevented = !1));
  }
  B.prototype.h = function () {
    this.defaultPrevented = !0;
  };
  var $o = (function () {
    if (!p.addEventListener || !Object.defineProperty) return !1;
    var t = !1,
      s = Object.defineProperty({}, 'passive', {
        get: function () {
          t = !0;
        },
      });
    try {
      const a = () => {};
      (p.addEventListener('test', a, s), p.removeEventListener('test', a, s));
    } catch {}
    return t;
  })();
  function at(t, s) {
    if (
      (B.call(this, t ? t.type : ''),
      (this.relatedTarget = this.g = this.target = null),
      (this.button =
        this.screenY =
        this.screenX =
        this.clientY =
        this.clientX =
          0),
      (this.key = ''),
      (this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1),
      (this.state = null),
      (this.pointerId = 0),
      (this.pointerType = ''),
      (this.i = null),
      t)
    ) {
      var a = (this.type = t.type),
        l =
          t.changedTouches && t.changedTouches.length
            ? t.changedTouches[0]
            : null;
      if (
        ((this.target = t.target || t.srcElement),
        (this.g = s),
        (s = t.relatedTarget))
      ) {
        if (Ne) {
          e: {
            try {
              ne(s.nodeName);
              var _ = !0;
              break e;
            } catch {}
            _ = !1;
          }
          _ || (s = null);
        }
      } else
        a == 'mouseover'
          ? (s = t.fromElement)
          : a == 'mouseout' && (s = t.toElement);
      ((this.relatedTarget = s),
        l
          ? ((this.clientX = l.clientX !== void 0 ? l.clientX : l.pageX),
            (this.clientY = l.clientY !== void 0 ? l.clientY : l.pageY),
            (this.screenX = l.screenX || 0),
            (this.screenY = l.screenY || 0))
          : ((this.clientX = t.clientX !== void 0 ? t.clientX : t.pageX),
            (this.clientY = t.clientY !== void 0 ? t.clientY : t.pageY),
            (this.screenX = t.screenX || 0),
            (this.screenY = t.screenY || 0)),
        (this.button = t.button),
        (this.key = t.key || ''),
        (this.ctrlKey = t.ctrlKey),
        (this.altKey = t.altKey),
        (this.shiftKey = t.shiftKey),
        (this.metaKey = t.metaKey),
        (this.pointerId = t.pointerId || 0),
        (this.pointerType =
          typeof t.pointerType == 'string'
            ? t.pointerType
            : Vo[t.pointerType] || ''),
        (this.state = t.state),
        (this.i = t),
        t.defaultPrevented && at.aa.h.call(this));
    }
  }
  C(at, B);
  var Vo = { 2: 'touch', 3: 'pen', 4: 'mouse' };
  at.prototype.h = function () {
    at.aa.h.call(this);
    var t = this.i;
    t.preventDefault ? t.preventDefault() : (t.returnValue = !1);
  };
  var Nt = 'closure_listenable_' + ((1e6 * Math.random()) | 0),
    Ho = 0;
  function zo(t, s, a, l, _) {
    ((this.listener = t),
      (this.proxy = null),
      (this.src = s),
      (this.type = a),
      (this.capture = !!l),
      (this.ha = _),
      (this.key = ++Ho),
      (this.da = this.fa = !1));
  }
  function Lt(t) {
    ((t.da = !0),
      (t.listener = null),
      (t.proxy = null),
      (t.src = null),
      (t.ha = null));
  }
  function Mt(t) {
    ((this.src = t), (this.g = {}), (this.h = 0));
  }
  Mt.prototype.add = function (t, s, a, l, _) {
    var w = t.toString();
    ((t = this.g[w]), t || ((t = this.g[w] = []), this.h++));
    var E = _n(t, s, l, _);
    return (
      -1 < E
        ? ((s = t[E]), a || (s.fa = !1))
        : ((s = new zo(s, this.src, w, !!l, _)), (s.fa = a), t.push(s)),
      s
    );
  };
  function yn(t, s) {
    var a = s.type;
    if (a in t.g) {
      var l = t.g[a],
        _ = Array.prototype.indexOf.call(l, s, void 0),
        w;
      ((w = 0 <= _) && Array.prototype.splice.call(l, _, 1),
        w && (Lt(s), t.g[a].length == 0 && (delete t.g[a], t.h--)));
    }
  }
  function _n(t, s, a, l) {
    for (var _ = 0; _ < t.length; ++_) {
      var w = t[_];
      if (!w.da && w.listener == s && w.capture == !!a && w.ha == l) return _;
    }
    return -1;
  }
  var In = 'closure_lm_' + ((1e6 * Math.random()) | 0),
    wn = {};
  function Di(t, s, a, l, _) {
    if (Array.isArray(s)) {
      for (var w = 0; w < s.length; w++) Di(t, s[w], a, l, _);
      return null;
    }
    return (
      (a = Mi(a)),
      t && t[Nt] ? t.K(s, a, T(l) ? !!l.capture : !1, _) : Go(t, s, a, !1, l, _)
    );
  }
  function Go(t, s, a, l, _, w) {
    if (!s) throw Error('Invalid event type');
    var E = T(_) ? !!_.capture : !!_,
      D = En(t);
    if ((D || (t[In] = D = new Mt(t)), (a = D.add(s, a, l, E, w)), a.proxy))
      return a;
    if (
      ((l = Wo()),
      (a.proxy = l),
      (l.src = t),
      (l.listener = a),
      t.addEventListener)
    )
      ($o || (_ = E),
        _ === void 0 && (_ = !1),
        t.addEventListener(s.toString(), l, _));
    else if (t.attachEvent) t.attachEvent(Li(s.toString()), l);
    else if (t.addListener && t.removeListener) t.addListener(l);
    else throw Error('addEventListener and attachEvent are unavailable.');
    return a;
  }
  function Wo() {
    function t(a) {
      return s.call(t.src, t.listener, a);
    }
    const s = qo;
    return t;
  }
  function Ni(t, s, a, l, _) {
    if (Array.isArray(s))
      for (var w = 0; w < s.length; w++) Ni(t, s[w], a, l, _);
    else
      ((l = T(l) ? !!l.capture : !!l),
        (a = Mi(a)),
        t && t[Nt]
          ? ((t = t.i),
            (s = String(s).toString()),
            s in t.g &&
              ((w = t.g[s]),
              (a = _n(w, a, l, _)),
              -1 < a &&
                (Lt(w[a]),
                Array.prototype.splice.call(w, a, 1),
                w.length == 0 && (delete t.g[s], t.h--))))
          : t &&
            (t = En(t)) &&
            ((s = t.g[s.toString()]),
            (t = -1),
            s && (t = _n(s, a, l, _)),
            (a = -1 < t ? s[t] : null) && Tn(a)));
  }
  function Tn(t) {
    if (typeof t != 'number' && t && !t.da) {
      var s = t.src;
      if (s && s[Nt]) yn(s.i, t);
      else {
        var a = t.type,
          l = t.proxy;
        (s.removeEventListener
          ? s.removeEventListener(a, l, t.capture)
          : s.detachEvent
            ? s.detachEvent(Li(a), l)
            : s.addListener && s.removeListener && s.removeListener(l),
          (a = En(s))
            ? (yn(a, t), a.h == 0 && ((a.src = null), (s[In] = null)))
            : Lt(t));
      }
    }
  }
  function Li(t) {
    return t in wn ? wn[t] : (wn[t] = 'on' + t);
  }
  function qo(t, s) {
    if (t.da) t = !0;
    else {
      s = new at(s, this);
      var a = t.listener,
        l = t.ha || t.src;
      (t.fa && Tn(t), (t = a.call(l, s)));
    }
    return t;
  }
  function En(t) {
    return ((t = t[In]), t instanceof Mt ? t : null);
  }
  var An = '__closure_events_fn_' + ((1e9 * Math.random()) >>> 0);
  function Mi(t) {
    return typeof t == 'function'
      ? t
      : (t[An] ||
          (t[An] = function (s) {
            return t.handleEvent(s);
          }),
        t[An]);
  }
  function $() {
    (Ie.call(this), (this.i = new Mt(this)), (this.M = this), (this.F = null));
  }
  (C($, Ie),
    ($.prototype[Nt] = !0),
    ($.prototype.removeEventListener = function (t, s, a, l) {
      Ni(this, t, s, a, l);
    }));
  function z(t, s) {
    var a,
      l = t.F;
    if (l) for (a = []; l; l = l.F) a.push(l);
    if (((t = t.M), (l = s.type || s), typeof s == 'string')) s = new B(s, t);
    else if (s instanceof B) s.target = s.target || t;
    else {
      var _ = s;
      ((s = new B(l, t)), g(s, _));
    }
    if (((_ = !0), a))
      for (var w = a.length - 1; 0 <= w; w--) {
        var E = (s.g = a[w]);
        _ = Ut(E, l, !0, s) && _;
      }
    if (
      ((E = s.g = t), (_ = Ut(E, l, !0, s) && _), (_ = Ut(E, l, !1, s) && _), a)
    )
      for (w = 0; w < a.length; w++)
        ((E = s.g = a[w]), (_ = Ut(E, l, !1, s) && _));
  }
  (($.prototype.N = function () {
    if (($.aa.N.call(this), this.i)) {
      var t = this.i,
        s;
      for (s in t.g) {
        for (var a = t.g[s], l = 0; l < a.length; l++) Lt(a[l]);
        (delete t.g[s], t.h--);
      }
    }
    this.F = null;
  }),
    ($.prototype.K = function (t, s, a, l) {
      return this.i.add(String(t), s, !1, a, l);
    }),
    ($.prototype.L = function (t, s, a, l) {
      return this.i.add(String(t), s, !0, a, l);
    }));
  function Ut(t, s, a, l) {
    if (((s = t.i.g[String(s)]), !s)) return !0;
    s = s.concat();
    for (var _ = !0, w = 0; w < s.length; ++w) {
      var E = s[w];
      if (E && !E.da && E.capture == a) {
        var D = E.listener,
          F = E.ha || E.src;
        (E.fa && yn(t.i, E), (_ = D.call(F, l) !== !1 && _));
      }
    }
    return _ && !l.defaultPrevented;
  }
  function Ui(t, s, a) {
    if (typeof t == 'function') a && (t = k(t, a));
    else if (t && typeof t.handleEvent == 'function') t = k(t.handleEvent, t);
    else throw Error('Invalid listener argument');
    return 2147483647 < Number(s) ? -1 : p.setTimeout(t, s || 0);
  }
  function xi(t) {
    t.g = Ui(() => {
      ((t.g = null), t.i && ((t.i = !1), xi(t)));
    }, t.l);
    const s = t.h;
    ((t.h = null), t.m.apply(null, s));
  }
  class Ko extends Ie {
    constructor(s, a) {
      (super(),
        (this.m = s),
        (this.l = a),
        (this.h = null),
        (this.i = !1),
        (this.g = null));
    }
    j(s) {
      ((this.h = arguments), this.g ? (this.i = !0) : xi(this));
    }
    N() {
      (super.N(),
        this.g &&
          (p.clearTimeout(this.g),
          (this.g = null),
          (this.i = !1),
          (this.h = null)));
    }
  }
  function ct(t) {
    (Ie.call(this), (this.h = t), (this.g = {}));
  }
  C(ct, Ie);
  var Fi = [];
  function ji(t) {
    (K(
      t.g,
      function (s, a) {
        this.g.hasOwnProperty(a) && Tn(s);
      },
      t
    ),
      (t.g = {}));
  }
  ((ct.prototype.N = function () {
    (ct.aa.N.call(this), ji(this));
  }),
    (ct.prototype.handleEvent = function () {
      throw Error('EventHandler.handleEvent not implemented');
    }));
  var bn = p.JSON.stringify,
    Jo = p.JSON.parse,
    Xo = class {
      stringify(t) {
        return p.JSON.stringify(t, void 0);
      }
      parse(t) {
        return p.JSON.parse(t, void 0);
      }
    };
  function Sn() {}
  Sn.prototype.h = null;
  function Bi(t) {
    return t.h || (t.h = t.i());
  }
  function Yo() {}
  var lt = { OPEN: 'a', kb: 'b', Ja: 'c', wb: 'd' };
  function kn() {
    B.call(this, 'd');
  }
  C(kn, B);
  function Rn() {
    B.call(this, 'c');
  }
  C(Rn, B);
  var Ge = {},
    $i = null;
  function Cn() {
    return ($i = $i || new $());
  }
  Ge.La = 'serverreachability';
  function Vi(t) {
    B.call(this, Ge.La, t);
  }
  C(Vi, B);
  function ht(t) {
    const s = Cn();
    z(s, new Vi(s));
  }
  Ge.STAT_EVENT = 'statevent';
  function Hi(t, s) {
    (B.call(this, Ge.STAT_EVENT, t), (this.stat = s));
  }
  C(Hi, B);
  function G(t) {
    const s = Cn();
    z(s, new Hi(s, t));
  }
  Ge.Ma = 'timingevent';
  function zi(t, s) {
    (B.call(this, Ge.Ma, t), (this.size = s));
  }
  C(zi, B);
  function ut(t, s) {
    if (typeof t != 'function')
      throw Error('Fn must not be null and must be a function');
    return p.setTimeout(function () {
      t();
    }, s);
  }
  function dt() {
    this.g = !0;
  }
  dt.prototype.xa = function () {
    this.g = !1;
  };
  function Qo(t, s, a, l, _, w) {
    t.info(function () {
      if (t.g)
        if (w)
          for (var E = '', D = w.split('&'), F = 0; F < D.length; F++) {
            var P = D[F].split('=');
            if (1 < P.length) {
              var V = P[0];
              P = P[1];
              var H = V.split('_');
              E =
                2 <= H.length && H[1] == 'type'
                  ? E + (V + '=' + P + '&')
                  : E + (V + '=redacted&');
            }
          }
        else E = null;
      else E = w;
      return (
        'XMLHTTP REQ (' +
        l +
        ') [attempt ' +
        _ +
        ']: ' +
        s +
        `
` +
        a +
        `
` +
        E
      );
    });
  }
  function Zo(t, s, a, l, _, w, E) {
    t.info(function () {
      return (
        'XMLHTTP RESP (' +
        l +
        ') [ attempt ' +
        _ +
        ']: ' +
        s +
        `
` +
        a +
        `
` +
        w +
        ' ' +
        E
      );
    });
  }
  function We(t, s, a, l) {
    t.info(function () {
      return 'XMLHTTP TEXT (' + s + '): ' + ta(t, a) + (l ? ' ' + l : '');
    });
  }
  function ea(t, s) {
    t.info(function () {
      return 'TIMEOUT: ' + s;
    });
  }
  dt.prototype.info = function () {};
  function ta(t, s) {
    if (!t.g) return s;
    if (!s) return null;
    try {
      var a = JSON.parse(s);
      if (a) {
        for (t = 0; t < a.length; t++)
          if (Array.isArray(a[t])) {
            var l = a[t];
            if (!(2 > l.length)) {
              var _ = l[1];
              if (Array.isArray(_) && !(1 > _.length)) {
                var w = _[0];
                if (w != 'noop' && w != 'stop' && w != 'close')
                  for (var E = 1; E < _.length; E++) _[E] = '';
              }
            }
          }
      }
      return bn(a);
    } catch {
      return s;
    }
  }
  var Pn = { NO_ERROR: 0, TIMEOUT: 8 },
    na = {},
    On;
  function xt() {}
  (C(xt, Sn),
    (xt.prototype.g = function () {
      return new XMLHttpRequest();
    }),
    (xt.prototype.i = function () {
      return {};
    }),
    (On = new xt()));
  function we(t, s, a, l) {
    ((this.j = t),
      (this.i = s),
      (this.l = a),
      (this.R = l || 1),
      (this.U = new ct(this)),
      (this.I = 45e3),
      (this.H = null),
      (this.o = !1),
      (this.m = this.A = this.v = this.L = this.F = this.S = this.B = null),
      (this.D = []),
      (this.g = null),
      (this.C = 0),
      (this.s = this.u = null),
      (this.X = -1),
      (this.J = !1),
      (this.O = 0),
      (this.M = null),
      (this.W = this.K = this.T = this.P = !1),
      (this.h = new Gi()));
  }
  function Gi() {
    ((this.i = null), (this.g = ''), (this.h = !1));
  }
  var Wi = {},
    Dn = {};
  function Nn(t, s, a) {
    ((t.L = 1), (t.v = $t(de(s))), (t.m = a), (t.P = !0), qi(t, null));
  }
  function qi(t, s) {
    ((t.F = Date.now()), Ft(t), (t.A = de(t.v)));
    var a = t.A,
      l = t.R;
    (Array.isArray(l) || (l = [String(l)]),
      ar(a.i, 't', l),
      (t.C = 0),
      (a = t.j.J),
      (t.h = new Gi()),
      (t.g = br(t.j, a ? s : null, !t.m)),
      0 < t.O && (t.M = new Ko(k(t.Y, t, t.g), t.O)),
      (s = t.U),
      (a = t.g),
      (l = t.ca));
    var _ = 'readystatechange';
    Array.isArray(_) || (_ && (Fi[0] = _.toString()), (_ = Fi));
    for (var w = 0; w < _.length; w++) {
      var E = Di(a, _[w], l || s.handleEvent, !1, s.h || s);
      if (!E) break;
      s.g[E.key] = E;
    }
    ((s = t.H ? u(t.H) : {}),
      t.m
        ? (t.u || (t.u = 'POST'),
          (s['Content-Type'] = 'application/x-www-form-urlencoded'),
          t.g.ea(t.A, t.u, t.m, s))
        : ((t.u = 'GET'), t.g.ea(t.A, t.u, null, s)),
      ht(),
      Qo(t.i, t.u, t.A, t.l, t.R, t.m));
  }
  ((we.prototype.ca = function (t) {
    t = t.target;
    const s = this.M;
    s && fe(t) == 3 ? s.j() : this.Y(t);
  }),
    (we.prototype.Y = function (t) {
      try {
        if (t == this.g)
          e: {
            const H = fe(this.g);
            var s = this.g.Ba();
            const Je = this.g.Z();
            if (
              !(3 > H) &&
              (H != 3 || (this.g && (this.h.h || this.g.oa() || pr(this.g))))
            ) {
              (this.J ||
                H != 4 ||
                s == 7 ||
                (s == 8 || 0 >= Je ? ht(3) : ht(2)),
                Ln(this));
              var a = this.g.Z();
              this.X = a;
              t: if (Ki(this)) {
                var l = pr(this.g);
                t = '';
                var _ = l.length,
                  w = fe(this.g) == 4;
                if (!this.h.i) {
                  if (typeof TextDecoder > 'u') {
                    (Le(this), ft(this));
                    var E = '';
                    break t;
                  }
                  this.h.i = new p.TextDecoder();
                }
                for (s = 0; s < _; s++)
                  ((this.h.h = !0),
                    (t += this.h.i.decode(l[s], {
                      stream: !(w && s == _ - 1),
                    })));
                ((l.length = 0), (this.h.g += t), (this.C = 0), (E = this.h.g));
              } else E = this.g.oa();
              if (
                ((this.o = a == 200),
                Zo(this.i, this.u, this.A, this.l, this.R, H, a),
                this.o)
              ) {
                if (this.T && !this.K) {
                  t: {
                    if (this.g) {
                      var D,
                        F = this.g;
                      if (
                        (D = F.g
                          ? F.g.getResponseHeader('X-HTTP-Initial-Response')
                          : null) &&
                        !Q(D)
                      ) {
                        var P = D;
                        break t;
                      }
                    }
                    P = null;
                  }
                  if ((a = P))
                    (We(
                      this.i,
                      this.l,
                      a,
                      'Initial handshake response via X-HTTP-Initial-Response'
                    ),
                      (this.K = !0),
                      Mn(this, a));
                  else {
                    ((this.o = !1), (this.s = 3), G(12), Le(this), ft(this));
                    break e;
                  }
                }
                if (this.P) {
                  a = !0;
                  let ie;
                  for (; !this.J && this.C < E.length; )
                    if (((ie = ia(this, E)), ie == Dn)) {
                      (H == 4 && ((this.s = 4), G(14), (a = !1)),
                        We(this.i, this.l, null, '[Incomplete Response]'));
                      break;
                    } else if (ie == Wi) {
                      ((this.s = 4),
                        G(15),
                        We(this.i, this.l, E, '[Invalid Chunk]'),
                        (a = !1));
                      break;
                    } else (We(this.i, this.l, ie, null), Mn(this, ie));
                  if (
                    (Ki(this) &&
                      this.C != 0 &&
                      ((this.h.g = this.h.g.slice(this.C)), (this.C = 0)),
                    H != 4 ||
                      E.length != 0 ||
                      this.h.h ||
                      ((this.s = 1), G(16), (a = !1)),
                    (this.o = this.o && a),
                    !a)
                  )
                    (We(this.i, this.l, E, '[Invalid Chunked Response]'),
                      Le(this),
                      ft(this));
                  else if (0 < E.length && !this.W) {
                    this.W = !0;
                    var V = this.j;
                    V.g == this &&
                      V.ba &&
                      !V.M &&
                      (V.j.info(
                        'Great, no buffering proxy detected. Bytes received: ' +
                          E.length
                      ),
                      $n(V),
                      (V.M = !0),
                      G(11));
                  }
                } else (We(this.i, this.l, E, null), Mn(this, E));
                (H == 4 && Le(this),
                  this.o &&
                    !this.J &&
                    (H == 4 ? wr(this.j, this) : ((this.o = !1), Ft(this))));
              } else
                (Ia(this.g),
                  a == 400 && 0 < E.indexOf('Unknown SID')
                    ? ((this.s = 3), G(12))
                    : ((this.s = 0), G(13)),
                  Le(this),
                  ft(this));
            }
          }
      } catch {
      } finally {
      }
    }));
  function Ki(t) {
    return t.g ? t.u == 'GET' && t.L != 2 && t.j.Ca : !1;
  }
  function ia(t, s) {
    var a = t.C,
      l = s.indexOf(
        `
`,
        a
      );
    return l == -1
      ? Dn
      : ((a = Number(s.substring(a, l))),
        isNaN(a)
          ? Wi
          : ((l += 1),
            l + a > s.length
              ? Dn
              : ((s = s.slice(l, l + a)), (t.C = l + a), s)));
  }
  we.prototype.cancel = function () {
    ((this.J = !0), Le(this));
  };
  function Ft(t) {
    ((t.S = Date.now() + t.I), Ji(t, t.I));
  }
  function Ji(t, s) {
    if (t.B != null) throw Error('WatchDog timer not null');
    t.B = ut(k(t.ba, t), s);
  }
  function Ln(t) {
    t.B && (p.clearTimeout(t.B), (t.B = null));
  }
  we.prototype.ba = function () {
    this.B = null;
    const t = Date.now();
    0 <= t - this.S
      ? (ea(this.i, this.A),
        this.L != 2 && (ht(), G(17)),
        Le(this),
        (this.s = 2),
        ft(this))
      : Ji(this, this.S - t);
  };
  function ft(t) {
    t.j.G == 0 || t.J || wr(t.j, t);
  }
  function Le(t) {
    Ln(t);
    var s = t.M;
    (s && typeof s.ma == 'function' && s.ma(),
      (t.M = null),
      ji(t.U),
      t.g && ((s = t.g), (t.g = null), s.abort(), s.ma()));
  }
  function Mn(t, s) {
    try {
      var a = t.j;
      if (a.G != 0 && (a.g == t || Un(a.h, t))) {
        if (!t.K && Un(a.h, t) && a.G == 3) {
          try {
            var l = a.Da.g.parse(s);
          } catch {
            l = null;
          }
          if (Array.isArray(l) && l.length == 3) {
            var _ = l;
            if (_[0] == 0) {
              e: if (!a.u) {
                if (a.g)
                  if (a.g.F + 3e3 < t.F) (qt(a), Gt(a));
                  else break e;
                (Bn(a), G(18));
              }
            } else
              ((a.za = _[1]),
                0 < a.za - a.T &&
                  37500 > _[2] &&
                  a.F &&
                  a.v == 0 &&
                  !a.C &&
                  (a.C = ut(k(a.Za, a), 6e3)));
            if (1 >= Qi(a.h) && a.ca) {
              try {
                a.ca();
              } catch {}
              a.ca = void 0;
            }
          } else Ue(a, 11);
        } else if (((t.K || a.g == t) && qt(a), !Q(s)))
          for (_ = a.Da.g.parse(s), s = 0; s < _.length; s++) {
            let P = _[s];
            if (((a.T = P[0]), (P = P[1]), a.G == 2))
              if (P[0] == 'c') {
                ((a.K = P[1]), (a.ia = P[2]));
                const V = P[3];
                V != null && ((a.la = V), a.j.info('VER=' + a.la));
                const H = P[4];
                H != null && ((a.Aa = H), a.j.info('SVER=' + a.Aa));
                const Je = P[5];
                (Je != null &&
                  typeof Je == 'number' &&
                  0 < Je &&
                  ((l = 1.5 * Je),
                  (a.L = l),
                  a.j.info('backChannelRequestTimeoutMs_=' + l)),
                  (l = a));
                const ie = t.g;
                if (ie) {
                  const Kt = ie.g
                    ? ie.g.getResponseHeader('X-Client-Wire-Protocol')
                    : null;
                  if (Kt) {
                    var w = l.h;
                    w.g ||
                      (Kt.indexOf('spdy') == -1 &&
                        Kt.indexOf('quic') == -1 &&
                        Kt.indexOf('h2') == -1) ||
                      ((w.j = w.l),
                      (w.g = new Set()),
                      w.h && (xn(w, w.h), (w.h = null)));
                  }
                  if (l.D) {
                    const Vn = ie.g
                      ? ie.g.getResponseHeader('X-HTTP-Session-Id')
                      : null;
                    Vn && ((l.ya = Vn), L(l.I, l.D, Vn));
                  }
                }
                ((a.G = 3),
                  a.l && a.l.ua(),
                  a.ba &&
                    ((a.R = Date.now() - t.F),
                    a.j.info('Handshake RTT: ' + a.R + 'ms')),
                  (l = a));
                var E = t;
                if (((l.qa = Ar(l, l.J ? l.ia : null, l.W)), E.K)) {
                  Zi(l.h, E);
                  var D = E,
                    F = l.L;
                  (F && (D.I = F), D.B && (Ln(D), Ft(D)), (l.g = E));
                } else _r(l);
                0 < a.i.length && Wt(a);
              } else (P[0] != 'stop' && P[0] != 'close') || Ue(a, 7);
            else
              a.G == 3 &&
                (P[0] == 'stop' || P[0] == 'close'
                  ? P[0] == 'stop'
                    ? Ue(a, 7)
                    : jn(a)
                  : P[0] != 'noop' && a.l && a.l.ta(P),
                (a.v = 0));
          }
      }
      ht(4);
    } catch {}
  }
  var ra = class {
    constructor(t, s) {
      ((this.g = t), (this.map = s));
    }
  };
  function Xi(t) {
    ((this.l = t || 10),
      p.PerformanceNavigationTiming
        ? ((t = p.performance.getEntriesByType('navigation')),
          (t =
            0 < t.length &&
            (t[0].nextHopProtocol == 'hq' || t[0].nextHopProtocol == 'h2')))
        : (t = !!(
            p.chrome &&
            p.chrome.loadTimes &&
            p.chrome.loadTimes() &&
            p.chrome.loadTimes().wasFetchedViaSpdy
          )),
      (this.j = t ? this.l : 1),
      (this.g = null),
      1 < this.j && (this.g = new Set()),
      (this.h = null),
      (this.i = []));
  }
  function Yi(t) {
    return t.h ? !0 : t.g ? t.g.size >= t.j : !1;
  }
  function Qi(t) {
    return t.h ? 1 : t.g ? t.g.size : 0;
  }
  function Un(t, s) {
    return t.h ? t.h == s : t.g ? t.g.has(s) : !1;
  }
  function xn(t, s) {
    t.g ? t.g.add(s) : (t.h = s);
  }
  function Zi(t, s) {
    t.h && t.h == s ? (t.h = null) : t.g && t.g.has(s) && t.g.delete(s);
  }
  Xi.prototype.cancel = function () {
    if (((this.i = er(this)), this.h)) (this.h.cancel(), (this.h = null));
    else if (this.g && this.g.size !== 0) {
      for (const t of this.g.values()) t.cancel();
      this.g.clear();
    }
  };
  function er(t) {
    if (t.h != null) return t.i.concat(t.h.D);
    if (t.g != null && t.g.size !== 0) {
      let s = t.i;
      for (const a of t.g.values()) s = s.concat(a.D);
      return s;
    }
    return x(t.i);
  }
  function sa(t) {
    if (t.V && typeof t.V == 'function') return t.V();
    if (
      (typeof Map < 'u' && t instanceof Map) ||
      (typeof Set < 'u' && t instanceof Set)
    )
      return Array.from(t.values());
    if (typeof t == 'string') return t.split('');
    if (v(t)) {
      for (var s = [], a = t.length, l = 0; l < a; l++) s.push(t[l]);
      return s;
    }
    ((s = []), (a = 0));
    for (l in t) s[a++] = t[l];
    return s;
  }
  function oa(t) {
    if (t.na && typeof t.na == 'function') return t.na();
    if (!t.V || typeof t.V != 'function') {
      if (typeof Map < 'u' && t instanceof Map) return Array.from(t.keys());
      if (!(typeof Set < 'u' && t instanceof Set)) {
        if (v(t) || typeof t == 'string') {
          var s = [];
          t = t.length;
          for (var a = 0; a < t; a++) s.push(a);
          return s;
        }
        ((s = []), (a = 0));
        for (const l in t) s[a++] = l;
        return s;
      }
    }
  }
  function tr(t, s) {
    if (t.forEach && typeof t.forEach == 'function') t.forEach(s, void 0);
    else if (v(t) || typeof t == 'string')
      Array.prototype.forEach.call(t, s, void 0);
    else
      for (var a = oa(t), l = sa(t), _ = l.length, w = 0; w < _; w++)
        s.call(void 0, l[w], a && a[w], t);
  }
  var nr = RegExp(
    '^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$'
  );
  function aa(t, s) {
    if (t) {
      t = t.split('&');
      for (var a = 0; a < t.length; a++) {
        var l = t[a].indexOf('='),
          _ = null;
        if (0 <= l) {
          var w = t[a].substring(0, l);
          _ = t[a].substring(l + 1);
        } else w = t[a];
        s(w, _ ? decodeURIComponent(_.replace(/\+/g, ' ')) : '');
      }
    }
  }
  function Me(t) {
    if (
      ((this.g = this.o = this.j = ''),
      (this.s = null),
      (this.m = this.l = ''),
      (this.h = !1),
      t instanceof Me)
    ) {
      ((this.h = t.h),
        jt(this, t.j),
        (this.o = t.o),
        (this.g = t.g),
        Bt(this, t.s),
        (this.l = t.l));
      var s = t.i,
        a = new mt();
      ((a.i = s.i),
        s.g && ((a.g = new Map(s.g)), (a.h = s.h)),
        ir(this, a),
        (this.m = t.m));
    } else
      t && (s = String(t).match(nr))
        ? ((this.h = !1),
          jt(this, s[1] || '', !0),
          (this.o = pt(s[2] || '')),
          (this.g = pt(s[3] || '', !0)),
          Bt(this, s[4]),
          (this.l = pt(s[5] || '', !0)),
          ir(this, s[6] || '', !0),
          (this.m = pt(s[7] || '')))
        : ((this.h = !1), (this.i = new mt(null, this.h)));
  }
  Me.prototype.toString = function () {
    var t = [],
      s = this.j;
    s && t.push(gt(s, rr, !0), ':');
    var a = this.g;
    return (
      (a || s == 'file') &&
        (t.push('//'),
        (s = this.o) && t.push(gt(s, rr, !0), '@'),
        t.push(
          encodeURIComponent(String(a)).replace(/%25([0-9a-fA-F]{2})/g, '%$1')
        ),
        (a = this.s),
        a != null && t.push(':', String(a))),
      (a = this.l) &&
        (this.g && a.charAt(0) != '/' && t.push('/'),
        t.push(gt(a, a.charAt(0) == '/' ? ha : la, !0))),
      (a = this.i.toString()) && t.push('?', a),
      (a = this.m) && t.push('#', gt(a, da)),
      t.join('')
    );
  };
  function de(t) {
    return new Me(t);
  }
  function jt(t, s, a) {
    ((t.j = a ? pt(s, !0) : s), t.j && (t.j = t.j.replace(/:$/, '')));
  }
  function Bt(t, s) {
    if (s) {
      if (((s = Number(s)), isNaN(s) || 0 > s))
        throw Error('Bad port number ' + s);
      t.s = s;
    } else t.s = null;
  }
  function ir(t, s, a) {
    s instanceof mt
      ? ((t.i = s), fa(t.i, t.h))
      : (a || (s = gt(s, ua)), (t.i = new mt(s, t.h)));
  }
  function L(t, s, a) {
    t.i.set(s, a);
  }
  function $t(t) {
    return (
      L(
        t,
        'zx',
        Math.floor(2147483648 * Math.random()).toString(36) +
          Math.abs(
            Math.floor(2147483648 * Math.random()) ^ Date.now()
          ).toString(36)
      ),
      t
    );
  }
  function pt(t, s) {
    return t
      ? s
        ? decodeURI(t.replace(/%25/g, '%2525'))
        : decodeURIComponent(t)
      : '';
  }
  function gt(t, s, a) {
    return typeof t == 'string'
      ? ((t = encodeURI(t).replace(s, ca)),
        a && (t = t.replace(/%25([0-9a-fA-F]{2})/g, '%$1')),
        t)
      : null;
  }
  function ca(t) {
    return (
      (t = t.charCodeAt(0)),
      '%' + ((t >> 4) & 15).toString(16) + (t & 15).toString(16)
    );
  }
  var rr = /[#\/\?@]/g,
    la = /[#\?:]/g,
    ha = /[#\?]/g,
    ua = /[#\?@]/g,
    da = /#/g;
  function mt(t, s) {
    ((this.h = this.g = null), (this.i = t || null), (this.j = !!s));
  }
  function Te(t) {
    t.g ||
      ((t.g = new Map()),
      (t.h = 0),
      t.i &&
        aa(t.i, function (s, a) {
          t.add(decodeURIComponent(s.replace(/\+/g, ' ')), a);
        }));
  }
  ((n = mt.prototype),
    (n.add = function (t, s) {
      (Te(this), (this.i = null), (t = qe(this, t)));
      var a = this.g.get(t);
      return (a || this.g.set(t, (a = [])), a.push(s), (this.h += 1), this);
    }));
  function sr(t, s) {
    (Te(t),
      (s = qe(t, s)),
      t.g.has(s) && ((t.i = null), (t.h -= t.g.get(s).length), t.g.delete(s)));
  }
  function or(t, s) {
    return (Te(t), (s = qe(t, s)), t.g.has(s));
  }
  ((n.forEach = function (t, s) {
    (Te(this),
      this.g.forEach(function (a, l) {
        a.forEach(function (_) {
          t.call(s, _, l, this);
        }, this);
      }, this));
  }),
    (n.na = function () {
      Te(this);
      const t = Array.from(this.g.values()),
        s = Array.from(this.g.keys()),
        a = [];
      for (let l = 0; l < s.length; l++) {
        const _ = t[l];
        for (let w = 0; w < _.length; w++) a.push(s[l]);
      }
      return a;
    }),
    (n.V = function (t) {
      Te(this);
      let s = [];
      if (typeof t == 'string')
        or(this, t) && (s = s.concat(this.g.get(qe(this, t))));
      else {
        t = Array.from(this.g.values());
        for (let a = 0; a < t.length; a++) s = s.concat(t[a]);
      }
      return s;
    }),
    (n.set = function (t, s) {
      return (
        Te(this),
        (this.i = null),
        (t = qe(this, t)),
        or(this, t) && (this.h -= this.g.get(t).length),
        this.g.set(t, [s]),
        (this.h += 1),
        this
      );
    }),
    (n.get = function (t, s) {
      return t ? ((t = this.V(t)), 0 < t.length ? String(t[0]) : s) : s;
    }));
  function ar(t, s, a) {
    (sr(t, s),
      0 < a.length &&
        ((t.i = null), t.g.set(qe(t, s), x(a)), (t.h += a.length)));
  }
  n.toString = function () {
    if (this.i) return this.i;
    if (!this.g) return '';
    const t = [],
      s = Array.from(this.g.keys());
    for (var a = 0; a < s.length; a++) {
      var l = s[a];
      const w = encodeURIComponent(String(l)),
        E = this.V(l);
      for (l = 0; l < E.length; l++) {
        var _ = w;
        (E[l] !== '' && (_ += '=' + encodeURIComponent(String(E[l]))),
          t.push(_));
      }
    }
    return (this.i = t.join('&'));
  };
  function qe(t, s) {
    return ((s = String(s)), t.j && (s = s.toLowerCase()), s);
  }
  function fa(t, s) {
    (s &&
      !t.j &&
      (Te(t),
      (t.i = null),
      t.g.forEach(function (a, l) {
        var _ = l.toLowerCase();
        l != _ && (sr(this, l), ar(this, _, a));
      }, t)),
      (t.j = s));
  }
  function pa(t, s) {
    const a = new dt();
    if (p.Image) {
      const l = new Image();
      ((l.onload = N(Ee, a, 'TestLoadImage: loaded', !0, s, l)),
        (l.onerror = N(Ee, a, 'TestLoadImage: error', !1, s, l)),
        (l.onabort = N(Ee, a, 'TestLoadImage: abort', !1, s, l)),
        (l.ontimeout = N(Ee, a, 'TestLoadImage: timeout', !1, s, l)),
        p.setTimeout(function () {
          l.ontimeout && l.ontimeout();
        }, 1e4),
        (l.src = t));
    } else s(!1);
  }
  function ga(t, s) {
    const a = new dt(),
      l = new AbortController(),
      _ = setTimeout(() => {
        (l.abort(), Ee(a, 'TestPingServer: timeout', !1, s));
      }, 1e4);
    fetch(t, { signal: l.signal })
      .then(w => {
        (clearTimeout(_),
          w.ok
            ? Ee(a, 'TestPingServer: ok', !0, s)
            : Ee(a, 'TestPingServer: server error', !1, s));
      })
      .catch(() => {
        (clearTimeout(_), Ee(a, 'TestPingServer: error', !1, s));
      });
  }
  function Ee(t, s, a, l, _) {
    try {
      (_ &&
        ((_.onload = null),
        (_.onerror = null),
        (_.onabort = null),
        (_.ontimeout = null)),
        l(a));
    } catch {}
  }
  function ma() {
    this.g = new Xo();
  }
  function va(t, s, a) {
    const l = a || '';
    try {
      tr(t, function (_, w) {
        let E = _;
        (T(_) && (E = bn(_)), s.push(l + w + '=' + encodeURIComponent(E)));
      });
    } catch (_) {
      throw (s.push(l + 'type=' + encodeURIComponent('_badmap')), _);
    }
  }
  function Vt(t) {
    ((this.l = t.Ub || null), (this.j = t.eb || !1));
  }
  (C(Vt, Sn),
    (Vt.prototype.g = function () {
      return new Ht(this.l, this.j);
    }),
    (Vt.prototype.i = (function (t) {
      return function () {
        return t;
      };
    })({})));
  function Ht(t, s) {
    ($.call(this),
      (this.D = t),
      (this.o = s),
      (this.m = void 0),
      (this.status = this.readyState = 0),
      (this.responseType =
        this.responseText =
        this.response =
        this.statusText =
          ''),
      (this.onreadystatechange = null),
      (this.u = new Headers()),
      (this.h = null),
      (this.B = 'GET'),
      (this.A = ''),
      (this.g = !1),
      (this.v = this.j = this.l = null));
  }
  (C(Ht, $),
    (n = Ht.prototype),
    (n.open = function (t, s) {
      if (this.readyState != 0)
        throw (this.abort(), Error('Error reopening a connection'));
      ((this.B = t), (this.A = s), (this.readyState = 1), yt(this));
    }),
    (n.send = function (t) {
      if (this.readyState != 1)
        throw (this.abort(), Error('need to call open() first. '));
      this.g = !0;
      const s = {
        headers: this.u,
        method: this.B,
        credentials: this.m,
        cache: void 0,
      };
      (t && (s.body = t),
        (this.D || p)
          .fetch(new Request(this.A, s))
          .then(this.Sa.bind(this), this.ga.bind(this)));
    }),
    (n.abort = function () {
      ((this.response = this.responseText = ''),
        (this.u = new Headers()),
        (this.status = 0),
        this.j && this.j.cancel('Request was aborted.').catch(() => {}),
        1 <= this.readyState &&
          this.g &&
          this.readyState != 4 &&
          ((this.g = !1), vt(this)),
        (this.readyState = 0));
    }),
    (n.Sa = function (t) {
      if (
        this.g &&
        ((this.l = t),
        this.h ||
          ((this.status = this.l.status),
          (this.statusText = this.l.statusText),
          (this.h = t.headers),
          (this.readyState = 2),
          yt(this)),
        this.g && ((this.readyState = 3), yt(this), this.g))
      )
        if (this.responseType === 'arraybuffer')
          t.arrayBuffer().then(this.Qa.bind(this), this.ga.bind(this));
        else if (typeof p.ReadableStream < 'u' && 'body' in t) {
          if (((this.j = t.body.getReader()), this.o)) {
            if (this.responseType)
              throw Error(
                'responseType must be empty for "streamBinaryChunks" mode responses.'
              );
            this.response = [];
          } else
            ((this.response = this.responseText = ''),
              (this.v = new TextDecoder()));
          cr(this);
        } else t.text().then(this.Ra.bind(this), this.ga.bind(this));
    }));
  function cr(t) {
    t.j.read().then(t.Pa.bind(t)).catch(t.ga.bind(t));
  }
  ((n.Pa = function (t) {
    if (this.g) {
      if (this.o && t.value) this.response.push(t.value);
      else if (!this.o) {
        var s = t.value ? t.value : new Uint8Array(0);
        (s = this.v.decode(s, { stream: !t.done })) &&
          (this.response = this.responseText += s);
      }
      (t.done ? vt(this) : yt(this), this.readyState == 3 && cr(this));
    }
  }),
    (n.Ra = function (t) {
      this.g && ((this.response = this.responseText = t), vt(this));
    }),
    (n.Qa = function (t) {
      this.g && ((this.response = t), vt(this));
    }),
    (n.ga = function () {
      this.g && vt(this);
    }));
  function vt(t) {
    ((t.readyState = 4), (t.l = null), (t.j = null), (t.v = null), yt(t));
  }
  ((n.setRequestHeader = function (t, s) {
    this.u.append(t, s);
  }),
    (n.getResponseHeader = function (t) {
      return (this.h && this.h.get(t.toLowerCase())) || '';
    }),
    (n.getAllResponseHeaders = function () {
      if (!this.h) return '';
      const t = [],
        s = this.h.entries();
      for (var a = s.next(); !a.done; )
        ((a = a.value), t.push(a[0] + ': ' + a[1]), (a = s.next()));
      return t.join(`\r
`);
    }));
  function yt(t) {
    t.onreadystatechange && t.onreadystatechange.call(t);
  }
  Object.defineProperty(Ht.prototype, 'withCredentials', {
    get: function () {
      return this.m === 'include';
    },
    set: function (t) {
      this.m = t ? 'include' : 'same-origin';
    },
  });
  function lr(t) {
    let s = '';
    return (
      K(t, function (a, l) {
        ((s += l),
          (s += ':'),
          (s += a),
          (s += `\r
`));
      }),
      s
    );
  }
  function Fn(t, s, a) {
    e: {
      for (l in a) {
        var l = !1;
        break e;
      }
      l = !0;
    }
    l ||
      ((a = lr(a)),
      typeof t == 'string'
        ? a != null && encodeURIComponent(String(a))
        : L(t, s, a));
  }
  function U(t) {
    ($.call(this),
      (this.headers = new Map()),
      (this.o = t || null),
      (this.h = !1),
      (this.v = this.g = null),
      (this.D = ''),
      (this.m = 0),
      (this.l = ''),
      (this.j = this.B = this.u = this.A = !1),
      (this.I = null),
      (this.H = ''),
      (this.J = !1));
  }
  C(U, $);
  var ya = /^https?$/i,
    _a = ['POST', 'PUT'];
  ((n = U.prototype),
    (n.Ha = function (t) {
      this.J = t;
    }),
    (n.ea = function (t, s, a, l) {
      if (this.g)
        throw Error(
          '[goog.net.XhrIo] Object is active with another request=' +
            this.D +
            '; newUri=' +
            t
        );
      ((s = s ? s.toUpperCase() : 'GET'),
        (this.D = t),
        (this.l = ''),
        (this.m = 0),
        (this.A = !1),
        (this.h = !0),
        (this.g = this.o ? this.o.g() : On.g()),
        (this.v = this.o ? Bi(this.o) : Bi(On)),
        (this.g.onreadystatechange = k(this.Ea, this)));
      try {
        ((this.B = !0), this.g.open(s, String(t), !0), (this.B = !1));
      } catch (w) {
        hr(this, w);
        return;
      }
      if (((t = a || ''), (a = new Map(this.headers)), l))
        if (Object.getPrototypeOf(l) === Object.prototype)
          for (var _ in l) a.set(_, l[_]);
        else if (typeof l.keys == 'function' && typeof l.get == 'function')
          for (const w of l.keys()) a.set(w, l.get(w));
        else throw Error('Unknown input type for opt_headers: ' + String(l));
      ((l = Array.from(a.keys()).find(w => w.toLowerCase() == 'content-type')),
        (_ = p.FormData && t instanceof p.FormData),
        !(0 <= Array.prototype.indexOf.call(_a, s, void 0)) ||
          l ||
          _ ||
          a.set(
            'Content-Type',
            'application/x-www-form-urlencoded;charset=utf-8'
          ));
      for (const [w, E] of a) this.g.setRequestHeader(w, E);
      (this.H && (this.g.responseType = this.H),
        'withCredentials' in this.g &&
          this.g.withCredentials !== this.J &&
          (this.g.withCredentials = this.J));
      try {
        (fr(this), (this.u = !0), this.g.send(t), (this.u = !1));
      } catch (w) {
        hr(this, w);
      }
    }));
  function hr(t, s) {
    ((t.h = !1),
      t.g && ((t.j = !0), t.g.abort(), (t.j = !1)),
      (t.l = s),
      (t.m = 5),
      ur(t),
      zt(t));
  }
  function ur(t) {
    t.A || ((t.A = !0), z(t, 'complete'), z(t, 'error'));
  }
  ((n.abort = function (t) {
    this.g &&
      this.h &&
      ((this.h = !1),
      (this.j = !0),
      this.g.abort(),
      (this.j = !1),
      (this.m = t || 7),
      z(this, 'complete'),
      z(this, 'abort'),
      zt(this));
  }),
    (n.N = function () {
      (this.g &&
        (this.h &&
          ((this.h = !1), (this.j = !0), this.g.abort(), (this.j = !1)),
        zt(this, !0)),
        U.aa.N.call(this));
    }),
    (n.Ea = function () {
      this.s || (this.B || this.u || this.j ? dr(this) : this.bb());
    }),
    (n.bb = function () {
      dr(this);
    }));
  function dr(t) {
    if (t.h && typeof h < 'u' && (!t.v[1] || fe(t) != 4 || t.Z() != 2)) {
      if (t.u && fe(t) == 4) Ui(t.Ea, 0, t);
      else if ((z(t, 'readystatechange'), fe(t) == 4)) {
        t.h = !1;
        try {
          const E = t.Z();
          e: switch (E) {
            case 200:
            case 201:
            case 202:
            case 204:
            case 206:
            case 304:
            case 1223:
              var s = !0;
              break e;
            default:
              s = !1;
          }
          var a;
          if (!(a = s)) {
            var l;
            if ((l = E === 0)) {
              var _ = String(t.D).match(nr)[1] || null;
              (!_ &&
                p.self &&
                p.self.location &&
                (_ = p.self.location.protocol.slice(0, -1)),
                (l = !ya.test(_ ? _.toLowerCase() : '')));
            }
            a = l;
          }
          if (a) (z(t, 'complete'), z(t, 'success'));
          else {
            t.m = 6;
            try {
              var w = 2 < fe(t) ? t.g.statusText : '';
            } catch {
              w = '';
            }
            ((t.l = w + ' [' + t.Z() + ']'), ur(t));
          }
        } finally {
          zt(t);
        }
      }
    }
  }
  function zt(t, s) {
    if (t.g) {
      fr(t);
      const a = t.g,
        l = t.v[0] ? () => {} : null;
      ((t.g = null), (t.v = null), s || z(t, 'ready'));
      try {
        a.onreadystatechange = l;
      } catch {}
    }
  }
  function fr(t) {
    t.I && (p.clearTimeout(t.I), (t.I = null));
  }
  n.isActive = function () {
    return !!this.g;
  };
  function fe(t) {
    return t.g ? t.g.readyState : 0;
  }
  ((n.Z = function () {
    try {
      return 2 < fe(this) ? this.g.status : -1;
    } catch {
      return -1;
    }
  }),
    (n.oa = function () {
      try {
        return this.g ? this.g.responseText : '';
      } catch {
        return '';
      }
    }),
    (n.Oa = function (t) {
      if (this.g) {
        var s = this.g.responseText;
        return (t && s.indexOf(t) == 0 && (s = s.substring(t.length)), Jo(s));
      }
    }));
  function pr(t) {
    try {
      if (!t.g) return null;
      if ('response' in t.g) return t.g.response;
      switch (t.H) {
        case '':
        case 'text':
          return t.g.responseText;
        case 'arraybuffer':
          if ('mozResponseArrayBuffer' in t.g)
            return t.g.mozResponseArrayBuffer;
      }
      return null;
    } catch {
      return null;
    }
  }
  function Ia(t) {
    const s = {};
    t = ((t.g && 2 <= fe(t) && t.g.getAllResponseHeaders()) || '').split(`\r
`);
    for (let l = 0; l < t.length; l++) {
      if (Q(t[l])) continue;
      var a = m(t[l]);
      const _ = a[0];
      if (((a = a[1]), typeof a != 'string')) continue;
      a = a.trim();
      const w = s[_] || [];
      ((s[_] = w), w.push(a));
    }
    y(s, function (l) {
      return l.join(', ');
    });
  }
  ((n.Ba = function () {
    return this.m;
  }),
    (n.Ka = function () {
      return typeof this.l == 'string' ? this.l : String(this.l);
    }));
  function _t(t, s, a) {
    return (a && a.internalChannelParams && a.internalChannelParams[t]) || s;
  }
  function gr(t) {
    ((this.Aa = 0),
      (this.i = []),
      (this.j = new dt()),
      (this.ia =
        this.qa =
        this.I =
        this.W =
        this.g =
        this.ya =
        this.D =
        this.H =
        this.m =
        this.S =
        this.o =
          null),
      (this.Ya = this.U = 0),
      (this.Va = _t('failFast', !1, t)),
      (this.F = this.C = this.u = this.s = this.l = null),
      (this.X = !0),
      (this.za = this.T = -1),
      (this.Y = this.v = this.B = 0),
      (this.Ta = _t('baseRetryDelayMs', 5e3, t)),
      (this.cb = _t('retryDelaySeedMs', 1e4, t)),
      (this.Wa = _t('forwardChannelMaxRetries', 2, t)),
      (this.wa = _t('forwardChannelRequestTimeoutMs', 2e4, t)),
      (this.pa = (t && t.xmlHttpFactory) || void 0),
      (this.Xa = (t && t.Tb) || void 0),
      (this.Ca = (t && t.useFetchStreams) || !1),
      (this.L = void 0),
      (this.J = (t && t.supportsCrossDomainXhr) || !1),
      (this.K = ''),
      (this.h = new Xi(t && t.concurrentRequestLimit)),
      (this.Da = new ma()),
      (this.P = (t && t.fastHandshake) || !1),
      (this.O = (t && t.encodeInitMessageHeaders) || !1),
      this.P && this.O && (this.O = !1),
      (this.Ua = (t && t.Rb) || !1),
      t && t.xa && this.j.xa(),
      t && t.forceLongPolling && (this.X = !1),
      (this.ba = (!this.P && this.X && t && t.detectBufferingProxy) || !1),
      (this.ja = void 0),
      t &&
        t.longPollingTimeout &&
        0 < t.longPollingTimeout &&
        (this.ja = t.longPollingTimeout),
      (this.ca = void 0),
      (this.R = 0),
      (this.M = !1),
      (this.ka = this.A = null));
  }
  ((n = gr.prototype),
    (n.la = 8),
    (n.G = 1),
    (n.connect = function (t, s, a, l) {
      (G(0),
        (this.W = t),
        (this.H = s || {}),
        a && l !== void 0 && ((this.H.OSID = a), (this.H.OAID = l)),
        (this.F = this.X),
        (this.I = Ar(this, null, this.W)),
        Wt(this));
    }));
  function jn(t) {
    if ((mr(t), t.G == 3)) {
      var s = t.U++,
        a = de(t.I);
      if (
        (L(a, 'SID', t.K),
        L(a, 'RID', s),
        L(a, 'TYPE', 'terminate'),
        It(t, a),
        (s = new we(t, t.j, s)),
        (s.L = 2),
        (s.v = $t(de(a))),
        (a = !1),
        p.navigator && p.navigator.sendBeacon)
      )
        try {
          a = p.navigator.sendBeacon(s.v.toString(), '');
        } catch {}
      (!a && p.Image && ((new Image().src = s.v), (a = !0)),
        a || ((s.g = br(s.j, null)), s.g.ea(s.v)),
        (s.F = Date.now()),
        Ft(s));
    }
    Er(t);
  }
  function Gt(t) {
    t.g && ($n(t), t.g.cancel(), (t.g = null));
  }
  function mr(t) {
    (Gt(t),
      t.u && (p.clearTimeout(t.u), (t.u = null)),
      qt(t),
      t.h.cancel(),
      t.s && (typeof t.s == 'number' && p.clearTimeout(t.s), (t.s = null)));
  }
  function Wt(t) {
    if (!Yi(t.h) && !t.s) {
      t.s = !0;
      var s = t.Ga;
      (st || Oi(), ot || (st(), (ot = !0)), vn.add(s, t), (t.B = 0));
    }
  }
  function wa(t, s) {
    return Qi(t.h) >= t.h.j - (t.s ? 1 : 0)
      ? !1
      : t.s
        ? ((t.i = s.D.concat(t.i)), !0)
        : t.G == 1 || t.G == 2 || t.B >= (t.Va ? 0 : t.Wa)
          ? !1
          : ((t.s = ut(k(t.Ga, t, s), Tr(t, t.B))), t.B++, !0);
  }
  n.Ga = function (t) {
    if (this.s)
      if (((this.s = null), this.G == 1)) {
        if (!t) {
          ((this.U = Math.floor(1e5 * Math.random())), (t = this.U++));
          const _ = new we(this, this.j, t);
          let w = this.o;
          if (
            (this.S && (w ? ((w = u(w)), g(w, this.S)) : (w = this.S)),
            this.m !== null || this.O || ((_.H = w), (w = null)),
            this.P)
          )
            e: {
              for (var s = 0, a = 0; a < this.i.length; a++) {
                t: {
                  var l = this.i[a];
                  if (
                    '__data__' in l.map &&
                    ((l = l.map.__data__), typeof l == 'string')
                  ) {
                    l = l.length;
                    break t;
                  }
                  l = void 0;
                }
                if (l === void 0) break;
                if (((s += l), 4096 < s)) {
                  s = a;
                  break e;
                }
                if (s === 4096 || a === this.i.length - 1) {
                  s = a + 1;
                  break e;
                }
              }
              s = 1e3;
            }
          else s = 1e3;
          ((s = yr(this, _, s)),
            (a = de(this.I)),
            L(a, 'RID', t),
            L(a, 'CVER', 22),
            this.D && L(a, 'X-HTTP-Session-Id', this.D),
            It(this, a),
            w &&
              (this.O
                ? (s = 'headers=' + encodeURIComponent(String(lr(w))) + '&' + s)
                : this.m && Fn(a, this.m, w)),
            xn(this.h, _),
            this.Ua && L(a, 'TYPE', 'init'),
            this.P
              ? (L(a, '$req', s),
                L(a, 'SID', 'null'),
                (_.T = !0),
                Nn(_, a, null))
              : Nn(_, a, s),
            (this.G = 2));
        }
      } else
        this.G == 3 &&
          (t ? vr(this, t) : this.i.length == 0 || Yi(this.h) || vr(this));
  };
  function vr(t, s) {
    var a;
    s ? (a = s.l) : (a = t.U++);
    const l = de(t.I);
    (L(l, 'SID', t.K),
      L(l, 'RID', a),
      L(l, 'AID', t.T),
      It(t, l),
      t.m && t.o && Fn(l, t.m, t.o),
      (a = new we(t, t.j, a, t.B + 1)),
      t.m === null && (a.H = t.o),
      s && (t.i = s.D.concat(t.i)),
      (s = yr(t, a, 1e3)),
      (a.I = Math.round(0.5 * t.wa) + Math.round(0.5 * t.wa * Math.random())),
      xn(t.h, a),
      Nn(a, l, s));
  }
  function It(t, s) {
    (t.H &&
      K(t.H, function (a, l) {
        L(s, l, a);
      }),
      t.l &&
        tr({}, function (a, l) {
          L(s, l, a);
        }));
  }
  function yr(t, s, a) {
    a = Math.min(t.i.length, a);
    var l = t.l ? k(t.l.Na, t.l, t) : null;
    e: {
      var _ = t.i;
      let w = -1;
      for (;;) {
        const E = ['count=' + a];
        w == -1
          ? 0 < a
            ? ((w = _[0].g), E.push('ofs=' + w))
            : (w = 0)
          : E.push('ofs=' + w);
        let D = !0;
        for (let F = 0; F < a; F++) {
          let P = _[F].g;
          const V = _[F].map;
          if (((P -= w), 0 > P)) ((w = Math.max(0, _[F].g - 100)), (D = !1));
          else
            try {
              va(V, E, 'req' + P + '_');
            } catch {
              l && l(V);
            }
        }
        if (D) {
          l = E.join('&');
          break e;
        }
      }
    }
    return ((t = t.i.splice(0, a)), (s.D = t), l);
  }
  function _r(t) {
    if (!t.g && !t.u) {
      t.Y = 1;
      var s = t.Fa;
      (st || Oi(), ot || (st(), (ot = !0)), vn.add(s, t), (t.v = 0));
    }
  }
  function Bn(t) {
    return t.g || t.u || 3 <= t.v
      ? !1
      : (t.Y++, (t.u = ut(k(t.Fa, t), Tr(t, t.v))), t.v++, !0);
  }
  ((n.Fa = function () {
    if (
      ((this.u = null),
      Ir(this),
      this.ba && !(this.M || this.g == null || 0 >= this.R))
    ) {
      var t = 2 * this.R;
      (this.j.info('BP detection timer enabled: ' + t),
        (this.A = ut(k(this.ab, this), t)));
    }
  }),
    (n.ab = function () {
      this.A &&
        ((this.A = null),
        this.j.info('BP detection timeout reached.'),
        this.j.info('Buffering proxy detected and switch to long-polling!'),
        (this.F = !1),
        (this.M = !0),
        G(10),
        Gt(this),
        Ir(this));
    }));
  function $n(t) {
    t.A != null && (p.clearTimeout(t.A), (t.A = null));
  }
  function Ir(t) {
    ((t.g = new we(t, t.j, 'rpc', t.Y)),
      t.m === null && (t.g.H = t.o),
      (t.g.O = 0));
    var s = de(t.qa);
    (L(s, 'RID', 'rpc'),
      L(s, 'SID', t.K),
      L(s, 'AID', t.T),
      L(s, 'CI', t.F ? '0' : '1'),
      !t.F && t.ja && L(s, 'TO', t.ja),
      L(s, 'TYPE', 'xmlhttp'),
      It(t, s),
      t.m && t.o && Fn(s, t.m, t.o),
      t.L && (t.g.I = t.L));
    var a = t.g;
    ((t = t.ia),
      (a.L = 1),
      (a.v = $t(de(s))),
      (a.m = null),
      (a.P = !0),
      qi(a, t));
  }
  n.Za = function () {
    this.C != null && ((this.C = null), Gt(this), Bn(this), G(19));
  };
  function qt(t) {
    t.C != null && (p.clearTimeout(t.C), (t.C = null));
  }
  function wr(t, s) {
    var a = null;
    if (t.g == s) {
      (qt(t), $n(t), (t.g = null));
      var l = 2;
    } else if (Un(t.h, s)) ((a = s.D), Zi(t.h, s), (l = 1));
    else return;
    if (t.G != 0) {
      if (s.o)
        if (l == 1) {
          ((a = s.m ? s.m.length : 0), (s = Date.now() - s.F));
          var _ = t.B;
          ((l = Cn()), z(l, new zi(l, a)), Wt(t));
        } else _r(t);
      else if (
        ((_ = s.s),
        _ == 3 ||
          (_ == 0 && 0 < s.X) ||
          !((l == 1 && wa(t, s)) || (l == 2 && Bn(t))))
      )
        switch ((a && 0 < a.length && ((s = t.h), (s.i = s.i.concat(a))), _)) {
          case 1:
            Ue(t, 5);
            break;
          case 4:
            Ue(t, 10);
            break;
          case 3:
            Ue(t, 6);
            break;
          default:
            Ue(t, 2);
        }
    }
  }
  function Tr(t, s) {
    let a = t.Ta + Math.floor(Math.random() * t.cb);
    return (t.isActive() || (a *= 2), a * s);
  }
  function Ue(t, s) {
    if ((t.j.info('Error code ' + s), s == 2)) {
      var a = k(t.fb, t),
        l = t.Xa;
      const _ = !l;
      ((l = new Me(l || '//www.google.com/images/cleardot.gif')),
        (p.location && p.location.protocol == 'http') || jt(l, 'https'),
        $t(l),
        _ ? pa(l.toString(), a) : ga(l.toString(), a));
    } else G(2);
    ((t.G = 0), t.l && t.l.sa(s), Er(t), mr(t));
  }
  n.fb = function (t) {
    t
      ? (this.j.info('Successfully pinged google.com'), G(2))
      : (this.j.info('Failed to ping google.com'), G(1));
  };
  function Er(t) {
    if (((t.G = 0), (t.ka = []), t.l)) {
      const s = er(t.h);
      ((s.length != 0 || t.i.length != 0) &&
        (M(t.ka, s),
        M(t.ka, t.i),
        (t.h.i.length = 0),
        x(t.i),
        (t.i.length = 0)),
        t.l.ra());
    }
  }
  function Ar(t, s, a) {
    var l = a instanceof Me ? de(a) : new Me(a);
    if (l.g != '') (s && (l.g = s + '.' + l.g), Bt(l, l.s));
    else {
      var _ = p.location;
      ((l = _.protocol),
        (s = s ? s + '.' + _.hostname : _.hostname),
        (_ = +_.port));
      var w = new Me(null);
      (l && jt(w, l), s && (w.g = s), _ && Bt(w, _), a && (w.l = a), (l = w));
    }
    return (
      (a = t.D),
      (s = t.ya),
      a && s && L(l, a, s),
      L(l, 'VER', t.la),
      It(t, l),
      l
    );
  }
  function br(t, s, a) {
    if (s && !t.J)
      throw Error("Can't create secondary domain capable XhrIo object.");
    return (
      (s = t.Ca && !t.pa ? new U(new Vt({ eb: a })) : new U(t.pa)),
      s.Ha(t.J),
      s
    );
  }
  n.isActive = function () {
    return !!this.l && this.l.isActive(this);
  };
  function Sr() {}
  ((n = Sr.prototype),
    (n.ua = function () {}),
    (n.ta = function () {}),
    (n.sa = function () {}),
    (n.ra = function () {}),
    (n.isActive = function () {
      return !0;
    }),
    (n.Na = function () {}));
  function ee(t, s) {
    ($.call(this),
      (this.g = new gr(s)),
      (this.l = t),
      (this.h = (s && s.messageUrlParams) || null),
      (t = (s && s.messageHeaders) || null),
      s &&
        s.clientProtocolHeaderRequired &&
        (t
          ? (t['X-Client-Protocol'] = 'webchannel')
          : (t = { 'X-Client-Protocol': 'webchannel' })),
      (this.g.o = t),
      (t = (s && s.initMessageHeaders) || null),
      s &&
        s.messageContentType &&
        (t
          ? (t['X-WebChannel-Content-Type'] = s.messageContentType)
          : (t = { 'X-WebChannel-Content-Type': s.messageContentType })),
      s &&
        s.va &&
        (t
          ? (t['X-WebChannel-Client-Profile'] = s.va)
          : (t = { 'X-WebChannel-Client-Profile': s.va })),
      (this.g.S = t),
      (t = s && s.Sb) && !Q(t) && (this.g.m = t),
      (this.v = (s && s.supportsCrossDomainXhr) || !1),
      (this.u = (s && s.sendRawJson) || !1),
      (s = s && s.httpSessionIdParam) &&
        !Q(s) &&
        ((this.g.D = s),
        (t = this.h),
        t !== null && s in t && ((t = this.h), s in t && delete t[s])),
      (this.j = new Ke(this)));
  }
  (C(ee, $),
    (ee.prototype.m = function () {
      ((this.g.l = this.j),
        this.v && (this.g.J = !0),
        this.g.connect(this.l, this.h || void 0));
    }),
    (ee.prototype.close = function () {
      jn(this.g);
    }),
    (ee.prototype.o = function (t) {
      var s = this.g;
      if (typeof t == 'string') {
        var a = {};
        ((a.__data__ = t), (t = a));
      } else this.u && ((a = {}), (a.__data__ = bn(t)), (t = a));
      (s.i.push(new ra(s.Ya++, t)), s.G == 3 && Wt(s));
    }),
    (ee.prototype.N = function () {
      ((this.g.l = null),
        delete this.j,
        jn(this.g),
        delete this.g,
        ee.aa.N.call(this));
    }));
  function kr(t) {
    (kn.call(this),
      t.__headers__ &&
        ((this.headers = t.__headers__),
        (this.statusCode = t.__status__),
        delete t.__headers__,
        delete t.__status__));
    var s = t.__sm__;
    if (s) {
      e: {
        for (const a in s) {
          t = a;
          break e;
        }
        t = void 0;
      }
      ((this.i = t) &&
        ((t = this.i), (s = s !== null && t in s ? s[t] : void 0)),
        (this.data = s));
    } else this.data = t;
  }
  C(kr, kn);
  function Rr() {
    (Rn.call(this), (this.status = 1));
  }
  C(Rr, Rn);
  function Ke(t) {
    this.g = t;
  }
  (C(Ke, Sr),
    (Ke.prototype.ua = function () {
      z(this.g, 'a');
    }),
    (Ke.prototype.ta = function (t) {
      z(this.g, new kr(t));
    }),
    (Ke.prototype.sa = function (t) {
      z(this.g, new Rr());
    }),
    (Ke.prototype.ra = function () {
      z(this.g, 'b');
    }),
    (ee.prototype.send = ee.prototype.o),
    (ee.prototype.open = ee.prototype.m),
    (ee.prototype.close = ee.prototype.close),
    (Pn.NO_ERROR = 0),
    (Pn.TIMEOUT = 8),
    (Pn.HTTP_ERROR = 6),
    (na.COMPLETE = 'complete'),
    (Yo.EventType = lt),
    (lt.OPEN = 'a'),
    (lt.CLOSE = 'b'),
    (lt.ERROR = 'c'),
    (lt.MESSAGE = 'd'),
    ($.prototype.listen = $.prototype.K),
    (U.prototype.listenOnce = U.prototype.L),
    (U.prototype.getLastError = U.prototype.Ka),
    (U.prototype.getLastErrorCode = U.prototype.Ba),
    (U.prototype.getStatus = U.prototype.Z),
    (U.prototype.getResponseJson = U.prototype.Oa),
    (U.prototype.getResponseText = U.prototype.oa),
    (U.prototype.send = U.prototype.ea),
    (U.prototype.setWithCredentials = U.prototype.Ha));
}).apply(
  typeof Xt < 'u'
    ? Xt
    : typeof self < 'u'
      ? self
      : typeof window < 'u'
        ? window
        : {}
);
const ds = '@firebase/firestore';
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class W {
  constructor(e) {
    this.uid = e;
  }
  isAuthenticated() {
    return this.uid != null;
  }
  toKey() {
    return this.isAuthenticated() ? 'uid:' + this.uid : 'anonymous-user';
  }
  isEqual(e) {
    return e.uid === this.uid;
  }
}
((W.UNAUTHENTICATED = new W(null)),
  (W.GOOGLE_CREDENTIALS = new W('google-credentials-uid')),
  (W.FIRST_PARTY = new W('first-party-uid')),
  (W.MOCK_USER = new W('mock-user')));
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ let Dt = '10.14.0';
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const tt = new dn('@firebase/firestore');
function re(n, ...e) {
  if (tt.logLevel <= O.DEBUG) {
    const i = e.map(ki);
    tt.debug(`Firestore (${Dt}): ${n}`, ...i);
  }
}
function Uo(n, ...e) {
  if (tt.logLevel <= O.ERROR) {
    const i = e.map(ki);
    tt.error(`Firestore (${Dt}): ${n}`, ...i);
  }
}
function yd(n, ...e) {
  if (tt.logLevel <= O.WARN) {
    const i = e.map(ki);
    tt.warn(`Firestore (${Dt}): ${n}`, ...i);
  }
}
function ki(n) {
  if (typeof n == 'string') return n;
  try {
    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */ return (function (i) {
      return JSON.stringify(i);
    })(n);
  } catch {
    return n;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Ri(n = 'Unexpected state') {
  const e = `FIRESTORE (${Dt}) INTERNAL ASSERTION FAILED: ` + n;
  throw (Uo(e), new Error(e));
}
function Et(n, e) {
  n || Ri();
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const J = {
  CANCELLED: 'cancelled',
  INVALID_ARGUMENT: 'invalid-argument',
  FAILED_PRECONDITION: 'failed-precondition',
};
class X extends oe {
  constructor(e, i) {
    (super(e, i),
      (this.code = e),
      (this.message = i),
      (this.toString = () =>
        `${this.name}: [code=${this.code}]: ${this.message}`));
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class At {
  constructor() {
    this.promise = new Promise((e, i) => {
      ((this.resolve = e), (this.reject = i));
    });
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class xo {
  constructor(e, i) {
    ((this.user = i),
      (this.type = 'OAuth'),
      (this.headers = new Map()),
      this.headers.set('Authorization', `Bearer ${e}`));
  }
}
class _d {
  getToken() {
    return Promise.resolve(null);
  }
  invalidateToken() {}
  start(e, i) {
    e.enqueueRetryable(() => i(W.UNAUTHENTICATED));
  }
  shutdown() {}
}
class Id {
  constructor(e) {
    ((this.token = e), (this.changeListener = null));
  }
  getToken() {
    return Promise.resolve(this.token);
  }
  invalidateToken() {}
  start(e, i) {
    ((this.changeListener = i), e.enqueueRetryable(() => i(this.token.user)));
  }
  shutdown() {
    this.changeListener = null;
  }
}
class wd {
  constructor(e) {
    ((this.t = e),
      (this.currentUser = W.UNAUTHENTICATED),
      (this.i = 0),
      (this.forceRefresh = !1),
      (this.auth = null));
  }
  start(e, i) {
    Et(this.o === void 0);
    let r = this.i;
    const o = v => (this.i !== r ? ((r = this.i), i(v)) : Promise.resolve());
    let c = new At();
    this.o = () => {
      (this.i++,
        (this.currentUser = this.u()),
        c.resolve(),
        (c = new At()),
        e.enqueueRetryable(() => o(this.currentUser)));
    };
    const h = () => {
        const v = c;
        e.enqueueRetryable(async () => {
          (await v.promise, await o(this.currentUser));
        });
      },
      p = v => {
        (re('FirebaseAuthCredentialsProvider', 'Auth detected'),
          (this.auth = v),
          this.o && (this.auth.addAuthTokenListener(this.o), h()));
      };
    (this.t.onInit(v => p(v)),
      setTimeout(() => {
        if (!this.auth) {
          const v = this.t.getImmediate({ optional: !0 });
          v
            ? p(v)
            : (re('FirebaseAuthCredentialsProvider', 'Auth not yet detected'),
              c.resolve(),
              (c = new At()));
        }
      }, 0),
      h());
  }
  getToken() {
    const e = this.i,
      i = this.forceRefresh;
    return (
      (this.forceRefresh = !1),
      this.auth
        ? this.auth
            .getToken(i)
            .then(r =>
              this.i !== e
                ? (re(
                    'FirebaseAuthCredentialsProvider',
                    'getToken aborted due to token change.'
                  ),
                  this.getToken())
                : r
                  ? (Et(typeof r.accessToken == 'string'),
                    new xo(r.accessToken, this.currentUser))
                  : null
            )
        : Promise.resolve(null)
    );
  }
  invalidateToken() {
    this.forceRefresh = !0;
  }
  shutdown() {
    (this.auth && this.o && this.auth.removeAuthTokenListener(this.o),
      (this.o = void 0));
  }
  u() {
    const e = this.auth && this.auth.getUid();
    return (Et(e === null || typeof e == 'string'), new W(e));
  }
}
class Td {
  constructor(e, i, r) {
    ((this.l = e),
      (this.h = i),
      (this.P = r),
      (this.type = 'FirstParty'),
      (this.user = W.FIRST_PARTY),
      (this.I = new Map()));
  }
  T() {
    return this.P ? this.P() : null;
  }
  get headers() {
    this.I.set('X-Goog-AuthUser', this.l);
    const e = this.T();
    return (
      e && this.I.set('Authorization', e),
      this.h && this.I.set('X-Goog-Iam-Authorization-Token', this.h),
      this.I
    );
  }
}
class Ed {
  constructor(e, i, r) {
    ((this.l = e), (this.h = i), (this.P = r));
  }
  getToken() {
    return Promise.resolve(new Td(this.l, this.h, this.P));
  }
  start(e, i) {
    e.enqueueRetryable(() => i(W.FIRST_PARTY));
  }
  shutdown() {}
  invalidateToken() {}
}
class Ad {
  constructor(e) {
    ((this.value = e),
      (this.type = 'AppCheck'),
      (this.headers = new Map()),
      e && e.length > 0 && this.headers.set('x-firebase-appcheck', this.value));
  }
}
class bd {
  constructor(e) {
    ((this.A = e),
      (this.forceRefresh = !1),
      (this.appCheck = null),
      (this.R = null));
  }
  start(e, i) {
    Et(this.o === void 0);
    const r = c => {
      c.error != null &&
        re(
          'FirebaseAppCheckTokenProvider',
          `Error getting App Check token; using placeholder token instead. Error: ${c.error.message}`
        );
      const h = c.token !== this.R;
      return (
        (this.R = c.token),
        re(
          'FirebaseAppCheckTokenProvider',
          `Received ${h ? 'new' : 'existing'} token.`
        ),
        h ? i(c.token) : Promise.resolve()
      );
    };
    this.o = c => {
      e.enqueueRetryable(() => r(c));
    };
    const o = c => {
      (re('FirebaseAppCheckTokenProvider', 'AppCheck detected'),
        (this.appCheck = c),
        this.o && this.appCheck.addTokenListener(this.o));
    };
    (this.A.onInit(c => o(c)),
      setTimeout(() => {
        if (!this.appCheck) {
          const c = this.A.getImmediate({ optional: !0 });
          c
            ? o(c)
            : re('FirebaseAppCheckTokenProvider', 'AppCheck not yet detected');
        }
      }, 0));
  }
  getToken() {
    const e = this.forceRefresh;
    return (
      (this.forceRefresh = !1),
      this.appCheck
        ? this.appCheck
            .getToken(e)
            .then(i =>
              i
                ? (Et(typeof i.token == 'string'),
                  (this.R = i.token),
                  new Ad(i.token))
                : null
            )
        : Promise.resolve(null)
    );
  }
  invalidateToken() {
    this.forceRefresh = !0;
  }
  shutdown() {
    (this.appCheck && this.o && this.appCheck.removeTokenListener(this.o),
      (this.o = void 0));
  }
}
function Sd(n) {
  return n.name === 'IndexedDbTransactionError';
}
class un {
  constructor(e, i) {
    ((this.projectId = e), (this.database = i || '(default)'));
  }
  static empty() {
    return new un('', '');
  }
  get isDefaultDatabase() {
    return this.database === '(default)';
  }
  isEqual(e) {
    return (
      e instanceof un &&
      e.projectId === this.projectId &&
      e.database === this.database
    );
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var fs, R;
(((R = fs || (fs = {}))[(R.OK = 0)] = 'OK'),
  (R[(R.CANCELLED = 1)] = 'CANCELLED'),
  (R[(R.UNKNOWN = 2)] = 'UNKNOWN'),
  (R[(R.INVALID_ARGUMENT = 3)] = 'INVALID_ARGUMENT'),
  (R[(R.DEADLINE_EXCEEDED = 4)] = 'DEADLINE_EXCEEDED'),
  (R[(R.NOT_FOUND = 5)] = 'NOT_FOUND'),
  (R[(R.ALREADY_EXISTS = 6)] = 'ALREADY_EXISTS'),
  (R[(R.PERMISSION_DENIED = 7)] = 'PERMISSION_DENIED'),
  (R[(R.UNAUTHENTICATED = 16)] = 'UNAUTHENTICATED'),
  (R[(R.RESOURCE_EXHAUSTED = 8)] = 'RESOURCE_EXHAUSTED'),
  (R[(R.FAILED_PRECONDITION = 9)] = 'FAILED_PRECONDITION'),
  (R[(R.ABORTED = 10)] = 'ABORTED'),
  (R[(R.OUT_OF_RANGE = 11)] = 'OUT_OF_RANGE'),
  (R[(R.UNIMPLEMENTED = 12)] = 'UNIMPLEMENTED'),
  (R[(R.INTERNAL = 13)] = 'INTERNAL'),
  (R[(R.UNAVAILABLE = 14)] = 'UNAVAILABLE'),
  (R[(R.DATA_LOSS = 15)] = 'DATA_LOSS'));
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ new Mo([4294967295, 4294967295], 0);
function Zn() {
  return typeof document < 'u' ? document : null;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class kd {
  constructor(e, i, r = 1e3, o = 1.5, c = 6e4) {
    ((this.ui = e),
      (this.timerId = i),
      (this.ko = r),
      (this.qo = o),
      (this.Qo = c),
      (this.Ko = 0),
      (this.$o = null),
      (this.Uo = Date.now()),
      this.reset());
  }
  reset() {
    this.Ko = 0;
  }
  Wo() {
    this.Ko = this.Qo;
  }
  Go(e) {
    this.cancel();
    const i = Math.floor(this.Ko + this.zo()),
      r = Math.max(0, Date.now() - this.Uo),
      o = Math.max(0, i - r);
    (o > 0 &&
      re(
        'ExponentialBackoff',
        `Backing off for ${o} ms (base delay: ${this.Ko} ms, delay with jitter: ${i} ms, last attempt: ${r} ms ago)`
      ),
      (this.$o = this.ui.enqueueAfterDelay(
        this.timerId,
        o,
        () => ((this.Uo = Date.now()), e())
      )),
      (this.Ko *= this.qo),
      this.Ko < this.ko && (this.Ko = this.ko),
      this.Ko > this.Qo && (this.Ko = this.Qo));
  }
  jo() {
    this.$o !== null && (this.$o.skipDelay(), (this.$o = null));
  }
  cancel() {
    this.$o !== null && (this.$o.cancel(), (this.$o = null));
  }
  zo() {
    return (Math.random() - 0.5) * this.Ko;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Ci {
  constructor(e, i, r, o, c) {
    ((this.asyncQueue = e),
      (this.timerId = i),
      (this.targetTimeMs = r),
      (this.op = o),
      (this.removalCallback = c),
      (this.deferred = new At()),
      (this.then = this.deferred.promise.then.bind(this.deferred.promise)),
      this.deferred.promise.catch(h => {}));
  }
  get promise() {
    return this.deferred.promise;
  }
  static createAndSchedule(e, i, r, o, c) {
    const h = Date.now() + r,
      p = new Ci(e, i, h, o, c);
    return (p.start(r), p);
  }
  start(e) {
    this.timerHandle = setTimeout(() => this.handleDelayElapsed(), e);
  }
  skipDelay() {
    return this.handleDelayElapsed();
  }
  cancel(e) {
    this.timerHandle !== null &&
      (this.clearTimeout(),
      this.deferred.reject(
        new X(J.CANCELLED, 'Operation cancelled' + (e ? ': ' + e : ''))
      ));
  }
  handleDelayElapsed() {
    this.asyncQueue.enqueueAndForget(() =>
      this.timerHandle !== null
        ? (this.clearTimeout(), this.op().then(e => this.deferred.resolve(e)))
        : Promise.resolve()
    );
  }
  clearTimeout() {
    this.timerHandle !== null &&
      (this.removalCallback(this),
      clearTimeout(this.timerHandle),
      (this.timerHandle = null));
  }
}
var ps, gs;
(((gs = ps || (ps = {})).ea = 'default'), (gs.Cache = 'cache'));
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Rd(n) {
  const e = {};
  return (
    n.timeoutSeconds !== void 0 && (e.timeoutSeconds = n.timeoutSeconds),
    e
  );
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const ms = new Map();
function Cd(n, e, i, r) {
  if (e === !0 && r === !0)
    throw new X(J.INVALID_ARGUMENT, `${n} and ${i} cannot be used together.`);
}
function Pd(n) {
  if (n === void 0) return 'undefined';
  if (n === null) return 'null';
  if (typeof n == 'string')
    return (
      n.length > 20 && (n = `${n.substring(0, 20)}...`),
      JSON.stringify(n)
    );
  if (typeof n == 'number' || typeof n == 'boolean') return '' + n;
  if (typeof n == 'object') {
    if (n instanceof Array) return 'an array';
    {
      const e = (function (r) {
        return r.constructor ? r.constructor.name : null;
      })(n);
      return e ? `a custom ${e} object` : 'an object';
    }
  }
  return typeof n == 'function' ? 'a function' : Ri();
}
function Od(n, e) {
  if (('_delegate' in n && (n = n._delegate), !(n instanceof e))) {
    if (e.name === n.constructor.name)
      throw new X(
        J.INVALID_ARGUMENT,
        'Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?'
      );
    {
      const i = Pd(n);
      throw new X(
        J.INVALID_ARGUMENT,
        `Expected type '${e.name}', but it was: ${i}`
      );
    }
  }
  return n;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class vs {
  constructor(e) {
    var i, r;
    if (e.host === void 0) {
      if (e.ssl !== void 0)
        throw new X(
          J.INVALID_ARGUMENT,
          "Can't provide ssl option if host option is not set"
        );
      ((this.host = 'firestore.googleapis.com'), (this.ssl = !0));
    } else
      ((this.host = e.host),
        (this.ssl = (i = e.ssl) === null || i === void 0 || i));
    if (
      ((this.credentials = e.credentials),
      (this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties),
      (this.localCache = e.localCache),
      e.cacheSizeBytes === void 0)
    )
      this.cacheSizeBytes = 41943040;
    else {
      if (e.cacheSizeBytes !== -1 && e.cacheSizeBytes < 1048576)
        throw new X(
          J.INVALID_ARGUMENT,
          'cacheSizeBytes must be at least 1048576'
        );
      this.cacheSizeBytes = e.cacheSizeBytes;
    }
    (Cd(
      'experimentalForceLongPolling',
      e.experimentalForceLongPolling,
      'experimentalAutoDetectLongPolling',
      e.experimentalAutoDetectLongPolling
    ),
      (this.experimentalForceLongPolling = !!e.experimentalForceLongPolling),
      this.experimentalForceLongPolling
        ? (this.experimentalAutoDetectLongPolling = !1)
        : e.experimentalAutoDetectLongPolling === void 0
          ? (this.experimentalAutoDetectLongPolling = !0)
          : (this.experimentalAutoDetectLongPolling =
              !!e.experimentalAutoDetectLongPolling),
      (this.experimentalLongPollingOptions = Rd(
        (r = e.experimentalLongPollingOptions) !== null && r !== void 0 ? r : {}
      )),
      (function (c) {
        if (c.timeoutSeconds !== void 0) {
          if (isNaN(c.timeoutSeconds))
            throw new X(
              J.INVALID_ARGUMENT,
              `invalid long polling timeout: ${c.timeoutSeconds} (must not be NaN)`
            );
          if (c.timeoutSeconds < 5)
            throw new X(
              J.INVALID_ARGUMENT,
              `invalid long polling timeout: ${c.timeoutSeconds} (minimum allowed value is 5)`
            );
          if (c.timeoutSeconds > 30)
            throw new X(
              J.INVALID_ARGUMENT,
              `invalid long polling timeout: ${c.timeoutSeconds} (maximum allowed value is 30)`
            );
        }
      })(this.experimentalLongPollingOptions),
      (this.useFetchStreams = !!e.useFetchStreams));
  }
  isEqual(e) {
    return (
      this.host === e.host &&
      this.ssl === e.ssl &&
      this.credentials === e.credentials &&
      this.cacheSizeBytes === e.cacheSizeBytes &&
      this.experimentalForceLongPolling === e.experimentalForceLongPolling &&
      this.experimentalAutoDetectLongPolling ===
        e.experimentalAutoDetectLongPolling &&
      (function (r, o) {
        return r.timeoutSeconds === o.timeoutSeconds;
      })(
        this.experimentalLongPollingOptions,
        e.experimentalLongPollingOptions
      ) &&
      this.ignoreUndefinedProperties === e.ignoreUndefinedProperties &&
      this.useFetchStreams === e.useFetchStreams
    );
  }
}
class Fo {
  constructor(e, i, r, o) {
    ((this._authCredentials = e),
      (this._appCheckCredentials = i),
      (this._databaseId = r),
      (this._app = o),
      (this.type = 'firestore-lite'),
      (this._persistenceKey = '(lite)'),
      (this._settings = new vs({})),
      (this._settingsFrozen = !1),
      (this._terminateTask = 'notTerminated'));
  }
  get app() {
    if (!this._app)
      throw new X(
        J.FAILED_PRECONDITION,
        "Firestore was not initialized using the Firebase SDK. 'app' is not available"
      );
    return this._app;
  }
  get _initialized() {
    return this._settingsFrozen;
  }
  get _terminated() {
    return this._terminateTask !== 'notTerminated';
  }
  _setSettings(e) {
    if (this._settingsFrozen)
      throw new X(
        J.FAILED_PRECONDITION,
        'Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.'
      );
    ((this._settings = new vs(e)),
      e.credentials !== void 0 &&
        (this._authCredentials = (function (r) {
          if (!r) return new _d();
          switch (r.type) {
            case 'firstParty':
              return new Ed(
                r.sessionIndex || '0',
                r.iamToken || null,
                r.authTokenFactory || null
              );
            case 'provider':
              return r.client;
            default:
              throw new X(
                J.INVALID_ARGUMENT,
                'makeAuthCredentialsProvider failed due to invalid credential type'
              );
          }
        })(e.credentials)));
  }
  _getSettings() {
    return this._settings;
  }
  _freezeSettings() {
    return ((this._settingsFrozen = !0), this._settings);
  }
  _delete() {
    return (
      this._terminateTask === 'notTerminated' &&
        (this._terminateTask = this._terminate()),
      this._terminateTask
    );
  }
  async _restart() {
    this._terminateTask === 'notTerminated'
      ? await this._terminate()
      : (this._terminateTask = 'notTerminated');
  }
  toJSON() {
    return {
      app: this._app,
      databaseId: this._databaseId,
      settings: this._settings,
    };
  }
  _terminate() {
    return (
      (function (i) {
        const r = ms.get(i);
        r &&
          (re('ComponentProvider', 'Removing Datastore'),
          ms.delete(i),
          r.terminate());
      })(this),
      Promise.resolve()
    );
  }
}
function Dd(n, e, i, r = {}) {
  var o;
  const c = (n = Od(n, Fo))._getSettings(),
    h = `${e}:${i}`;
  if (
    (c.host !== 'firestore.googleapis.com' &&
      c.host !== h &&
      yd(
        'Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.'
      ),
    n._setSettings(Object.assign(Object.assign({}, c), { host: h, ssl: !1 })),
    r.mockUserToken)
  ) {
    let p, v;
    if (typeof r.mockUserToken == 'string')
      ((p = r.mockUserToken), (v = W.MOCK_USER));
    else {
      p = Oa(
        r.mockUserToken,
        (o = n._app) === null || o === void 0 ? void 0 : o.options.projectId
      );
      const T = r.mockUserToken.sub || r.mockUserToken.user_id;
      if (!T)
        throw new X(
          J.INVALID_ARGUMENT,
          "mockUserToken must contain 'sub' or 'user_id' field!"
        );
      v = new W(T);
    }
    n._authCredentials = new Id(new xo(p, v));
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class ys {
  constructor(e = Promise.resolve()) {
    ((this.Pu = []),
      (this.Iu = !1),
      (this.Tu = []),
      (this.Eu = null),
      (this.du = !1),
      (this.Au = !1),
      (this.Ru = []),
      (this.t_ = new kd(this, 'async_queue_retry')),
      (this.Vu = () => {
        const r = Zn();
        (r &&
          re('AsyncQueue', 'Visibility state changed to ' + r.visibilityState),
          this.t_.jo());
      }),
      (this.mu = e));
    const i = Zn();
    i &&
      typeof i.addEventListener == 'function' &&
      i.addEventListener('visibilitychange', this.Vu);
  }
  get isShuttingDown() {
    return this.Iu;
  }
  enqueueAndForget(e) {
    this.enqueue(e);
  }
  enqueueAndForgetEvenWhileRestricted(e) {
    (this.fu(), this.gu(e));
  }
  enterRestrictedMode(e) {
    if (!this.Iu) {
      ((this.Iu = !0), (this.Au = e || !1));
      const i = Zn();
      i &&
        typeof i.removeEventListener == 'function' &&
        i.removeEventListener('visibilitychange', this.Vu);
    }
  }
  enqueue(e) {
    if ((this.fu(), this.Iu)) return new Promise(() => {});
    const i = new At();
    return this.gu(() =>
      this.Iu && this.Au
        ? Promise.resolve()
        : (e().then(i.resolve, i.reject), i.promise)
    ).then(() => i.promise);
  }
  enqueueRetryable(e) {
    this.enqueueAndForget(() => (this.Pu.push(e), this.pu()));
  }
  async pu() {
    if (this.Pu.length !== 0) {
      try {
        (await this.Pu[0](), this.Pu.shift(), this.t_.reset());
      } catch (e) {
        if (!Sd(e)) throw e;
        re('AsyncQueue', 'Operation failed with retryable error: ' + e);
      }
      this.Pu.length > 0 && this.t_.Go(() => this.pu());
    }
  }
  gu(e) {
    const i = this.mu.then(
      () => (
        (this.du = !0),
        e()
          .catch(r => {
            ((this.Eu = r), (this.du = !1));
            const o = (function (h) {
              let p = h.message || '';
              return (
                h.stack &&
                  (p = h.stack.includes(h.message)
                    ? h.stack
                    : h.message +
                      `
` +
                      h.stack),
                p
              );
            })(r);
            throw (Uo('INTERNAL UNHANDLED ERROR: ', o), r);
          })
          .then(r => ((this.du = !1), r))
      )
    );
    return ((this.mu = i), i);
  }
  enqueueAfterDelay(e, i, r) {
    (this.fu(), this.Ru.indexOf(e) > -1 && (i = 0));
    const o = Ci.createAndSchedule(this, e, i, r, c => this.yu(c));
    return (this.Tu.push(o), o);
  }
  fu() {
    this.Eu && Ri();
  }
  verifyOperationInProgress() {}
  async wu() {
    let e;
    do ((e = this.mu), await e);
    while (e !== this.mu);
  }
  Su(e) {
    for (const i of this.Tu) if (i.timerId === e) return !0;
    return !1;
  }
  bu(e) {
    return this.wu().then(() => {
      this.Tu.sort((i, r) => i.targetTimeMs - r.targetTimeMs);
      for (const i of this.Tu)
        if ((i.skipDelay(), e !== 'all' && i.timerId === e)) break;
      return this.wu();
    });
  }
  Du(e) {
    this.Ru.push(e);
  }
  yu(e) {
    const i = this.Tu.indexOf(e);
    this.Tu.splice(i, 1);
  }
}
class Nd extends Fo {
  constructor(e, i, r, o) {
    (super(e, i, r, o),
      (this.type = 'firestore'),
      (this._queue = new ys()),
      (this._persistenceKey = o?.name || '[DEFAULT]'));
  }
  async _terminate() {
    if (this._firestoreClient) {
      const e = this._firestoreClient.terminate();
      ((this._queue = new ys(e)), (this._firestoreClient = void 0), await e);
    }
  }
}
function Ld(n, e) {
  const i = typeof n == 'object' ? n : ui(),
    r = typeof n == 'string' ? n : '(default)',
    o = ze(i, 'firestore').getImmediate({ identifier: r });
  if (!o._initialized) {
    const c = Ca('firestore');
    c && Dd(o, ...c);
  }
  return o;
}
(function (e, i = !0) {
  ((function (o) {
    Dt = o;
  })(nt),
    le(
      new se(
        'firestore',
        (r, { instanceIdentifier: o, options: c }) => {
          const h = r.getProvider('app').getImmediate(),
            p = new Nd(
              new wd(r.getProvider('auth-internal')),
              new bd(r.getProvider('app-check-internal')),
              (function (T, A) {
                if (
                  !Object.prototype.hasOwnProperty.apply(T.options, [
                    'projectId',
                  ])
                )
                  throw new X(
                    J.INVALID_ARGUMENT,
                    '"projectId" not provided in firebase.initializeApp.'
                  );
                return new un(T.options.projectId, A);
              })(h, o),
              h
            );
          return (
            (c = Object.assign({ useFetchStreams: i }, c)),
            p._setSettings(c),
            p
          );
        },
        'PUBLIC'
      ).setMultipleInstances(!0)
    ),
    te(ds, '4.7.3', e),
    te(ds, '4.7.3', 'esm2017'));
})();
const Md = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    databaseURL: 'https://ball-network-web-default-rtdb.firebaseio.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
    measurementId: 'G-ZS07SKSRRL',
  },
  Pi = Os(Md);
md(Pi);
Ld(Pi);
vh(Pi);
export { Pi as a };
//# sourceMappingURL=firebaseConfig-DCH0t8Yd.js.map
