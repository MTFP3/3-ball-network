var Ai = {};
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
 */ const ys = function (n) {
    const e = [];
    let r = 0;
    for (let i = 0; i < n.length; i++) {
      let o = n.charCodeAt(i);
      o < 128
        ? (e[r++] = o)
        : o < 2048
          ? ((e[r++] = (o >> 6) | 192), (e[r++] = (o & 63) | 128))
          : (o & 64512) === 55296 &&
              i + 1 < n.length &&
              (n.charCodeAt(i + 1) & 64512) === 56320
            ? ((o = 65536 + ((o & 1023) << 10) + (n.charCodeAt(++i) & 1023)),
              (e[r++] = (o >> 18) | 240),
              (e[r++] = ((o >> 12) & 63) | 128),
              (e[r++] = ((o >> 6) & 63) | 128),
              (e[r++] = (o & 63) | 128))
            : ((e[r++] = (o >> 12) | 224),
              (e[r++] = ((o >> 6) & 63) | 128),
              (e[r++] = (o & 63) | 128));
    }
    return e;
  },
  va = function (n) {
    const e = [];
    let r = 0,
      i = 0;
    for (; r < n.length; ) {
      const o = n[r++];
      if (o < 128) e[i++] = String.fromCharCode(o);
      else if (o > 191 && o < 224) {
        const c = n[r++];
        e[i++] = String.fromCharCode(((o & 31) << 6) | (c & 63));
      } else if (o > 239 && o < 365) {
        const c = n[r++],
          l = n[r++],
          p = n[r++],
          v =
            (((o & 7) << 18) | ((c & 63) << 12) | ((l & 63) << 6) | (p & 63)) -
            65536;
        ((e[i++] = String.fromCharCode(55296 + (v >> 10))),
          (e[i++] = String.fromCharCode(56320 + (v & 1023))));
      } else {
        const c = n[r++],
          l = n[r++];
        e[i++] = String.fromCharCode(
          ((o & 15) << 12) | ((c & 63) << 6) | (l & 63)
        );
      }
    }
    return e.join('');
  },
  vs = {
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
      const r = e ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
        i = [];
      for (let o = 0; o < n.length; o += 3) {
        const c = n[o],
          l = o + 1 < n.length,
          p = l ? n[o + 1] : 0,
          v = o + 2 < n.length,
          T = v ? n[o + 2] : 0,
          S = c >> 2,
          k = ((c & 3) << 4) | (p >> 4);
        let A = ((p & 15) << 2) | (T >> 6),
          L = T & 63;
        (v || ((L = 64), l || (A = 64)), i.push(r[S], r[k], r[A], r[L]));
      }
      return i.join('');
    },
    encodeString(n, e) {
      return this.HAS_NATIVE_SUPPORT && !e
        ? btoa(n)
        : this.encodeByteArray(ys(n), e);
    },
    decodeString(n, e) {
      return this.HAS_NATIVE_SUPPORT && !e
        ? atob(n)
        : va(this.decodeStringToByteArray(n, e));
    },
    decodeStringToByteArray(n, e) {
      this.init_();
      const r = e ? this.charToByteMapWebSafe_ : this.charToByteMap_,
        i = [];
      for (let o = 0; o < n.length; ) {
        const c = r[n.charAt(o++)],
          l = o < n.length ? r[n.charAt(o)] : 0;
        ++o;
        const p = o < n.length ? r[n.charAt(o)] : 64;
        ++o;
        const v = o < n.length ? r[n.charAt(o)] : 64;
        if ((++o, c == null || l == null || p == null || v == null))
          throw new wa();
        const T = (c << 2) | (l >> 4);
        if ((i.push(T), p !== 64)) {
          const S = ((l << 4) & 240) | (p >> 2);
          if ((i.push(S), v !== 64)) {
            const k = ((p << 6) & 192) | v;
            i.push(k);
          }
        }
      }
      return i;
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
class wa extends Error {
  constructor() {
    (super(...arguments), (this.name = 'DecodeBase64StringError'));
  }
}
const ba = function (n) {
    const e = ys(n);
    return vs.encodeByteArray(e, !0);
  },
  en = function (n) {
    return ba(n).replace(/\./g, '');
  },
  ws = function (n) {
    try {
      return vs.decodeString(n, !0);
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
 */ function Ia() {
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
 */ const Ta = () => Ia().__FIREBASE_DEFAULTS__,
  _a = () => {
    if (typeof process > 'u' || typeof Ai > 'u') return;
    const n = Ai.__FIREBASE_DEFAULTS__;
    if (n) return JSON.parse(n);
  },
  Ea = () => {
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
  ar = () => {
    try {
      return Ta() || _a() || Ea();
    } catch (n) {
      console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);
      return;
    }
  },
  bs = n => {
    var e, r;
    return (r =
      (e = ar()) === null || e === void 0 ? void 0 : e.emulatorHosts) ===
      null || r === void 0
      ? void 0
      : r[n];
  },
  Sa = n => {
    const e = bs(n);
    if (!e) return;
    const r = e.lastIndexOf(':');
    if (r <= 0 || r + 1 === e.length)
      throw new Error(`Invalid host ${e} with no separate hostname and port!`);
    const i = parseInt(e.substring(r + 1), 10);
    return e[0] === '[' ? [e.substring(1, r - 1), i] : [e.substring(0, r), i];
  },
  Is = () => {
    var n;
    return (n = ar()) === null || n === void 0 ? void 0 : n.config;
  },
  Ts = n => {
    var e;
    return (e = ar()) === null || e === void 0 ? void 0 : e[`_${n}`];
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
 */ class ka {
  constructor() {
    ((this.reject = () => {}),
      (this.resolve = () => {}),
      (this.promise = new Promise((e, r) => {
        ((this.resolve = e), (this.reject = r));
      })));
  }
  wrapCallback(e) {
    return (r, i) => {
      (r ? this.reject(r) : this.resolve(i),
        typeof e == 'function' &&
          (this.promise.catch(() => {}), e.length === 1 ? e(r) : e(r, i)));
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
 */ function Aa(n, e) {
  if (n.uid)
    throw new Error(
      'The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.'
    );
  const r = { alg: 'none', type: 'JWT' },
    i = e || 'demo-project',
    o = n.iat || 0,
    c = n.sub || n.user_id;
  if (!c)
    throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
  const l = Object.assign(
    {
      iss: `https://securetoken.google.com/${i}`,
      aud: i,
      iat: o,
      exp: o + 3600,
      auth_time: o,
      sub: c,
      user_id: c,
      firebase: { sign_in_provider: 'custom', identities: {} },
    },
    n
  );
  return [en(JSON.stringify(r)), en(JSON.stringify(l)), ''].join('.');
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
 */ function K() {
  return typeof navigator < 'u' && typeof navigator.userAgent == 'string'
    ? navigator.userAgent
    : '';
}
function Ca() {
  return (
    typeof window < 'u' &&
    !!(window.cordova || window.phonegap || window.PhoneGap) &&
    /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(K())
  );
}
function Pa() {
  return typeof navigator < 'u' && navigator.userAgent === 'Cloudflare-Workers';
}
function _s() {
  const n =
    typeof chrome == 'object'
      ? chrome.runtime
      : typeof browser == 'object'
        ? browser.runtime
        : void 0;
  return typeof n == 'object' && n.id !== void 0;
}
function Oa() {
  return typeof navigator == 'object' && navigator.product === 'ReactNative';
}
function Ra() {
  const n = K();
  return n.indexOf('MSIE ') >= 0 || n.indexOf('Trident/') >= 0;
}
function Es() {
  try {
    return typeof indexedDB == 'object';
  } catch {
    return !1;
  }
}
function Ss() {
  return new Promise((n, e) => {
    try {
      let r = !0;
      const i = 'validate-browser-context-for-indexeddb-analytics-module',
        o = self.indexedDB.open(i);
      ((o.onsuccess = () => {
        (o.result.close(), r || self.indexedDB.deleteDatabase(i), n(!0));
      }),
        (o.onupgradeneeded = () => {
          r = !1;
        }),
        (o.onerror = () => {
          var c;
          e(
            ((c = o.error) === null || c === void 0 ? void 0 : c.message) || ''
          );
        }));
    } catch (r) {
      e(r);
    }
  });
}
function Da() {
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
 */ const Na = 'FirebaseError';
class oe extends Error {
  constructor(e, r, i) {
    (super(r),
      (this.code = e),
      (this.customData = i),
      (this.name = Na),
      Object.setPrototypeOf(this, oe.prototype),
      Error.captureStackTrace &&
        Error.captureStackTrace(this, Be.prototype.create));
  }
}
class Be {
  constructor(e, r, i) {
    ((this.service = e), (this.serviceName = r), (this.errors = i));
  }
  create(e, ...r) {
    const i = r[0] || {},
      o = `${this.service}/${e}`,
      c = this.errors[e],
      l = c ? La(c, i) : 'Error',
      p = `${this.serviceName}: ${l} (${o}).`;
    return new oe(o, p, i);
  }
}
function La(n, e) {
  return n.replace(Ma, (r, i) => {
    const o = e[i];
    return o != null ? String(o) : `<${i}?>`;
  });
}
const Ma = /\{\$([^}]+)}/g;
function Ua(n) {
  for (const e in n) if (Object.prototype.hasOwnProperty.call(n, e)) return !1;
  return !0;
}
function Et(n, e) {
  if (n === e) return !0;
  const r = Object.keys(n),
    i = Object.keys(e);
  for (const o of r) {
    if (!i.includes(o)) return !1;
    const c = n[o],
      l = e[o];
    if (Ci(c) && Ci(l)) {
      if (!Et(c, l)) return !1;
    } else if (c !== l) return !1;
  }
  for (const o of i) if (!r.includes(o)) return !1;
  return !0;
}
function Ci(n) {
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
 */ function At(n) {
  const e = [];
  for (const [r, i] of Object.entries(n))
    Array.isArray(i)
      ? i.forEach(o => {
          e.push(encodeURIComponent(r) + '=' + encodeURIComponent(o));
        })
      : e.push(encodeURIComponent(r) + '=' + encodeURIComponent(i));
  return e.length ? '&' + e.join('&') : '';
}
function ja(n, e) {
  const r = new xa(n, e);
  return r.subscribe.bind(r);
}
class xa {
  constructor(e, r) {
    ((this.observers = []),
      (this.unsubscribes = []),
      (this.observerCount = 0),
      (this.task = Promise.resolve()),
      (this.finalized = !1),
      (this.onNoObservers = r),
      this.task
        .then(() => {
          e(this);
        })
        .catch(i => {
          this.error(i);
        }));
  }
  next(e) {
    this.forEachObserver(r => {
      r.next(e);
    });
  }
  error(e) {
    (this.forEachObserver(r => {
      r.error(e);
    }),
      this.close(e));
  }
  complete() {
    (this.forEachObserver(e => {
      e.complete();
    }),
      this.close());
  }
  subscribe(e, r, i) {
    let o;
    if (e === void 0 && r === void 0 && i === void 0)
      throw new Error('Missing Observer.');
    (Fa(e, ['next', 'error', 'complete'])
      ? (o = e)
      : (o = { next: e, error: r, complete: i }),
      o.next === void 0 && (o.next = $n),
      o.error === void 0 && (o.error = $n),
      o.complete === void 0 && (o.complete = $n));
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
      for (let r = 0; r < this.observers.length; r++) this.sendOne(r, e);
  }
  sendOne(e, r) {
    this.task.then(() => {
      if (this.observers !== void 0 && this.observers[e] !== void 0)
        try {
          r(this.observers[e]);
        } catch (i) {
          typeof console < 'u' && console.error && console.error(i);
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
function Fa(n, e) {
  if (typeof n != 'object' || n === null) return !1;
  for (const r of e) if (r in n && typeof n[r] == 'function') return !0;
  return !1;
}
function $n() {}
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
 */ const Ha = 1e3,
  $a = 2,
  Va = 4 * 60 * 60 * 1e3,
  Ba = 0.5;
function Pi(n, e = Ha, r = $a) {
  const i = e * Math.pow(r, n),
    o = Math.round(Ba * i * (Math.random() - 0.5) * 2);
  return Math.min(Va, i + o);
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
  constructor(e, r, i) {
    ((this.name = e),
      (this.instanceFactory = r),
      (this.type = i),
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
 */ const je = '[DEFAULT]';
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
 */ class za {
  constructor(e, r) {
    ((this.name = e),
      (this.container = r),
      (this.component = null),
      (this.instances = new Map()),
      (this.instancesDeferred = new Map()),
      (this.instancesOptions = new Map()),
      (this.onInitCallbacks = new Map()));
  }
  get(e) {
    const r = this.normalizeInstanceIdentifier(e);
    if (!this.instancesDeferred.has(r)) {
      const i = new ka();
      if (
        (this.instancesDeferred.set(r, i),
        this.isInitialized(r) || this.shouldAutoInitialize())
      )
        try {
          const o = this.getOrInitializeService({ instanceIdentifier: r });
          o && i.resolve(o);
        } catch {}
    }
    return this.instancesDeferred.get(r).promise;
  }
  getImmediate(e) {
    var r;
    const i = this.normalizeInstanceIdentifier(e?.identifier),
      o = (r = e?.optional) !== null && r !== void 0 ? r : !1;
    if (this.isInitialized(i) || this.shouldAutoInitialize())
      try {
        return this.getOrInitializeService({ instanceIdentifier: i });
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
      if (Ka(e))
        try {
          this.getOrInitializeService({ instanceIdentifier: je });
        } catch {}
      for (const [r, i] of this.instancesDeferred.entries()) {
        const o = this.normalizeInstanceIdentifier(r);
        try {
          const c = this.getOrInitializeService({ instanceIdentifier: o });
          i.resolve(c);
        } catch {}
      }
    }
  }
  clearInstance(e = je) {
    (this.instancesDeferred.delete(e),
      this.instancesOptions.delete(e),
      this.instances.delete(e));
  }
  async delete() {
    const e = Array.from(this.instances.values());
    await Promise.all([
      ...e.filter(r => 'INTERNAL' in r).map(r => r.INTERNAL.delete()),
      ...e.filter(r => '_delete' in r).map(r => r._delete()),
    ]);
  }
  isComponentSet() {
    return this.component != null;
  }
  isInitialized(e = je) {
    return this.instances.has(e);
  }
  getOptions(e = je) {
    return this.instancesOptions.get(e) || {};
  }
  initialize(e = {}) {
    const { options: r = {} } = e,
      i = this.normalizeInstanceIdentifier(e.instanceIdentifier);
    if (this.isInitialized(i))
      throw Error(`${this.name}(${i}) has already been initialized`);
    if (!this.isComponentSet())
      throw Error(`Component ${this.name} has not been registered yet`);
    const o = this.getOrInitializeService({
      instanceIdentifier: i,
      options: r,
    });
    for (const [c, l] of this.instancesDeferred.entries()) {
      const p = this.normalizeInstanceIdentifier(c);
      i === p && l.resolve(o);
    }
    return o;
  }
  onInit(e, r) {
    var i;
    const o = this.normalizeInstanceIdentifier(r),
      c =
        (i = this.onInitCallbacks.get(o)) !== null && i !== void 0
          ? i
          : new Set();
    (c.add(e), this.onInitCallbacks.set(o, c));
    const l = this.instances.get(o);
    return (
      l && e(l, o),
      () => {
        c.delete(e);
      }
    );
  }
  invokeOnInitCallbacks(e, r) {
    const i = this.onInitCallbacks.get(r);
    if (i)
      for (const o of i)
        try {
          o(e, r);
        } catch {}
  }
  getOrInitializeService({ instanceIdentifier: e, options: r = {} }) {
    let i = this.instances.get(e);
    if (
      !i &&
      this.component &&
      ((i = this.component.instanceFactory(this.container, {
        instanceIdentifier: qa(e),
        options: r,
      })),
      this.instances.set(e, i),
      this.instancesOptions.set(e, r),
      this.invokeOnInitCallbacks(i, e),
      this.component.onInstanceCreated)
    )
      try {
        this.component.onInstanceCreated(this.container, e, i);
      } catch {}
    return i || null;
  }
  normalizeInstanceIdentifier(e = je) {
    return this.component ? (this.component.multipleInstances ? e : je) : e;
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== 'EXPLICIT';
  }
}
function qa(n) {
  return n === je ? void 0 : n;
}
function Ka(n) {
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
 */ class Ga {
  constructor(e) {
    ((this.name = e), (this.providers = new Map()));
  }
  addComponent(e) {
    const r = this.getProvider(e.name);
    if (r.isComponentSet())
      throw new Error(
        `Component ${e.name} has already been registered with ${this.name}`
      );
    r.setComponent(e);
  }
  addOrOverwriteComponent(e) {
    (this.getProvider(e.name).isComponentSet() && this.providers.delete(e.name),
      this.addComponent(e));
  }
  getProvider(e) {
    if (this.providers.has(e)) return this.providers.get(e);
    const r = new za(e, this);
    return (this.providers.set(e, r), r);
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
const Wa = {
    debug: O.DEBUG,
    verbose: O.VERBOSE,
    info: O.INFO,
    warn: O.WARN,
    error: O.ERROR,
    silent: O.SILENT,
  },
  Ja = O.INFO,
  Xa = {
    [O.DEBUG]: 'log',
    [O.VERBOSE]: 'log',
    [O.INFO]: 'info',
    [O.WARN]: 'warn',
    [O.ERROR]: 'error',
  },
  Ya = (n, e, ...r) => {
    if (e < n.logLevel) return;
    const i = new Date().toISOString(),
      o = Xa[e];
    if (o) console[o](`[${i}]  ${n.name}:`, ...r);
    else
      throw new Error(
        `Attempted to log a message with an invalid logType (value: ${e})`
      );
  };
class un {
  constructor(e) {
    ((this.name = e),
      (this._logLevel = Ja),
      (this._logHandler = Ya),
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
    this._logLevel = typeof e == 'string' ? Wa[e] : e;
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
const Qa = (n, e) => e.some(r => n instanceof r);
let Oi, Ri;
function Za() {
  return (
    Oi ||
    (Oi = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])
  );
}
function ec() {
  return (
    Ri ||
    (Ri = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey,
    ])
  );
}
const ks = new WeakMap(),
  Qn = new WeakMap(),
  As = new WeakMap(),
  Vn = new WeakMap(),
  cr = new WeakMap();
function tc(n) {
  const e = new Promise((r, i) => {
    const o = () => {
        (n.removeEventListener('success', c),
          n.removeEventListener('error', l));
      },
      c = () => {
        (r(Oe(n.result)), o());
      },
      l = () => {
        (i(n.error), o());
      };
    (n.addEventListener('success', c), n.addEventListener('error', l));
  });
  return (
    e
      .then(r => {
        r instanceof IDBCursor && ks.set(r, n);
      })
      .catch(() => {}),
    cr.set(e, n),
    e
  );
}
function nc(n) {
  if (Qn.has(n)) return;
  const e = new Promise((r, i) => {
    const o = () => {
        (n.removeEventListener('complete', c),
          n.removeEventListener('error', l),
          n.removeEventListener('abort', l));
      },
      c = () => {
        (r(), o());
      },
      l = () => {
        (i(n.error || new DOMException('AbortError', 'AbortError')), o());
      };
    (n.addEventListener('complete', c),
      n.addEventListener('error', l),
      n.addEventListener('abort', l));
  });
  Qn.set(n, e);
}
let Zn = {
  get(n, e, r) {
    if (n instanceof IDBTransaction) {
      if (e === 'done') return Qn.get(n);
      if (e === 'objectStoreNames') return n.objectStoreNames || As.get(n);
      if (e === 'store')
        return r.objectStoreNames[1]
          ? void 0
          : r.objectStore(r.objectStoreNames[0]);
    }
    return Oe(n[e]);
  },
  set(n, e, r) {
    return ((n[e] = r), !0);
  },
  has(n, e) {
    return n instanceof IDBTransaction && (e === 'done' || e === 'store')
      ? !0
      : e in n;
  },
};
function rc(n) {
  Zn = n(Zn);
}
function ic(n) {
  return n === IDBDatabase.prototype.transaction &&
    !('objectStoreNames' in IDBTransaction.prototype)
    ? function (e, ...r) {
        const i = n.call(Bn(this), e, ...r);
        return (As.set(i, e.sort ? e.sort() : [e]), Oe(i));
      }
    : ec().includes(n)
      ? function (...e) {
          return (n.apply(Bn(this), e), Oe(ks.get(this)));
        }
      : function (...e) {
          return Oe(n.apply(Bn(this), e));
        };
}
function sc(n) {
  return typeof n == 'function'
    ? ic(n)
    : (n instanceof IDBTransaction && nc(n),
      Qa(n, Za()) ? new Proxy(n, Zn) : n);
}
function Oe(n) {
  if (n instanceof IDBRequest) return tc(n);
  if (Vn.has(n)) return Vn.get(n);
  const e = sc(n);
  return (e !== n && (Vn.set(n, e), cr.set(e, n)), e);
}
const Bn = n => cr.get(n);
function Cs(n, e, { blocked: r, upgrade: i, blocking: o, terminated: c } = {}) {
  const l = indexedDB.open(n, e),
    p = Oe(l);
  return (
    i &&
      l.addEventListener('upgradeneeded', v => {
        i(Oe(l.result), v.oldVersion, v.newVersion, Oe(l.transaction), v);
      }),
    r && l.addEventListener('blocked', v => r(v.oldVersion, v.newVersion, v)),
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
const oc = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'],
  ac = ['put', 'add', 'delete', 'clear'],
  zn = new Map();
function Di(n, e) {
  if (!(n instanceof IDBDatabase && !(e in n) && typeof e == 'string')) return;
  if (zn.get(e)) return zn.get(e);
  const r = e.replace(/FromIndex$/, ''),
    i = e !== r,
    o = ac.includes(r);
  if (
    !(r in (i ? IDBIndex : IDBObjectStore).prototype) ||
    !(o || oc.includes(r))
  )
    return;
  const c = async function (l, ...p) {
    const v = this.transaction(l, o ? 'readwrite' : 'readonly');
    let T = v.store;
    return (
      i && (T = T.index(p.shift())),
      (await Promise.all([T[r](...p), o && v.done]))[0]
    );
  };
  return (zn.set(e, c), c);
}
rc(n => ({
  ...n,
  get: (e, r, i) => Di(e, r) || n.get(e, r, i),
  has: (e, r) => !!Di(e, r) || n.has(e, r),
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
 */ class cc {
  constructor(e) {
    this.container = e;
  }
  getPlatformInfoString() {
    return this.container
      .getProviders()
      .map(e => {
        if (hc(e)) {
          const r = e.getImmediate();
          return `${r.library}/${r.version}`;
        } else return null;
      })
      .filter(e => e)
      .join(' ');
  }
}
function hc(n) {
  return n.getComponent()?.type === 'VERSION';
}
const er = '@firebase/app',
  Ni = '0.10.13';
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
 */ const ye = new un('@firebase/app'),
  lc = '@firebase/app-compat',
  uc = '@firebase/analytics-compat',
  dc = '@firebase/analytics',
  fc = '@firebase/app-check-compat',
  pc = '@firebase/app-check',
  gc = '@firebase/auth',
  mc = '@firebase/auth-compat',
  yc = '@firebase/database',
  vc = '@firebase/data-connect',
  wc = '@firebase/database-compat',
  bc = '@firebase/functions',
  Ic = '@firebase/functions-compat',
  Tc = '@firebase/installations',
  _c = '@firebase/installations-compat',
  Ec = '@firebase/messaging',
  Sc = '@firebase/messaging-compat',
  kc = '@firebase/performance',
  Ac = '@firebase/performance-compat',
  Cc = '@firebase/remote-config',
  Pc = '@firebase/remote-config-compat',
  Oc = '@firebase/storage',
  Rc = '@firebase/storage-compat',
  Dc = '@firebase/firestore',
  Nc = '@firebase/vertexai-preview',
  Lc = '@firebase/firestore-compat',
  Mc = 'firebase',
  Uc = '10.14.1';
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
 */ const tr = '[DEFAULT]',
  jc = {
    [er]: 'fire-core',
    [lc]: 'fire-core-compat',
    [dc]: 'fire-analytics',
    [uc]: 'fire-analytics-compat',
    [pc]: 'fire-app-check',
    [fc]: 'fire-app-check-compat',
    [gc]: 'fire-auth',
    [mc]: 'fire-auth-compat',
    [yc]: 'fire-rtdb',
    [vc]: 'fire-data-connect',
    [wc]: 'fire-rtdb-compat',
    [bc]: 'fire-fn',
    [Ic]: 'fire-fn-compat',
    [Tc]: 'fire-iid',
    [_c]: 'fire-iid-compat',
    [Ec]: 'fire-fcm',
    [Sc]: 'fire-fcm-compat',
    [kc]: 'fire-perf',
    [Ac]: 'fire-perf-compat',
    [Cc]: 'fire-rc',
    [Pc]: 'fire-rc-compat',
    [Oc]: 'fire-gcs',
    [Rc]: 'fire-gcs-compat',
    [Dc]: 'fire-fst',
    [Lc]: 'fire-fst-compat',
    [Nc]: 'fire-vertex',
    'fire-js': 'fire-js',
    [Mc]: 'fire-js-all',
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
 */ const tn = new Map(),
  xc = new Map(),
  nr = new Map();
function Li(n, e) {
  try {
    n.container.addComponent(e);
  } catch (r) {
    ye.debug(
      `Component ${e.name} failed to register with FirebaseApp ${n.name}`,
      r
    );
  }
}
function he(n) {
  const e = n.name;
  if (nr.has(e))
    return (
      ye.debug(`There were multiple attempts to register component ${e}.`),
      !1
    );
  nr.set(e, n);
  for (const r of tn.values()) Li(r, n);
  for (const r of xc.values()) Li(r, n);
  return !0;
}
function ze(n, e) {
  const r = n.container.getProvider('heartbeat').getImmediate({ optional: !0 });
  return (r && r.triggerHeartbeat(), n.container.getProvider(e));
}
function Pe(n) {
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
 */ const Fc = {
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
  Re = new Be('app', 'Firebase', Fc);
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
 */ class Hc {
  constructor(e, r, i) {
    ((this._isDeleted = !1),
      (this._options = Object.assign({}, e)),
      (this._config = Object.assign({}, r)),
      (this._name = r.name),
      (this._automaticDataCollectionEnabled = r.automaticDataCollectionEnabled),
      (this._container = i),
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
    if (this.isDeleted) throw Re.create('app-deleted', { appName: this._name });
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
 */ const nt = Uc;
function Ps(n, e = {}) {
  let r = n;
  typeof e != 'object' && (e = { name: e });
  const i = Object.assign({ name: tr, automaticDataCollectionEnabled: !1 }, e),
    o = i.name;
  if (typeof o != 'string' || !o)
    throw Re.create('bad-app-name', { appName: String(o) });
  if ((r || (r = Is()), !r)) throw Re.create('no-options');
  const c = tn.get(o);
  if (c) {
    if (Et(r, c.options) && Et(i, c.config)) return c;
    throw Re.create('duplicate-app', { appName: o });
  }
  const l = new Ga(o);
  for (const v of nr.values()) l.addComponent(v);
  const p = new Hc(r, i, l);
  return (tn.set(o, p), p);
}
function hr(n = tr) {
  const e = tn.get(n);
  if (!e && n === tr && Is()) return Ps();
  if (!e) throw Re.create('no-app', { appName: n });
  return e;
}
function te(n, e, r) {
  var i;
  let o = (i = jc[n]) !== null && i !== void 0 ? i : n;
  r && (o += `-${r}`);
  const c = o.match(/\s|\//),
    l = e.match(/\s|\//);
  if (c || l) {
    const p = [`Unable to register library "${o}" with version "${e}":`];
    (c &&
      p.push(
        `library name "${o}" contains illegal characters (whitespace or "/")`
      ),
      c && l && p.push('and'),
      l &&
        p.push(
          `version name "${e}" contains illegal characters (whitespace or "/")`
        ),
      ye.warn(p.join(' ')));
    return;
  }
  he(new se(`${o}-version`, () => ({ library: o, version: e }), 'VERSION'));
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
 */ const $c = 'firebase-heartbeat-database',
  Vc = 1,
  St = 'firebase-heartbeat-store';
let qn = null;
function Os() {
  return (
    qn ||
      (qn = Cs($c, Vc, {
        upgrade: (n, e) => {
          switch (e) {
            case 0:
              try {
                n.createObjectStore(St);
              } catch (r) {
                console.warn(r);
              }
          }
        },
      }).catch(n => {
        throw Re.create('idb-open', { originalErrorMessage: n.message });
      })),
    qn
  );
}
async function Bc(n) {
  try {
    const e = (await Os()).transaction(St),
      r = await e.objectStore(St).get(Rs(n));
    return (await e.done, r);
  } catch (e) {
    if (e instanceof oe) ye.warn(e.message);
    else {
      const r = Re.create('idb-get', { originalErrorMessage: e?.message });
      ye.warn(r.message);
    }
  }
}
async function Mi(n, e) {
  try {
    const r = (await Os()).transaction(St, 'readwrite');
    (await r.objectStore(St).put(e, Rs(n)), await r.done);
  } catch (r) {
    if (r instanceof oe) ye.warn(r.message);
    else {
      const i = Re.create('idb-set', { originalErrorMessage: r?.message });
      ye.warn(i.message);
    }
  }
}
function Rs(n) {
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
 */ const zc = 1024,
  qc = 30 * 24 * 60 * 60 * 1e3;
class Kc {
  constructor(e) {
    ((this.container = e), (this._heartbeatsCache = null));
    const r = this.container.getProvider('app').getImmediate();
    ((this._storage = new Wc(r)),
      (this._heartbeatsCachePromise = this._storage
        .read()
        .then(i => ((this._heartbeatsCache = i), i))));
  }
  async triggerHeartbeat() {
    var e, r;
    try {
      const i = this.container
          .getProvider('platform-logger')
          .getImmediate()
          .getPlatformInfoString(),
        o = Ui();
      return (((e = this._heartbeatsCache) === null || e === void 0
        ? void 0
        : e.heartbeats) == null &&
        ((this._heartbeatsCache = await this._heartbeatsCachePromise),
        ((r = this._heartbeatsCache) === null || r === void 0
          ? void 0
          : r.heartbeats) == null)) ||
        this._heartbeatsCache.lastSentHeartbeatDate === o ||
        this._heartbeatsCache.heartbeats.some(c => c.date === o)
        ? void 0
        : (this._heartbeatsCache.heartbeats.push({ date: o, agent: i }),
          (this._heartbeatsCache.heartbeats =
            this._heartbeatsCache.heartbeats.filter(c => {
              const l = new Date(c.date).valueOf();
              return Date.now() - l <= qc;
            })),
          this._storage.overwrite(this._heartbeatsCache));
    } catch (i) {
      ye.warn(i);
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
      const r = Ui(),
        { heartbeatsToSend: i, unsentEntries: o } = Gc(
          this._heartbeatsCache.heartbeats
        ),
        c = en(JSON.stringify({ version: 2, heartbeats: i }));
      return (
        (this._heartbeatsCache.lastSentHeartbeatDate = r),
        o.length > 0
          ? ((this._heartbeatsCache.heartbeats = o),
            await this._storage.overwrite(this._heartbeatsCache))
          : ((this._heartbeatsCache.heartbeats = []),
            this._storage.overwrite(this._heartbeatsCache)),
        c
      );
    } catch (r) {
      return (ye.warn(r), '');
    }
  }
}
function Ui() {
  return new Date().toISOString().substring(0, 10);
}
function Gc(n, e = zc) {
  const r = [];
  let i = n.slice();
  for (const o of n) {
    const c = r.find(l => l.agent === o.agent);
    if (c) {
      if ((c.dates.push(o.date), ji(r) > e)) {
        c.dates.pop();
        break;
      }
    } else if ((r.push({ agent: o.agent, dates: [o.date] }), ji(r) > e)) {
      r.pop();
      break;
    }
    i = i.slice(1);
  }
  return { heartbeatsToSend: r, unsentEntries: i };
}
class Wc {
  constructor(e) {
    ((this.app = e),
      (this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck()));
  }
  async runIndexedDBEnvironmentCheck() {
    return Es()
      ? Ss()
          .then(() => !0)
          .catch(() => !1)
      : !1;
  }
  async read() {
    if (await this._canUseIndexedDBPromise) {
      const e = await Bc(this.app);
      return e?.heartbeats ? e : { heartbeats: [] };
    } else return { heartbeats: [] };
  }
  async overwrite(e) {
    var r;
    if (await this._canUseIndexedDBPromise) {
      const i = await this.read();
      return Mi(this.app, {
        lastSentHeartbeatDate:
          (r = e.lastSentHeartbeatDate) !== null && r !== void 0
            ? r
            : i.lastSentHeartbeatDate,
        heartbeats: e.heartbeats,
      });
    } else return;
  }
  async add(e) {
    var r;
    if (await this._canUseIndexedDBPromise) {
      const i = await this.read();
      return Mi(this.app, {
        lastSentHeartbeatDate:
          (r = e.lastSentHeartbeatDate) !== null && r !== void 0
            ? r
            : i.lastSentHeartbeatDate,
        heartbeats: [...i.heartbeats, ...e.heartbeats],
      });
    } else return;
  }
}
function ji(n) {
  return en(JSON.stringify({ version: 2, heartbeats: n })).length;
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
 */ function Jc(n) {
  (he(new se('platform-logger', e => new cc(e), 'PRIVATE')),
    he(new se('heartbeat', e => new Kc(e), 'PRIVATE')),
    te(er, Ni, n),
    te(er, Ni, 'esm2017'),
    te('fire-js', ''));
}
Jc('');
var Xc = 'firebase',
  Yc = '10.14.1';
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
 */ te(Xc, Yc, 'app');
const Ds = '@firebase/installations',
  lr = '0.6.9';
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
 */ const Ns = 1e4,
  Ls = `w:${lr}`,
  Ms = 'FIS_v2',
  Qc = 'https://firebaseinstallations.googleapis.com/v1',
  Zc = 60 * 60 * 1e3,
  eh = 'installations',
  th = 'Installations';
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
 */ const nh = {
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
  He = new Be(eh, th, nh);
function Us(n) {
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
  return `${Qc}/projects/${n}/installations`;
}
function xs(n) {
  return {
    token: n.token,
    requestStatus: 2,
    expiresIn: ih(n.expiresIn),
    creationTime: Date.now(),
  };
}
async function Fs(n, e) {
  const r = (await e.json()).error;
  return He.create('request-failed', {
    requestName: n,
    serverCode: r.code,
    serverMessage: r.message,
    serverStatus: r.status,
  });
}
function Hs({ apiKey: n }) {
  return new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-goog-api-key': n,
  });
}
function rh(n, { refreshToken: e }) {
  const r = Hs(n);
  return (r.append('Authorization', sh(e)), r);
}
async function $s(n) {
  const e = await n();
  return e.status >= 500 && e.status < 600 ? n() : e;
}
function ih(n) {
  return Number(n.replace('s', '000'));
}
function sh(n) {
  return `${Ms} ${n}`;
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
 */ async function oh(
  { appConfig: n, heartbeatServiceProvider: e },
  { fid: r }
) {
  const i = js(n),
    o = Hs(n),
    c = e.getImmediate({ optional: !0 });
  if (c) {
    const T = await c.getHeartbeatsHeader();
    T && o.append('x-firebase-client', T);
  }
  const l = { fid: r, authVersion: Ms, appId: n.appId, sdkVersion: Ls },
    p = { method: 'POST', headers: o, body: JSON.stringify(l) },
    v = await $s(() => fetch(i, p));
  if (v.ok) {
    const T = await v.json();
    return {
      fid: T.fid || r,
      registrationStatus: 2,
      refreshToken: T.refreshToken,
      authToken: xs(T.authToken),
    };
  } else throw await Fs('Create Installation', v);
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
 */ function Vs(n) {
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
 */ function ah(n) {
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
 */ const ch = /^[cdef][\w-]{21}$/,
  rr = '';
function hh() {
  try {
    const n = new Uint8Array(17);
    ((self.crypto || self.msCrypto).getRandomValues(n),
      (n[0] = 112 + (n[0] % 16)));
    const e = lh(n);
    return ch.test(e) ? e : rr;
  } catch {
    return rr;
  }
}
function lh(n) {
  return ah(n).substr(0, 22);
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
 */ function dn(n) {
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
 */ const Bs = new Map();
function zs(n, e) {
  const r = dn(n);
  (qs(r, e), uh(r, e));
}
function qs(n, e) {
  const r = Bs.get(n);
  if (r) for (const i of r) i(e);
}
function uh(n, e) {
  const r = dh();
  (r && r.postMessage({ key: n, fid: e }), fh());
}
let xe = null;
function dh() {
  return (
    !xe &&
      'BroadcastChannel' in self &&
      ((xe = new BroadcastChannel('[Firebase] FID Change')),
      (xe.onmessage = n => {
        qs(n.data.key, n.data.fid);
      })),
    xe
  );
}
function fh() {
  Bs.size === 0 && xe && (xe.close(), (xe = null));
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
 */ const ph = 'firebase-installations-database',
  gh = 1,
  $e = 'firebase-installations-store';
let Kn = null;
function ur() {
  return (
    Kn ||
      (Kn = Cs(ph, gh, {
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
async function nn(n, e) {
  const r = dn(n),
    i = (await ur()).transaction($e, 'readwrite'),
    o = i.objectStore($e),
    c = await o.get(r);
  return (
    await o.put(e, r),
    await i.done,
    (!c || c.fid !== e.fid) && zs(n, e.fid),
    e
  );
}
async function Ks(n) {
  const e = dn(n),
    r = (await ur()).transaction($e, 'readwrite');
  (await r.objectStore($e).delete(e), await r.done);
}
async function fn(n, e) {
  const r = dn(n),
    i = (await ur()).transaction($e, 'readwrite'),
    o = i.objectStore($e),
    c = await o.get(r),
    l = e(c);
  return (
    l === void 0 ? await o.delete(r) : await o.put(l, r),
    await i.done,
    l && (!c || c.fid !== l.fid) && zs(n, l.fid),
    l
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
 */ async function dr(n) {
  let e;
  const r = await fn(n.appConfig, i => {
    const o = mh(i),
      c = yh(n, o);
    return ((e = c.registrationPromise), c.installationEntry);
  });
  return r.fid === rr
    ? { installationEntry: await e }
    : { installationEntry: r, registrationPromise: e };
}
function mh(n) {
  const e = n || { fid: hh(), registrationStatus: 0 };
  return Gs(e);
}
function yh(n, e) {
  if (e.registrationStatus === 0) {
    if (!navigator.onLine) {
      const o = Promise.reject(He.create('app-offline'));
      return { installationEntry: e, registrationPromise: o };
    }
    const r = {
        fid: e.fid,
        registrationStatus: 1,
        registrationTime: Date.now(),
      },
      i = vh(n, r);
    return { installationEntry: r, registrationPromise: i };
  } else
    return e.registrationStatus === 1
      ? { installationEntry: e, registrationPromise: wh(n) }
      : { installationEntry: e };
}
async function vh(n, e) {
  try {
    const r = await oh(n, e);
    return nn(n.appConfig, r);
  } catch (r) {
    throw (
      Us(r) && r.customData.serverCode === 409
        ? await Ks(n.appConfig)
        : await nn(n.appConfig, { fid: e.fid, registrationStatus: 0 }),
      r
    );
  }
}
async function wh(n) {
  let e = await xi(n.appConfig);
  for (; e.registrationStatus === 1; )
    (await Vs(100), (e = await xi(n.appConfig)));
  if (e.registrationStatus === 0) {
    const { installationEntry: r, registrationPromise: i } = await dr(n);
    return i || r;
  }
  return e;
}
function xi(n) {
  return fn(n, e => {
    if (!e) throw He.create('installation-not-found');
    return Gs(e);
  });
}
function Gs(n) {
  return bh(n) ? { fid: n.fid, registrationStatus: 0 } : n;
}
function bh(n) {
  return n.registrationStatus === 1 && n.registrationTime + Ns < Date.now();
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
 */ async function Ih({ appConfig: n, heartbeatServiceProvider: e }, r) {
  const i = Th(n, r),
    o = rh(n, r),
    c = e.getImmediate({ optional: !0 });
  if (c) {
    const T = await c.getHeartbeatsHeader();
    T && o.append('x-firebase-client', T);
  }
  const l = { installation: { sdkVersion: Ls, appId: n.appId } },
    p = { method: 'POST', headers: o, body: JSON.stringify(l) },
    v = await $s(() => fetch(i, p));
  if (v.ok) {
    const T = await v.json();
    return xs(T);
  } else throw await Fs('Generate Auth Token', v);
}
function Th(n, { fid: e }) {
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
 */ async function fr(n, e = !1) {
  let r;
  const i = await fn(n.appConfig, o => {
    if (!Ws(o)) throw He.create('not-registered');
    const c = o.authToken;
    if (!e && Sh(c)) return o;
    if (c.requestStatus === 1) return ((r = _h(n, e)), o);
    {
      if (!navigator.onLine) throw He.create('app-offline');
      const l = Ah(o);
      return ((r = Eh(n, l)), l);
    }
  });
  return r ? await r : i.authToken;
}
async function _h(n, e) {
  let r = await Fi(n.appConfig);
  for (; r.authToken.requestStatus === 1; )
    (await Vs(100), (r = await Fi(n.appConfig)));
  const i = r.authToken;
  return i.requestStatus === 0 ? fr(n, e) : i;
}
function Fi(n) {
  return fn(n, e => {
    if (!Ws(e)) throw He.create('not-registered');
    const r = e.authToken;
    return Ch(r)
      ? Object.assign(Object.assign({}, e), { authToken: { requestStatus: 0 } })
      : e;
  });
}
async function Eh(n, e) {
  try {
    const r = await Ih(n, e),
      i = Object.assign(Object.assign({}, e), { authToken: r });
    return (await nn(n.appConfig, i), r);
  } catch (r) {
    if (
      Us(r) &&
      (r.customData.serverCode === 401 || r.customData.serverCode === 404)
    )
      await Ks(n.appConfig);
    else {
      const i = Object.assign(Object.assign({}, e), {
        authToken: { requestStatus: 0 },
      });
      await nn(n.appConfig, i);
    }
    throw r;
  }
}
function Ws(n) {
  return n !== void 0 && n.registrationStatus === 2;
}
function Sh(n) {
  return n.requestStatus === 2 && !kh(n);
}
function kh(n) {
  const e = Date.now();
  return e < n.creationTime || n.creationTime + n.expiresIn < e + Zc;
}
function Ah(n) {
  const e = { requestStatus: 1, requestTime: Date.now() };
  return Object.assign(Object.assign({}, n), { authToken: e });
}
function Ch(n) {
  return n.requestStatus === 1 && n.requestTime + Ns < Date.now();
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
 */ async function Ph(n) {
  const e = n,
    { installationEntry: r, registrationPromise: i } = await dr(e);
  return (i ? i.catch(console.error) : fr(e).catch(console.error), r.fid);
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
 */ async function Oh(n, e = !1) {
  const r = n;
  return (await Rh(r), (await fr(r, e)).token);
}
async function Rh(n) {
  const { registrationPromise: e } = await dr(n);
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
 */ function Dh(n) {
  if (!n || !n.options) throw Gn('App Configuration');
  if (!n.name) throw Gn('App Name');
  const e = ['projectId', 'apiKey', 'appId'];
  for (const r of e) if (!n.options[r]) throw Gn(r);
  return {
    appName: n.name,
    projectId: n.options.projectId,
    apiKey: n.options.apiKey,
    appId: n.options.appId,
  };
}
function Gn(n) {
  return He.create('missing-app-config-values', { valueName: n });
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
 */ const Js = 'installations',
  Nh = 'installations-internal',
  Lh = n => {
    const e = n.getProvider('app').getImmediate(),
      r = Dh(e),
      i = ze(e, 'heartbeat');
    return {
      app: e,
      appConfig: r,
      heartbeatServiceProvider: i,
      _delete: () => Promise.resolve(),
    };
  },
  Mh = n => {
    const e = n.getProvider('app').getImmediate(),
      r = ze(e, Js).getImmediate();
    return { getId: () => Ph(r), getToken: i => Oh(r, i) };
  };
function Uh() {
  (he(new se(Js, Lh, 'PUBLIC')), he(new se(Nh, Mh, 'PRIVATE')));
}
Uh();
te(Ds, lr);
te(Ds, lr, 'esm2017');
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
 */ const rn = 'analytics',
  jh = 'firebase_id',
  xh = 'origin',
  Fh = 60 * 1e3,
  Hh =
    'https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig',
  pr = 'https://www.googletagmanager.com/gtag/js';
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
 */ const Y = new un('@firebase/analytics');
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
 */ const $h = {
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
  Z = new Be('analytics', 'Analytics', $h);
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
 */ function Vh(n) {
  if (!n.startsWith(pr)) {
    const e = Z.create('invalid-gtag-resource', { gtagURL: n });
    return (Y.warn(e.message), '');
  }
  return n;
}
function Xs(n) {
  return Promise.all(n.map(e => e.catch(r => r)));
}
function Bh(n, e) {
  let r;
  return (
    window.trustedTypes && (r = window.trustedTypes.createPolicy(n, e)),
    r
  );
}
function zh(n, e) {
  const r = Bh('firebase-js-sdk-policy', { createScriptURL: Vh }),
    i = document.createElement('script'),
    o = `${pr}?l=${n}&id=${e}`;
  ((i.src = r ? r?.createScriptURL(o) : o),
    (i.async = !0),
    document.head.appendChild(i));
}
function qh(n) {
  let e = [];
  return (Array.isArray(window[n]) ? (e = window[n]) : (window[n] = e), e);
}
async function Kh(n, e, r, i, o, c) {
  const l = i[o];
  try {
    if (l) await e[l];
    else {
      const p = (await Xs(r)).find(v => v.measurementId === o);
      p && (await e[p.appId]);
    }
  } catch (p) {
    Y.error(p);
  }
  n('config', o, c);
}
async function Gh(n, e, r, i, o) {
  try {
    let c = [];
    if (o && o.send_to) {
      let l = o.send_to;
      Array.isArray(l) || (l = [l]);
      const p = await Xs(r);
      for (const v of l) {
        const T = p.find(k => k.measurementId === v),
          S = T && e[T.appId];
        if (S) c.push(S);
        else {
          c = [];
          break;
        }
      }
    }
    (c.length === 0 && (c = Object.values(e)),
      await Promise.all(c),
      n('event', i, o || {}));
  } catch (c) {
    Y.error(c);
  }
}
function Wh(n, e, r, i) {
  async function o(c, ...l) {
    try {
      if (c === 'event') {
        const [p, v] = l;
        await Gh(n, e, r, p, v);
      } else if (c === 'config') {
        const [p, v] = l;
        await Kh(n, e, r, i, p, v);
      } else if (c === 'consent') {
        const [p, v] = l;
        n('consent', p, v);
      } else if (c === 'get') {
        const [p, v, T] = l;
        n('get', p, v, T);
      } else if (c === 'set') {
        const [p] = l;
        n('set', p);
      } else n(c, ...l);
    } catch (p) {
      Y.error(p);
    }
  }
  return o;
}
function Jh(n, e, r, i, o) {
  let c = function (...l) {
    window[i].push(arguments);
  };
  return (
    window[o] && typeof window[o] == 'function' && (c = window[o]),
    (window[o] = Wh(c, n, e, r)),
    { gtagCore: c, wrappedGtag: window[o] }
  );
}
function Xh(n) {
  const e = window.document.getElementsByTagName('script');
  for (const r of Object.values(e))
    if (r.src && r.src.includes(pr) && r.src.includes(n)) return r;
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
 */ const Yh = 30,
  Qh = 1e3;
class Zh {
  constructor(e = {}, r = Qh) {
    ((this.throttleMetadata = e), (this.intervalMillis = r));
  }
  getThrottleMetadata(e) {
    return this.throttleMetadata[e];
  }
  setThrottleMetadata(e, r) {
    this.throttleMetadata[e] = r;
  }
  deleteThrottleMetadata(e) {
    delete this.throttleMetadata[e];
  }
}
const Ys = new Zh();
function el(n) {
  return new Headers({ Accept: 'application/json', 'x-goog-api-key': n });
}
async function tl(n) {
  var e;
  const { appId: r, apiKey: i } = n,
    o = { method: 'GET', headers: el(i) },
    c = Hh.replace('{app-id}', r),
    l = await fetch(c, o);
  if (l.status !== 200 && l.status !== 304) {
    let p = '';
    try {
      const v = await l.json();
      !((e = v.error) === null || e === void 0) &&
        e.message &&
        (p = v.error.message);
    } catch {}
    throw Z.create('config-fetch-failed', {
      httpStatus: l.status,
      responseMessage: p,
    });
  }
  return l.json();
}
async function nl(n, e = Ys, r) {
  const { appId: i, apiKey: o, measurementId: c } = n.options;
  if (!i) throw Z.create('no-app-id');
  if (!o) {
    if (c) return { measurementId: c, appId: i };
    throw Z.create('no-api-key');
  }
  const l = e.getThrottleMetadata(i) || {
      backoffCount: 0,
      throttleEndTimeMillis: Date.now(),
    },
    p = new sl();
  return (
    setTimeout(async () => {
      p.abort();
    }, Fh),
    Qs({ appId: i, apiKey: o, measurementId: c }, l, p, e)
  );
}
async function Qs(n, { throttleEndTimeMillis: e, backoffCount: r }, i, o = Ys) {
  var c;
  const { appId: l, measurementId: p } = n;
  try {
    await rl(i, e);
  } catch (v) {
    if (p)
      return (
        Y.warn(
          `Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${p} provided in the "measurementId" field in the local Firebase config. [${v?.message}]`
        ),
        { appId: l, measurementId: p }
      );
    throw v;
  }
  try {
    const v = await tl(n);
    return (o.deleteThrottleMetadata(l), v);
  } catch (v) {
    const T = v;
    if (!il(T)) {
      if ((o.deleteThrottleMetadata(l), p))
        return (
          Y.warn(
            `Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${p} provided in the "measurementId" field in the local Firebase config. [${T?.message}]`
          ),
          { appId: l, measurementId: p }
        );
      throw v;
    }
    const S =
        Number(
          (c = T?.customData) === null || c === void 0 ? void 0 : c.httpStatus
        ) === 503
          ? Pi(r, o.intervalMillis, Yh)
          : Pi(r, o.intervalMillis),
      k = { throttleEndTimeMillis: Date.now() + S, backoffCount: r + 1 };
    return (
      o.setThrottleMetadata(l, k),
      Y.debug(`Calling attemptFetch again in ${S} millis`),
      Qs(n, k, i, o)
    );
  }
}
function rl(n, e) {
  return new Promise((r, i) => {
    const o = Math.max(e - Date.now(), 0),
      c = setTimeout(r, o);
    n.addEventListener(() => {
      (clearTimeout(c),
        i(Z.create('fetch-throttle', { throttleEndTimeMillis: e })));
    });
  });
}
function il(n) {
  if (!(n instanceof oe) || !n.customData) return !1;
  const e = Number(n.customData.httpStatus);
  return e === 429 || e === 500 || e === 503 || e === 504;
}
class sl {
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
async function ol(n, e, r, i, o) {
  if (o && o.global) {
    n('event', r, i);
    return;
  } else {
    const c = await e,
      l = Object.assign(Object.assign({}, i), { send_to: c });
    n('event', r, l);
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
 */ async function al() {
  if (Es())
    try {
      await Ss();
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
async function cl(n, e, r, i, o, c, l) {
  var p;
  const v = nl(n);
  (v
    .then(L => {
      ((r[L.measurementId] = L.appId),
        n.options.measurementId &&
          L.measurementId !== n.options.measurementId &&
          Y.warn(
            `The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${L.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`
          ));
    })
    .catch(L => Y.error(L)),
    e.push(v));
  const T = al().then(L => {
      if (L) return i.getId();
    }),
    [S, k] = await Promise.all([v, T]);
  (Xh(c) || zh(c, S.measurementId), o('js', new Date()));
  const A = (p = l?.config) !== null && p !== void 0 ? p : {};
  return (
    (A[xh] = 'firebase'),
    (A.update = !0),
    k != null && (A[jh] = k),
    o('config', S.measurementId, A),
    S.measurementId
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
 */ class hl {
  constructor(e) {
    this.app = e;
  }
  _delete() {
    return (delete bt[this.app.options.appId], Promise.resolve());
  }
}
let bt = {},
  Hi = [];
const $i = {};
let Wn = 'dataLayer',
  ll = 'gtag',
  Vi,
  Zs,
  Bi = !1;
function ul() {
  const n = [];
  if (
    (_s() && n.push('This is a browser extension environment.'),
    Da() || n.push('Cookies are not available.'),
    n.length > 0)
  ) {
    const e = n.map((i, o) => `(${o + 1}) ${i}`).join(' '),
      r = Z.create('invalid-analytics-context', { errorInfo: e });
    Y.warn(r.message);
  }
}
function dl(n, e, r) {
  ul();
  const i = n.options.appId;
  if (!i) throw Z.create('no-app-id');
  if (!n.options.apiKey)
    if (n.options.measurementId)
      Y.warn(
        `The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`
      );
    else throw Z.create('no-api-key');
  if (bt[i] != null) throw Z.create('already-exists', { id: i });
  if (!Bi) {
    qh(Wn);
    const { wrappedGtag: o, gtagCore: c } = Jh(bt, Hi, $i, Wn, ll);
    ((Zs = o), (Vi = c), (Bi = !0));
  }
  return ((bt[i] = cl(n, Hi, $i, e, Vi, Wn, r)), new hl(n));
}
function fl(n = hr()) {
  n = De(n);
  const e = ze(n, rn);
  return e.isInitialized() ? e.getImmediate() : pl(n);
}
function pl(n, e = {}) {
  const r = ze(n, rn);
  if (r.isInitialized()) {
    const i = r.getImmediate();
    if (Et(e, r.getOptions())) return i;
    throw Z.create('already-initialized');
  }
  return r.initialize({ options: e });
}
function gl(n, e, r, i) {
  ((n = De(n)),
    ol(Zs, bt[n.app.options.appId], e, r, i).catch(o => Y.error(o)));
}
const zi = '@firebase/analytics',
  qi = '0.10.8';
function ml() {
  (he(
    new se(
      rn,
      (e, { options: r }) => {
        const i = e.getProvider('app').getImmediate(),
          o = e.getProvider('installations-internal').getImmediate();
        return dl(i, o, r);
      },
      'PUBLIC'
    )
  ),
    he(new se('analytics-internal', n, 'PRIVATE')),
    te(zi, qi),
    te(zi, qi, 'esm2017'));
  function n(e) {
    try {
      const r = e.getProvider(rn).getImmediate();
      return { logEvent: (i, o, c) => gl(r, i, o, c) };
    } catch (r) {
      throw Z.create('interop-component-reg-failed', { reason: r });
    }
  }
}
ml();
function gr(n, e) {
  var r = {};
  for (var i in n)
    Object.prototype.hasOwnProperty.call(n, i) &&
      e.indexOf(i) < 0 &&
      (r[i] = n[i]);
  if (n != null && typeof Object.getOwnPropertySymbols == 'function')
    for (var o = 0, i = Object.getOwnPropertySymbols(n); o < i.length; o++)
      e.indexOf(i[o]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(n, i[o]) &&
        (r[i[o]] = n[i[o]]);
  return r;
}
function eo() {
  return {
    'dependent-sdk-initialized-before-auth':
      'Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.',
  };
}
const yl = eo,
  to = new Be('auth', 'Firebase', eo());
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
 */ const sn = new un('@firebase/auth');
function vl(n, ...e) {
  sn.logLevel <= O.WARN && sn.warn(`Auth (${nt}): ${n}`, ...e);
}
function Xt(n, ...e) {
  sn.logLevel <= O.ERROR && sn.error(`Auth (${nt}): ${n}`, ...e);
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
 */ function ve(n, ...e) {
  throw mr(n, ...e);
}
function ae(n, ...e) {
  return mr(n, ...e);
}
function no(n, e, r) {
  const i = Object.assign(Object.assign({}, yl()), { [e]: r });
  return new Be('auth', 'Firebase', i).create(e, { appName: n.name });
}
function Fe(n) {
  return no(
    n,
    'operation-not-supported-in-this-environment',
    'Operations that alter the current user are not supported in conjunction with FirebaseServerApp'
  );
}
function mr(n, ...e) {
  if (typeof n != 'string') {
    const r = e[0],
      i = [...e.slice(1)];
    return (i[0] && (i[0].appName = n.name), n._errorFactory.create(r, ...i));
  }
  return to.create(n, ...e);
}
function E(n, e, ...r) {
  if (!n) throw mr(e, ...r);
}
function pe(n) {
  const e = 'INTERNAL ASSERTION FAILED: ' + n;
  throw (Xt(e), new Error(e));
}
function we(n, e) {
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
 */ function ir() {
  var n;
  return (
    (typeof self < 'u' &&
      ((n = self.location) === null || n === void 0 ? void 0 : n.href)) ||
    ''
  );
}
function wl() {
  return Ki() === 'http:' || Ki() === 'https:';
}
function Ki() {
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
 */ function bl() {
  return typeof navigator < 'u' &&
    navigator &&
    'onLine' in navigator &&
    typeof navigator.onLine == 'boolean' &&
    (wl() || _s() || 'connection' in navigator)
    ? navigator.onLine
    : !0;
}
function Il() {
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
  constructor(e, r) {
    ((this.shortDelay = e),
      (this.longDelay = r),
      we(r > e, 'Short delay should be less than long delay!'),
      (this.isMobile = Ca() || Oa()));
  }
  get() {
    return bl()
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
 */ function yr(n, e) {
  we(n.emulator, 'Emulator should always be set here');
  const { url: r } = n.emulator;
  return e ? `${r}${e.startsWith('/') ? e.slice(1) : e}` : r;
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
 */ class ro {
  static initialize(e, r, i) {
    ((this.fetchImpl = e),
      r && (this.headersImpl = r),
      i && (this.responseImpl = i));
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
 */ const Tl = {
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
 */ const _l = new Ct(3e4, 6e4);
function vr(n, e) {
  return n.tenantId && !e.tenantId
    ? Object.assign(Object.assign({}, e), { tenantId: n.tenantId })
    : e;
}
async function rt(n, e, r, i, o = {}) {
  return io(n, o, async () => {
    let c = {},
      l = {};
    i && (e === 'GET' ? (l = i) : (c = { body: JSON.stringify(i) }));
    const p = At(Object.assign({ key: n.config.apiKey }, l)).slice(1),
      v = await n._getAdditionalHeaders();
    ((v['Content-Type'] = 'application/json'),
      n.languageCode && (v['X-Firebase-Locale'] = n.languageCode));
    const T = Object.assign({ method: e, headers: v }, c);
    return (
      Pa() || (T.referrerPolicy = 'no-referrer'),
      ro.fetch()(so(n, n.config.apiHost, r, p), T)
    );
  });
}
async function io(n, e, r) {
  n._canInitEmulator = !1;
  const i = Object.assign(Object.assign({}, Tl), e);
  try {
    const o = new Sl(n),
      c = await Promise.race([r(), o.promise]);
    o.clearNetworkTimeout();
    const l = await c.json();
    if ('needConfirmation' in l)
      throw Wt(n, 'account-exists-with-different-credential', l);
    if (c.ok && !('errorMessage' in l)) return l;
    {
      const p = c.ok ? l.errorMessage : l.error.message,
        [v, T] = p.split(' : ');
      if (v === 'FEDERATED_USER_ID_ALREADY_LINKED')
        throw Wt(n, 'credential-already-in-use', l);
      if (v === 'EMAIL_EXISTS') throw Wt(n, 'email-already-in-use', l);
      if (v === 'USER_DISABLED') throw Wt(n, 'user-disabled', l);
      const S = i[v] || v.toLowerCase().replace(/[_\s]+/g, '-');
      if (T) throw no(n, S, T);
      ve(n, S);
    }
  } catch (o) {
    if (o instanceof oe) throw o;
    ve(n, 'network-request-failed', { message: String(o) });
  }
}
async function El(n, e, r, i, o = {}) {
  const c = await rt(n, e, r, i, o);
  return (
    'mfaPendingCredential' in c &&
      ve(n, 'multi-factor-auth-required', { _serverResponse: c }),
    c
  );
}
function so(n, e, r, i) {
  const o = `${e}${r}?${i}`;
  return n.config.emulator ? yr(n.config, o) : `${n.config.apiScheme}://${o}`;
}
class Sl {
  constructor(e) {
    ((this.auth = e),
      (this.timer = null),
      (this.promise = new Promise((r, i) => {
        this.timer = setTimeout(
          () => i(ae(this.auth, 'network-request-failed')),
          _l.get()
        );
      })));
  }
  clearNetworkTimeout() {
    clearTimeout(this.timer);
  }
}
function Wt(n, e, r) {
  const i = { appName: n.name };
  (r.email && (i.email = r.email),
    r.phoneNumber && (i.phoneNumber = r.phoneNumber));
  const o = ae(n, e, i);
  return ((o.customData._tokenResponse = r), o);
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
 */ async function kl(n, e) {
  return rt(n, 'POST', '/v1/accounts:delete', e);
}
async function oo(n, e) {
  return rt(n, 'POST', '/v1/accounts:lookup', e);
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
 */ function It(n) {
  if (n)
    try {
      const e = new Date(Number(n));
      if (!isNaN(e.getTime())) return e.toUTCString();
    } catch {}
}
async function Al(n, e = !1) {
  const r = De(n),
    i = await r.getIdToken(e),
    o = wr(i);
  E(o && o.exp && o.auth_time && o.iat, r.auth, 'internal-error');
  const c = typeof o.firebase == 'object' ? o.firebase : void 0,
    l = c?.sign_in_provider;
  return {
    claims: o,
    token: i,
    authTime: It(Jn(o.auth_time)),
    issuedAtTime: It(Jn(o.iat)),
    expirationTime: It(Jn(o.exp)),
    signInProvider: l || null,
    signInSecondFactor: c?.sign_in_second_factor || null,
  };
}
function Jn(n) {
  return Number(n) * 1e3;
}
function wr(n) {
  const [e, r, i] = n.split('.');
  if (e === void 0 || r === void 0 || i === void 0)
    return (Xt('JWT malformed, contained fewer than 3 sections'), null);
  try {
    const o = ws(r);
    return o
      ? JSON.parse(o)
      : (Xt('Failed to decode base64 JWT payload'), null);
  } catch (o) {
    return (
      Xt('Caught error parsing JWT payload as JSON', o?.toString()),
      null
    );
  }
}
function Gi(n) {
  const e = wr(n);
  return (
    E(e, 'internal-error'),
    E(typeof e.exp < 'u', 'internal-error'),
    E(typeof e.iat < 'u', 'internal-error'),
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
 */ async function kt(n, e, r = !1) {
  if (r) return e;
  try {
    return await e;
  } catch (i) {
    throw (
      i instanceof oe &&
        Cl(i) &&
        n.auth.currentUser === n &&
        (await n.auth.signOut()),
      i
    );
  }
}
function Cl({ code: n }) {
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
 */ class Pl {
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
    var r;
    if (e) {
      const i = this.errorBackoff;
      return ((this.errorBackoff = Math.min(this.errorBackoff * 2, 96e4)), i);
    } else {
      this.errorBackoff = 3e4;
      const i =
        ((r = this.user.stsTokenManager.expirationTime) !== null && r !== void 0
          ? r
          : 0) -
        Date.now() -
        3e5;
      return Math.max(0, i);
    }
  }
  schedule(e = !1) {
    if (!this.isRunning) return;
    const r = this.getInterval(e);
    this.timerId = setTimeout(async () => {
      await this.iteration();
    }, r);
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
 */ class sr {
  constructor(e, r) {
    ((this.createdAt = e), (this.lastLoginAt = r), this._initializeTime());
  }
  _initializeTime() {
    ((this.lastSignInTime = It(this.lastLoginAt)),
      (this.creationTime = It(this.createdAt)));
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
 */ async function on(n) {
  var e;
  const r = n.auth,
    i = await n.getIdToken(),
    o = await kt(n, oo(r, { idToken: i }));
  E(o?.users.length, r, 'internal-error');
  const c = o.users[0];
  n._notifyReloadListener(c);
  const l =
      !((e = c.providerUserInfo) === null || e === void 0) && e.length
        ? ao(c.providerUserInfo)
        : [],
    p = Rl(n.providerData, l),
    v = n.isAnonymous,
    T = !(n.email && c.passwordHash) && !p?.length,
    S = v ? T : !1,
    k = {
      uid: c.localId,
      displayName: c.displayName || null,
      photoURL: c.photoUrl || null,
      email: c.email || null,
      emailVerified: c.emailVerified || !1,
      phoneNumber: c.phoneNumber || null,
      tenantId: c.tenantId || null,
      providerData: p,
      metadata: new sr(c.createdAt, c.lastLoginAt),
      isAnonymous: S,
    };
  Object.assign(n, k);
}
async function Ol(n) {
  const e = De(n);
  (await on(e),
    await e.auth._persistUserIfCurrent(e),
    e.auth._notifyListenersIfCurrent(e));
}
function Rl(n, e) {
  return [...n.filter(r => !e.some(i => i.providerId === r.providerId)), ...e];
}
function ao(n) {
  return n.map(e => {
    var { providerId: r } = e,
      i = gr(e, ['providerId']);
    return {
      providerId: r,
      uid: i.rawId || '',
      displayName: i.displayName || null,
      email: i.email || null,
      phoneNumber: i.phoneNumber || null,
      photoURL: i.photoUrl || null,
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
 */ async function Dl(n, e) {
  const r = await io(n, {}, async () => {
    const i = At({ grant_type: 'refresh_token', refresh_token: e }).slice(1),
      { tokenApiHost: o, apiKey: c } = n.config,
      l = so(n, o, '/v1/token', `key=${c}`),
      p = await n._getAdditionalHeaders();
    return (
      (p['Content-Type'] = 'application/x-www-form-urlencoded'),
      ro.fetch()(l, { method: 'POST', headers: p, body: i })
    );
  });
  return {
    accessToken: r.access_token,
    expiresIn: r.expires_in,
    refreshToken: r.refresh_token,
  };
}
async function Nl(n, e) {
  return rt(n, 'POST', '/v2/accounts:revokeToken', vr(n, e));
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
    (E(e.idToken, 'internal-error'),
      E(typeof e.idToken < 'u', 'internal-error'),
      E(typeof e.refreshToken < 'u', 'internal-error'));
    const r =
      'expiresIn' in e && typeof e.expiresIn < 'u'
        ? Number(e.expiresIn)
        : Gi(e.idToken);
    this.updateTokensAndExpiration(e.idToken, e.refreshToken, r);
  }
  updateFromIdToken(e) {
    E(e.length !== 0, 'internal-error');
    const r = Gi(e);
    this.updateTokensAndExpiration(e, null, r);
  }
  async getToken(e, r = !1) {
    return !r && this.accessToken && !this.isExpired
      ? this.accessToken
      : (E(this.refreshToken, e, 'user-token-expired'),
        this.refreshToken
          ? (await this.refresh(e, this.refreshToken), this.accessToken)
          : null);
  }
  clearRefreshToken() {
    this.refreshToken = null;
  }
  async refresh(e, r) {
    const { accessToken: i, refreshToken: o, expiresIn: c } = await Dl(e, r);
    this.updateTokensAndExpiration(i, o, Number(c));
  }
  updateTokensAndExpiration(e, r, i) {
    ((this.refreshToken = r || null),
      (this.accessToken = e || null),
      (this.expirationTime = Date.now() + i * 1e3));
  }
  static fromJSON(e, r) {
    const { refreshToken: i, accessToken: o, expirationTime: c } = r,
      l = new Ye();
    return (
      i &&
        (E(typeof i == 'string', 'internal-error', { appName: e }),
        (l.refreshToken = i)),
      o &&
        (E(typeof o == 'string', 'internal-error', { appName: e }),
        (l.accessToken = o)),
      c &&
        (E(typeof c == 'number', 'internal-error', { appName: e }),
        (l.expirationTime = c)),
      l
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
 */ function Ee(n, e) {
  E(typeof n == 'string' || typeof n > 'u', 'internal-error', { appName: e });
}
class ge {
  constructor(e) {
    var { uid: r, auth: i, stsTokenManager: o } = e,
      c = gr(e, ['uid', 'auth', 'stsTokenManager']);
    ((this.providerId = 'firebase'),
      (this.proactiveRefresh = new Pl(this)),
      (this.reloadUserInfo = null),
      (this.reloadListener = null),
      (this.uid = r),
      (this.auth = i),
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
      (this.metadata = new sr(c.createdAt || void 0, c.lastLoginAt || void 0)));
  }
  async getIdToken(e) {
    const r = await kt(this, this.stsTokenManager.getToken(this.auth, e));
    return (
      E(r, this.auth, 'internal-error'),
      this.accessToken !== r &&
        ((this.accessToken = r),
        await this.auth._persistUserIfCurrent(this),
        this.auth._notifyListenersIfCurrent(this)),
      r
    );
  }
  getIdTokenResult(e) {
    return Al(this, e);
  }
  reload() {
    return Ol(this);
  }
  _assign(e) {
    this !== e &&
      (E(this.uid === e.uid, this.auth, 'internal-error'),
      (this.displayName = e.displayName),
      (this.photoURL = e.photoURL),
      (this.email = e.email),
      (this.emailVerified = e.emailVerified),
      (this.phoneNumber = e.phoneNumber),
      (this.isAnonymous = e.isAnonymous),
      (this.tenantId = e.tenantId),
      (this.providerData = e.providerData.map(r => Object.assign({}, r))),
      this.metadata._copy(e.metadata),
      this.stsTokenManager._assign(e.stsTokenManager));
  }
  _clone(e) {
    const r = new ge(
      Object.assign(Object.assign({}, this), {
        auth: e,
        stsTokenManager: this.stsTokenManager._clone(),
      })
    );
    return (r.metadata._copy(this.metadata), r);
  }
  _onReload(e) {
    (E(!this.reloadListener, this.auth, 'internal-error'),
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
  async _updateTokensIfNecessary(e, r = !1) {
    let i = !1;
    (e.idToken &&
      e.idToken !== this.stsTokenManager.accessToken &&
      (this.stsTokenManager.updateFromServerResponse(e), (i = !0)),
      r && (await on(this)),
      await this.auth._persistUserIfCurrent(this),
      i && this.auth._notifyListenersIfCurrent(this));
  }
  async delete() {
    if (Pe(this.auth.app)) return Promise.reject(Fe(this.auth));
    const e = await this.getIdToken();
    return (
      await kt(this, kl(this.auth, { idToken: e })),
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
  static _fromJSON(e, r) {
    var i, o, c, l, p, v, T, S;
    const k = (i = r.displayName) !== null && i !== void 0 ? i : void 0,
      A = (o = r.email) !== null && o !== void 0 ? o : void 0,
      L = (c = r.phoneNumber) !== null && c !== void 0 ? c : void 0,
      P = (l = r.photoURL) !== null && l !== void 0 ? l : void 0,
      j = (p = r.tenantId) !== null && p !== void 0 ? p : void 0,
      M = (v = r._redirectEventId) !== null && v !== void 0 ? v : void 0,
      le = (T = r.createdAt) !== null && T !== void 0 ? T : void 0,
      Q = (S = r.lastLoginAt) !== null && S !== void 0 ? S : void 0,
      {
        uid: F,
        emailVerified: ne,
        isAnonymous: Ne,
        providerData: G,
        stsTokenManager: y,
      } = r;
    E(F && y, e, 'internal-error');
    const u = Ye.fromJSON(this.name, y);
    (E(typeof F == 'string', e, 'internal-error'),
      Ee(k, e.name),
      Ee(A, e.name),
      E(typeof ne == 'boolean', e, 'internal-error'),
      E(typeof Ne == 'boolean', e, 'internal-error'),
      Ee(L, e.name),
      Ee(P, e.name),
      Ee(j, e.name),
      Ee(M, e.name),
      Ee(le, e.name),
      Ee(Q, e.name));
    const f = new ge({
      uid: F,
      auth: e,
      email: A,
      emailVerified: ne,
      displayName: k,
      isAnonymous: Ne,
      photoURL: P,
      phoneNumber: L,
      tenantId: j,
      stsTokenManager: u,
      createdAt: le,
      lastLoginAt: Q,
    });
    return (
      G &&
        Array.isArray(G) &&
        (f.providerData = G.map(g => Object.assign({}, g))),
      M && (f._redirectEventId = M),
      f
    );
  }
  static async _fromIdTokenResponse(e, r, i = !1) {
    const o = new Ye();
    o.updateFromServerResponse(r);
    const c = new ge({
      uid: r.localId,
      auth: e,
      stsTokenManager: o,
      isAnonymous: i,
    });
    return (await on(c), c);
  }
  static async _fromGetAccountInfoResponse(e, r, i) {
    const o = r.users[0];
    E(o.localId !== void 0, 'internal-error');
    const c = o.providerUserInfo !== void 0 ? ao(o.providerUserInfo) : [],
      l = !(o.email && o.passwordHash) && !c?.length,
      p = new Ye();
    p.updateFromIdToken(i);
    const v = new ge({
        uid: o.localId,
        auth: e,
        stsTokenManager: p,
        isAnonymous: l,
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
        metadata: new sr(o.createdAt, o.lastLoginAt),
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
 */ const Wi = new Map();
function me(n) {
  we(n instanceof Function, 'Expected a class definition');
  let e = Wi.get(n);
  return e
    ? (we(e instanceof n, 'Instance stored in cache mismatched with class'), e)
    : ((e = new n()), Wi.set(n, e), e);
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
 */ class co {
  constructor() {
    ((this.type = 'NONE'), (this.storage = {}));
  }
  async _isAvailable() {
    return !0;
  }
  async _set(e, r) {
    this.storage[e] = r;
  }
  async _get(e) {
    const r = this.storage[e];
    return r === void 0 ? null : r;
  }
  async _remove(e) {
    delete this.storage[e];
  }
  _addListener(e, r) {}
  _removeListener(e, r) {}
}
co.type = 'NONE';
const Ji = co;
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
 */ function Yt(n, e, r) {
  return `firebase:${n}:${e}:${r}`;
}
class Qe {
  constructor(e, r, i) {
    ((this.persistence = e), (this.auth = r), (this.userKey = i));
    const { config: o, name: c } = this.auth;
    ((this.fullUserKey = Yt(this.userKey, o.apiKey, c)),
      (this.fullPersistenceKey = Yt('persistence', o.apiKey, c)),
      (this.boundEventHandler = r._onStorageEvent.bind(r)),
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
    const r = await this.getCurrentUser();
    if ((await this.removeCurrentUser(), (this.persistence = e), r))
      return this.setCurrentUser(r);
  }
  delete() {
    this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
  }
  static async create(e, r, i = 'authUser') {
    if (!r.length) return new Qe(me(Ji), e, i);
    const o = (
      await Promise.all(
        r.map(async T => {
          if (await T._isAvailable()) return T;
        })
      )
    ).filter(T => T);
    let c = o[0] || me(Ji);
    const l = Yt(i, e.config.apiKey, e.name);
    let p = null;
    for (const T of r)
      try {
        const S = await T._get(l);
        if (S) {
          const k = ge._fromJSON(e, S);
          (T !== c && (p = k), (c = T));
          break;
        }
      } catch {}
    const v = o.filter(T => T._shouldAllowMigration);
    return !c._shouldAllowMigration || !v.length
      ? new Qe(c, e, i)
      : ((c = v[0]),
        p && (await c._set(l, p.toJSON())),
        await Promise.all(
          r.map(async T => {
            if (T !== c)
              try {
                await T._remove(l);
              } catch {}
          })
        ),
        new Qe(c, e, i));
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
 */ function Xi(n) {
  const e = n.toLowerCase();
  if (e.includes('opera/') || e.includes('opr/') || e.includes('opios/'))
    return 'Opera';
  if (fo(e)) return 'IEMobile';
  if (e.includes('msie') || e.includes('trident/')) return 'IE';
  if (e.includes('edge/')) return 'Edge';
  if (ho(e)) return 'Firefox';
  if (e.includes('silk/')) return 'Silk';
  if (go(e)) return 'Blackberry';
  if (mo(e)) return 'Webos';
  if (lo(e)) return 'Safari';
  if ((e.includes('chrome/') || uo(e)) && !e.includes('edge/')) return 'Chrome';
  if (po(e)) return 'Android';
  {
    const r = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,
      i = n.match(r);
    if (i?.length === 2) return i[1];
  }
  return 'Other';
}
function ho(n = K()) {
  return /firefox\//i.test(n);
}
function lo(n = K()) {
  const e = n.toLowerCase();
  return (
    e.includes('safari/') &&
    !e.includes('chrome/') &&
    !e.includes('crios/') &&
    !e.includes('android')
  );
}
function uo(n = K()) {
  return /crios\//i.test(n);
}
function fo(n = K()) {
  return /iemobile/i.test(n);
}
function po(n = K()) {
  return /android/i.test(n);
}
function go(n = K()) {
  return /blackberry/i.test(n);
}
function mo(n = K()) {
  return /webos/i.test(n);
}
function br(n = K()) {
  return (
    /iphone|ipad|ipod/i.test(n) || (/macintosh/i.test(n) && /mobile/i.test(n))
  );
}
function Ll(n = K()) {
  var e;
  return (
    br(n) &&
    !!(!((e = window.navigator) === null || e === void 0) && e.standalone)
  );
}
function Ml() {
  return Ra() && document.documentMode === 10;
}
function yo(n = K()) {
  return br(n) || po(n) || mo(n) || go(n) || /windows phone/i.test(n) || fo(n);
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
 */ function vo(n, e = []) {
  let r;
  switch (n) {
    case 'Browser':
      r = Xi(K());
      break;
    case 'Worker':
      r = `${Xi(K())}-${n}`;
      break;
    default:
      r = n;
  }
  const i = e.length ? e.join(',') : 'FirebaseCore-web';
  return `${r}/JsCore/${nt}/${i}`;
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
 */ class Ul {
  constructor(e) {
    ((this.auth = e), (this.queue = []));
  }
  pushCallback(e, r) {
    const i = c =>
      new Promise((l, p) => {
        try {
          const v = e(c);
          l(v);
        } catch (v) {
          p(v);
        }
      });
    ((i.onAbort = r), this.queue.push(i));
    const o = this.queue.length - 1;
    return () => {
      this.queue[o] = () => Promise.resolve();
    };
  }
  async runMiddleware(e) {
    if (this.auth.currentUser === e) return;
    const r = [];
    try {
      for (const i of this.queue) (await i(e), i.onAbort && r.push(i.onAbort));
    } catch (i) {
      r.reverse();
      for (const o of r)
        try {
          o();
        } catch {}
      throw this.auth._errorFactory.create('login-blocked', {
        originalMessage: i?.message,
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
 */ async function jl(n, e = {}) {
  return rt(n, 'GET', '/v2/passwordPolicy', vr(n, e));
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
 */ const xl = 6;
class Fl {
  constructor(e) {
    var r, i, o, c;
    const l = e.customStrengthOptions;
    ((this.customStrengthOptions = {}),
      (this.customStrengthOptions.minPasswordLength =
        (r = l.minPasswordLength) !== null && r !== void 0 ? r : xl),
      l.maxPasswordLength &&
        (this.customStrengthOptions.maxPasswordLength = l.maxPasswordLength),
      l.containsLowercaseCharacter !== void 0 &&
        (this.customStrengthOptions.containsLowercaseLetter =
          l.containsLowercaseCharacter),
      l.containsUppercaseCharacter !== void 0 &&
        (this.customStrengthOptions.containsUppercaseLetter =
          l.containsUppercaseCharacter),
      l.containsNumericCharacter !== void 0 &&
        (this.customStrengthOptions.containsNumericCharacter =
          l.containsNumericCharacter),
      l.containsNonAlphanumericCharacter !== void 0 &&
        (this.customStrengthOptions.containsNonAlphanumericCharacter =
          l.containsNonAlphanumericCharacter),
      (this.enforcementState = e.enforcementState),
      this.enforcementState === 'ENFORCEMENT_STATE_UNSPECIFIED' &&
        (this.enforcementState = 'OFF'),
      (this.allowedNonAlphanumericCharacters =
        (o =
          (i = e.allowedNonAlphanumericCharacters) === null || i === void 0
            ? void 0
            : i.join('')) !== null && o !== void 0
          ? o
          : ''),
      (this.forceUpgradeOnSignin =
        (c = e.forceUpgradeOnSignin) !== null && c !== void 0 ? c : !1),
      (this.schemaVersion = e.schemaVersion));
  }
  validatePassword(e) {
    var r, i, o, c, l, p;
    const v = { isValid: !0, passwordPolicy: this };
    return (
      this.validatePasswordLengthOptions(e, v),
      this.validatePasswordCharacterOptions(e, v),
      v.isValid &&
        (v.isValid =
          (r = v.meetsMinPasswordLength) !== null && r !== void 0 ? r : !0),
      v.isValid &&
        (v.isValid =
          (i = v.meetsMaxPasswordLength) !== null && i !== void 0 ? i : !0),
      v.isValid &&
        (v.isValid =
          (o = v.containsLowercaseLetter) !== null && o !== void 0 ? o : !0),
      v.isValid &&
        (v.isValid =
          (c = v.containsUppercaseLetter) !== null && c !== void 0 ? c : !0),
      v.isValid &&
        (v.isValid =
          (l = v.containsNumericCharacter) !== null && l !== void 0 ? l : !0),
      v.isValid &&
        (v.isValid =
          (p = v.containsNonAlphanumericCharacter) !== null && p !== void 0
            ? p
            : !0),
      v
    );
  }
  validatePasswordLengthOptions(e, r) {
    const i = this.customStrengthOptions.minPasswordLength,
      o = this.customStrengthOptions.maxPasswordLength;
    (i && (r.meetsMinPasswordLength = e.length >= i),
      o && (r.meetsMaxPasswordLength = e.length <= o));
  }
  validatePasswordCharacterOptions(e, r) {
    this.updatePasswordCharacterOptionsStatuses(r, !1, !1, !1, !1);
    let i;
    for (let o = 0; o < e.length; o++)
      ((i = e.charAt(o)),
        this.updatePasswordCharacterOptionsStatuses(
          r,
          i >= 'a' && i <= 'z',
          i >= 'A' && i <= 'Z',
          i >= '0' && i <= '9',
          this.allowedNonAlphanumericCharacters.includes(i)
        ));
  }
  updatePasswordCharacterOptionsStatuses(e, r, i, o, c) {
    (this.customStrengthOptions.containsLowercaseLetter &&
      (e.containsLowercaseLetter || (e.containsLowercaseLetter = r)),
      this.customStrengthOptions.containsUppercaseLetter &&
        (e.containsUppercaseLetter || (e.containsUppercaseLetter = i)),
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
 */ class Hl {
  constructor(e, r, i, o) {
    ((this.app = e),
      (this.heartbeatServiceProvider = r),
      (this.appCheckServiceProvider = i),
      (this.config = o),
      (this.currentUser = null),
      (this.emulatorConfig = null),
      (this.operations = Promise.resolve()),
      (this.authStateSubscription = new Yi(this)),
      (this.idTokenSubscription = new Yi(this)),
      (this.beforeStateQueue = new Ul(this)),
      (this.redirectUser = null),
      (this.isProactiveRefreshEnabled = !1),
      (this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1),
      (this._canInitEmulator = !0),
      (this._isInitialized = !1),
      (this._deleted = !1),
      (this._initializationPromise = null),
      (this._popupRedirectResolver = null),
      (this._errorFactory = to),
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
  _initializeWithPersistence(e, r) {
    return (
      r && (this._popupRedirectResolver = me(r)),
      (this._initializationPromise = this.queue(async () => {
        var i, o;
        if (
          !this._deleted &&
          ((this.persistenceManager = await Qe.create(this, e)), !this._deleted)
        ) {
          if (
            !((i = this._popupRedirectResolver) === null || i === void 0) &&
            i._shouldInitProactively
          )
            try {
              await this._popupRedirectResolver._initialize(this);
            } catch {}
          (await this.initializeCurrentUser(r),
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
      const r = await oo(this, { idToken: e }),
        i = await ge._fromGetAccountInfoResponse(this, r, e);
      await this.directlySetCurrentUser(i);
    } catch (r) {
      (console.warn(
        'FirebaseServerApp could not login user with provided authIdToken: ',
        r
      ),
        await this.directlySetCurrentUser(null));
    }
  }
  async initializeCurrentUser(e) {
    var r;
    if (Pe(this.app)) {
      const l = this.app.settings.authIdToken;
      return l
        ? new Promise(p => {
            setTimeout(() =>
              this.initializeCurrentUserFromIdToken(l).then(p, p)
            );
          })
        : this.directlySetCurrentUser(null);
    }
    const i = await this.assertedPersistence.getCurrentUser();
    let o = i,
      c = !1;
    if (e && this.config.authDomain) {
      await this.getOrInitRedirectPersistenceManager();
      const l =
          (r = this.redirectUser) === null || r === void 0
            ? void 0
            : r._redirectEventId,
        p = o?._redirectEventId,
        v = await this.tryRedirectSignIn(e);
      (!l || l === p) && v?.user && ((o = v.user), (c = !0));
    }
    if (!o) return this.directlySetCurrentUser(null);
    if (!o._redirectEventId) {
      if (c)
        try {
          await this.beforeStateQueue.runMiddleware(o);
        } catch (l) {
          ((o = i),
            this._popupRedirectResolver._overrideRedirectResult(this, () =>
              Promise.reject(l)
            ));
        }
      return o
        ? this.reloadAndSetCurrentUserOrClear(o)
        : this.directlySetCurrentUser(null);
    }
    return (
      E(this._popupRedirectResolver, this, 'argument-error'),
      await this.getOrInitRedirectPersistenceManager(),
      this.redirectUser &&
      this.redirectUser._redirectEventId === o._redirectEventId
        ? this.directlySetCurrentUser(o)
        : this.reloadAndSetCurrentUserOrClear(o)
    );
  }
  async tryRedirectSignIn(e) {
    let r = null;
    try {
      r = await this._popupRedirectResolver._completeRedirectFn(this, e, !0);
    } catch {
      await this._setRedirectUser(null);
    }
    return r;
  }
  async reloadAndSetCurrentUserOrClear(e) {
    try {
      await on(e);
    } catch (r) {
      if (r?.code !== 'auth/network-request-failed')
        return this.directlySetCurrentUser(null);
    }
    return this.directlySetCurrentUser(e);
  }
  useDeviceLanguage() {
    this.languageCode = Il();
  }
  async _delete() {
    this._deleted = !0;
  }
  async updateCurrentUser(e) {
    if (Pe(this.app)) return Promise.reject(Fe(this));
    const r = e ? De(e) : null;
    return (
      r &&
        E(
          r.auth.config.apiKey === this.config.apiKey,
          this,
          'invalid-user-token'
        ),
      this._updateCurrentUser(r && r._clone(this))
    );
  }
  async _updateCurrentUser(e, r = !1) {
    if (!this._deleted)
      return (
        e && E(this.tenantId === e.tenantId, this, 'tenant-id-mismatch'),
        r || (await this.beforeStateQueue.runMiddleware(e)),
        this.queue(async () => {
          (await this.directlySetCurrentUser(e), this.notifyAuthListeners());
        })
      );
  }
  async signOut() {
    return Pe(this.app)
      ? Promise.reject(Fe(this))
      : (await this.beforeStateQueue.runMiddleware(null),
        (this.redirectPersistenceManager || this._popupRedirectResolver) &&
          (await this._setRedirectUser(null)),
        this._updateCurrentUser(null, !0));
  }
  setPersistence(e) {
    return Pe(this.app)
      ? Promise.reject(Fe(this))
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
    const r = this._getPasswordPolicyInternal();
    return r.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION
      ? Promise.reject(
          this._errorFactory.create(
            'unsupported-password-policy-schema-version',
            {}
          )
        )
      : r.validatePassword(e);
  }
  _getPasswordPolicyInternal() {
    return this.tenantId === null
      ? this._projectPasswordPolicy
      : this._tenantPasswordPolicies[this.tenantId];
  }
  async _updatePasswordPolicy() {
    const e = await jl(this),
      r = new Fl(e);
    this.tenantId === null
      ? (this._projectPasswordPolicy = r)
      : (this._tenantPasswordPolicies[this.tenantId] = r);
  }
  _getPersistence() {
    return this.assertedPersistence.persistence.type;
  }
  _updateErrorMap(e) {
    this._errorFactory = new Be('auth', 'Firebase', e());
  }
  onAuthStateChanged(e, r, i) {
    return this.registerStateListener(this.authStateSubscription, e, r, i);
  }
  beforeAuthStateChanged(e, r) {
    return this.beforeStateQueue.pushCallback(e, r);
  }
  onIdTokenChanged(e, r, i) {
    return this.registerStateListener(this.idTokenSubscription, e, r, i);
  }
  authStateReady() {
    return new Promise((e, r) => {
      if (this.currentUser) e();
      else {
        const i = this.onAuthStateChanged(() => {
          (i(), e());
        }, r);
      }
    });
  }
  async revokeAccessToken(e) {
    if (this.currentUser) {
      const r = await this.currentUser.getIdToken(),
        i = {
          providerId: 'apple.com',
          tokenType: 'ACCESS_TOKEN',
          token: e,
          idToken: r,
        };
      (this.tenantId != null && (i.tenantId = this.tenantId),
        await Nl(this, i));
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
  async _setRedirectUser(e, r) {
    const i = await this.getOrInitRedirectPersistenceManager(r);
    return e === null ? i.removeCurrentUser() : i.setCurrentUser(e);
  }
  async getOrInitRedirectPersistenceManager(e) {
    if (!this.redirectPersistenceManager) {
      const r = (e && me(e)) || this._popupRedirectResolver;
      (E(r, this, 'argument-error'),
        (this.redirectPersistenceManager = await Qe.create(
          this,
          [me(r._redirectPersistence)],
          'redirectUser'
        )),
        (this.redirectUser =
          await this.redirectPersistenceManager.getCurrentUser()));
    }
    return this.redirectPersistenceManager;
  }
  async _redirectUserForId(e) {
    var r, i;
    return (
      this._isInitialized && (await this.queue(async () => {})),
      ((r = this._currentUser) === null || r === void 0
        ? void 0
        : r._redirectEventId) === e
        ? this._currentUser
        : ((i = this.redirectUser) === null || i === void 0
              ? void 0
              : i._redirectEventId) === e
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
    var e, r;
    if (!this._isInitialized) return;
    this.idTokenSubscription.next(this.currentUser);
    const i =
      (r = (e = this.currentUser) === null || e === void 0 ? void 0 : e.uid) !==
        null && r !== void 0
        ? r
        : null;
    this.lastNotifiedUid !== i &&
      ((this.lastNotifiedUid = i),
      this.authStateSubscription.next(this.currentUser));
  }
  registerStateListener(e, r, i, o) {
    if (this._deleted) return () => {};
    const c = typeof r == 'function' ? r : r.next.bind(r);
    let l = !1;
    const p = this._isInitialized
      ? Promise.resolve()
      : this._initializationPromise;
    if (
      (E(p, this, 'internal-error'),
      p.then(() => {
        l || c(this.currentUser);
      }),
      typeof r == 'function')
    ) {
      const v = e.addObserver(r, i, o);
      return () => {
        ((l = !0), v());
      };
    } else {
      const v = e.addObserver(r);
      return () => {
        ((l = !0), v());
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
      E(this.persistenceManager, this, 'internal-error'),
      this.persistenceManager
    );
  }
  _logFramework(e) {
    !e ||
      this.frameworks.includes(e) ||
      (this.frameworks.push(e),
      this.frameworks.sort(),
      (this.clientVersion = vo(
        this.config.clientPlatform,
        this._getFrameworks()
      )));
  }
  _getFrameworks() {
    return this.frameworks;
  }
  async _getAdditionalHeaders() {
    var e;
    const r = { 'X-Client-Version': this.clientVersion };
    this.app.options.appId && (r['X-Firebase-gmpid'] = this.app.options.appId);
    const i = await ((e = this.heartbeatServiceProvider.getImmediate({
      optional: !0,
    })) === null || e === void 0
      ? void 0
      : e.getHeartbeatsHeader());
    i && (r['X-Firebase-Client'] = i);
    const o = await this._getAppCheckToken();
    return (o && (r['X-Firebase-AppCheck'] = o), r);
  }
  async _getAppCheckToken() {
    var e;
    const r = await ((e = this.appCheckServiceProvider.getImmediate({
      optional: !0,
    })) === null || e === void 0
      ? void 0
      : e.getToken());
    return (
      r?.error && vl(`Error while retrieving App Check token: ${r.error}`),
      r?.token
    );
  }
}
function Ir(n) {
  return De(n);
}
class Yi {
  constructor(e) {
    ((this.auth = e),
      (this.observer = null),
      (this.addObserver = ja(r => (this.observer = r))));
  }
  get next() {
    return (
      E(this.observer, this.auth, 'internal-error'),
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
 */ let Tr = {
  async loadJS() {
    throw new Error('Unable to load external scripts');
  },
  recaptchaV2Script: '',
  recaptchaEnterpriseScript: '',
  gapiScript: '',
};
function $l(n) {
  Tr = n;
}
function Vl(n) {
  return Tr.loadJS(n);
}
function Bl() {
  return Tr.gapiScript;
}
function zl(n) {
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
 */ function ql(n, e) {
  const r = ze(n, 'auth');
  if (r.isInitialized()) {
    const i = r.getImmediate(),
      o = r.getOptions();
    if (Et(o, e ?? {})) return i;
    ve(i, 'already-initialized');
  }
  return r.initialize({ options: e });
}
function Kl(n, e) {
  const r = e?.persistence || [],
    i = (Array.isArray(r) ? r : [r]).map(me);
  (e?.errorMap && n._updateErrorMap(e.errorMap),
    n._initializeWithPersistence(i, e?.popupRedirectResolver));
}
function Gl(n, e, r) {
  const i = Ir(n);
  (E(i._canInitEmulator, i, 'emulator-config-failed'),
    E(/^https?:\/\//.test(e), i, 'invalid-emulator-scheme'));
  const o = !1,
    c = wo(e),
    { host: l, port: p } = Wl(e),
    v = p === null ? '' : `:${p}`;
  ((i.config.emulator = { url: `${c}//${l}${v}/` }),
    (i.settings.appVerificationDisabledForTesting = !0),
    (i.emulatorConfig = Object.freeze({
      host: l,
      port: p,
      protocol: c.replace(':', ''),
      options: Object.freeze({ disableWarnings: o }),
    })),
    Jl());
}
function wo(n) {
  const e = n.indexOf(':');
  return e < 0 ? '' : n.substr(0, e + 1);
}
function Wl(n) {
  const e = wo(n),
    r = /(\/\/)?([^?#/]+)/.exec(n.substr(e.length));
  if (!r) return { host: '', port: null };
  const i = r[2].split('@').pop() || '',
    o = /^(\[[^\]]+\])(:|$)/.exec(i);
  if (o) {
    const c = o[1];
    return { host: c, port: Qi(i.substr(c.length + 1)) };
  } else {
    const [c, l] = i.split(':');
    return { host: c, port: Qi(l) };
  }
}
function Qi(n) {
  if (!n) return null;
  const e = Number(n);
  return isNaN(e) ? null : e;
}
function Jl() {
  function n() {
    const e = document.createElement('p'),
      r = e.style;
    ((e.innerText =
      'Running in emulator mode. Do not use with production credentials.'),
      (r.position = 'fixed'),
      (r.width = '100%'),
      (r.backgroundColor = '#ffffff'),
      (r.border = '.1em solid #000000'),
      (r.color = '#b50000'),
      (r.bottom = '0px'),
      (r.left = '0px'),
      (r.margin = '0px'),
      (r.zIndex = '10000'),
      (r.textAlign = 'center'),
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
 */ class bo {
  constructor(e, r) {
    ((this.providerId = e), (this.signInMethod = r));
  }
  toJSON() {
    return pe('not implemented');
  }
  _getIdTokenResponse(e) {
    return pe('not implemented');
  }
  _linkToIdToken(e, r) {
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
  return El(n, 'POST', '/v1/accounts:signInWithIdp', vr(n, e));
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
 */ const Xl = 'http://localhost';
class Ve extends bo {
  constructor() {
    (super(...arguments), (this.pendingToken = null));
  }
  static _fromParams(e) {
    const r = new Ve(e.providerId, e.signInMethod);
    return (
      e.idToken || e.accessToken
        ? (e.idToken && (r.idToken = e.idToken),
          e.accessToken && (r.accessToken = e.accessToken),
          e.nonce && !e.pendingToken && (r.nonce = e.nonce),
          e.pendingToken && (r.pendingToken = e.pendingToken))
        : e.oauthToken && e.oauthTokenSecret
          ? ((r.accessToken = e.oauthToken), (r.secret = e.oauthTokenSecret))
          : ve('argument-error'),
      r
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
    const r = typeof e == 'string' ? JSON.parse(e) : e,
      { providerId: i, signInMethod: o } = r,
      c = gr(r, ['providerId', 'signInMethod']);
    if (!i || !o) return null;
    const l = new Ve(i, o);
    return (
      (l.idToken = c.idToken || void 0),
      (l.accessToken = c.accessToken || void 0),
      (l.secret = c.secret),
      (l.nonce = c.nonce),
      (l.pendingToken = c.pendingToken || null),
      l
    );
  }
  _getIdTokenResponse(e) {
    const r = this.buildRequest();
    return Ze(e, r);
  }
  _linkToIdToken(e, r) {
    const i = this.buildRequest();
    return ((i.idToken = r), Ze(e, i));
  }
  _getReauthenticationResolver(e) {
    const r = this.buildRequest();
    return ((r.autoCreate = !1), Ze(e, r));
  }
  buildRequest() {
    const e = { requestUri: Xl, returnSecureToken: !0 };
    if (this.pendingToken) e.pendingToken = this.pendingToken;
    else {
      const r = {};
      (this.idToken && (r.id_token = this.idToken),
        this.accessToken && (r.access_token = this.accessToken),
        this.secret && (r.oauth_token_secret = this.secret),
        (r.providerId = this.providerId),
        this.nonce && !this.pendingToken && (r.nonce = this.nonce),
        (e.postBody = At(r)));
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
 */ class Io {
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
 */ class Pt extends Io {
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
 */ class Se extends Pt {
  constructor() {
    super('facebook.com');
  }
  static credential(e) {
    return Ve._fromParams({
      providerId: Se.PROVIDER_ID,
      signInMethod: Se.FACEBOOK_SIGN_IN_METHOD,
      accessToken: e,
    });
  }
  static credentialFromResult(e) {
    return Se.credentialFromTaggedObject(e);
  }
  static credentialFromError(e) {
    return Se.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: e }) {
    if (!e || !('oauthAccessToken' in e) || !e.oauthAccessToken) return null;
    try {
      return Se.credential(e.oauthAccessToken);
    } catch {
      return null;
    }
  }
}
Se.FACEBOOK_SIGN_IN_METHOD = 'facebook.com';
Se.PROVIDER_ID = 'facebook.com';
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
    (super('google.com'), this.addScope('profile'));
  }
  static credential(e, r) {
    return Ve._fromParams({
      providerId: ke.PROVIDER_ID,
      signInMethod: ke.GOOGLE_SIGN_IN_METHOD,
      idToken: e,
      accessToken: r,
    });
  }
  static credentialFromResult(e) {
    return ke.credentialFromTaggedObject(e);
  }
  static credentialFromError(e) {
    return ke.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: e }) {
    if (!e) return null;
    const { oauthIdToken: r, oauthAccessToken: i } = e;
    if (!r && !i) return null;
    try {
      return ke.credential(r, i);
    } catch {
      return null;
    }
  }
}
ke.GOOGLE_SIGN_IN_METHOD = 'google.com';
ke.PROVIDER_ID = 'google.com';
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
 */ class Ae extends Pt {
  constructor() {
    super('github.com');
  }
  static credential(e) {
    return Ve._fromParams({
      providerId: Ae.PROVIDER_ID,
      signInMethod: Ae.GITHUB_SIGN_IN_METHOD,
      accessToken: e,
    });
  }
  static credentialFromResult(e) {
    return Ae.credentialFromTaggedObject(e);
  }
  static credentialFromError(e) {
    return Ae.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: e }) {
    if (!e || !('oauthAccessToken' in e) || !e.oauthAccessToken) return null;
    try {
      return Ae.credential(e.oauthAccessToken);
    } catch {
      return null;
    }
  }
}
Ae.GITHUB_SIGN_IN_METHOD = 'github.com';
Ae.PROVIDER_ID = 'github.com';
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
 */ class Ce extends Pt {
  constructor() {
    super('twitter.com');
  }
  static credential(e, r) {
    return Ve._fromParams({
      providerId: Ce.PROVIDER_ID,
      signInMethod: Ce.TWITTER_SIGN_IN_METHOD,
      oauthToken: e,
      oauthTokenSecret: r,
    });
  }
  static credentialFromResult(e) {
    return Ce.credentialFromTaggedObject(e);
  }
  static credentialFromError(e) {
    return Ce.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: e }) {
    if (!e) return null;
    const { oauthAccessToken: r, oauthTokenSecret: i } = e;
    if (!r || !i) return null;
    try {
      return Ce.credential(r, i);
    } catch {
      return null;
    }
  }
}
Ce.TWITTER_SIGN_IN_METHOD = 'twitter.com';
Ce.PROVIDER_ID = 'twitter.com';
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
  static async _fromIdTokenResponse(e, r, i, o = !1) {
    const c = await ge._fromIdTokenResponse(e, i, o),
      l = Zi(i);
    return new et({
      user: c,
      providerId: l,
      _tokenResponse: i,
      operationType: r,
    });
  }
  static async _forOperation(e, r, i) {
    await e._updateTokensIfNecessary(i, !0);
    const o = Zi(i);
    return new et({
      user: e,
      providerId: o,
      _tokenResponse: i,
      operationType: r,
    });
  }
}
function Zi(n) {
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
 */ class an extends oe {
  constructor(e, r, i, o) {
    var c;
    (super(r.code, r.message),
      (this.operationType = i),
      (this.user = o),
      Object.setPrototypeOf(this, an.prototype),
      (this.customData = {
        appName: e.name,
        tenantId: (c = e.tenantId) !== null && c !== void 0 ? c : void 0,
        _serverResponse: r.customData._serverResponse,
        operationType: i,
      }));
  }
  static _fromErrorAndOperation(e, r, i, o) {
    return new an(e, r, i, o);
  }
}
function To(n, e, r, i) {
  return (
    e === 'reauthenticate'
      ? r._getReauthenticationResolver(n)
      : r._getIdTokenResponse(n)
  ).catch(o => {
    throw o.code === 'auth/multi-factor-auth-required'
      ? an._fromErrorAndOperation(n, o, e, i)
      : o;
  });
}
async function Yl(n, e, r = !1) {
  const i = await kt(n, e._linkToIdToken(n.auth, await n.getIdToken()), r);
  return et._forOperation(n, 'link', i);
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
 */ async function Ql(n, e, r = !1) {
  const { auth: i } = n;
  if (Pe(i.app)) return Promise.reject(Fe(i));
  const o = 'reauthenticate';
  try {
    const c = await kt(n, To(i, o, e, n), r);
    E(c.idToken, i, 'internal-error');
    const l = wr(c.idToken);
    E(l, i, 'internal-error');
    const { sub: p } = l;
    return (E(n.uid === p, i, 'user-mismatch'), et._forOperation(n, o, c));
  } catch (c) {
    throw (c?.code === 'auth/user-not-found' && ve(i, 'user-mismatch'), c);
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
 */ async function Zl(n, e, r = !1) {
  if (Pe(n.app)) return Promise.reject(Fe(n));
  const i = 'signIn',
    o = await To(n, i, e),
    c = await et._fromIdTokenResponse(n, i, o);
  return (r || (await n._updateCurrentUser(c.user)), c);
}
function eu(n, e, r, i) {
  return De(n).onIdTokenChanged(e, r, i);
}
function tu(n, e, r) {
  return De(n).beforeAuthStateChanged(e, r);
}
const cn = '__sak';
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
 */ class _o {
  constructor(e, r) {
    ((this.storageRetriever = e), (this.type = r));
  }
  _isAvailable() {
    try {
      return this.storage
        ? (this.storage.setItem(cn, '1'),
          this.storage.removeItem(cn),
          Promise.resolve(!0))
        : Promise.resolve(!1);
    } catch {
      return Promise.resolve(!1);
    }
  }
  _set(e, r) {
    return (this.storage.setItem(e, JSON.stringify(r)), Promise.resolve());
  }
  _get(e) {
    const r = this.storage.getItem(e);
    return Promise.resolve(r ? JSON.parse(r) : null);
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
 */ const nu = 1e3,
  ru = 10;
class Eo extends _o {
  constructor() {
    (super(() => window.localStorage, 'LOCAL'),
      (this.boundEventHandler = (e, r) => this.onStorageEvent(e, r)),
      (this.listeners = {}),
      (this.localCache = {}),
      (this.pollTimer = null),
      (this.fallbackToPolling = yo()),
      (this._shouldAllowMigration = !0));
  }
  forAllChangedKeys(e) {
    for (const r of Object.keys(this.listeners)) {
      const i = this.storage.getItem(r),
        o = this.localCache[r];
      i !== o && e(r, o, i);
    }
  }
  onStorageEvent(e, r = !1) {
    if (!e.key) {
      this.forAllChangedKeys((l, p, v) => {
        this.notifyListeners(l, v);
      });
      return;
    }
    const i = e.key;
    r ? this.detachListener() : this.stopPolling();
    const o = () => {
        const l = this.storage.getItem(i);
        (!r && this.localCache[i] === l) || this.notifyListeners(i, l);
      },
      c = this.storage.getItem(i);
    Ml() && c !== e.newValue && e.newValue !== e.oldValue
      ? setTimeout(o, ru)
      : o();
  }
  notifyListeners(e, r) {
    this.localCache[e] = r;
    const i = this.listeners[e];
    if (i) for (const o of Array.from(i)) o(r && JSON.parse(r));
  }
  startPolling() {
    (this.stopPolling(),
      (this.pollTimer = setInterval(() => {
        this.forAllChangedKeys((e, r, i) => {
          this.onStorageEvent(
            new StorageEvent('storage', { key: e, oldValue: r, newValue: i }),
            !0
          );
        });
      }, nu)));
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
  _addListener(e, r) {
    (Object.keys(this.listeners).length === 0 &&
      (this.fallbackToPolling ? this.startPolling() : this.attachListener()),
      this.listeners[e] ||
        ((this.listeners[e] = new Set()),
        (this.localCache[e] = this.storage.getItem(e))),
      this.listeners[e].add(r));
  }
  _removeListener(e, r) {
    (this.listeners[e] &&
      (this.listeners[e].delete(r),
      this.listeners[e].size === 0 && delete this.listeners[e]),
      Object.keys(this.listeners).length === 0 &&
        (this.detachListener(), this.stopPolling()));
  }
  async _set(e, r) {
    (await super._set(e, r), (this.localCache[e] = JSON.stringify(r)));
  }
  async _get(e) {
    const r = await super._get(e);
    return ((this.localCache[e] = JSON.stringify(r)), r);
  }
  async _remove(e) {
    (await super._remove(e), delete this.localCache[e]);
  }
}
Eo.type = 'LOCAL';
const iu = Eo;
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
 */ class So extends _o {
  constructor() {
    super(() => window.sessionStorage, 'SESSION');
  }
  _addListener(e, r) {}
  _removeListener(e, r) {}
}
So.type = 'SESSION';
const ko = So;
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
 */ function su(n) {
  return Promise.all(
    n.map(async e => {
      try {
        return { fulfilled: !0, value: await e };
      } catch (r) {
        return { fulfilled: !1, reason: r };
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
 */ class pn {
  constructor(e) {
    ((this.eventTarget = e),
      (this.handlersMap = {}),
      (this.boundEventHandler = this.handleEvent.bind(this)));
  }
  static _getInstance(e) {
    const r = this.receivers.find(o => o.isListeningto(e));
    if (r) return r;
    const i = new pn(e);
    return (this.receivers.push(i), i);
  }
  isListeningto(e) {
    return this.eventTarget === e;
  }
  async handleEvent(e) {
    const r = e,
      { eventId: i, eventType: o, data: c } = r.data,
      l = this.handlersMap[o];
    if (!l?.size) return;
    r.ports[0].postMessage({ status: 'ack', eventId: i, eventType: o });
    const p = Array.from(l).map(async T => T(r.origin, c)),
      v = await su(p);
    r.ports[0].postMessage({
      status: 'done',
      eventId: i,
      eventType: o,
      response: v,
    });
  }
  _subscribe(e, r) {
    (Object.keys(this.handlersMap).length === 0 &&
      this.eventTarget.addEventListener('message', this.boundEventHandler),
      this.handlersMap[e] || (this.handlersMap[e] = new Set()),
      this.handlersMap[e].add(r));
  }
  _unsubscribe(e, r) {
    (this.handlersMap[e] && r && this.handlersMap[e].delete(r),
      (!r || this.handlersMap[e].size === 0) && delete this.handlersMap[e],
      Object.keys(this.handlersMap).length === 0 &&
        this.eventTarget.removeEventListener(
          'message',
          this.boundEventHandler
        ));
  }
}
pn.receivers = [];
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
 */ function _r(n = '', e = 10) {
  let r = '';
  for (let i = 0; i < e; i++) r += Math.floor(Math.random() * 10);
  return n + r;
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
 */ class ou {
  constructor(e) {
    ((this.target = e), (this.handlers = new Set()));
  }
  removeMessageHandler(e) {
    (e.messageChannel &&
      (e.messageChannel.port1.removeEventListener('message', e.onMessage),
      e.messageChannel.port1.close()),
      this.handlers.delete(e));
  }
  async _send(e, r, i = 50) {
    const o = typeof MessageChannel < 'u' ? new MessageChannel() : null;
    if (!o) throw new Error('connection_unavailable');
    let c, l;
    return new Promise((p, v) => {
      const T = _r('', 20);
      o.port1.start();
      const S = setTimeout(() => {
        v(new Error('unsupported_event'));
      }, i);
      ((l = {
        messageChannel: o,
        onMessage(k) {
          const A = k;
          if (A.data.eventId === T)
            switch (A.data.status) {
              case 'ack':
                (clearTimeout(S),
                  (c = setTimeout(() => {
                    v(new Error('timeout'));
                  }, 3e3)));
                break;
              case 'done':
                (clearTimeout(c), p(A.data.response));
                break;
              default:
                (clearTimeout(S),
                  clearTimeout(c),
                  v(new Error('invalid_response')));
                break;
            }
        },
      }),
        this.handlers.add(l),
        o.port1.addEventListener('message', l.onMessage),
        this.target.postMessage({ eventType: e, eventId: T, data: r }, [
          o.port2,
        ]));
    }).finally(() => {
      l && this.removeMessageHandler(l);
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
function au(n) {
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
 */ function Ao() {
  return (
    typeof ce().WorkerGlobalScope < 'u' &&
    typeof ce().importScripts == 'function'
  );
}
async function cu() {
  if (!navigator?.serviceWorker) return null;
  try {
    return (await navigator.serviceWorker.ready).active;
  } catch {
    return null;
  }
}
function hu() {
  var n;
  return (
    ((n = navigator?.serviceWorker) === null || n === void 0
      ? void 0
      : n.controller) || null
  );
}
function lu() {
  return Ao() ? self : null;
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
 */ const Co = 'firebaseLocalStorageDb',
  uu = 1,
  hn = 'firebaseLocalStorage',
  Po = 'fbase_key';
class Ot {
  constructor(e) {
    this.request = e;
  }
  toPromise() {
    return new Promise((e, r) => {
      (this.request.addEventListener('success', () => {
        e(this.request.result);
      }),
        this.request.addEventListener('error', () => {
          r(this.request.error);
        }));
    });
  }
}
function gn(n, e) {
  return n.transaction([hn], e ? 'readwrite' : 'readonly').objectStore(hn);
}
function du() {
  const n = indexedDB.deleteDatabase(Co);
  return new Ot(n).toPromise();
}
function or() {
  const n = indexedDB.open(Co, uu);
  return new Promise((e, r) => {
    (n.addEventListener('error', () => {
      r(n.error);
    }),
      n.addEventListener('upgradeneeded', () => {
        const i = n.result;
        try {
          i.createObjectStore(hn, { keyPath: Po });
        } catch (o) {
          r(o);
        }
      }),
      n.addEventListener('success', async () => {
        const i = n.result;
        i.objectStoreNames.contains(hn)
          ? e(i)
          : (i.close(), await du(), e(await or()));
      }));
  });
}
async function es(n, e, r) {
  const i = gn(n, !0).put({ [Po]: e, value: r });
  return new Ot(i).toPromise();
}
async function fu(n, e) {
  const r = gn(n, !1).get(e),
    i = await new Ot(r).toPromise();
  return i === void 0 ? null : i.value;
}
function ts(n, e) {
  const r = gn(n, !0).delete(e);
  return new Ot(r).toPromise();
}
const pu = 800,
  gu = 3;
class Oo {
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
    return this.db ? this.db : ((this.db = await or()), this.db);
  }
  async _withRetries(e) {
    let r = 0;
    for (;;)
      try {
        const i = await this._openDb();
        return await e(i);
      } catch (i) {
        if (r++ > gu) throw i;
        this.db && (this.db.close(), (this.db = void 0));
      }
  }
  async initializeServiceWorkerMessaging() {
    return Ao() ? this.initializeReceiver() : this.initializeSender();
  }
  async initializeReceiver() {
    ((this.receiver = pn._getInstance(lu())),
      this.receiver._subscribe('keyChanged', async (e, r) => ({
        keyProcessed: (await this._poll()).includes(r.key),
      })),
      this.receiver._subscribe('ping', async (e, r) => ['keyChanged']));
  }
  async initializeSender() {
    var e, r;
    if (((this.activeServiceWorker = await cu()), !this.activeServiceWorker))
      return;
    this.sender = new ou(this.activeServiceWorker);
    const i = await this.sender._send('ping', {}, 800);
    i &&
      !((e = i[0]) === null || e === void 0) &&
      e.fulfilled &&
      !((r = i[0]) === null || r === void 0) &&
      r.value.includes('keyChanged') &&
      (this.serviceWorkerReceiverAvailable = !0);
  }
  async notifyServiceWorker(e) {
    if (
      !(
        !this.sender ||
        !this.activeServiceWorker ||
        hu() !== this.activeServiceWorker
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
      const e = await or();
      return (await es(e, cn, '1'), await ts(e, cn), !0);
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
  async _set(e, r) {
    return this._withPendingWrite(
      async () => (
        await this._withRetries(i => es(i, e, r)),
        (this.localCache[e] = r),
        this.notifyServiceWorker(e)
      )
    );
  }
  async _get(e) {
    const r = await this._withRetries(i => fu(i, e));
    return ((this.localCache[e] = r), r);
  }
  async _remove(e) {
    return this._withPendingWrite(
      async () => (
        await this._withRetries(r => ts(r, e)),
        delete this.localCache[e],
        this.notifyServiceWorker(e)
      )
    );
  }
  async _poll() {
    const e = await this._withRetries(o => {
      const c = gn(o, !1).getAll();
      return new Ot(c).toPromise();
    });
    if (!e) return [];
    if (this.pendingWrites !== 0) return [];
    const r = [],
      i = new Set();
    if (e.length !== 0)
      for (const { fbase_key: o, value: c } of e)
        (i.add(o),
          JSON.stringify(this.localCache[o]) !== JSON.stringify(c) &&
            (this.notifyListeners(o, c), r.push(o)));
    for (const o of Object.keys(this.localCache))
      this.localCache[o] &&
        !i.has(o) &&
        (this.notifyListeners(o, null), r.push(o));
    return r;
  }
  notifyListeners(e, r) {
    this.localCache[e] = r;
    const i = this.listeners[e];
    if (i) for (const o of Array.from(i)) o(r);
  }
  startPolling() {
    (this.stopPolling(),
      (this.pollTimer = setInterval(async () => this._poll(), pu)));
  }
  stopPolling() {
    this.pollTimer && (clearInterval(this.pollTimer), (this.pollTimer = null));
  }
  _addListener(e, r) {
    (Object.keys(this.listeners).length === 0 && this.startPolling(),
      this.listeners[e] || ((this.listeners[e] = new Set()), this._get(e)),
      this.listeners[e].add(r));
  }
  _removeListener(e, r) {
    (this.listeners[e] &&
      (this.listeners[e].delete(r),
      this.listeners[e].size === 0 && delete this.listeners[e]),
      Object.keys(this.listeners).length === 0 && this.stopPolling());
  }
}
Oo.type = 'LOCAL';
const mu = Oo;
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
 */ function yu(n, e) {
  return e
    ? me(e)
    : (E(n._popupRedirectResolver, n, 'argument-error'),
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
 */ class Er extends bo {
  constructor(e) {
    (super('custom', 'custom'), (this.params = e));
  }
  _getIdTokenResponse(e) {
    return Ze(e, this._buildIdpRequest());
  }
  _linkToIdToken(e, r) {
    return Ze(e, this._buildIdpRequest(r));
  }
  _getReauthenticationResolver(e) {
    return Ze(e, this._buildIdpRequest());
  }
  _buildIdpRequest(e) {
    const r = {
      requestUri: this.params.requestUri,
      sessionId: this.params.sessionId,
      postBody: this.params.postBody,
      tenantId: this.params.tenantId,
      pendingToken: this.params.pendingToken,
      returnSecureToken: !0,
      returnIdpCredential: !0,
    };
    return (e && (r.idToken = e), r);
  }
}
function vu(n) {
  return Zl(n.auth, new Er(n), n.bypassAuthState);
}
function wu(n) {
  const { auth: e, user: r } = n;
  return (E(r, e, 'internal-error'), Ql(r, new Er(n), n.bypassAuthState));
}
async function bu(n) {
  const { auth: e, user: r } = n;
  return (E(r, e, 'internal-error'), Yl(r, new Er(n), n.bypassAuthState));
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
 */ class Ro {
  constructor(e, r, i, o, c = !1) {
    ((this.auth = e),
      (this.resolver = i),
      (this.user = o),
      (this.bypassAuthState = c),
      (this.pendingPromise = null),
      (this.eventManager = null),
      (this.filter = Array.isArray(r) ? r : [r]));
  }
  execute() {
    return new Promise(async (e, r) => {
      this.pendingPromise = { resolve: e, reject: r };
      try {
        ((this.eventManager = await this.resolver._initialize(this.auth)),
          await this.onExecution(),
          this.eventManager.registerConsumer(this));
      } catch (i) {
        this.reject(i);
      }
    });
  }
  async onAuthEvent(e) {
    const {
      urlResponse: r,
      sessionId: i,
      postBody: o,
      tenantId: c,
      error: l,
      type: p,
    } = e;
    if (l) {
      this.reject(l);
      return;
    }
    const v = {
      auth: this.auth,
      requestUri: r,
      sessionId: i,
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
        return vu;
      case 'linkViaPopup':
      case 'linkViaRedirect':
        return bu;
      case 'reauthViaPopup':
      case 'reauthViaRedirect':
        return wu;
      default:
        ve(this.auth, 'internal-error');
    }
  }
  resolve(e) {
    (we(this.pendingPromise, 'Pending promise was never set'),
      this.pendingPromise.resolve(e),
      this.unregisterAndCleanUp());
  }
  reject(e) {
    (we(this.pendingPromise, 'Pending promise was never set'),
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
 */ const Iu = new Ct(2e3, 1e4);
class Xe extends Ro {
  constructor(e, r, i, o, c) {
    (super(e, r, o, c),
      (this.provider = i),
      (this.authWindow = null),
      (this.pollId = null),
      Xe.currentPopupAction && Xe.currentPopupAction.cancel(),
      (Xe.currentPopupAction = this));
  }
  async executeNotNull() {
    const e = await this.execute();
    return (E(e, this.auth, 'internal-error'), e);
  }
  async onExecution() {
    we(this.filter.length === 1, 'Popup operations only handle one event');
    const e = _r();
    ((this.authWindow = await this.resolver._openPopup(
      this.auth,
      this.provider,
      this.filter[0],
      e
    )),
      (this.authWindow.associatedEvent = e),
      this.resolver._originValidation(this.auth).catch(r => {
        this.reject(r);
      }),
      this.resolver._isIframeWebStorageSupported(this.auth, r => {
        r || this.reject(ae(this.auth, 'web-storage-unsupported'));
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
      var r, i;
      if (
        !(
          (i =
            (r = this.authWindow) === null || r === void 0
              ? void 0
              : r.window) === null || i === void 0
        ) &&
        i.closed
      ) {
        this.pollId = window.setTimeout(() => {
          ((this.pollId = null),
            this.reject(ae(this.auth, 'popup-closed-by-user')));
        }, 8e3);
        return;
      }
      this.pollId = window.setTimeout(e, Iu.get());
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
 */ const Tu = 'pendingRedirect',
  Qt = new Map();
class _u extends Ro {
  constructor(e, r, i = !1) {
    (super(
      e,
      ['signInViaRedirect', 'linkViaRedirect', 'reauthViaRedirect', 'unknown'],
      r,
      void 0,
      i
    ),
      (this.eventId = null));
  }
  async execute() {
    let e = Qt.get(this.auth._key());
    if (!e) {
      try {
        const r = (await Eu(this.resolver, this.auth))
          ? await super.execute()
          : null;
        e = () => Promise.resolve(r);
      } catch (r) {
        e = () => Promise.reject(r);
      }
      Qt.set(this.auth._key(), e);
    }
    return (
      this.bypassAuthState ||
        Qt.set(this.auth._key(), () => Promise.resolve(null)),
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
      const r = await this.auth._redirectUserForId(e.eventId);
      if (r) return ((this.user = r), super.onAuthEvent(e));
      this.resolve(null);
    }
  }
  async onExecution() {}
  cleanUp() {}
}
async function Eu(n, e) {
  const r = Au(e),
    i = ku(n);
  if (!(await i._isAvailable())) return !1;
  const o = (await i._get(r)) === 'true';
  return (await i._remove(r), o);
}
function Su(n, e) {
  Qt.set(n._key(), e);
}
function ku(n) {
  return me(n._redirectPersistence);
}
function Au(n) {
  return Yt(Tu, n.config.apiKey, n.name);
}
async function Cu(n, e, r = !1) {
  if (Pe(n.app)) return Promise.reject(Fe(n));
  const i = Ir(n),
    o = yu(i, e),
    c = await new _u(i, o, r).execute();
  return (
    c &&
      !r &&
      (delete c.user._redirectEventId,
      await i._persistUserIfCurrent(c.user),
      await i._setRedirectUser(null, e)),
    c
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
 */ const Pu = 10 * 60 * 1e3;
class Ou {
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
    let r = !1;
    return (
      this.consumers.forEach(i => {
        this.isEventForConsumer(e, i) &&
          ((r = !0), this.sendToConsumer(e, i), this.saveEventToCache(e));
      }),
      this.hasHandledPotentialRedirect ||
        !Ru(e) ||
        ((this.hasHandledPotentialRedirect = !0),
        r || ((this.queuedRedirectEvent = e), (r = !0))),
      r
    );
  }
  sendToConsumer(e, r) {
    var i;
    if (e.error && !Do(e)) {
      const o =
        ((i = e.error.code) === null || i === void 0
          ? void 0
          : i.split('auth/')[1]) || 'internal-error';
      r.onError(ae(this.auth, o));
    } else r.onAuthEvent(e);
  }
  isEventForConsumer(e, r) {
    const i = r.eventId === null || (!!e.eventId && e.eventId === r.eventId);
    return r.filter.includes(e.type) && i;
  }
  hasEventBeenHandled(e) {
    return (
      Date.now() - this.lastProcessedEventTime >= Pu &&
        this.cachedEventUids.clear(),
      this.cachedEventUids.has(ns(e))
    );
  }
  saveEventToCache(e) {
    (this.cachedEventUids.add(ns(e)),
      (this.lastProcessedEventTime = Date.now()));
  }
}
function ns(n) {
  return [n.type, n.eventId, n.sessionId, n.tenantId].filter(e => e).join('-');
}
function Do({ type: n, error: e }) {
  return n === 'unknown' && e?.code === 'auth/no-auth-event';
}
function Ru(n) {
  switch (n.type) {
    case 'signInViaRedirect':
    case 'linkViaRedirect':
    case 'reauthViaRedirect':
      return !0;
    case 'unknown':
      return Do(n);
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
 */ async function Du(n, e = {}) {
  return rt(n, 'GET', '/v1/projects', e);
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
 */ const Nu = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  Lu = /^https?/;
async function Mu(n) {
  if (n.config.emulator) return;
  const { authorizedDomains: e } = await Du(n);
  for (const r of e)
    try {
      if (Uu(r)) return;
    } catch {}
  ve(n, 'unauthorized-domain');
}
function Uu(n) {
  const e = ir(),
    { protocol: r, hostname: i } = new URL(e);
  if (n.startsWith('chrome-extension://')) {
    const c = new URL(n);
    return c.hostname === '' && i === ''
      ? r === 'chrome-extension:' &&
          n.replace('chrome-extension://', '') ===
            e.replace('chrome-extension://', '')
      : r === 'chrome-extension:' && c.hostname === i;
  }
  if (!Lu.test(r)) return !1;
  if (Nu.test(n)) return i === n;
  const o = n.replace(/\./g, '\\.');
  return new RegExp('^(.+\\.' + o + '|' + o + ')$', 'i').test(i);
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
 */ const ju = new Ct(3e4, 6e4);
function rs() {
  const n = ce().___jsl;
  if (n?.H) {
    for (const e of Object.keys(n.H))
      if (
        ((n.H[e].r = n.H[e].r || []),
        (n.H[e].L = n.H[e].L || []),
        (n.H[e].r = [...n.H[e].L]),
        n.CP)
      )
        for (let r = 0; r < n.CP.length; r++) n.CP[r] = null;
  }
}
function xu(n) {
  return new Promise((e, r) => {
    var i, o, c;
    function l() {
      (rs(),
        gapi.load('gapi.iframes', {
          callback: () => {
            e(gapi.iframes.getContext());
          },
          ontimeout: () => {
            (rs(), r(ae(n, 'network-request-failed')));
          },
          timeout: ju.get(),
        }));
    }
    if (
      !(
        (o = (i = ce().gapi) === null || i === void 0 ? void 0 : i.iframes) ===
          null || o === void 0
      ) &&
      o.Iframe
    )
      e(gapi.iframes.getContext());
    else if (!((c = ce().gapi) === null || c === void 0) && c.load) l();
    else {
      const p = zl('iframefcb');
      return (
        (ce()[p] = () => {
          gapi.load ? l() : r(ae(n, 'network-request-failed'));
        }),
        Vl(`${Bl()}?onload=${p}`).catch(v => r(v))
      );
    }
  }).catch(e => {
    throw ((Zt = null), e);
  });
}
let Zt = null;
function Fu(n) {
  return ((Zt = Zt || xu(n)), Zt);
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
 */ const Hu = new Ct(5e3, 15e3),
  $u = '__/auth/iframe',
  Vu = 'emulator/auth/iframe',
  Bu = {
    style: { position: 'absolute', top: '-100px', width: '1px', height: '1px' },
    'aria-hidden': 'true',
    tabindex: '-1',
  },
  zu = new Map([
    ['identitytoolkit.googleapis.com', 'p'],
    ['staging-identitytoolkit.sandbox.googleapis.com', 's'],
    ['test-identitytoolkit.sandbox.googleapis.com', 't'],
  ]);
function qu(n) {
  const e = n.config;
  E(e.authDomain, n, 'auth-domain-config-required');
  const r = e.emulator ? yr(e, Vu) : `https://${n.config.authDomain}/${$u}`,
    i = { apiKey: e.apiKey, appName: n.name, v: nt },
    o = zu.get(n.config.apiHost);
  o && (i.eid = o);
  const c = n._getFrameworks();
  return (c.length && (i.fw = c.join(',')), `${r}?${At(i).slice(1)}`);
}
async function Ku(n) {
  const e = await Fu(n),
    r = ce().gapi;
  return (
    E(r, n, 'internal-error'),
    e.open(
      {
        where: document.body,
        url: qu(n),
        messageHandlersFilter: r.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
        attributes: Bu,
        dontclear: !0,
      },
      i =>
        new Promise(async (o, c) => {
          await i.restyle({ setHideOnLeave: !1 });
          const l = ae(n, 'network-request-failed'),
            p = ce().setTimeout(() => {
              c(l);
            }, Hu.get());
          function v() {
            (ce().clearTimeout(p), o(i));
          }
          i.ping(v).then(v, () => {
            c(l);
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
 */ const Gu = {
    location: 'yes',
    resizable: 'yes',
    statusbar: 'yes',
    toolbar: 'no',
  },
  Wu = 500,
  Ju = 600,
  Xu = '_blank',
  Yu = 'http://localhost';
class is {
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
function Qu(n, e, r, i = Wu, o = Ju) {
  const c = Math.max((window.screen.availHeight - o) / 2, 0).toString(),
    l = Math.max((window.screen.availWidth - i) / 2, 0).toString();
  let p = '';
  const v = Object.assign(Object.assign({}, Gu), {
      width: i.toString(),
      height: o.toString(),
      top: c,
      left: l,
    }),
    T = K().toLowerCase();
  (r && (p = uo(T) ? Xu : r), ho(T) && ((e = e || Yu), (v.scrollbars = 'yes')));
  const S = Object.entries(v).reduce((A, [L, P]) => `${A}${L}=${P},`, '');
  if (Ll(T) && p !== '_self') return (Zu(e || '', p), new is(null));
  const k = window.open(e || '', p, S);
  E(k, n, 'popup-blocked');
  try {
    k.focus();
  } catch {}
  return new is(k);
}
function Zu(n, e) {
  const r = document.createElement('a');
  ((r.href = n), (r.target = e));
  const i = document.createEvent('MouseEvent');
  (i.initMouseEvent(
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
    r.dispatchEvent(i));
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
 */ const ed = '__/auth/handler',
  td = 'emulator/auth/handler',
  nd = encodeURIComponent('fac');
async function ss(n, e, r, i, o, c) {
  (E(n.config.authDomain, n, 'auth-domain-config-required'),
    E(n.config.apiKey, n, 'invalid-api-key'));
  const l = {
    apiKey: n.config.apiKey,
    appName: n.name,
    authType: r,
    redirectUrl: i,
    v: nt,
    eventId: o,
  };
  if (e instanceof Io) {
    (e.setDefaultLanguage(n.languageCode),
      (l.providerId = e.providerId || ''),
      Ua(e.getCustomParameters()) ||
        (l.customParameters = JSON.stringify(e.getCustomParameters())));
    for (const [S, k] of Object.entries({})) l[S] = k;
  }
  if (e instanceof Pt) {
    const S = e.getScopes().filter(k => k !== '');
    S.length > 0 && (l.scopes = S.join(','));
  }
  n.tenantId && (l.tid = n.tenantId);
  const p = l;
  for (const S of Object.keys(p)) p[S] === void 0 && delete p[S];
  const v = await n._getAppCheckToken(),
    T = v ? `#${nd}=${encodeURIComponent(v)}` : '';
  return `${rd(n)}?${At(p).slice(1)}${T}`;
}
function rd({ config: n }) {
  return n.emulator ? yr(n, td) : `https://${n.authDomain}/${ed}`;
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
 */ const Xn = 'webStorageSupport';
class id {
  constructor() {
    ((this.eventManagers = {}),
      (this.iframes = {}),
      (this.originValidationPromises = {}),
      (this._redirectPersistence = ko),
      (this._completeRedirectFn = Cu),
      (this._overrideRedirectResult = Su));
  }
  async _openPopup(e, r, i, o) {
    var c;
    we(
      (c = this.eventManagers[e._key()]) === null || c === void 0
        ? void 0
        : c.manager,
      '_initialize() not called before _openPopup()'
    );
    const l = await ss(e, r, i, ir(), o);
    return Qu(e, l, _r());
  }
  async _openRedirect(e, r, i, o) {
    await this._originValidation(e);
    const c = await ss(e, r, i, ir(), o);
    return (au(c), new Promise(() => {}));
  }
  _initialize(e) {
    const r = e._key();
    if (this.eventManagers[r]) {
      const { manager: o, promise: c } = this.eventManagers[r];
      return o
        ? Promise.resolve(o)
        : (we(c, 'If manager is not set, promise should be'), c);
    }
    const i = this.initAndGetManager(e);
    return (
      (this.eventManagers[r] = { promise: i }),
      i.catch(() => {
        delete this.eventManagers[r];
      }),
      i
    );
  }
  async initAndGetManager(e) {
    const r = await Ku(e),
      i = new Ou(e);
    return (
      r.register(
        'authEvent',
        o => (
          E(o?.authEvent, e, 'invalid-auth-event'),
          { status: i.onEvent(o.authEvent) ? 'ACK' : 'ERROR' }
        ),
        gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER
      ),
      (this.eventManagers[e._key()] = { manager: i }),
      (this.iframes[e._key()] = r),
      i
    );
  }
  _isIframeWebStorageSupported(e, r) {
    this.iframes[e._key()].send(
      Xn,
      { type: Xn },
      i => {
        var o;
        const c = (o = i?.[0]) === null || o === void 0 ? void 0 : o[Xn];
        (c !== void 0 && r(!!c), ve(e, 'internal-error'));
      },
      gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER
    );
  }
  _originValidation(e) {
    const r = e._key();
    return (
      this.originValidationPromises[r] ||
        (this.originValidationPromises[r] = Mu(e)),
      this.originValidationPromises[r]
    );
  }
  get _shouldInitProactively() {
    return yo() || lo() || br();
  }
}
const sd = id;
var os = '@firebase/auth',
  as = '1.7.9';
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
 */ class od {
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
    const r = this.auth.onIdTokenChanged(i => {
      e(i?.stsTokenManager.accessToken || null);
    });
    (this.internalListeners.set(e, r), this.updateProactiveRefresh());
  }
  removeAuthTokenListener(e) {
    this.assertAuthConfigured();
    const r = this.internalListeners.get(e);
    r && (this.internalListeners.delete(e), r(), this.updateProactiveRefresh());
  }
  assertAuthConfigured() {
    E(
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
 */ function ad(n) {
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
function cd(n) {
  (he(
    new se(
      'auth',
      (e, { options: r }) => {
        const i = e.getProvider('app').getImmediate(),
          o = e.getProvider('heartbeat'),
          c = e.getProvider('app-check-internal'),
          { apiKey: l, authDomain: p } = i.options;
        E(l && !l.includes(':'), 'invalid-api-key', { appName: i.name });
        const v = {
            apiKey: l,
            authDomain: p,
            clientPlatform: n,
            apiHost: 'identitytoolkit.googleapis.com',
            tokenApiHost: 'securetoken.googleapis.com',
            apiScheme: 'https',
            sdkClientVersion: vo(n),
          },
          T = new Hl(i, o, c, v);
        return (Kl(T, r), T);
      },
      'PUBLIC'
    )
      .setInstantiationMode('EXPLICIT')
      .setInstanceCreatedCallback((e, r, i) => {
        e.getProvider('auth-internal').initialize();
      })
  ),
    he(
      new se(
        'auth-internal',
        e => {
          const r = Ir(e.getProvider('auth').getImmediate());
          return (i => new od(i))(r);
        },
        'PRIVATE'
      ).setInstantiationMode('EXPLICIT')
    ),
    te(os, as, ad(n)),
    te(os, as, 'esm2017'));
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
 */ const hd = 5 * 60,
  ld = Ts('authIdTokenMaxAge') || hd;
let cs = null;
const ud = n => async e => {
  const r = e && (await e.getIdTokenResult()),
    i = r && (new Date().getTime() - Date.parse(r.issuedAtTime)) / 1e3;
  if (i && i > ld) return;
  const o = r?.token;
  cs !== o &&
    ((cs = o),
    await fetch(n, {
      method: o ? 'POST' : 'DELETE',
      headers: o ? { Authorization: `Bearer ${o}` } : {},
    }));
};
function dd(n = hr()) {
  const e = ze(n, 'auth');
  if (e.isInitialized()) return e.getImmediate();
  const r = ql(n, { popupRedirectResolver: sd, persistence: [mu, iu, ko] }),
    i = Ts('authTokenSyncURL');
  if (i && typeof isSecureContext == 'boolean' && isSecureContext) {
    const c = new URL(i, location.origin);
    if (location.origin === c.origin) {
      const l = ud(c.toString());
      (tu(r, l, () => l(r.currentUser)), eu(r, p => l(p)));
    }
  }
  const o = bs('auth');
  return (o && Gl(r, `http://${o}`), r);
}
function fd() {
  var n, e;
  return (e =
    (n = document.getElementsByTagName('head')) === null || n === void 0
      ? void 0
      : n[0]) !== null && e !== void 0
    ? e
    : document;
}
$l({
  loadJS(n) {
    return new Promise((e, r) => {
      const i = document.createElement('script');
      (i.setAttribute('src', n),
        (i.onload = e),
        (i.onerror = o => {
          const c = ae('internal-error');
          ((c.customData = o), r(c));
        }),
        (i.type = 'text/javascript'),
        (i.charset = 'UTF-8'),
        fd().appendChild(i));
    });
  },
  gapiScript: 'https://apis.google.com/js/api.js',
  recaptchaV2Script: 'https://www.google.com/recaptcha/api.js',
  recaptchaEnterpriseScript:
    'https://www.google.com/recaptcha/enterprise.js?render=',
});
cd('Browser');
var hs =
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
*/ var No;
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
      (y.C = function (g, m, b) {
        for (
          var d = Array(arguments.length - 2), ue = 2;
          ue < arguments.length;
          ue++
        )
          d[ue - 2] = arguments[ue];
        return u.prototype[m].apply(g, d);
      }));
  }
  function r() {
    this.blockSize = -1;
  }
  function i() {
    ((this.blockSize = -1),
      (this.blockSize = 64),
      (this.g = Array(4)),
      (this.B = Array(this.blockSize)),
      (this.o = this.h = 0),
      this.s());
  }
  (e(i, r),
    (i.prototype.s = function () {
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
    var b = y.g[3],
      d = (u + (b ^ (f & (m ^ b))) + g[0] + 3614090360) & 4294967295;
    ((u = f + (((d << 7) & 4294967295) | (d >>> 25))),
      (d = (b + (m ^ (u & (f ^ m))) + g[1] + 3905402710) & 4294967295),
      (b = u + (((d << 12) & 4294967295) | (d >>> 20))),
      (d = (m + (f ^ (b & (u ^ f))) + g[2] + 606105819) & 4294967295),
      (m = b + (((d << 17) & 4294967295) | (d >>> 15))),
      (d = (f + (u ^ (m & (b ^ u))) + g[3] + 3250441966) & 4294967295),
      (f = m + (((d << 22) & 4294967295) | (d >>> 10))),
      (d = (u + (b ^ (f & (m ^ b))) + g[4] + 4118548399) & 4294967295),
      (u = f + (((d << 7) & 4294967295) | (d >>> 25))),
      (d = (b + (m ^ (u & (f ^ m))) + g[5] + 1200080426) & 4294967295),
      (b = u + (((d << 12) & 4294967295) | (d >>> 20))),
      (d = (m + (f ^ (b & (u ^ f))) + g[6] + 2821735955) & 4294967295),
      (m = b + (((d << 17) & 4294967295) | (d >>> 15))),
      (d = (f + (u ^ (m & (b ^ u))) + g[7] + 4249261313) & 4294967295),
      (f = m + (((d << 22) & 4294967295) | (d >>> 10))),
      (d = (u + (b ^ (f & (m ^ b))) + g[8] + 1770035416) & 4294967295),
      (u = f + (((d << 7) & 4294967295) | (d >>> 25))),
      (d = (b + (m ^ (u & (f ^ m))) + g[9] + 2336552879) & 4294967295),
      (b = u + (((d << 12) & 4294967295) | (d >>> 20))),
      (d = (m + (f ^ (b & (u ^ f))) + g[10] + 4294925233) & 4294967295),
      (m = b + (((d << 17) & 4294967295) | (d >>> 15))),
      (d = (f + (u ^ (m & (b ^ u))) + g[11] + 2304563134) & 4294967295),
      (f = m + (((d << 22) & 4294967295) | (d >>> 10))),
      (d = (u + (b ^ (f & (m ^ b))) + g[12] + 1804603682) & 4294967295),
      (u = f + (((d << 7) & 4294967295) | (d >>> 25))),
      (d = (b + (m ^ (u & (f ^ m))) + g[13] + 4254626195) & 4294967295),
      (b = u + (((d << 12) & 4294967295) | (d >>> 20))),
      (d = (m + (f ^ (b & (u ^ f))) + g[14] + 2792965006) & 4294967295),
      (m = b + (((d << 17) & 4294967295) | (d >>> 15))),
      (d = (f + (u ^ (m & (b ^ u))) + g[15] + 1236535329) & 4294967295),
      (f = m + (((d << 22) & 4294967295) | (d >>> 10))),
      (d = (u + (m ^ (b & (f ^ m))) + g[1] + 4129170786) & 4294967295),
      (u = f + (((d << 5) & 4294967295) | (d >>> 27))),
      (d = (b + (f ^ (m & (u ^ f))) + g[6] + 3225465664) & 4294967295),
      (b = u + (((d << 9) & 4294967295) | (d >>> 23))),
      (d = (m + (u ^ (f & (b ^ u))) + g[11] + 643717713) & 4294967295),
      (m = b + (((d << 14) & 4294967295) | (d >>> 18))),
      (d = (f + (b ^ (u & (m ^ b))) + g[0] + 3921069994) & 4294967295),
      (f = m + (((d << 20) & 4294967295) | (d >>> 12))),
      (d = (u + (m ^ (b & (f ^ m))) + g[5] + 3593408605) & 4294967295),
      (u = f + (((d << 5) & 4294967295) | (d >>> 27))),
      (d = (b + (f ^ (m & (u ^ f))) + g[10] + 38016083) & 4294967295),
      (b = u + (((d << 9) & 4294967295) | (d >>> 23))),
      (d = (m + (u ^ (f & (b ^ u))) + g[15] + 3634488961) & 4294967295),
      (m = b + (((d << 14) & 4294967295) | (d >>> 18))),
      (d = (f + (b ^ (u & (m ^ b))) + g[4] + 3889429448) & 4294967295),
      (f = m + (((d << 20) & 4294967295) | (d >>> 12))),
      (d = (u + (m ^ (b & (f ^ m))) + g[9] + 568446438) & 4294967295),
      (u = f + (((d << 5) & 4294967295) | (d >>> 27))),
      (d = (b + (f ^ (m & (u ^ f))) + g[14] + 3275163606) & 4294967295),
      (b = u + (((d << 9) & 4294967295) | (d >>> 23))),
      (d = (m + (u ^ (f & (b ^ u))) + g[3] + 4107603335) & 4294967295),
      (m = b + (((d << 14) & 4294967295) | (d >>> 18))),
      (d = (f + (b ^ (u & (m ^ b))) + g[8] + 1163531501) & 4294967295),
      (f = m + (((d << 20) & 4294967295) | (d >>> 12))),
      (d = (u + (m ^ (b & (f ^ m))) + g[13] + 2850285829) & 4294967295),
      (u = f + (((d << 5) & 4294967295) | (d >>> 27))),
      (d = (b + (f ^ (m & (u ^ f))) + g[2] + 4243563512) & 4294967295),
      (b = u + (((d << 9) & 4294967295) | (d >>> 23))),
      (d = (m + (u ^ (f & (b ^ u))) + g[7] + 1735328473) & 4294967295),
      (m = b + (((d << 14) & 4294967295) | (d >>> 18))),
      (d = (f + (b ^ (u & (m ^ b))) + g[12] + 2368359562) & 4294967295),
      (f = m + (((d << 20) & 4294967295) | (d >>> 12))),
      (d = (u + (f ^ m ^ b) + g[5] + 4294588738) & 4294967295),
      (u = f + (((d << 4) & 4294967295) | (d >>> 28))),
      (d = (b + (u ^ f ^ m) + g[8] + 2272392833) & 4294967295),
      (b = u + (((d << 11) & 4294967295) | (d >>> 21))),
      (d = (m + (b ^ u ^ f) + g[11] + 1839030562) & 4294967295),
      (m = b + (((d << 16) & 4294967295) | (d >>> 16))),
      (d = (f + (m ^ b ^ u) + g[14] + 4259657740) & 4294967295),
      (f = m + (((d << 23) & 4294967295) | (d >>> 9))),
      (d = (u + (f ^ m ^ b) + g[1] + 2763975236) & 4294967295),
      (u = f + (((d << 4) & 4294967295) | (d >>> 28))),
      (d = (b + (u ^ f ^ m) + g[4] + 1272893353) & 4294967295),
      (b = u + (((d << 11) & 4294967295) | (d >>> 21))),
      (d = (m + (b ^ u ^ f) + g[7] + 4139469664) & 4294967295),
      (m = b + (((d << 16) & 4294967295) | (d >>> 16))),
      (d = (f + (m ^ b ^ u) + g[10] + 3200236656) & 4294967295),
      (f = m + (((d << 23) & 4294967295) | (d >>> 9))),
      (d = (u + (f ^ m ^ b) + g[13] + 681279174) & 4294967295),
      (u = f + (((d << 4) & 4294967295) | (d >>> 28))),
      (d = (b + (u ^ f ^ m) + g[0] + 3936430074) & 4294967295),
      (b = u + (((d << 11) & 4294967295) | (d >>> 21))),
      (d = (m + (b ^ u ^ f) + g[3] + 3572445317) & 4294967295),
      (m = b + (((d << 16) & 4294967295) | (d >>> 16))),
      (d = (f + (m ^ b ^ u) + g[6] + 76029189) & 4294967295),
      (f = m + (((d << 23) & 4294967295) | (d >>> 9))),
      (d = (u + (f ^ m ^ b) + g[9] + 3654602809) & 4294967295),
      (u = f + (((d << 4) & 4294967295) | (d >>> 28))),
      (d = (b + (u ^ f ^ m) + g[12] + 3873151461) & 4294967295),
      (b = u + (((d << 11) & 4294967295) | (d >>> 21))),
      (d = (m + (b ^ u ^ f) + g[15] + 530742520) & 4294967295),
      (m = b + (((d << 16) & 4294967295) | (d >>> 16))),
      (d = (f + (m ^ b ^ u) + g[2] + 3299628645) & 4294967295),
      (f = m + (((d << 23) & 4294967295) | (d >>> 9))),
      (d = (u + (m ^ (f | ~b)) + g[0] + 4096336452) & 4294967295),
      (u = f + (((d << 6) & 4294967295) | (d >>> 26))),
      (d = (b + (f ^ (u | ~m)) + g[7] + 1126891415) & 4294967295),
      (b = u + (((d << 10) & 4294967295) | (d >>> 22))),
      (d = (m + (u ^ (b | ~f)) + g[14] + 2878612391) & 4294967295),
      (m = b + (((d << 15) & 4294967295) | (d >>> 17))),
      (d = (f + (b ^ (m | ~u)) + g[5] + 4237533241) & 4294967295),
      (f = m + (((d << 21) & 4294967295) | (d >>> 11))),
      (d = (u + (m ^ (f | ~b)) + g[12] + 1700485571) & 4294967295),
      (u = f + (((d << 6) & 4294967295) | (d >>> 26))),
      (d = (b + (f ^ (u | ~m)) + g[3] + 2399980690) & 4294967295),
      (b = u + (((d << 10) & 4294967295) | (d >>> 22))),
      (d = (m + (u ^ (b | ~f)) + g[10] + 4293915773) & 4294967295),
      (m = b + (((d << 15) & 4294967295) | (d >>> 17))),
      (d = (f + (b ^ (m | ~u)) + g[1] + 2240044497) & 4294967295),
      (f = m + (((d << 21) & 4294967295) | (d >>> 11))),
      (d = (u + (m ^ (f | ~b)) + g[8] + 1873313359) & 4294967295),
      (u = f + (((d << 6) & 4294967295) | (d >>> 26))),
      (d = (b + (f ^ (u | ~m)) + g[15] + 4264355552) & 4294967295),
      (b = u + (((d << 10) & 4294967295) | (d >>> 22))),
      (d = (m + (u ^ (b | ~f)) + g[6] + 2734768916) & 4294967295),
      (m = b + (((d << 15) & 4294967295) | (d >>> 17))),
      (d = (f + (b ^ (m | ~u)) + g[13] + 1309151649) & 4294967295),
      (f = m + (((d << 21) & 4294967295) | (d >>> 11))),
      (d = (u + (m ^ (f | ~b)) + g[4] + 4149444226) & 4294967295),
      (u = f + (((d << 6) & 4294967295) | (d >>> 26))),
      (d = (b + (f ^ (u | ~m)) + g[11] + 3174756917) & 4294967295),
      (b = u + (((d << 10) & 4294967295) | (d >>> 22))),
      (d = (m + (u ^ (b | ~f)) + g[2] + 718787259) & 4294967295),
      (m = b + (((d << 15) & 4294967295) | (d >>> 17))),
      (d = (f + (b ^ (m | ~u)) + g[9] + 3951481745) & 4294967295),
      (y.g[0] = (y.g[0] + u) & 4294967295),
      (y.g[1] =
        (y.g[1] + (m + (((d << 21) & 4294967295) | (d >>> 11)))) & 4294967295),
      (y.g[2] = (y.g[2] + m) & 4294967295),
      (y.g[3] = (y.g[3] + b) & 4294967295));
  }
  ((i.prototype.u = function (y, u) {
    u === void 0 && (u = y.length);
    for (var f = u - this.blockSize, g = this.B, m = this.h, b = 0; b < u; ) {
      if (m == 0) for (; b <= f; ) (o(this, y, b), (b += this.blockSize));
      if (typeof y == 'string') {
        for (; b < u; )
          if (((g[m++] = y.charCodeAt(b++)), m == this.blockSize)) {
            (o(this, g), (m = 0));
            break;
          }
      } else
        for (; b < u; )
          if (((g[m++] = y[b++]), m == this.blockSize)) {
            (o(this, g), (m = 0));
            break;
          }
    }
    ((this.h = m), (this.o += u));
  }),
    (i.prototype.v = function () {
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
  function l(y, u) {
    this.h = u;
    for (var f = [], g = !0, m = y.length - 1; 0 <= m; m--) {
      var b = y[m] | 0;
      (g && b == u) || ((f[m] = b), (g = !1));
    }
    this.g = f;
  }
  var p = {};
  function v(y) {
    return -128 <= y && 128 > y
      ? c(y, function (u) {
          return new l([u | 0], 0 > u ? -1 : 0);
        })
      : new l([y | 0], 0 > y ? -1 : 0);
  }
  function T(y) {
    if (isNaN(y) || !isFinite(y)) return k;
    if (0 > y) return M(T(-y));
    for (var u = [], f = 1, g = 0; y >= f; g++)
      ((u[g] = (y / f) | 0), (f *= 4294967296));
    return new l(u, 0);
  }
  function S(y, u) {
    if (y.length == 0) throw Error('number format error: empty string');
    if (((u = u || 10), 2 > u || 36 < u))
      throw Error('radix out of range: ' + u);
    if (y.charAt(0) == '-') return M(S(y.substring(1), u));
    if (0 <= y.indexOf('-'))
      throw Error('number format error: interior "-" character');
    for (var f = T(Math.pow(u, 8)), g = k, m = 0; m < y.length; m += 8) {
      var b = Math.min(8, y.length - m),
        d = parseInt(y.substring(m, m + b), u);
      8 > b
        ? ((b = T(Math.pow(u, b))), (g = g.j(b).add(T(d))))
        : ((g = g.j(f)), (g = g.add(T(d))));
    }
    return g;
  }
  var k = v(0),
    A = v(1),
    L = v(16777216);
  ((n = l.prototype),
    (n.m = function () {
      if (j(this)) return -M(this).m();
      for (var y = 0, u = 1, f = 0; f < this.g.length; f++) {
        var g = this.i(f);
        ((y += (0 <= g ? g : 4294967296 + g) * u), (u *= 4294967296));
      }
      return y;
    }),
    (n.toString = function (y) {
      if (((y = y || 10), 2 > y || 36 < y))
        throw Error('radix out of range: ' + y);
      if (P(this)) return '0';
      if (j(this)) return '-' + M(this).toString(y);
      for (var u = T(Math.pow(y, 6)), f = this, g = ''; ; ) {
        var m = ne(f, u).g;
        f = le(f, m.j(u));
        var b = ((0 < f.g.length ? f.g[0] : f.h) >>> 0).toString(y);
        if (((f = m), P(f))) return b + g;
        for (; 6 > b.length; ) b = '0' + b;
        g = b + g;
      }
    }),
    (n.i = function (y) {
      return 0 > y ? 0 : y < this.g.length ? this.g[y] : this.h;
    }));
  function P(y) {
    if (y.h != 0) return !1;
    for (var u = 0; u < y.g.length; u++) if (y.g[u] != 0) return !1;
    return !0;
  }
  function j(y) {
    return y.h == -1;
  }
  n.l = function (y) {
    return ((y = le(this, y)), j(y) ? -1 : P(y) ? 0 : 1);
  };
  function M(y) {
    for (var u = y.g.length, f = [], g = 0; g < u; g++) f[g] = ~y.g[g];
    return new l(f, ~y.h).add(A);
  }
  ((n.abs = function () {
    return j(this) ? M(this) : this;
  }),
    (n.add = function (y) {
      for (
        var u = Math.max(this.g.length, y.g.length), f = [], g = 0, m = 0;
        m <= u;
        m++
      ) {
        var b = g + (this.i(m) & 65535) + (y.i(m) & 65535),
          d = (b >>> 16) + (this.i(m) >>> 16) + (y.i(m) >>> 16);
        ((g = d >>> 16), (b &= 65535), (d &= 65535), (f[m] = (d << 16) | b));
      }
      return new l(f, f[f.length - 1] & -2147483648 ? -1 : 0);
    }));
  function le(y, u) {
    return y.add(M(u));
  }
  n.j = function (y) {
    if (P(this) || P(y)) return k;
    if (j(this)) return j(y) ? M(this).j(M(y)) : M(M(this).j(y));
    if (j(y)) return M(this.j(M(y)));
    if (0 > this.l(L) && 0 > y.l(L)) return T(this.m() * y.m());
    for (var u = this.g.length + y.g.length, f = [], g = 0; g < 2 * u; g++)
      f[g] = 0;
    for (g = 0; g < this.g.length; g++)
      for (var m = 0; m < y.g.length; m++) {
        var b = this.i(g) >>> 16,
          d = this.i(g) & 65535,
          ue = y.i(m) >>> 16,
          it = y.i(m) & 65535;
        ((f[2 * g + 2 * m] += d * it),
          Q(f, 2 * g + 2 * m),
          (f[2 * g + 2 * m + 1] += b * it),
          Q(f, 2 * g + 2 * m + 1),
          (f[2 * g + 2 * m + 1] += d * ue),
          Q(f, 2 * g + 2 * m + 1),
          (f[2 * g + 2 * m + 2] += b * ue),
          Q(f, 2 * g + 2 * m + 2));
      }
    for (g = 0; g < u; g++) f[g] = (f[2 * g + 1] << 16) | f[2 * g];
    for (g = u; g < 2 * u; g++) f[g] = 0;
    return new l(f, 0);
  };
  function Q(y, u) {
    for (; (y[u] & 65535) != y[u]; )
      ((y[u + 1] += y[u] >>> 16), (y[u] &= 65535), u++);
  }
  function F(y, u) {
    ((this.g = y), (this.h = u));
  }
  function ne(y, u) {
    if (P(u)) throw Error('division by zero');
    if (P(y)) return new F(k, k);
    if (j(y)) return ((u = ne(M(y), u)), new F(M(u.g), M(u.h)));
    if (j(u)) return ((u = ne(y, M(u))), new F(M(u.g), u.h));
    if (30 < y.g.length) {
      if (j(y) || j(u))
        throw Error('slowDivide_ only works with positive integers.');
      for (var f = A, g = u; 0 >= g.l(y); ) ((f = Ne(f)), (g = Ne(g)));
      var m = G(f, 1),
        b = G(g, 1);
      for (g = G(g, 2), f = G(f, 2); !P(g); ) {
        var d = b.add(g);
        (0 >= d.l(y) && ((m = m.add(f)), (b = d)),
          (g = G(g, 1)),
          (f = G(f, 1)));
      }
      return ((u = le(y, m.j(u))), new F(m, u));
    }
    for (m = k; 0 <= y.l(u); ) {
      for (
        f = Math.max(1, Math.floor(y.m() / u.m())),
          g = Math.ceil(Math.log(f) / Math.LN2),
          g = 48 >= g ? 1 : Math.pow(2, g - 48),
          b = T(f),
          d = b.j(u);
        j(d) || 0 < d.l(y);

      )
        ((f -= g), (b = T(f)), (d = b.j(u)));
      (P(b) && (b = A), (m = m.add(b)), (y = le(y, d)));
    }
    return new F(m, y);
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
      return new l(f, this.h & y.h);
    }),
    (n.or = function (y) {
      for (
        var u = Math.max(this.g.length, y.g.length), f = [], g = 0;
        g < u;
        g++
      )
        f[g] = this.i(g) | y.i(g);
      return new l(f, this.h | y.h);
    }),
    (n.xor = function (y) {
      for (
        var u = Math.max(this.g.length, y.g.length), f = [], g = 0;
        g < u;
        g++
      )
        f[g] = this.i(g) ^ y.i(g);
      return new l(f, this.h ^ y.h);
    }));
  function Ne(y) {
    for (var u = y.g.length + 1, f = [], g = 0; g < u; g++)
      f[g] = (y.i(g) << 1) | (y.i(g - 1) >>> 31);
    return new l(f, y.h);
  }
  function G(y, u) {
    var f = u >> 5;
    u %= 32;
    for (var g = y.g.length - f, m = [], b = 0; b < g; b++)
      m[b] =
        0 < u ? (y.i(b + f) >>> u) | (y.i(b + f + 1) << (32 - u)) : y.i(b + f);
    return new l(m, y.h);
  }
  ((i.prototype.digest = i.prototype.v),
    (i.prototype.reset = i.prototype.s),
    (i.prototype.update = i.prototype.u),
    (l.prototype.add = l.prototype.add),
    (l.prototype.multiply = l.prototype.j),
    (l.prototype.modulo = l.prototype.A),
    (l.prototype.compare = l.prototype.l),
    (l.prototype.toNumber = l.prototype.m),
    (l.prototype.toString = l.prototype.toString),
    (l.prototype.getBits = l.prototype.i),
    (l.fromNumber = T),
    (l.fromString = S),
    (No = l));
}).apply(
  typeof hs < 'u'
    ? hs
    : typeof self < 'u'
      ? self
      : typeof window < 'u'
        ? window
        : {}
);
var Jt =
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
  function r(t) {
    t = [
      typeof globalThis == 'object' && globalThis,
      t,
      typeof window == 'object' && window,
      typeof self == 'object' && self,
      typeof Jt == 'object' && Jt,
    ];
    for (var s = 0; s < t.length; ++s) {
      var a = t[s];
      if (a && a.Math == Math) return a;
    }
    throw Error('Cannot find global object');
  }
  var i = r(this);
  function o(t, s) {
    if (s)
      e: {
        var a = i;
        t = t.split('.');
        for (var h = 0; h < t.length - 1; h++) {
          var w = t[h];
          if (!(w in a)) break e;
          a = a[w];
        }
        ((t = t[t.length - 1]),
          (h = a[t]),
          (s = s(h)),
          s != h &&
            s != null &&
            e(a, t, { configurable: !0, writable: !0, value: s }));
      }
  }
  function c(t, s) {
    t instanceof String && (t += '');
    var a = 0,
      h = !1,
      w = {
        next: function () {
          if (!h && a < t.length) {
            var I = a++;
            return { value: s(I, t[I]), done: !1 };
          }
          return ((h = !0), { done: !0, value: void 0 });
        },
      };
    return (
      (w[Symbol.iterator] = function () {
        return w;
      }),
      w
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
*/ var l = l || {},
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
  function S(t, s, a) {
    return t.call.apply(t.bind, arguments);
  }
  function k(t, s, a) {
    if (!t) throw Error();
    if (2 < arguments.length) {
      var h = Array.prototype.slice.call(arguments, 2);
      return function () {
        var w = Array.prototype.slice.call(arguments);
        return (Array.prototype.unshift.apply(w, h), t.apply(s, w));
      };
    }
    return function () {
      return t.apply(s, arguments);
    };
  }
  function A(t, s, a) {
    return (
      (A =
        Function.prototype.bind &&
        Function.prototype.bind.toString().indexOf('native code') != -1
          ? S
          : k),
      A.apply(null, arguments)
    );
  }
  function L(t, s) {
    var a = Array.prototype.slice.call(arguments, 1);
    return function () {
      var h = a.slice();
      return (h.push.apply(h, arguments), t.apply(this, h));
    };
  }
  function P(t, s) {
    function a() {}
    ((a.prototype = s.prototype),
      (t.aa = s.prototype),
      (t.prototype = new a()),
      (t.prototype.constructor = t),
      (t.Qb = function (h, w, I) {
        for (
          var _ = Array(arguments.length - 2), N = 2;
          N < arguments.length;
          N++
        )
          _[N - 2] = arguments[N];
        return s.prototype[w].apply(h, _);
      }));
  }
  function j(t) {
    const s = t.length;
    if (0 < s) {
      const a = Array(s);
      for (let h = 0; h < s; h++) a[h] = t[h];
      return a;
    }
    return [];
  }
  function M(t, s) {
    for (let a = 1; a < arguments.length; a++) {
      const h = arguments[a];
      if (v(h)) {
        const w = t.length || 0,
          I = h.length || 0;
        t.length = w + I;
        for (let _ = 0; _ < I; _++) t[w + _] = h[_];
      } else t.push(h);
    }
  }
  class le {
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
  function F() {
    var t = p.navigator;
    return t && (t = t.userAgent) ? t : '';
  }
  function ne(t) {
    return (ne[' '](t), t);
  }
  ne[' '] = function () {};
  var Ne =
    F().indexOf('Gecko') != -1 &&
    !(F().toLowerCase().indexOf('webkit') != -1 && F().indexOf('Edge') == -1) &&
    !(F().indexOf('Trident') != -1 || F().indexOf('MSIE') != -1) &&
    F().indexOf('Edge') == -1;
  function G(t, s, a) {
    for (const h in t) s.call(a, t[h], h, t);
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
    let a, h;
    for (let w = 1; w < arguments.length; w++) {
      h = arguments[w];
      for (a in h) t[a] = h[a];
      for (let I = 0; I < f.length; I++)
        ((a = f[I]),
          Object.prototype.hasOwnProperty.call(h, a) && (t[a] = h[a]));
    }
  }
  function m(t) {
    var s = 1;
    t = t.split(':');
    const a = [];
    for (; 0 < s && t.length; ) (a.push(t.shift()), s--);
    return (t.length && a.push(t.join(':')), a);
  }
  function b(t) {
    p.setTimeout(() => {
      throw t;
    }, 0);
  }
  function d() {
    var t = mn;
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
      const h = it.get();
      (h.set(s, a), this.h ? (this.h.next = h) : (this.g = h), (this.h = h));
    }
  }
  var it = new le(
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
    mn = new ue(),
    Pr = () => {
      const t = p.Promise.resolve(void 0);
      st = () => {
        t.then(xo);
      };
    };
  var xo = () => {
    for (var t; (t = d()); ) {
      try {
        t.h.call(t.g);
      } catch (a) {
        b(a);
      }
      var s = it;
      (s.j(t), 100 > s.h && (s.h++, (t.next = s.g), (s.g = t)));
    }
    ot = !1;
  };
  function be() {
    ((this.s = this.s), (this.C = this.C));
  }
  ((be.prototype.s = !1),
    (be.prototype.ma = function () {
      this.s || ((this.s = !0), this.N());
    }),
    (be.prototype.N = function () {
      if (this.C) for (; this.C.length; ) this.C.shift()();
    }));
  function H(t, s) {
    ((this.type = t), (this.g = this.target = s), (this.defaultPrevented = !1));
  }
  H.prototype.h = function () {
    this.defaultPrevented = !0;
  };
  var Fo = (function () {
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
      (H.call(this, t ? t.type : ''),
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
        h =
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
              var w = !0;
              break e;
            } catch {}
            w = !1;
          }
          w || (s = null);
        }
      } else
        a == 'mouseover'
          ? (s = t.fromElement)
          : a == 'mouseout' && (s = t.toElement);
      ((this.relatedTarget = s),
        h
          ? ((this.clientX = h.clientX !== void 0 ? h.clientX : h.pageX),
            (this.clientY = h.clientY !== void 0 ? h.clientY : h.pageY),
            (this.screenX = h.screenX || 0),
            (this.screenY = h.screenY || 0))
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
            : Ho[t.pointerType] || ''),
        (this.state = t.state),
        (this.i = t),
        t.defaultPrevented && at.aa.h.call(this));
    }
  }
  P(at, H);
  var Ho = { 2: 'touch', 3: 'pen', 4: 'mouse' };
  at.prototype.h = function () {
    at.aa.h.call(this);
    var t = this.i;
    t.preventDefault ? t.preventDefault() : (t.returnValue = !1);
  };
  var Dt = 'closure_listenable_' + ((1e6 * Math.random()) | 0),
    $o = 0;
  function Vo(t, s, a, h, w) {
    ((this.listener = t),
      (this.proxy = null),
      (this.src = s),
      (this.type = a),
      (this.capture = !!h),
      (this.ha = w),
      (this.key = ++$o),
      (this.da = this.fa = !1));
  }
  function Nt(t) {
    ((t.da = !0),
      (t.listener = null),
      (t.proxy = null),
      (t.src = null),
      (t.ha = null));
  }
  function Lt(t) {
    ((this.src = t), (this.g = {}), (this.h = 0));
  }
  Lt.prototype.add = function (t, s, a, h, w) {
    var I = t.toString();
    ((t = this.g[I]), t || ((t = this.g[I] = []), this.h++));
    var _ = vn(t, s, h, w);
    return (
      -1 < _
        ? ((s = t[_]), a || (s.fa = !1))
        : ((s = new Vo(s, this.src, I, !!h, w)), (s.fa = a), t.push(s)),
      s
    );
  };
  function yn(t, s) {
    var a = s.type;
    if (a in t.g) {
      var h = t.g[a],
        w = Array.prototype.indexOf.call(h, s, void 0),
        I;
      ((I = 0 <= w) && Array.prototype.splice.call(h, w, 1),
        I && (Nt(s), t.g[a].length == 0 && (delete t.g[a], t.h--)));
    }
  }
  function vn(t, s, a, h) {
    for (var w = 0; w < t.length; ++w) {
      var I = t[w];
      if (!I.da && I.listener == s && I.capture == !!a && I.ha == h) return w;
    }
    return -1;
  }
  var wn = 'closure_lm_' + ((1e6 * Math.random()) | 0),
    bn = {};
  function Or(t, s, a, h, w) {
    if (Array.isArray(s)) {
      for (var I = 0; I < s.length; I++) Or(t, s[I], a, h, w);
      return null;
    }
    return (
      (a = Nr(a)),
      t && t[Dt] ? t.K(s, a, T(h) ? !!h.capture : !1, w) : Bo(t, s, a, !1, h, w)
    );
  }
  function Bo(t, s, a, h, w, I) {
    if (!s) throw Error('Invalid event type');
    var _ = T(w) ? !!w.capture : !!w,
      N = Tn(t);
    if ((N || (t[wn] = N = new Lt(t)), (a = N.add(s, a, h, _, I)), a.proxy))
      return a;
    if (
      ((h = zo()),
      (a.proxy = h),
      (h.src = t),
      (h.listener = a),
      t.addEventListener)
    )
      (Fo || (w = _),
        w === void 0 && (w = !1),
        t.addEventListener(s.toString(), h, w));
    else if (t.attachEvent) t.attachEvent(Dr(s.toString()), h);
    else if (t.addListener && t.removeListener) t.addListener(h);
    else throw Error('addEventListener and attachEvent are unavailable.');
    return a;
  }
  function zo() {
    function t(a) {
      return s.call(t.src, t.listener, a);
    }
    const s = qo;
    return t;
  }
  function Rr(t, s, a, h, w) {
    if (Array.isArray(s))
      for (var I = 0; I < s.length; I++) Rr(t, s[I], a, h, w);
    else
      ((h = T(h) ? !!h.capture : !!h),
        (a = Nr(a)),
        t && t[Dt]
          ? ((t = t.i),
            (s = String(s).toString()),
            s in t.g &&
              ((I = t.g[s]),
              (a = vn(I, a, h, w)),
              -1 < a &&
                (Nt(I[a]),
                Array.prototype.splice.call(I, a, 1),
                I.length == 0 && (delete t.g[s], t.h--))))
          : t &&
            (t = Tn(t)) &&
            ((s = t.g[s.toString()]),
            (t = -1),
            s && (t = vn(s, a, h, w)),
            (a = -1 < t ? s[t] : null) && In(a)));
  }
  function In(t) {
    if (typeof t != 'number' && t && !t.da) {
      var s = t.src;
      if (s && s[Dt]) yn(s.i, t);
      else {
        var a = t.type,
          h = t.proxy;
        (s.removeEventListener
          ? s.removeEventListener(a, h, t.capture)
          : s.detachEvent
            ? s.detachEvent(Dr(a), h)
            : s.addListener && s.removeListener && s.removeListener(h),
          (a = Tn(s))
            ? (yn(a, t), a.h == 0 && ((a.src = null), (s[wn] = null)))
            : Nt(t));
      }
    }
  }
  function Dr(t) {
    return t in bn ? bn[t] : (bn[t] = 'on' + t);
  }
  function qo(t, s) {
    if (t.da) t = !0;
    else {
      s = new at(s, this);
      var a = t.listener,
        h = t.ha || t.src;
      (t.fa && In(t), (t = a.call(h, s)));
    }
    return t;
  }
  function Tn(t) {
    return ((t = t[wn]), t instanceof Lt ? t : null);
  }
  var _n = '__closure_events_fn_' + ((1e9 * Math.random()) >>> 0);
  function Nr(t) {
    return typeof t == 'function'
      ? t
      : (t[_n] ||
          (t[_n] = function (s) {
            return t.handleEvent(s);
          }),
        t[_n]);
  }
  function $() {
    (be.call(this), (this.i = new Lt(this)), (this.M = this), (this.F = null));
  }
  (P($, be),
    ($.prototype[Dt] = !0),
    ($.prototype.removeEventListener = function (t, s, a, h) {
      Rr(this, t, s, a, h);
    }));
  function B(t, s) {
    var a,
      h = t.F;
    if (h) for (a = []; h; h = h.F) a.push(h);
    if (((t = t.M), (h = s.type || s), typeof s == 'string')) s = new H(s, t);
    else if (s instanceof H) s.target = s.target || t;
    else {
      var w = s;
      ((s = new H(h, t)), g(s, w));
    }
    if (((w = !0), a))
      for (var I = a.length - 1; 0 <= I; I--) {
        var _ = (s.g = a[I]);
        w = Mt(_, h, !0, s) && w;
      }
    if (
      ((_ = s.g = t), (w = Mt(_, h, !0, s) && w), (w = Mt(_, h, !1, s) && w), a)
    )
      for (I = 0; I < a.length; I++)
        ((_ = s.g = a[I]), (w = Mt(_, h, !1, s) && w));
  }
  (($.prototype.N = function () {
    if (($.aa.N.call(this), this.i)) {
      var t = this.i,
        s;
      for (s in t.g) {
        for (var a = t.g[s], h = 0; h < a.length; h++) Nt(a[h]);
        (delete t.g[s], t.h--);
      }
    }
    this.F = null;
  }),
    ($.prototype.K = function (t, s, a, h) {
      return this.i.add(String(t), s, !1, a, h);
    }),
    ($.prototype.L = function (t, s, a, h) {
      return this.i.add(String(t), s, !0, a, h);
    }));
  function Mt(t, s, a, h) {
    if (((s = t.i.g[String(s)]), !s)) return !0;
    s = s.concat();
    for (var w = !0, I = 0; I < s.length; ++I) {
      var _ = s[I];
      if (_ && !_.da && _.capture == a) {
        var N = _.listener,
          x = _.ha || _.src;
        (_.fa && yn(t.i, _), (w = N.call(x, h) !== !1 && w));
      }
    }
    return w && !h.defaultPrevented;
  }
  function Lr(t, s, a) {
    if (typeof t == 'function') a && (t = A(t, a));
    else if (t && typeof t.handleEvent == 'function') t = A(t.handleEvent, t);
    else throw Error('Invalid listener argument');
    return 2147483647 < Number(s) ? -1 : p.setTimeout(t, s || 0);
  }
  function Mr(t) {
    t.g = Lr(() => {
      ((t.g = null), t.i && ((t.i = !1), Mr(t)));
    }, t.l);
    const s = t.h;
    ((t.h = null), t.m.apply(null, s));
  }
  class Ko extends be {
    constructor(s, a) {
      (super(),
        (this.m = s),
        (this.l = a),
        (this.h = null),
        (this.i = !1),
        (this.g = null));
    }
    j(s) {
      ((this.h = arguments), this.g ? (this.i = !0) : Mr(this));
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
    (be.call(this), (this.h = t), (this.g = {}));
  }
  P(ct, be);
  var Ur = [];
  function jr(t) {
    (G(
      t.g,
      function (s, a) {
        this.g.hasOwnProperty(a) && In(s);
      },
      t
    ),
      (t.g = {}));
  }
  ((ct.prototype.N = function () {
    (ct.aa.N.call(this), jr(this));
  }),
    (ct.prototype.handleEvent = function () {
      throw Error('EventHandler.handleEvent not implemented');
    }));
  var En = p.JSON.stringify,
    Go = p.JSON.parse,
    Wo = class {
      stringify(t) {
        return p.JSON.stringify(t, void 0);
      }
      parse(t) {
        return p.JSON.parse(t, void 0);
      }
    };
  function Sn() {}
  Sn.prototype.h = null;
  function xr(t) {
    return t.h || (t.h = t.i());
  }
  function kn() {
    H.call(this, 'd');
  }
  P(kn, H);
  function An() {
    H.call(this, 'c');
  }
  P(An, H);
  var qe = {},
    Fr = null;
  function Cn() {
    return (Fr = Fr || new $());
  }
  qe.La = 'serverreachability';
  function Hr(t) {
    H.call(this, qe.La, t);
  }
  P(Hr, H);
  function ht(t) {
    const s = Cn();
    B(s, new Hr(s));
  }
  qe.STAT_EVENT = 'statevent';
  function $r(t, s) {
    (H.call(this, qe.STAT_EVENT, t), (this.stat = s));
  }
  P($r, H);
  function z(t) {
    const s = Cn();
    B(s, new $r(s, t));
  }
  qe.Ma = 'timingevent';
  function Vr(t, s) {
    (H.call(this, qe.Ma, t), (this.size = s));
  }
  P(Vr, H);
  function lt(t, s) {
    if (typeof t != 'function')
      throw Error('Fn must not be null and must be a function');
    return p.setTimeout(function () {
      t();
    }, s);
  }
  function ut() {
    this.g = !0;
  }
  ut.prototype.xa = function () {
    this.g = !1;
  };
  function Jo(t, s, a, h, w, I) {
    t.info(function () {
      if (t.g)
        if (I)
          for (var _ = '', N = I.split('&'), x = 0; x < N.length; x++) {
            var R = N[x].split('=');
            if (1 < R.length) {
              var V = R[0];
              R = R[1];
              var W = V.split('_');
              _ =
                2 <= W.length && W[1] == 'type'
                  ? _ + (V + '=' + R + '&')
                  : _ + (V + '=redacted&');
            }
          }
        else _ = null;
      else _ = I;
      return (
        'XMLHTTP REQ (' +
        h +
        ') [attempt ' +
        w +
        ']: ' +
        s +
        `
` +
        a +
        `
` +
        _
      );
    });
  }
  function Xo(t, s, a, h, w, I, _) {
    t.info(function () {
      return (
        'XMLHTTP RESP (' +
        h +
        ') [ attempt ' +
        w +
        ']: ' +
        s +
        `
` +
        a +
        `
` +
        I +
        ' ' +
        _
      );
    });
  }
  function Ke(t, s, a, h) {
    t.info(function () {
      return 'XMLHTTP TEXT (' + s + '): ' + Qo(t, a) + (h ? ' ' + h : '');
    });
  }
  function Yo(t, s) {
    t.info(function () {
      return 'TIMEOUT: ' + s;
    });
  }
  ut.prototype.info = function () {};
  function Qo(t, s) {
    if (!t.g) return s;
    if (!s) return null;
    try {
      var a = JSON.parse(s);
      if (a) {
        for (t = 0; t < a.length; t++)
          if (Array.isArray(a[t])) {
            var h = a[t];
            if (!(2 > h.length)) {
              var w = h[1];
              if (Array.isArray(w) && !(1 > w.length)) {
                var I = w[0];
                if (I != 'noop' && I != 'stop' && I != 'close')
                  for (var _ = 1; _ < w.length; _++) w[_] = '';
              }
            }
          }
      }
      return En(a);
    } catch {
      return s;
    }
  }
  var Pn;
  function Ut() {}
  (P(Ut, Sn),
    (Ut.prototype.g = function () {
      return new XMLHttpRequest();
    }),
    (Ut.prototype.i = function () {
      return {};
    }),
    (Pn = new Ut()));
  function Ie(t, s, a, h) {
    ((this.j = t),
      (this.i = s),
      (this.l = a),
      (this.R = h || 1),
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
      (this.h = new Br()));
  }
  function Br() {
    ((this.i = null), (this.g = ''), (this.h = !1));
  }
  var zr = {},
    On = {};
  function Rn(t, s, a) {
    ((t.L = 1), (t.v = Ht(de(s))), (t.m = a), (t.P = !0), qr(t, null));
  }
  function qr(t, s) {
    ((t.F = Date.now()), jt(t), (t.A = de(t.v)));
    var a = t.A,
      h = t.R;
    (Array.isArray(h) || (h = [String(h)]),
      si(a.i, 't', h),
      (t.C = 0),
      (a = t.j.J),
      (t.h = new Br()),
      (t.g = _i(t.j, a ? s : null, !t.m)),
      0 < t.O && (t.M = new Ko(A(t.Y, t, t.g), t.O)),
      (s = t.U),
      (a = t.g),
      (h = t.ca));
    var w = 'readystatechange';
    Array.isArray(w) || (w && (Ur[0] = w.toString()), (w = Ur));
    for (var I = 0; I < w.length; I++) {
      var _ = Or(a, w[I], h || s.handleEvent, !1, s.h || s);
      if (!_) break;
      s.g[_.key] = _;
    }
    ((s = t.H ? u(t.H) : {}),
      t.m
        ? (t.u || (t.u = 'POST'),
          (s['Content-Type'] = 'application/x-www-form-urlencoded'),
          t.g.ea(t.A, t.u, t.m, s))
        : ((t.u = 'GET'), t.g.ea(t.A, t.u, null, s)),
      ht(),
      Jo(t.i, t.u, t.A, t.l, t.R, t.m));
  }
  ((Ie.prototype.ca = function (t) {
    t = t.target;
    const s = this.M;
    s && fe(t) == 3 ? s.j() : this.Y(t);
  }),
    (Ie.prototype.Y = function (t) {
      try {
        if (t == this.g)
          e: {
            const W = fe(this.g);
            var s = this.g.Ba();
            const Je = this.g.Z();
            if (
              !(3 > W) &&
              (W != 3 || (this.g && (this.h.h || this.g.oa() || di(this.g))))
            ) {
              (this.J ||
                W != 4 ||
                s == 7 ||
                (s == 8 || 0 >= Je ? ht(3) : ht(2)),
                Dn(this));
              var a = this.g.Z();
              this.X = a;
              t: if (Kr(this)) {
                var h = di(this.g);
                t = '';
                var w = h.length,
                  I = fe(this.g) == 4;
                if (!this.h.i) {
                  if (typeof TextDecoder > 'u') {
                    (Le(this), dt(this));
                    var _ = '';
                    break t;
                  }
                  this.h.i = new p.TextDecoder();
                }
                for (s = 0; s < w; s++)
                  ((this.h.h = !0),
                    (t += this.h.i.decode(h[s], {
                      stream: !(I && s == w - 1),
                    })));
                ((h.length = 0), (this.h.g += t), (this.C = 0), (_ = this.h.g));
              } else _ = this.g.oa();
              if (
                ((this.o = a == 200),
                Xo(this.i, this.u, this.A, this.l, this.R, W, a),
                this.o)
              ) {
                if (this.T && !this.K) {
                  t: {
                    if (this.g) {
                      var N,
                        x = this.g;
                      if (
                        (N = x.g
                          ? x.g.getResponseHeader('X-HTTP-Initial-Response')
                          : null) &&
                        !Q(N)
                      ) {
                        var R = N;
                        break t;
                      }
                    }
                    R = null;
                  }
                  if ((a = R))
                    (Ke(
                      this.i,
                      this.l,
                      a,
                      'Initial handshake response via X-HTTP-Initial-Response'
                    ),
                      (this.K = !0),
                      Nn(this, a));
                  else {
                    ((this.o = !1), (this.s = 3), z(12), Le(this), dt(this));
                    break e;
                  }
                }
                if (this.P) {
                  a = !0;
                  let re;
                  for (; !this.J && this.C < _.length; )
                    if (((re = Zo(this, _)), re == On)) {
                      (W == 4 && ((this.s = 4), z(14), (a = !1)),
                        Ke(this.i, this.l, null, '[Incomplete Response]'));
                      break;
                    } else if (re == zr) {
                      ((this.s = 4),
                        z(15),
                        Ke(this.i, this.l, _, '[Invalid Chunk]'),
                        (a = !1));
                      break;
                    } else (Ke(this.i, this.l, re, null), Nn(this, re));
                  if (
                    (Kr(this) &&
                      this.C != 0 &&
                      ((this.h.g = this.h.g.slice(this.C)), (this.C = 0)),
                    W != 4 ||
                      _.length != 0 ||
                      this.h.h ||
                      ((this.s = 1), z(16), (a = !1)),
                    (this.o = this.o && a),
                    !a)
                  )
                    (Ke(this.i, this.l, _, '[Invalid Chunked Response]'),
                      Le(this),
                      dt(this));
                  else if (0 < _.length && !this.W) {
                    this.W = !0;
                    var V = this.j;
                    V.g == this &&
                      V.ba &&
                      !V.M &&
                      (V.j.info(
                        'Great, no buffering proxy detected. Bytes received: ' +
                          _.length
                      ),
                      Fn(V),
                      (V.M = !0),
                      z(11));
                  }
                } else (Ke(this.i, this.l, _, null), Nn(this, _));
                (W == 4 && Le(this),
                  this.o &&
                    !this.J &&
                    (W == 4 ? wi(this.j, this) : ((this.o = !1), jt(this))));
              } else
                (ma(this.g),
                  a == 400 && 0 < _.indexOf('Unknown SID')
                    ? ((this.s = 3), z(12))
                    : ((this.s = 0), z(13)),
                  Le(this),
                  dt(this));
            }
          }
      } catch {
      } finally {
      }
    }));
  function Kr(t) {
    return t.g ? t.u == 'GET' && t.L != 2 && t.j.Ca : !1;
  }
  function Zo(t, s) {
    var a = t.C,
      h = s.indexOf(
        `
`,
        a
      );
    return h == -1
      ? On
      : ((a = Number(s.substring(a, h))),
        isNaN(a)
          ? zr
          : ((h += 1),
            h + a > s.length
              ? On
              : ((s = s.slice(h, h + a)), (t.C = h + a), s)));
  }
  Ie.prototype.cancel = function () {
    ((this.J = !0), Le(this));
  };
  function jt(t) {
    ((t.S = Date.now() + t.I), Gr(t, t.I));
  }
  function Gr(t, s) {
    if (t.B != null) throw Error('WatchDog timer not null');
    t.B = lt(A(t.ba, t), s);
  }
  function Dn(t) {
    t.B && (p.clearTimeout(t.B), (t.B = null));
  }
  Ie.prototype.ba = function () {
    this.B = null;
    const t = Date.now();
    0 <= t - this.S
      ? (Yo(this.i, this.A),
        this.L != 2 && (ht(), z(17)),
        Le(this),
        (this.s = 2),
        dt(this))
      : Gr(this, this.S - t);
  };
  function dt(t) {
    t.j.G == 0 || t.J || wi(t.j, t);
  }
  function Le(t) {
    Dn(t);
    var s = t.M;
    (s && typeof s.ma == 'function' && s.ma(),
      (t.M = null),
      jr(t.U),
      t.g && ((s = t.g), (t.g = null), s.abort(), s.ma()));
  }
  function Nn(t, s) {
    try {
      var a = t.j;
      if (a.G != 0 && (a.g == t || Ln(a.h, t))) {
        if (!t.K && Ln(a.h, t) && a.G == 3) {
          try {
            var h = a.Da.g.parse(s);
          } catch {
            h = null;
          }
          if (Array.isArray(h) && h.length == 3) {
            var w = h;
            if (w[0] == 0) {
              e: if (!a.u) {
                if (a.g)
                  if (a.g.F + 3e3 < t.F) (Kt(a), zt(a));
                  else break e;
                (xn(a), z(18));
              }
            } else
              ((a.za = w[1]),
                0 < a.za - a.T &&
                  37500 > w[2] &&
                  a.F &&
                  a.v == 0 &&
                  !a.C &&
                  (a.C = lt(A(a.Za, a), 6e3)));
            if (1 >= Xr(a.h) && a.ca) {
              try {
                a.ca();
              } catch {}
              a.ca = void 0;
            }
          } else Ue(a, 11);
        } else if (((t.K || a.g == t) && Kt(a), !Q(s)))
          for (w = a.Da.g.parse(s), s = 0; s < w.length; s++) {
            let R = w[s];
            if (((a.T = R[0]), (R = R[1]), a.G == 2))
              if (R[0] == 'c') {
                ((a.K = R[1]), (a.ia = R[2]));
                const V = R[3];
                V != null && ((a.la = V), a.j.info('VER=' + a.la));
                const W = R[4];
                W != null && ((a.Aa = W), a.j.info('SVER=' + a.Aa));
                const Je = R[5];
                (Je != null &&
                  typeof Je == 'number' &&
                  0 < Je &&
                  ((h = 1.5 * Je),
                  (a.L = h),
                  a.j.info('backChannelRequestTimeoutMs_=' + h)),
                  (h = a));
                const re = t.g;
                if (re) {
                  const Gt = re.g
                    ? re.g.getResponseHeader('X-Client-Wire-Protocol')
                    : null;
                  if (Gt) {
                    var I = h.h;
                    I.g ||
                      (Gt.indexOf('spdy') == -1 &&
                        Gt.indexOf('quic') == -1 &&
                        Gt.indexOf('h2') == -1) ||
                      ((I.j = I.l),
                      (I.g = new Set()),
                      I.h && (Mn(I, I.h), (I.h = null)));
                  }
                  if (h.D) {
                    const Hn = re.g
                      ? re.g.getResponseHeader('X-HTTP-Session-Id')
                      : null;
                    Hn && ((h.ya = Hn), D(h.I, h.D, Hn));
                  }
                }
                ((a.G = 3),
                  a.l && a.l.ua(),
                  a.ba &&
                    ((a.R = Date.now() - t.F),
                    a.j.info('Handshake RTT: ' + a.R + 'ms')),
                  (h = a));
                var _ = t;
                if (((h.qa = Ti(h, h.J ? h.ia : null, h.W)), _.K)) {
                  Yr(h.h, _);
                  var N = _,
                    x = h.L;
                  (x && (N.I = x), N.B && (Dn(N), jt(N)), (h.g = _));
                } else yi(h);
                0 < a.i.length && qt(a);
              } else (R[0] != 'stop' && R[0] != 'close') || Ue(a, 7);
            else
              a.G == 3 &&
                (R[0] == 'stop' || R[0] == 'close'
                  ? R[0] == 'stop'
                    ? Ue(a, 7)
                    : jn(a)
                  : R[0] != 'noop' && a.l && a.l.ta(R),
                (a.v = 0));
          }
      }
      ht(4);
    } catch {}
  }
  var ea = class {
    constructor(t, s) {
      ((this.g = t), (this.map = s));
    }
  };
  function Wr(t) {
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
  function Jr(t) {
    return t.h ? !0 : t.g ? t.g.size >= t.j : !1;
  }
  function Xr(t) {
    return t.h ? 1 : t.g ? t.g.size : 0;
  }
  function Ln(t, s) {
    return t.h ? t.h == s : t.g ? t.g.has(s) : !1;
  }
  function Mn(t, s) {
    t.g ? t.g.add(s) : (t.h = s);
  }
  function Yr(t, s) {
    t.h && t.h == s ? (t.h = null) : t.g && t.g.has(s) && t.g.delete(s);
  }
  Wr.prototype.cancel = function () {
    if (((this.i = Qr(this)), this.h)) (this.h.cancel(), (this.h = null));
    else if (this.g && this.g.size !== 0) {
      for (const t of this.g.values()) t.cancel();
      this.g.clear();
    }
  };
  function Qr(t) {
    if (t.h != null) return t.i.concat(t.h.D);
    if (t.g != null && t.g.size !== 0) {
      let s = t.i;
      for (const a of t.g.values()) s = s.concat(a.D);
      return s;
    }
    return j(t.i);
  }
  function ta(t) {
    if (t.V && typeof t.V == 'function') return t.V();
    if (
      (typeof Map < 'u' && t instanceof Map) ||
      (typeof Set < 'u' && t instanceof Set)
    )
      return Array.from(t.values());
    if (typeof t == 'string') return t.split('');
    if (v(t)) {
      for (var s = [], a = t.length, h = 0; h < a; h++) s.push(t[h]);
      return s;
    }
    ((s = []), (a = 0));
    for (h in t) s[a++] = t[h];
    return s;
  }
  function na(t) {
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
        for (const h in t) s[a++] = h;
        return s;
      }
    }
  }
  function Zr(t, s) {
    if (t.forEach && typeof t.forEach == 'function') t.forEach(s, void 0);
    else if (v(t) || typeof t == 'string')
      Array.prototype.forEach.call(t, s, void 0);
    else
      for (var a = na(t), h = ta(t), w = h.length, I = 0; I < w; I++)
        s.call(void 0, h[I], a && a[I], t);
  }
  var ei = RegExp(
    '^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$'
  );
  function ra(t, s) {
    if (t) {
      t = t.split('&');
      for (var a = 0; a < t.length; a++) {
        var h = t[a].indexOf('='),
          w = null;
        if (0 <= h) {
          var I = t[a].substring(0, h);
          w = t[a].substring(h + 1);
        } else I = t[a];
        s(I, w ? decodeURIComponent(w.replace(/\+/g, ' ')) : '');
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
        xt(this, t.j),
        (this.o = t.o),
        (this.g = t.g),
        Ft(this, t.s),
        (this.l = t.l));
      var s = t.i,
        a = new gt();
      ((a.i = s.i),
        s.g && ((a.g = new Map(s.g)), (a.h = s.h)),
        ti(this, a),
        (this.m = t.m));
    } else
      t && (s = String(t).match(ei))
        ? ((this.h = !1),
          xt(this, s[1] || '', !0),
          (this.o = ft(s[2] || '')),
          (this.g = ft(s[3] || '', !0)),
          Ft(this, s[4]),
          (this.l = ft(s[5] || '', !0)),
          ti(this, s[6] || '', !0),
          (this.m = ft(s[7] || '')))
        : ((this.h = !1), (this.i = new gt(null, this.h)));
  }
  Me.prototype.toString = function () {
    var t = [],
      s = this.j;
    s && t.push(pt(s, ni, !0), ':');
    var a = this.g;
    return (
      (a || s == 'file') &&
        (t.push('//'),
        (s = this.o) && t.push(pt(s, ni, !0), '@'),
        t.push(
          encodeURIComponent(String(a)).replace(/%25([0-9a-fA-F]{2})/g, '%$1')
        ),
        (a = this.s),
        a != null && t.push(':', String(a))),
      (a = this.l) &&
        (this.g && a.charAt(0) != '/' && t.push('/'),
        t.push(pt(a, a.charAt(0) == '/' ? oa : sa, !0))),
      (a = this.i.toString()) && t.push('?', a),
      (a = this.m) && t.push('#', pt(a, ca)),
      t.join('')
    );
  };
  function de(t) {
    return new Me(t);
  }
  function xt(t, s, a) {
    ((t.j = a ? ft(s, !0) : s), t.j && (t.j = t.j.replace(/:$/, '')));
  }
  function Ft(t, s) {
    if (s) {
      if (((s = Number(s)), isNaN(s) || 0 > s))
        throw Error('Bad port number ' + s);
      t.s = s;
    } else t.s = null;
  }
  function ti(t, s, a) {
    s instanceof gt
      ? ((t.i = s), ha(t.i, t.h))
      : (a || (s = pt(s, aa)), (t.i = new gt(s, t.h)));
  }
  function D(t, s, a) {
    t.i.set(s, a);
  }
  function Ht(t) {
    return (
      D(
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
  function ft(t, s) {
    return t
      ? s
        ? decodeURI(t.replace(/%25/g, '%2525'))
        : decodeURIComponent(t)
      : '';
  }
  function pt(t, s, a) {
    return typeof t == 'string'
      ? ((t = encodeURI(t).replace(s, ia)),
        a && (t = t.replace(/%25([0-9a-fA-F]{2})/g, '%$1')),
        t)
      : null;
  }
  function ia(t) {
    return (
      (t = t.charCodeAt(0)),
      '%' + ((t >> 4) & 15).toString(16) + (t & 15).toString(16)
    );
  }
  var ni = /[#\/\?@]/g,
    sa = /[#\?:]/g,
    oa = /[#\?]/g,
    aa = /[#\?@]/g,
    ca = /#/g;
  function gt(t, s) {
    ((this.h = this.g = null), (this.i = t || null), (this.j = !!s));
  }
  function Te(t) {
    t.g ||
      ((t.g = new Map()),
      (t.h = 0),
      t.i &&
        ra(t.i, function (s, a) {
          t.add(decodeURIComponent(s.replace(/\+/g, ' ')), a);
        }));
  }
  ((n = gt.prototype),
    (n.add = function (t, s) {
      (Te(this), (this.i = null), (t = Ge(this, t)));
      var a = this.g.get(t);
      return (a || this.g.set(t, (a = [])), a.push(s), (this.h += 1), this);
    }));
  function ri(t, s) {
    (Te(t),
      (s = Ge(t, s)),
      t.g.has(s) && ((t.i = null), (t.h -= t.g.get(s).length), t.g.delete(s)));
  }
  function ii(t, s) {
    return (Te(t), (s = Ge(t, s)), t.g.has(s));
  }
  ((n.forEach = function (t, s) {
    (Te(this),
      this.g.forEach(function (a, h) {
        a.forEach(function (w) {
          t.call(s, w, h, this);
        }, this);
      }, this));
  }),
    (n.na = function () {
      Te(this);
      const t = Array.from(this.g.values()),
        s = Array.from(this.g.keys()),
        a = [];
      for (let h = 0; h < s.length; h++) {
        const w = t[h];
        for (let I = 0; I < w.length; I++) a.push(s[h]);
      }
      return a;
    }),
    (n.V = function (t) {
      Te(this);
      let s = [];
      if (typeof t == 'string')
        ii(this, t) && (s = s.concat(this.g.get(Ge(this, t))));
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
        (t = Ge(this, t)),
        ii(this, t) && (this.h -= this.g.get(t).length),
        this.g.set(t, [s]),
        (this.h += 1),
        this
      );
    }),
    (n.get = function (t, s) {
      return t ? ((t = this.V(t)), 0 < t.length ? String(t[0]) : s) : s;
    }));
  function si(t, s, a) {
    (ri(t, s),
      0 < a.length &&
        ((t.i = null), t.g.set(Ge(t, s), j(a)), (t.h += a.length)));
  }
  n.toString = function () {
    if (this.i) return this.i;
    if (!this.g) return '';
    const t = [],
      s = Array.from(this.g.keys());
    for (var a = 0; a < s.length; a++) {
      var h = s[a];
      const I = encodeURIComponent(String(h)),
        _ = this.V(h);
      for (h = 0; h < _.length; h++) {
        var w = I;
        (_[h] !== '' && (w += '=' + encodeURIComponent(String(_[h]))),
          t.push(w));
      }
    }
    return (this.i = t.join('&'));
  };
  function Ge(t, s) {
    return ((s = String(s)), t.j && (s = s.toLowerCase()), s);
  }
  function ha(t, s) {
    (s &&
      !t.j &&
      (Te(t),
      (t.i = null),
      t.g.forEach(function (a, h) {
        var w = h.toLowerCase();
        h != w && (ri(this, h), si(this, w, a));
      }, t)),
      (t.j = s));
  }
  function la(t, s) {
    const a = new ut();
    if (p.Image) {
      const h = new Image();
      ((h.onload = L(_e, a, 'TestLoadImage: loaded', !0, s, h)),
        (h.onerror = L(_e, a, 'TestLoadImage: error', !1, s, h)),
        (h.onabort = L(_e, a, 'TestLoadImage: abort', !1, s, h)),
        (h.ontimeout = L(_e, a, 'TestLoadImage: timeout', !1, s, h)),
        p.setTimeout(function () {
          h.ontimeout && h.ontimeout();
        }, 1e4),
        (h.src = t));
    } else s(!1);
  }
  function ua(t, s) {
    const a = new ut(),
      h = new AbortController(),
      w = setTimeout(() => {
        (h.abort(), _e(a, 'TestPingServer: timeout', !1, s));
      }, 1e4);
    fetch(t, { signal: h.signal })
      .then(I => {
        (clearTimeout(w),
          I.ok
            ? _e(a, 'TestPingServer: ok', !0, s)
            : _e(a, 'TestPingServer: server error', !1, s));
      })
      .catch(() => {
        (clearTimeout(w), _e(a, 'TestPingServer: error', !1, s));
      });
  }
  function _e(t, s, a, h, w) {
    try {
      (w &&
        ((w.onload = null),
        (w.onerror = null),
        (w.onabort = null),
        (w.ontimeout = null)),
        h(a));
    } catch {}
  }
  function da() {
    this.g = new Wo();
  }
  function fa(t, s, a) {
    const h = a || '';
    try {
      Zr(t, function (w, I) {
        let _ = w;
        (T(w) && (_ = En(w)), s.push(h + I + '=' + encodeURIComponent(_)));
      });
    } catch (w) {
      throw (s.push(h + 'type=' + encodeURIComponent('_badmap')), w);
    }
  }
  function $t(t) {
    ((this.l = t.Ub || null), (this.j = t.eb || !1));
  }
  (P($t, Sn),
    ($t.prototype.g = function () {
      return new Vt(this.l, this.j);
    }),
    ($t.prototype.i = (function (t) {
      return function () {
        return t;
      };
    })({})));
  function Vt(t, s) {
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
  (P(Vt, $),
    (n = Vt.prototype),
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
          ((this.g = !1), mt(this)),
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
          oi(this);
        } else t.text().then(this.Ra.bind(this), this.ga.bind(this));
    }));
  function oi(t) {
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
      (t.done ? mt(this) : yt(this), this.readyState == 3 && oi(this));
    }
  }),
    (n.Ra = function (t) {
      this.g && ((this.response = this.responseText = t), mt(this));
    }),
    (n.Qa = function (t) {
      this.g && ((this.response = t), mt(this));
    }),
    (n.ga = function () {
      this.g && mt(this);
    }));
  function mt(t) {
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
  Object.defineProperty(Vt.prototype, 'withCredentials', {
    get: function () {
      return this.m === 'include';
    },
    set: function (t) {
      this.m = t ? 'include' : 'same-origin';
    },
  });
  function ai(t) {
    let s = '';
    return (
      G(t, function (a, h) {
        ((s += h),
          (s += ':'),
          (s += a),
          (s += `\r
`));
      }),
      s
    );
  }
  function Un(t, s, a) {
    e: {
      for (h in a) {
        var h = !1;
        break e;
      }
      h = !0;
    }
    h ||
      ((a = ai(a)),
      typeof t == 'string'
        ? a != null && encodeURIComponent(String(a))
        : D(t, s, a));
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
  P(U, $);
  var pa = /^https?$/i,
    ga = ['POST', 'PUT'];
  ((n = U.prototype),
    (n.Ha = function (t) {
      this.J = t;
    }),
    (n.ea = function (t, s, a, h) {
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
        (this.g = this.o ? this.o.g() : Pn.g()),
        (this.v = this.o ? xr(this.o) : xr(Pn)),
        (this.g.onreadystatechange = A(this.Ea, this)));
      try {
        ((this.B = !0), this.g.open(s, String(t), !0), (this.B = !1));
      } catch (I) {
        ci(this, I);
        return;
      }
      if (((t = a || ''), (a = new Map(this.headers)), h))
        if (Object.getPrototypeOf(h) === Object.prototype)
          for (var w in h) a.set(w, h[w]);
        else if (typeof h.keys == 'function' && typeof h.get == 'function')
          for (const I of h.keys()) a.set(I, h.get(I));
        else throw Error('Unknown input type for opt_headers: ' + String(h));
      ((h = Array.from(a.keys()).find(I => I.toLowerCase() == 'content-type')),
        (w = p.FormData && t instanceof p.FormData),
        !(0 <= Array.prototype.indexOf.call(ga, s, void 0)) ||
          h ||
          w ||
          a.set(
            'Content-Type',
            'application/x-www-form-urlencoded;charset=utf-8'
          ));
      for (const [I, _] of a) this.g.setRequestHeader(I, _);
      (this.H && (this.g.responseType = this.H),
        'withCredentials' in this.g &&
          this.g.withCredentials !== this.J &&
          (this.g.withCredentials = this.J));
      try {
        (ui(this), (this.u = !0), this.g.send(t), (this.u = !1));
      } catch (I) {
        ci(this, I);
      }
    }));
  function ci(t, s) {
    ((t.h = !1),
      t.g && ((t.j = !0), t.g.abort(), (t.j = !1)),
      (t.l = s),
      (t.m = 5),
      hi(t),
      Bt(t));
  }
  function hi(t) {
    t.A || ((t.A = !0), B(t, 'complete'), B(t, 'error'));
  }
  ((n.abort = function (t) {
    this.g &&
      this.h &&
      ((this.h = !1),
      (this.j = !0),
      this.g.abort(),
      (this.j = !1),
      (this.m = t || 7),
      B(this, 'complete'),
      B(this, 'abort'),
      Bt(this));
  }),
    (n.N = function () {
      (this.g &&
        (this.h &&
          ((this.h = !1), (this.j = !0), this.g.abort(), (this.j = !1)),
        Bt(this, !0)),
        U.aa.N.call(this));
    }),
    (n.Ea = function () {
      this.s || (this.B || this.u || this.j ? li(this) : this.bb());
    }),
    (n.bb = function () {
      li(this);
    }));
  function li(t) {
    if (t.h && typeof l < 'u' && (!t.v[1] || fe(t) != 4 || t.Z() != 2)) {
      if (t.u && fe(t) == 4) Lr(t.Ea, 0, t);
      else if ((B(t, 'readystatechange'), fe(t) == 4)) {
        t.h = !1;
        try {
          const _ = t.Z();
          e: switch (_) {
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
            var h;
            if ((h = _ === 0)) {
              var w = String(t.D).match(ei)[1] || null;
              (!w &&
                p.self &&
                p.self.location &&
                (w = p.self.location.protocol.slice(0, -1)),
                (h = !pa.test(w ? w.toLowerCase() : '')));
            }
            a = h;
          }
          if (a) (B(t, 'complete'), B(t, 'success'));
          else {
            t.m = 6;
            try {
              var I = 2 < fe(t) ? t.g.statusText : '';
            } catch {
              I = '';
            }
            ((t.l = I + ' [' + t.Z() + ']'), hi(t));
          }
        } finally {
          Bt(t);
        }
      }
    }
  }
  function Bt(t, s) {
    if (t.g) {
      ui(t);
      const a = t.g,
        h = t.v[0] ? () => {} : null;
      ((t.g = null), (t.v = null), s || B(t, 'ready'));
      try {
        a.onreadystatechange = h;
      } catch {}
    }
  }
  function ui(t) {
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
        return (t && s.indexOf(t) == 0 && (s = s.substring(t.length)), Go(s));
      }
    }));
  function di(t) {
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
  function ma(t) {
    const s = {};
    t = ((t.g && 2 <= fe(t) && t.g.getAllResponseHeaders()) || '').split(`\r
`);
    for (let h = 0; h < t.length; h++) {
      if (Q(t[h])) continue;
      var a = m(t[h]);
      const w = a[0];
      if (((a = a[1]), typeof a != 'string')) continue;
      a = a.trim();
      const I = s[w] || [];
      ((s[w] = I), I.push(a));
    }
    y(s, function (h) {
      return h.join(', ');
    });
  }
  ((n.Ba = function () {
    return this.m;
  }),
    (n.Ka = function () {
      return typeof this.l == 'string' ? this.l : String(this.l);
    }));
  function vt(t, s, a) {
    return (a && a.internalChannelParams && a.internalChannelParams[t]) || s;
  }
  function fi(t) {
    ((this.Aa = 0),
      (this.i = []),
      (this.j = new ut()),
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
      (this.Va = vt('failFast', !1, t)),
      (this.F = this.C = this.u = this.s = this.l = null),
      (this.X = !0),
      (this.za = this.T = -1),
      (this.Y = this.v = this.B = 0),
      (this.Ta = vt('baseRetryDelayMs', 5e3, t)),
      (this.cb = vt('retryDelaySeedMs', 1e4, t)),
      (this.Wa = vt('forwardChannelMaxRetries', 2, t)),
      (this.wa = vt('forwardChannelRequestTimeoutMs', 2e4, t)),
      (this.pa = (t && t.xmlHttpFactory) || void 0),
      (this.Xa = (t && t.Tb) || void 0),
      (this.Ca = (t && t.useFetchStreams) || !1),
      (this.L = void 0),
      (this.J = (t && t.supportsCrossDomainXhr) || !1),
      (this.K = ''),
      (this.h = new Wr(t && t.concurrentRequestLimit)),
      (this.Da = new da()),
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
  ((n = fi.prototype),
    (n.la = 8),
    (n.G = 1),
    (n.connect = function (t, s, a, h) {
      (z(0),
        (this.W = t),
        (this.H = s || {}),
        a && h !== void 0 && ((this.H.OSID = a), (this.H.OAID = h)),
        (this.F = this.X),
        (this.I = Ti(this, null, this.W)),
        qt(this));
    }));
  function jn(t) {
    if ((pi(t), t.G == 3)) {
      var s = t.U++,
        a = de(t.I);
      if (
        (D(a, 'SID', t.K),
        D(a, 'RID', s),
        D(a, 'TYPE', 'terminate'),
        wt(t, a),
        (s = new Ie(t, t.j, s)),
        (s.L = 2),
        (s.v = Ht(de(a))),
        (a = !1),
        p.navigator && p.navigator.sendBeacon)
      )
        try {
          a = p.navigator.sendBeacon(s.v.toString(), '');
        } catch {}
      (!a && p.Image && ((new Image().src = s.v), (a = !0)),
        a || ((s.g = _i(s.j, null)), s.g.ea(s.v)),
        (s.F = Date.now()),
        jt(s));
    }
    Ii(t);
  }
  function zt(t) {
    t.g && (Fn(t), t.g.cancel(), (t.g = null));
  }
  function pi(t) {
    (zt(t),
      t.u && (p.clearTimeout(t.u), (t.u = null)),
      Kt(t),
      t.h.cancel(),
      t.s && (typeof t.s == 'number' && p.clearTimeout(t.s), (t.s = null)));
  }
  function qt(t) {
    if (!Jr(t.h) && !t.s) {
      t.s = !0;
      var s = t.Ga;
      (st || Pr(), ot || (st(), (ot = !0)), mn.add(s, t), (t.B = 0));
    }
  }
  function ya(t, s) {
    return Xr(t.h) >= t.h.j - (t.s ? 1 : 0)
      ? !1
      : t.s
        ? ((t.i = s.D.concat(t.i)), !0)
        : t.G == 1 || t.G == 2 || t.B >= (t.Va ? 0 : t.Wa)
          ? !1
          : ((t.s = lt(A(t.Ga, t, s), bi(t, t.B))), t.B++, !0);
  }
  n.Ga = function (t) {
    if (this.s)
      if (((this.s = null), this.G == 1)) {
        if (!t) {
          ((this.U = Math.floor(1e5 * Math.random())), (t = this.U++));
          const w = new Ie(this, this.j, t);
          let I = this.o;
          if (
            (this.S && (I ? ((I = u(I)), g(I, this.S)) : (I = this.S)),
            this.m !== null || this.O || ((w.H = I), (I = null)),
            this.P)
          )
            e: {
              for (var s = 0, a = 0; a < this.i.length; a++) {
                t: {
                  var h = this.i[a];
                  if (
                    '__data__' in h.map &&
                    ((h = h.map.__data__), typeof h == 'string')
                  ) {
                    h = h.length;
                    break t;
                  }
                  h = void 0;
                }
                if (h === void 0) break;
                if (((s += h), 4096 < s)) {
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
          ((s = mi(this, w, s)),
            (a = de(this.I)),
            D(a, 'RID', t),
            D(a, 'CVER', 22),
            this.D && D(a, 'X-HTTP-Session-Id', this.D),
            wt(this, a),
            I &&
              (this.O
                ? (s = 'headers=' + encodeURIComponent(String(ai(I))) + '&' + s)
                : this.m && Un(a, this.m, I)),
            Mn(this.h, w),
            this.Ua && D(a, 'TYPE', 'init'),
            this.P
              ? (D(a, '$req', s),
                D(a, 'SID', 'null'),
                (w.T = !0),
                Rn(w, a, null))
              : Rn(w, a, s),
            (this.G = 2));
        }
      } else
        this.G == 3 &&
          (t ? gi(this, t) : this.i.length == 0 || Jr(this.h) || gi(this));
  };
  function gi(t, s) {
    var a;
    s ? (a = s.l) : (a = t.U++);
    const h = de(t.I);
    (D(h, 'SID', t.K),
      D(h, 'RID', a),
      D(h, 'AID', t.T),
      wt(t, h),
      t.m && t.o && Un(h, t.m, t.o),
      (a = new Ie(t, t.j, a, t.B + 1)),
      t.m === null && (a.H = t.o),
      s && (t.i = s.D.concat(t.i)),
      (s = mi(t, a, 1e3)),
      (a.I = Math.round(0.5 * t.wa) + Math.round(0.5 * t.wa * Math.random())),
      Mn(t.h, a),
      Rn(a, h, s));
  }
  function wt(t, s) {
    (t.H &&
      G(t.H, function (a, h) {
        D(s, h, a);
      }),
      t.l &&
        Zr({}, function (a, h) {
          D(s, h, a);
        }));
  }
  function mi(t, s, a) {
    a = Math.min(t.i.length, a);
    var h = t.l ? A(t.l.Na, t.l, t) : null;
    e: {
      var w = t.i;
      let I = -1;
      for (;;) {
        const _ = ['count=' + a];
        I == -1
          ? 0 < a
            ? ((I = w[0].g), _.push('ofs=' + I))
            : (I = 0)
          : _.push('ofs=' + I);
        let N = !0;
        for (let x = 0; x < a; x++) {
          let R = w[x].g;
          const V = w[x].map;
          if (((R -= I), 0 > R)) ((I = Math.max(0, w[x].g - 100)), (N = !1));
          else
            try {
              fa(V, _, 'req' + R + '_');
            } catch {
              h && h(V);
            }
        }
        if (N) {
          h = _.join('&');
          break e;
        }
      }
    }
    return ((t = t.i.splice(0, a)), (s.D = t), h);
  }
  function yi(t) {
    if (!t.g && !t.u) {
      t.Y = 1;
      var s = t.Fa;
      (st || Pr(), ot || (st(), (ot = !0)), mn.add(s, t), (t.v = 0));
    }
  }
  function xn(t) {
    return t.g || t.u || 3 <= t.v
      ? !1
      : (t.Y++, (t.u = lt(A(t.Fa, t), bi(t, t.v))), t.v++, !0);
  }
  ((n.Fa = function () {
    if (
      ((this.u = null),
      vi(this),
      this.ba && !(this.M || this.g == null || 0 >= this.R))
    ) {
      var t = 2 * this.R;
      (this.j.info('BP detection timer enabled: ' + t),
        (this.A = lt(A(this.ab, this), t)));
    }
  }),
    (n.ab = function () {
      this.A &&
        ((this.A = null),
        this.j.info('BP detection timeout reached.'),
        this.j.info('Buffering proxy detected and switch to long-polling!'),
        (this.F = !1),
        (this.M = !0),
        z(10),
        zt(this),
        vi(this));
    }));
  function Fn(t) {
    t.A != null && (p.clearTimeout(t.A), (t.A = null));
  }
  function vi(t) {
    ((t.g = new Ie(t, t.j, 'rpc', t.Y)),
      t.m === null && (t.g.H = t.o),
      (t.g.O = 0));
    var s = de(t.qa);
    (D(s, 'RID', 'rpc'),
      D(s, 'SID', t.K),
      D(s, 'AID', t.T),
      D(s, 'CI', t.F ? '0' : '1'),
      !t.F && t.ja && D(s, 'TO', t.ja),
      D(s, 'TYPE', 'xmlhttp'),
      wt(t, s),
      t.m && t.o && Un(s, t.m, t.o),
      t.L && (t.g.I = t.L));
    var a = t.g;
    ((t = t.ia),
      (a.L = 1),
      (a.v = Ht(de(s))),
      (a.m = null),
      (a.P = !0),
      qr(a, t));
  }
  n.Za = function () {
    this.C != null && ((this.C = null), zt(this), xn(this), z(19));
  };
  function Kt(t) {
    t.C != null && (p.clearTimeout(t.C), (t.C = null));
  }
  function wi(t, s) {
    var a = null;
    if (t.g == s) {
      (Kt(t), Fn(t), (t.g = null));
      var h = 2;
    } else if (Ln(t.h, s)) ((a = s.D), Yr(t.h, s), (h = 1));
    else return;
    if (t.G != 0) {
      if (s.o)
        if (h == 1) {
          ((a = s.m ? s.m.length : 0), (s = Date.now() - s.F));
          var w = t.B;
          ((h = Cn()), B(h, new Vr(h, a)), qt(t));
        } else yi(t);
      else if (
        ((w = s.s),
        w == 3 ||
          (w == 0 && 0 < s.X) ||
          !((h == 1 && ya(t, s)) || (h == 2 && xn(t))))
      )
        switch ((a && 0 < a.length && ((s = t.h), (s.i = s.i.concat(a))), w)) {
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
  function bi(t, s) {
    let a = t.Ta + Math.floor(Math.random() * t.cb);
    return (t.isActive() || (a *= 2), a * s);
  }
  function Ue(t, s) {
    if ((t.j.info('Error code ' + s), s == 2)) {
      var a = A(t.fb, t),
        h = t.Xa;
      const w = !h;
      ((h = new Me(h || '//www.google.com/images/cleardot.gif')),
        (p.location && p.location.protocol == 'http') || xt(h, 'https'),
        Ht(h),
        w ? la(h.toString(), a) : ua(h.toString(), a));
    } else z(2);
    ((t.G = 0), t.l && t.l.sa(s), Ii(t), pi(t));
  }
  n.fb = function (t) {
    t
      ? (this.j.info('Successfully pinged google.com'), z(2))
      : (this.j.info('Failed to ping google.com'), z(1));
  };
  function Ii(t) {
    if (((t.G = 0), (t.ka = []), t.l)) {
      const s = Qr(t.h);
      ((s.length != 0 || t.i.length != 0) &&
        (M(t.ka, s),
        M(t.ka, t.i),
        (t.h.i.length = 0),
        j(t.i),
        (t.i.length = 0)),
        t.l.ra());
    }
  }
  function Ti(t, s, a) {
    var h = a instanceof Me ? de(a) : new Me(a);
    if (h.g != '') (s && (h.g = s + '.' + h.g), Ft(h, h.s));
    else {
      var w = p.location;
      ((h = w.protocol),
        (s = s ? s + '.' + w.hostname : w.hostname),
        (w = +w.port));
      var I = new Me(null);
      (h && xt(I, h), s && (I.g = s), w && Ft(I, w), a && (I.l = a), (h = I));
    }
    return (
      (a = t.D),
      (s = t.ya),
      a && s && D(h, a, s),
      D(h, 'VER', t.la),
      wt(t, h),
      h
    );
  }
  function _i(t, s, a) {
    if (s && !t.J)
      throw Error("Can't create secondary domain capable XhrIo object.");
    return (
      (s = t.Ca && !t.pa ? new U(new $t({ eb: a })) : new U(t.pa)),
      s.Ha(t.J),
      s
    );
  }
  n.isActive = function () {
    return !!this.l && this.l.isActive(this);
  };
  function Ei() {}
  ((n = Ei.prototype),
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
      (this.g = new fi(s)),
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
      (this.j = new We(this)));
  }
  (P(ee, $),
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
      } else this.u && ((a = {}), (a.__data__ = En(t)), (t = a));
      (s.i.push(new ea(s.Ya++, t)), s.G == 3 && qt(s));
    }),
    (ee.prototype.N = function () {
      ((this.g.l = null),
        delete this.j,
        jn(this.g),
        delete this.g,
        ee.aa.N.call(this));
    }));
  function Si(t) {
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
  P(Si, kn);
  function ki() {
    (An.call(this), (this.status = 1));
  }
  P(ki, An);
  function We(t) {
    this.g = t;
  }
  (P(We, Ei),
    (We.prototype.ua = function () {
      B(this.g, 'a');
    }),
    (We.prototype.ta = function (t) {
      B(this.g, new Si(t));
    }),
    (We.prototype.sa = function (t) {
      B(this.g, new ki());
    }),
    (We.prototype.ra = function () {
      B(this.g, 'b');
    }),
    (ee.prototype.send = ee.prototype.o),
    (ee.prototype.open = ee.prototype.m),
    (ee.prototype.close = ee.prototype.close),
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
  typeof Jt < 'u'
    ? Jt
    : typeof self < 'u'
      ? self
      : typeof window < 'u'
        ? window
        : {}
);
const ls = '@firebase/firestore';
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
 */ class q {
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
((q.UNAUTHENTICATED = new q(null)),
  (q.GOOGLE_CREDENTIALS = new q('google-credentials-uid')),
  (q.FIRST_PARTY = new q('first-party-uid')),
  (q.MOCK_USER = new q('mock-user')));
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
 */ let Rt = '10.14.0';
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
 */ const tt = new un('@firebase/firestore');
function ie(n, ...e) {
  if (tt.logLevel <= O.DEBUG) {
    const r = e.map(Sr);
    tt.debug(`Firestore (${Rt}): ${n}`, ...r);
  }
}
function Lo(n, ...e) {
  if (tt.logLevel <= O.ERROR) {
    const r = e.map(Sr);
    tt.error(`Firestore (${Rt}): ${n}`, ...r);
  }
}
function pd(n, ...e) {
  if (tt.logLevel <= O.WARN) {
    const r = e.map(Sr);
    tt.warn(`Firestore (${Rt}): ${n}`, ...r);
  }
}
function Sr(n) {
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
     */ return (function (e) {
      return JSON.stringify(e);
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
 */ function kr(n = 'Unexpected state') {
  const e = `FIRESTORE (${Rt}) INTERNAL ASSERTION FAILED: ` + n;
  throw (Lo(e), new Error(e));
}
function Tt(n, e) {
  n || kr();
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
  constructor(e, r) {
    (super(e, r),
      (this.code = e),
      (this.message = r),
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
 */ class _t {
  constructor() {
    this.promise = new Promise((e, r) => {
      ((this.resolve = e), (this.reject = r));
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
 */ class Mo {
  constructor(e, r) {
    ((this.user = r),
      (this.type = 'OAuth'),
      (this.headers = new Map()),
      this.headers.set('Authorization', `Bearer ${e}`));
  }
}
class gd {
  getToken() {
    return Promise.resolve(null);
  }
  invalidateToken() {}
  start(e, r) {
    e.enqueueRetryable(() => r(q.UNAUTHENTICATED));
  }
  shutdown() {}
}
class md {
  constructor(e) {
    ((this.token = e), (this.changeListener = null));
  }
  getToken() {
    return Promise.resolve(this.token);
  }
  invalidateToken() {}
  start(e, r) {
    ((this.changeListener = r), e.enqueueRetryable(() => r(this.token.user)));
  }
  shutdown() {
    this.changeListener = null;
  }
}
class yd {
  constructor(e) {
    ((this.t = e),
      (this.currentUser = q.UNAUTHENTICATED),
      (this.i = 0),
      (this.forceRefresh = !1),
      (this.auth = null));
  }
  start(e, r) {
    Tt(this.o === void 0);
    let i = this.i;
    const o = v => (this.i !== i ? ((i = this.i), r(v)) : Promise.resolve());
    let c = new _t();
    this.o = () => {
      (this.i++,
        (this.currentUser = this.u()),
        c.resolve(),
        (c = new _t()),
        e.enqueueRetryable(() => o(this.currentUser)));
    };
    const l = () => {
        const v = c;
        e.enqueueRetryable(async () => {
          (await v.promise, await o(this.currentUser));
        });
      },
      p = v => {
        (ie('FirebaseAuthCredentialsProvider', 'Auth detected'),
          (this.auth = v),
          this.o && (this.auth.addAuthTokenListener(this.o), l()));
      };
    (this.t.onInit(v => p(v)),
      setTimeout(() => {
        if (!this.auth) {
          const v = this.t.getImmediate({ optional: !0 });
          v
            ? p(v)
            : (ie('FirebaseAuthCredentialsProvider', 'Auth not yet detected'),
              c.resolve(),
              (c = new _t()));
        }
      }, 0),
      l());
  }
  getToken() {
    const e = this.i,
      r = this.forceRefresh;
    return (
      (this.forceRefresh = !1),
      this.auth
        ? this.auth
            .getToken(r)
            .then(i =>
              this.i !== e
                ? (ie(
                    'FirebaseAuthCredentialsProvider',
                    'getToken aborted due to token change.'
                  ),
                  this.getToken())
                : i
                  ? (Tt(typeof i.accessToken == 'string'),
                    new Mo(i.accessToken, this.currentUser))
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
    return (Tt(e === null || typeof e == 'string'), new q(e));
  }
}
class vd {
  constructor(e, r, i) {
    ((this.l = e),
      (this.h = r),
      (this.P = i),
      (this.type = 'FirstParty'),
      (this.user = q.FIRST_PARTY),
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
class wd {
  constructor(e, r, i) {
    ((this.l = e), (this.h = r), (this.P = i));
  }
  getToken() {
    return Promise.resolve(new vd(this.l, this.h, this.P));
  }
  start(e, r) {
    e.enqueueRetryable(() => r(q.FIRST_PARTY));
  }
  shutdown() {}
  invalidateToken() {}
}
class bd {
  constructor(e) {
    ((this.value = e),
      (this.type = 'AppCheck'),
      (this.headers = new Map()),
      e && e.length > 0 && this.headers.set('x-firebase-appcheck', this.value));
  }
}
class Id {
  constructor(e) {
    ((this.A = e),
      (this.forceRefresh = !1),
      (this.appCheck = null),
      (this.R = null));
  }
  start(e, r) {
    Tt(this.o === void 0);
    const i = c => {
      c.error != null &&
        ie(
          'FirebaseAppCheckTokenProvider',
          `Error getting App Check token; using placeholder token instead. Error: ${c.error.message}`
        );
      const l = c.token !== this.R;
      return (
        (this.R = c.token),
        ie(
          'FirebaseAppCheckTokenProvider',
          `Received ${l ? 'new' : 'existing'} token.`
        ),
        l ? r(c.token) : Promise.resolve()
      );
    };
    this.o = c => {
      e.enqueueRetryable(() => i(c));
    };
    const o = c => {
      (ie('FirebaseAppCheckTokenProvider', 'AppCheck detected'),
        (this.appCheck = c),
        this.o && this.appCheck.addTokenListener(this.o));
    };
    (this.A.onInit(c => o(c)),
      setTimeout(() => {
        if (!this.appCheck) {
          const c = this.A.getImmediate({ optional: !0 });
          c
            ? o(c)
            : ie('FirebaseAppCheckTokenProvider', 'AppCheck not yet detected');
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
            .then(r =>
              r
                ? (Tt(typeof r.token == 'string'),
                  (this.R = r.token),
                  new bd(r.token))
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
function Td(n) {
  return n.name === 'IndexedDbTransactionError';
}
class ln {
  constructor(e, r) {
    ((this.projectId = e), (this.database = r || '(default)'));
  }
  static empty() {
    return new ln('', '');
  }
  get isDefaultDatabase() {
    return this.database === '(default)';
  }
  isEqual(e) {
    return (
      e instanceof ln &&
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
 */ var us, C;
(((C = us || (us = {}))[(C.OK = 0)] = 'OK'),
  (C[(C.CANCELLED = 1)] = 'CANCELLED'),
  (C[(C.UNKNOWN = 2)] = 'UNKNOWN'),
  (C[(C.INVALID_ARGUMENT = 3)] = 'INVALID_ARGUMENT'),
  (C[(C.DEADLINE_EXCEEDED = 4)] = 'DEADLINE_EXCEEDED'),
  (C[(C.NOT_FOUND = 5)] = 'NOT_FOUND'),
  (C[(C.ALREADY_EXISTS = 6)] = 'ALREADY_EXISTS'),
  (C[(C.PERMISSION_DENIED = 7)] = 'PERMISSION_DENIED'),
  (C[(C.UNAUTHENTICATED = 16)] = 'UNAUTHENTICATED'),
  (C[(C.RESOURCE_EXHAUSTED = 8)] = 'RESOURCE_EXHAUSTED'),
  (C[(C.FAILED_PRECONDITION = 9)] = 'FAILED_PRECONDITION'),
  (C[(C.ABORTED = 10)] = 'ABORTED'),
  (C[(C.OUT_OF_RANGE = 11)] = 'OUT_OF_RANGE'),
  (C[(C.UNIMPLEMENTED = 12)] = 'UNIMPLEMENTED'),
  (C[(C.INTERNAL = 13)] = 'INTERNAL'),
  (C[(C.UNAVAILABLE = 14)] = 'UNAVAILABLE'),
  (C[(C.DATA_LOSS = 15)] = 'DATA_LOSS'));
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
 */ new No([4294967295, 4294967295], 0);
function Yn() {
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
 */ class _d {
  constructor(e, r, i = 1e3, o = 1.5, c = 6e4) {
    ((this.ui = e),
      (this.timerId = r),
      (this.ko = i),
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
    const r = Math.floor(this.Ko + this.zo()),
      i = Math.max(0, Date.now() - this.Uo),
      o = Math.max(0, r - i);
    (o > 0 &&
      ie(
        'ExponentialBackoff',
        `Backing off for ${o} ms (base delay: ${this.Ko} ms, delay with jitter: ${r} ms, last attempt: ${i} ms ago)`
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
 */ class Ar {
  constructor(e, r, i, o, c) {
    ((this.asyncQueue = e),
      (this.timerId = r),
      (this.targetTimeMs = i),
      (this.op = o),
      (this.removalCallback = c),
      (this.deferred = new _t()),
      (this.then = this.deferred.promise.then.bind(this.deferred.promise)),
      this.deferred.promise.catch(l => {}));
  }
  get promise() {
    return this.deferred.promise;
  }
  static createAndSchedule(e, r, i, o, c) {
    const l = Date.now() + i,
      p = new Ar(e, r, l, o, c);
    return (p.start(i), p);
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
var ds, fs;
(((fs = ds || (ds = {})).ea = 'default'), (fs.Cache = 'cache'));
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
 */ function Ed(n) {
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
 */ const ps = new Map();
function Sd(n, e, r, i) {
  if (e === !0 && i === !0)
    throw new X(J.INVALID_ARGUMENT, `${n} and ${r} cannot be used together.`);
}
function kd(n) {
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
  return typeof n == 'function' ? 'a function' : kr();
}
function Ad(n, e) {
  if (('_delegate' in n && (n = n._delegate), !(n instanceof e))) {
    if (e.name === n.constructor.name)
      throw new X(
        J.INVALID_ARGUMENT,
        'Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?'
      );
    {
      const r = kd(n);
      throw new X(
        J.INVALID_ARGUMENT,
        `Expected type '${e.name}', but it was: ${r}`
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
 */ class gs {
  constructor(e) {
    var r, i;
    if (e.host === void 0) {
      if (e.ssl !== void 0)
        throw new X(
          J.INVALID_ARGUMENT,
          "Can't provide ssl option if host option is not set"
        );
      ((this.host = 'firestore.googleapis.com'), (this.ssl = !0));
    } else
      ((this.host = e.host),
        (this.ssl = (r = e.ssl) === null || r === void 0 || r));
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
    (Sd(
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
      (this.experimentalLongPollingOptions = Ed(
        (i = e.experimentalLongPollingOptions) !== null && i !== void 0 ? i : {}
      )),
      (function (o) {
        if (o.timeoutSeconds !== void 0) {
          if (isNaN(o.timeoutSeconds))
            throw new X(
              J.INVALID_ARGUMENT,
              `invalid long polling timeout: ${o.timeoutSeconds} (must not be NaN)`
            );
          if (o.timeoutSeconds < 5)
            throw new X(
              J.INVALID_ARGUMENT,
              `invalid long polling timeout: ${o.timeoutSeconds} (minimum allowed value is 5)`
            );
          if (o.timeoutSeconds > 30)
            throw new X(
              J.INVALID_ARGUMENT,
              `invalid long polling timeout: ${o.timeoutSeconds} (maximum allowed value is 30)`
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
      (function (r, i) {
        return r.timeoutSeconds === i.timeoutSeconds;
      })(
        this.experimentalLongPollingOptions,
        e.experimentalLongPollingOptions
      ) &&
      this.ignoreUndefinedProperties === e.ignoreUndefinedProperties &&
      this.useFetchStreams === e.useFetchStreams
    );
  }
}
class Uo {
  constructor(e, r, i, o) {
    ((this._authCredentials = e),
      (this._appCheckCredentials = r),
      (this._databaseId = i),
      (this._app = o),
      (this.type = 'firestore-lite'),
      (this._persistenceKey = '(lite)'),
      (this._settings = new gs({})),
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
    ((this._settings = new gs(e)),
      e.credentials !== void 0 &&
        (this._authCredentials = (function (r) {
          if (!r) return new gd();
          switch (r.type) {
            case 'firstParty':
              return new wd(
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
      (function (e) {
        const r = ps.get(e);
        r &&
          (ie('ComponentProvider', 'Removing Datastore'),
          ps.delete(e),
          r.terminate());
      })(this),
      Promise.resolve()
    );
  }
}
function Cd(n, e, r, i = {}) {
  var o;
  const c = (n = Ad(n, Uo))._getSettings(),
    l = `${e}:${r}`;
  if (
    (c.host !== 'firestore.googleapis.com' &&
      c.host !== l &&
      pd(
        'Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.'
      ),
    n._setSettings(Object.assign(Object.assign({}, c), { host: l, ssl: !1 })),
    i.mockUserToken)
  ) {
    let p, v;
    if (typeof i.mockUserToken == 'string')
      ((p = i.mockUserToken), (v = q.MOCK_USER));
    else {
      p = Aa(
        i.mockUserToken,
        (o = n._app) === null || o === void 0 ? void 0 : o.options.projectId
      );
      const T = i.mockUserToken.sub || i.mockUserToken.user_id;
      if (!T)
        throw new X(
          J.INVALID_ARGUMENT,
          "mockUserToken must contain 'sub' or 'user_id' field!"
        );
      v = new q(T);
    }
    n._authCredentials = new md(new Mo(p, v));
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
 */ class ms {
  constructor(e = Promise.resolve()) {
    ((this.Pu = []),
      (this.Iu = !1),
      (this.Tu = []),
      (this.Eu = null),
      (this.du = !1),
      (this.Au = !1),
      (this.Ru = []),
      (this.t_ = new _d(this, 'async_queue_retry')),
      (this.Vu = () => {
        const i = Yn();
        (i &&
          ie('AsyncQueue', 'Visibility state changed to ' + i.visibilityState),
          this.t_.jo());
      }),
      (this.mu = e));
    const r = Yn();
    r &&
      typeof r.addEventListener == 'function' &&
      r.addEventListener('visibilitychange', this.Vu);
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
      const r = Yn();
      r &&
        typeof r.removeEventListener == 'function' &&
        r.removeEventListener('visibilitychange', this.Vu);
    }
  }
  enqueue(e) {
    if ((this.fu(), this.Iu)) return new Promise(() => {});
    const r = new _t();
    return this.gu(() =>
      this.Iu && this.Au
        ? Promise.resolve()
        : (e().then(r.resolve, r.reject), r.promise)
    ).then(() => r.promise);
  }
  enqueueRetryable(e) {
    this.enqueueAndForget(() => (this.Pu.push(e), this.pu()));
  }
  async pu() {
    if (this.Pu.length !== 0) {
      try {
        (await this.Pu[0](), this.Pu.shift(), this.t_.reset());
      } catch (e) {
        if (!Td(e)) throw e;
        ie('AsyncQueue', 'Operation failed with retryable error: ' + e);
      }
      this.Pu.length > 0 && this.t_.Go(() => this.pu());
    }
  }
  gu(e) {
    const r = this.mu.then(
      () => (
        (this.du = !0),
        e()
          .catch(i => {
            ((this.Eu = i), (this.du = !1));
            const o = (function (c) {
              let l = c.message || '';
              return (
                c.stack &&
                  (l = c.stack.includes(c.message)
                    ? c.stack
                    : c.message +
                      `
` +
                      c.stack),
                l
              );
            })(i);
            throw (Lo('INTERNAL UNHANDLED ERROR: ', o), i);
          })
          .then(i => ((this.du = !1), i))
      )
    );
    return ((this.mu = r), r);
  }
  enqueueAfterDelay(e, r, i) {
    (this.fu(), this.Ru.indexOf(e) > -1 && (r = 0));
    const o = Ar.createAndSchedule(this, e, r, i, c => this.yu(c));
    return (this.Tu.push(o), o);
  }
  fu() {
    this.Eu && kr();
  }
  verifyOperationInProgress() {}
  async wu() {
    let e;
    do ((e = this.mu), await e);
    while (e !== this.mu);
  }
  Su(e) {
    for (const r of this.Tu) if (r.timerId === e) return !0;
    return !1;
  }
  bu(e) {
    return this.wu().then(() => {
      this.Tu.sort((r, i) => r.targetTimeMs - i.targetTimeMs);
      for (const r of this.Tu)
        if ((r.skipDelay(), e !== 'all' && r.timerId === e)) break;
      return this.wu();
    });
  }
  Du(e) {
    this.Ru.push(e);
  }
  yu(e) {
    const r = this.Tu.indexOf(e);
    this.Tu.splice(r, 1);
  }
}
class Pd extends Uo {
  constructor(e, r, i, o) {
    (super(e, r, i, o),
      (this.type = 'firestore'),
      (this._queue = new ms()),
      (this._persistenceKey = o?.name || '[DEFAULT]'));
  }
  async _terminate() {
    if (this._firestoreClient) {
      const e = this._firestoreClient.terminate();
      ((this._queue = new ms(e)), (this._firestoreClient = void 0), await e);
    }
  }
}
function Od(n, e) {
  const r = typeof n == 'object' ? n : hr(),
    i = typeof n == 'string' ? n : '(default)',
    o = ze(r, 'firestore').getImmediate({ identifier: i });
  if (!o._initialized) {
    const c = Sa('firestore');
    c && Cd(o, ...c);
  }
  return o;
}
(function (n, e = !0) {
  ((function (r) {
    Rt = r;
  })(nt),
    he(
      new se(
        'firestore',
        (r, { instanceIdentifier: i, options: o }) => {
          const c = r.getProvider('app').getImmediate(),
            l = new Pd(
              new yd(r.getProvider('auth-internal')),
              new Id(r.getProvider('app-check-internal')),
              (function (p, v) {
                if (
                  !Object.prototype.hasOwnProperty.apply(p.options, [
                    'projectId',
                  ])
                )
                  throw new X(
                    J.INVALID_ARGUMENT,
                    '"projectId" not provided in firebase.initializeApp.'
                  );
                return new ln(p.options.projectId, v);
              })(c, i),
              c
            );
          return (
            (o = Object.assign({ useFetchStreams: e }, o)),
            l._setSettings(o),
            l
          );
        },
        'PUBLIC'
      ).setMultipleInstances(!0)
    ),
    te(ls, '4.7.3', n),
    te(ls, '4.7.3', 'esm2017'));
})();
const Rd = {
    apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
    authDomain: 'ball-network-web.firebaseapp.com',
    databaseURL: 'https://ball-network-web-default-rtdb.firebaseio.com',
    projectId: 'ball-network-web',
    storageBucket: 'ball-network-web.appspot.com',
    messagingSenderId: '740915998465',
    appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
    measurementId: 'G-ZS07SKSRRL',
  },
  Cr = Ps(Rd);
dd(Cr);
Od(Cr);
fl(Cr);
export { Cr as C };
//# sourceMappingURL=firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy-Cf6bMmA_-B8D1IVXI.js.map
