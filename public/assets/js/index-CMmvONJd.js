import"./modulepreload-polyfill-B5Qt9EMX-ulV_1b7r.js";import"./modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF-Ch0fsPTR-CXZUdh1a-CeVZLGMH-yloy7H---yloy7H--.js";/* empty css                       */(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();var Cr={};/**
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
*/const ws=function(i){const e=[];let n=0;for(let r=0;r<i.length;r++){let o=i.charCodeAt(r);o<128?e[n++]=o:o<2048?(e[n++]=o>>6|192,e[n++]=o&63|128):(o&64512)===55296&&r+1<i.length&&(i.charCodeAt(r+1)&64512)===56320?(o=65536+((o&1023)<<10)+(i.charCodeAt(++r)&1023),e[n++]=o>>18|240,e[n++]=o>>12&63|128,e[n++]=o>>6&63|128,e[n++]=o&63|128):(e[n++]=o>>12|224,e[n++]=o>>6&63|128,e[n++]=o&63|128)}return e},ba=function(i){const e=[];let n=0,r=0;for(;n<i.length;){const o=i[n++];if(o<128)e[r++]=String.fromCharCode(o);else if(o>191&&o<224){const c=i[n++];e[r++]=String.fromCharCode((o&31)<<6|c&63)}else if(o>239&&o<365){const c=i[n++],l=i[n++],f=i[n++],y=((o&7)<<18|(c&63)<<12|(l&63)<<6|f&63)-65536;e[r++]=String.fromCharCode(55296+(y>>10)),e[r++]=String.fromCharCode(56320+(y&1023))}else{const c=i[n++],l=i[n++];e[r++]=String.fromCharCode((o&15)<<12|(c&63)<<6|l&63)}}return e.join("")},bs={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(i,e){if(!Array.isArray(i))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let o=0;o<i.length;o+=3){const c=i[o],l=o+1<i.length,f=l?i[o+1]:0,y=o+2<i.length,T=y?i[o+2]:0,S=c>>2,k=(c&3)<<4|f>>4;let A=(f&15)<<2|T>>6,L=T&63;y||(L=64,l||(A=64)),r.push(n[S],n[k],n[A],n[L])}return r.join("")},encodeString(i,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(i):this.encodeByteArray(ws(i),e)},decodeString(i,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(i):ba(this.decodeStringToByteArray(i,e))},decodeStringToByteArray(i,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let o=0;o<i.length;){const c=n[i.charAt(o++)],l=o<i.length?n[i.charAt(o)]:0;++o;const f=o<i.length?n[i.charAt(o)]:64;++o;const y=o<i.length?n[i.charAt(o)]:64;if(++o,c==null||l==null||f==null||y==null)throw new Ia;const T=c<<2|l>>4;if(r.push(T),f!==64){const S=l<<4&240|f>>2;if(r.push(S),y!==64){const k=f<<6&192|y;r.push(k)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let i=0;i<this.ENCODED_VALS.length;i++)this.byteToCharMap_[i]=this.ENCODED_VALS.charAt(i),this.charToByteMap_[this.byteToCharMap_[i]]=i,this.byteToCharMapWebSafe_[i]=this.ENCODED_VALS_WEBSAFE.charAt(i),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]]=i,i>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)]=i,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)]=i)}}};class Ia extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Ta=function(i){const e=ws(i);return bs.encodeByteArray(e,!0)},ti=function(i){return Ta(i).replace(/\./g,"")},Is=function(i){try{return bs.decodeString(i,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
*/function _a(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
*/const Ea=()=>_a().__FIREBASE_DEFAULTS__,Sa=()=>{if(typeof process>"u"||typeof Cr>"u")return;const i=Cr.__FIREBASE_DEFAULTS__;if(i)return JSON.parse(i)},ka=()=>{if(typeof document>"u")return;let i;try{i=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=i&&Is(i[1]);return e&&JSON.parse(e)},cn=()=>{try{return Ea()||Sa()||ka()}catch(i){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${i}`);return}},Ts=i=>{var e,n;return(n=(e=cn())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[i]},Aa=i=>{const e=Ts(i);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},_s=()=>{var i;return(i=cn())===null||i===void 0?void 0:i.config},Es=i=>{var e;return(e=cn())===null||e===void 0?void 0:e[`_${i}`]};/**
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
*/class Ca{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
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
*/function Pa(i,e){if(i.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",o=i.iat||0,c=i.sub||i.user_id;if(!c)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const l=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:o,exp:o+3600,auth_time:o,sub:c,user_id:c,firebase:{sign_in_provider:"custom",identities:{}}},i);return[ti(JSON.stringify(n)),ti(JSON.stringify(l)),""].join(".")}/**
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
*/function K(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Oa(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(K())}function Ra(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Ss(){const i=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof i=="object"&&i.id!==void 0}function Na(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Da(){const i=K();return i.indexOf("MSIE ")>=0||i.indexOf("Trident/")>=0}function ks(){try{return typeof indexedDB=="object"}catch{return!1}}function As(){return new Promise((i,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(r);o.onsuccess=()=>{o.result.close(),n||self.indexedDB.deleteDatabase(r),i(!0)},o.onupgradeneeded=()=>{n=!1},o.onerror=()=>{var c;e(((c=o.error)===null||c===void 0?void 0:c.message)||"")}}catch(n){e(n)}})}function La(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
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
*/const Ma="FirebaseError";class oe extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=Ma,Object.setPrototypeOf(this,oe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ve.prototype.create)}}class Ve{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},o=`${this.service}/${e}`,c=this.errors[e],l=c?Ua(c,r):"Error",f=`${this.serviceName}: ${l} (${o}).`;return new oe(o,f,r)}}function Ua(i,e){return i.replace(ja,(n,r)=>{const o=e[r];return o!=null?String(o):`<${r}?>`})}const ja=/\{\$([^}]+)}/g;function xa(i){for(const e in i)if(Object.prototype.hasOwnProperty.call(i,e))return!1;return!0}function Et(i,e){if(i===e)return!0;const n=Object.keys(i),r=Object.keys(e);for(const o of n){if(!r.includes(o))return!1;const c=i[o],l=e[o];if(Pr(c)&&Pr(l)){if(!Et(c,l))return!1}else if(c!==l)return!1}for(const o of r)if(!n.includes(o))return!1;return!0}function Pr(i){return i!==null&&typeof i=="object"}/**
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
*/function Ct(i){const e=[];for(const[n,r]of Object.entries(i))Array.isArray(r)?r.forEach(o=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(o))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Fa(i,e){const n=new Ha(i,e);return n.subscribe.bind(n)}class Ha{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let o;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");$a(e,["next","error","complete"])?o=e:o={next:e,error:n,complete:r},o.next===void 0&&(o.next=$i),o.error===void 0&&(o.error=$i),o.complete===void 0&&(o.complete=$i);const c=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),c}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function $a(i,e){if(typeof i!="object"||i===null)return!1;for(const n of e)if(n in i&&typeof i[n]=="function")return!0;return!1}function $i(){}/**
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
*/const Ba=1e3,Va=2,za=4*60*60*1e3,qa=.5;function Or(i,e=Ba,n=Va){const r=e*Math.pow(n,i),o=Math.round(qa*r*(Math.random()-.5)*2);return Math.min(za,r+o)}/**
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
*/function Ne(i){return i&&i._delegate?i._delegate:i}class se{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
*/const je="[DEFAULT]";/**
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
*/class Ka{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new Ca;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:n});o&&r.resolve(o)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e?.identifier),o=(n=e?.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(c){if(o)return null;throw c}else{if(o)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Ga(e))try{this.getOrInitializeService({instanceIdentifier:je})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(n);try{const c=this.getOrInitializeService({instanceIdentifier:o});r.resolve(c)}catch{}}}}clearInstance(e=je){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=je){return this.instances.has(e)}getOptions(e=je){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[c,l]of this.instancesDeferred.entries()){const f=this.normalizeInstanceIdentifier(c);r===f&&l.resolve(o)}return o}onInit(e,n){var r;const o=this.normalizeInstanceIdentifier(n),c=(r=this.onInitCallbacks.get(o))!==null&&r!==void 0?r:new Set;c.add(e),this.onInitCallbacks.set(o,c);const l=this.instances.get(o);return l&&e(l,o),()=>{c.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const o of r)try{o(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Wa(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=je){return this.component?this.component.multipleInstances?e:je:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Wa(i){return i===je?void 0:i}function Ga(i){return i.instantiationMode==="EAGER"}/**
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
*/class Ja{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Ka(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
*/var O;(function(i){i[i.DEBUG=0]="DEBUG",i[i.VERBOSE=1]="VERBOSE",i[i.INFO=2]="INFO",i[i.WARN=3]="WARN",i[i.ERROR=4]="ERROR",i[i.SILENT=5]="SILENT"})(O||(O={}));const Xa={debug:O.DEBUG,verbose:O.VERBOSE,info:O.INFO,warn:O.WARN,error:O.ERROR,silent:O.SILENT},Ya=O.INFO,Qa={[O.DEBUG]:"log",[O.VERBOSE]:"log",[O.INFO]:"info",[O.WARN]:"warn",[O.ERROR]:"error"},Za=(i,e,...n)=>{if(e<i.logLevel)return;const r=new Date().toISOString(),o=Qa[e];if(o)console[o](`[${r}]  ${i.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ui{constructor(e){this.name=e,this._logLevel=Ya,this._logHandler=Za,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in O))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Xa[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,O.DEBUG,...e),this._logHandler(this,O.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,O.VERBOSE,...e),this._logHandler(this,O.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,O.INFO,...e),this._logHandler(this,O.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,O.WARN,...e),this._logHandler(this,O.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,O.ERROR,...e),this._logHandler(this,O.ERROR,...e)}}const ec=(i,e)=>e.some(n=>i instanceof n);let Rr,Nr;function tc(){return Rr||(Rr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ic(){return Nr||(Nr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Cs=new WeakMap,Qi=new WeakMap,Ps=new WeakMap,Bi=new WeakMap,hn=new WeakMap;function nc(i){const e=new Promise((n,r)=>{const o=()=>{i.removeEventListener("success",c),i.removeEventListener("error",l)},c=()=>{n(Oe(i.result)),o()},l=()=>{r(i.error),o()};i.addEventListener("success",c),i.addEventListener("error",l)});return e.then(n=>{n instanceof IDBCursor&&Cs.set(n,i)}).catch(()=>{}),hn.set(e,i),e}function rc(i){if(Qi.has(i))return;const e=new Promise((n,r)=>{const o=()=>{i.removeEventListener("complete",c),i.removeEventListener("error",l),i.removeEventListener("abort",l)},c=()=>{n(),o()},l=()=>{r(i.error||new DOMException("AbortError","AbortError")),o()};i.addEventListener("complete",c),i.addEventListener("error",l),i.addEventListener("abort",l)});Qi.set(i,e)}let Zi={get(i,e,n){if(i instanceof IDBTransaction){if(e==="done")return Qi.get(i);if(e==="objectStoreNames")return i.objectStoreNames||Ps.get(i);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Oe(i[e])},set(i,e,n){return i[e]=n,!0},has(i,e){return i instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in i}};function sc(i){Zi=i(Zi)}function oc(i){return i===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=i.call(Vi(this),e,...n);return Ps.set(r,e.sort?e.sort():[e]),Oe(r)}:ic().includes(i)?function(...e){return i.apply(Vi(this),e),Oe(Cs.get(this))}:function(...e){return Oe(i.apply(Vi(this),e))}}function ac(i){return typeof i=="function"?oc(i):(i instanceof IDBTransaction&&rc(i),ec(i,tc())?new Proxy(i,Zi):i)}function Oe(i){if(i instanceof IDBRequest)return nc(i);if(Bi.has(i))return Bi.get(i);const e=ac(i);return e!==i&&(Bi.set(i,e),hn.set(e,i)),e}const Vi=i=>hn.get(i);function Os(i,e,{blocked:n,upgrade:r,blocking:o,terminated:c}={}){const l=indexedDB.open(i,e),f=Oe(l);return r&&l.addEventListener("upgradeneeded",y=>{r(Oe(l.result),y.oldVersion,y.newVersion,Oe(l.transaction),y)}),n&&l.addEventListener("blocked",y=>n(y.oldVersion,y.newVersion,y)),f.then(y=>{c&&y.addEventListener("close",()=>c()),o&&y.addEventListener("versionchange",T=>o(T.oldVersion,T.newVersion,T))}).catch(()=>{}),f}const cc=["get","getKey","getAll","getAllKeys","count"],hc=["put","add","delete","clear"],zi=new Map;function Dr(i,e){if(!(i instanceof IDBDatabase&&!(e in i)&&typeof e=="string"))return;if(zi.get(e))return zi.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,o=hc.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(o||cc.includes(n)))return;const c=async function(l,...f){const y=this.transaction(l,o?"readwrite":"readonly");let T=y.store;return r&&(T=T.index(f.shift())),(await Promise.all([T[n](...f),o&&y.done]))[0]};return zi.set(e,c),c}sc(i=>({...i,get:(e,n,r)=>Dr(e,n)||i.get(e,n,r),has:(e,n)=>!!Dr(e,n)||i.has(e,n)}));/**
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
*/class lc{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(uc(e)){const n=e.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(e=>e).join(" ")}}function uc(i){return i.getComponent()?.type==="VERSION"}const en="@firebase/app",Lr="0.10.13";/**
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
*/const ve=new ui("@firebase/app"),dc="@firebase/app-compat",pc="@firebase/analytics-compat",fc="@firebase/analytics",gc="@firebase/app-check-compat",mc="@firebase/app-check",vc="@firebase/auth",yc="@firebase/auth-compat",wc="@firebase/database",bc="@firebase/data-connect",Ic="@firebase/database-compat",Tc="@firebase/functions",_c="@firebase/functions-compat",Ec="@firebase/installations",Sc="@firebase/installations-compat",kc="@firebase/messaging",Ac="@firebase/messaging-compat",Cc="@firebase/performance",Pc="@firebase/performance-compat",Oc="@firebase/remote-config",Rc="@firebase/remote-config-compat",Nc="@firebase/storage",Dc="@firebase/storage-compat",Lc="@firebase/firestore",Mc="@firebase/vertexai-preview",Uc="@firebase/firestore-compat",jc="firebase",xc="10.14.1";/**
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
*/const tn="[DEFAULT]",Fc={[en]:"fire-core",[dc]:"fire-core-compat",[fc]:"fire-analytics",[pc]:"fire-analytics-compat",[mc]:"fire-app-check",[gc]:"fire-app-check-compat",[vc]:"fire-auth",[yc]:"fire-auth-compat",[wc]:"fire-rtdb",[bc]:"fire-data-connect",[Ic]:"fire-rtdb-compat",[Tc]:"fire-fn",[_c]:"fire-fn-compat",[Ec]:"fire-iid",[Sc]:"fire-iid-compat",[kc]:"fire-fcm",[Ac]:"fire-fcm-compat",[Cc]:"fire-perf",[Pc]:"fire-perf-compat",[Oc]:"fire-rc",[Rc]:"fire-rc-compat",[Nc]:"fire-gcs",[Dc]:"fire-gcs-compat",[Lc]:"fire-fst",[Uc]:"fire-fst-compat",[Mc]:"fire-vertex","fire-js":"fire-js",[jc]:"fire-js-all"};/**
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
*/const ii=new Map,Hc=new Map,nn=new Map;function Mr(i,e){try{i.container.addComponent(e)}catch(n){ve.debug(`Component ${e.name} failed to register with FirebaseApp ${i.name}`,n)}}function he(i){const e=i.name;if(nn.has(e))return ve.debug(`There were multiple attempts to register component ${e}.`),!1;nn.set(e,i);for(const n of ii.values())Mr(n,i);for(const n of Hc.values())Mr(n,i);return!0}function ze(i,e){const n=i.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),i.container.getProvider(e)}function Pe(i){return i.settings!==void 0}/**
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
*/const $c={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Re=new Ve("app","Firebase",$c);/**
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
*/class Bc{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new se("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Re.create("app-deleted",{appName:this._name})}}/**
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
*/const it=xc;function Rs(i,e={}){let n=i;typeof e!="object"&&(e={name:e});const r=Object.assign({name:tn,automaticDataCollectionEnabled:!1},e),o=r.name;if(typeof o!="string"||!o)throw Re.create("bad-app-name",{appName:String(o)});if(n||(n=_s()),!n)throw Re.create("no-options");const c=ii.get(o);if(c){if(Et(n,c.options)&&Et(r,c.config))return c;throw Re.create("duplicate-app",{appName:o})}const l=new Ja(o);for(const y of nn.values())l.addComponent(y);const f=new Bc(n,r,l);return ii.set(o,f),f}function ln(i=tn){const e=ii.get(i);if(!e&&i===tn&&_s())return Rs();if(!e)throw Re.create("no-app",{appName:i});return e}function te(i,e,n){var r;let o=(r=Fc[i])!==null&&r!==void 0?r:i;n&&(o+=`-${n}`);const c=o.match(/\s|\//),l=e.match(/\s|\//);if(c||l){const f=[`Unable to register library "${o}" with version "${e}":`];c&&f.push(`library name "${o}" contains illegal characters (whitespace or "/")`),c&&l&&f.push("and"),l&&f.push(`version name "${e}" contains illegal characters (whitespace or "/")`),ve.warn(f.join(" "));return}he(new se(`${o}-version`,()=>({library:o,version:e}),"VERSION"))}/**
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
*/const Vc="firebase-heartbeat-database",zc=1,St="firebase-heartbeat-store";let qi=null;function Ns(){return qi||(qi=Os(Vc,zc,{upgrade:(i,e)=>{switch(e){case 0:try{i.createObjectStore(St)}catch(n){console.warn(n)}}}}).catch(i=>{throw Re.create("idb-open",{originalErrorMessage:i.message})})),qi}async function qc(i){try{const e=(await Ns()).transaction(St),n=await e.objectStore(St).get(Ds(i));return await e.done,n}catch(e){if(e instanceof oe)ve.warn(e.message);else{const n=Re.create("idb-get",{originalErrorMessage:e?.message});ve.warn(n.message)}}}async function Ur(i,e){try{const n=(await Ns()).transaction(St,"readwrite");await n.objectStore(St).put(e,Ds(i)),await n.done}catch(n){if(n instanceof oe)ve.warn(n.message);else{const r=Re.create("idb-set",{originalErrorMessage:n?.message});ve.warn(r.message)}}}function Ds(i){return`${i.name}!${i.options.appId}`}/**
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
*/const Kc=1024,Wc=30*24*60*60*1e3;class Gc{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Xc(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=jr();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(c=>c.date===o)?void 0:(this._heartbeatsCache.heartbeats.push({date:o,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(c=>{const l=new Date(c.date).valueOf();return Date.now()-l<=Wc}),this._storage.overwrite(this._heartbeatsCache))}catch(r){ve.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=jr(),{heartbeatsToSend:r,unsentEntries:o}=Jc(this._heartbeatsCache.heartbeats),c=ti(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),c}catch(n){return ve.warn(n),""}}}function jr(){return new Date().toISOString().substring(0,10)}function Jc(i,e=Kc){const n=[];let r=i.slice();for(const o of i){const c=n.find(l=>l.agent===o.agent);if(c){if(c.dates.push(o.date),xr(n)>e){c.dates.pop();break}}else if(n.push({agent:o.agent,dates:[o.date]}),xr(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Xc{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return ks()?As().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await qc(this.app);return e?.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return Ur(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return Ur(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function xr(i){return ti(JSON.stringify({version:2,heartbeats:i})).length}/**
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
*/function Yc(i){he(new se("platform-logger",e=>new lc(e),"PRIVATE")),he(new se("heartbeat",e=>new Gc(e),"PRIVATE")),te(en,Lr,i),te(en,Lr,"esm2017"),te("fire-js","")}Yc("");var Qc="firebase",Zc="10.14.1";/**
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
*/te(Qc,Zc,"app");const Ls="@firebase/installations",un="0.6.9";/**
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
*/const Ms=1e4,Us=`w:${un}`,js="FIS_v2",eh="https://firebaseinstallations.googleapis.com/v1",th=60*60*1e3,ih="installations",nh="Installations";/**
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
*/const rh={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},He=new Ve(ih,nh,rh);function xs(i){return i instanceof oe&&i.code.includes("request-failed")}/**
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
*/function Fs({projectId:i}){return`${eh}/projects/${i}/installations`}function Hs(i){return{token:i.token,requestStatus:2,expiresIn:oh(i.expiresIn),creationTime:Date.now()}}async function $s(i,e){const n=(await e.json()).error;return He.create("request-failed",{requestName:i,serverCode:n.code,serverMessage:n.message,serverStatus:n.status})}function Bs({apiKey:i}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":i})}function sh(i,{refreshToken:e}){const n=Bs(i);return n.append("Authorization",ah(e)),n}async function Vs(i){const e=await i();return e.status>=500&&e.status<600?i():e}function oh(i){return Number(i.replace("s","000"))}function ah(i){return`${js} ${i}`}/**
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
*/async function ch({appConfig:i,heartbeatServiceProvider:e},{fid:n}){const r=Fs(i),o=Bs(i),c=e.getImmediate({optional:!0});if(c){const T=await c.getHeartbeatsHeader();T&&o.append("x-firebase-client",T)}const l={fid:n,authVersion:js,appId:i.appId,sdkVersion:Us},f={method:"POST",headers:o,body:JSON.stringify(l)},y=await Vs(()=>fetch(r,f));if(y.ok){const T=await y.json();return{fid:T.fid||n,registrationStatus:2,refreshToken:T.refreshToken,authToken:Hs(T.authToken)}}else throw await $s("Create Installation",y)}/**
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
*/function zs(i){return new Promise(e=>{setTimeout(e,i)})}/**
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
*/function hh(i){return btoa(String.fromCharCode(...i)).replace(/\+/g,"-").replace(/\//g,"_")}/**
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
*/const lh=/^[cdef][\w-]{21}$/,rn="";function uh(){try{const i=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(i),i[0]=112+i[0]%16;const e=dh(i);return lh.test(e)?e:rn}catch{return rn}}function dh(i){return hh(i).substr(0,22)}/**
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
*/function di(i){return`${i.appName}!${i.appId}`}/**
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
*/const qs=new Map;function Ks(i,e){const n=di(i);Ws(n,e),ph(n,e)}function Ws(i,e){const n=qs.get(i);if(n)for(const r of n)r(e)}function ph(i,e){const n=fh();n&&n.postMessage({key:i,fid:e}),gh()}let xe=null;function fh(){return!xe&&"BroadcastChannel"in self&&(xe=new BroadcastChannel("[Firebase] FID Change"),xe.onmessage=i=>{Ws(i.data.key,i.data.fid)}),xe}function gh(){qs.size===0&&xe&&(xe.close(),xe=null)}/**
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
*/const mh="firebase-installations-database",vh=1,$e="firebase-installations-store";let Ki=null;function dn(){return Ki||(Ki=Os(mh,vh,{upgrade:(i,e)=>{switch(e){case 0:i.createObjectStore($e)}}})),Ki}async function ni(i,e){const n=di(i),r=(await dn()).transaction($e,"readwrite"),o=r.objectStore($e),c=await o.get(n);return await o.put(e,n),await r.done,(!c||c.fid!==e.fid)&&Ks(i,e.fid),e}async function Gs(i){const e=di(i),n=(await dn()).transaction($e,"readwrite");await n.objectStore($e).delete(e),await n.done}async function pi(i,e){const n=di(i),r=(await dn()).transaction($e,"readwrite"),o=r.objectStore($e),c=await o.get(n),l=e(c);return l===void 0?await o.delete(n):await o.put(l,n),await r.done,l&&(!c||c.fid!==l.fid)&&Ks(i,l.fid),l}/**
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
*/async function pn(i){let e;const n=await pi(i.appConfig,r=>{const o=yh(r),c=wh(i,o);return e=c.registrationPromise,c.installationEntry});return n.fid===rn?{installationEntry:await e}:{installationEntry:n,registrationPromise:e}}function yh(i){const e=i||{fid:uh(),registrationStatus:0};return Js(e)}function wh(i,e){if(e.registrationStatus===0){if(!navigator.onLine){const o=Promise.reject(He.create("app-offline"));return{installationEntry:e,registrationPromise:o}}const n={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=bh(i,n);return{installationEntry:n,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:Ih(i)}:{installationEntry:e}}async function bh(i,e){try{const n=await ch(i,e);return ni(i.appConfig,n)}catch(n){throw xs(n)&&n.customData.serverCode===409?await Gs(i.appConfig):await ni(i.appConfig,{fid:e.fid,registrationStatus:0}),n}}async function Ih(i){let e=await Fr(i.appConfig);for(;e.registrationStatus===1;)await zs(100),e=await Fr(i.appConfig);if(e.registrationStatus===0){const{installationEntry:n,registrationPromise:r}=await pn(i);return r||n}return e}function Fr(i){return pi(i,e=>{if(!e)throw He.create("installation-not-found");return Js(e)})}function Js(i){return Th(i)?{fid:i.fid,registrationStatus:0}:i}function Th(i){return i.registrationStatus===1&&i.registrationTime+Ms<Date.now()}/**
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
*/async function _h({appConfig:i,heartbeatServiceProvider:e},n){const r=Eh(i,n),o=sh(i,n),c=e.getImmediate({optional:!0});if(c){const T=await c.getHeartbeatsHeader();T&&o.append("x-firebase-client",T)}const l={installation:{sdkVersion:Us,appId:i.appId}},f={method:"POST",headers:o,body:JSON.stringify(l)},y=await Vs(()=>fetch(r,f));if(y.ok){const T=await y.json();return Hs(T)}else throw await $s("Generate Auth Token",y)}function Eh(i,{fid:e}){return`${Fs(i)}/${e}/authTokens:generate`}/**
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
*/async function fn(i,e=!1){let n;const r=await pi(i.appConfig,o=>{if(!Xs(o))throw He.create("not-registered");const c=o.authToken;if(!e&&Ah(c))return o;if(c.requestStatus===1)return n=Sh(i,e),o;{if(!navigator.onLine)throw He.create("app-offline");const l=Ph(o);return n=kh(i,l),l}});return n?await n:r.authToken}async function Sh(i,e){let n=await Hr(i.appConfig);for(;n.authToken.requestStatus===1;)await zs(100),n=await Hr(i.appConfig);const r=n.authToken;return r.requestStatus===0?fn(i,e):r}function Hr(i){return pi(i,e=>{if(!Xs(e))throw He.create("not-registered");const n=e.authToken;return Oh(n)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function kh(i,e){try{const n=await _h(i,e),r=Object.assign(Object.assign({},e),{authToken:n});return await ni(i.appConfig,r),n}catch(n){if(xs(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await Gs(i.appConfig);else{const r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await ni(i.appConfig,r)}throw n}}function Xs(i){return i!==void 0&&i.registrationStatus===2}function Ah(i){return i.requestStatus===2&&!Ch(i)}function Ch(i){const e=Date.now();return e<i.creationTime||i.creationTime+i.expiresIn<e+th}function Ph(i){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},i),{authToken:e})}function Oh(i){return i.requestStatus===1&&i.requestTime+Ms<Date.now()}/**
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
*/async function Rh(i){const e=i,{installationEntry:n,registrationPromise:r}=await pn(e);return r?r.catch(console.error):fn(e).catch(console.error),n.fid}/**
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
*/async function Nh(i,e=!1){const n=i;return await Dh(n),(await fn(n,e)).token}async function Dh(i){const{registrationPromise:e}=await pn(i);e&&await e}/**
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
*/function Lh(i){if(!i||!i.options)throw Wi("App Configuration");if(!i.name)throw Wi("App Name");const e=["projectId","apiKey","appId"];for(const n of e)if(!i.options[n])throw Wi(n);return{appName:i.name,projectId:i.options.projectId,apiKey:i.options.apiKey,appId:i.options.appId}}function Wi(i){return He.create("missing-app-config-values",{valueName:i})}/**
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
*/const Ys="installations",Mh="installations-internal",Uh=i=>{const e=i.getProvider("app").getImmediate(),n=Lh(e),r=ze(e,"heartbeat");return{app:e,appConfig:n,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},jh=i=>{const e=i.getProvider("app").getImmediate(),n=ze(e,Ys).getImmediate();return{getId:()=>Rh(n),getToken:r=>Nh(n,r)}};function xh(){he(new se(Ys,Uh,"PUBLIC")),he(new se(Mh,jh,"PRIVATE"))}xh();te(Ls,un);te(Ls,un,"esm2017");/**
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
*/const ri="analytics",Fh="firebase_id",Hh="origin",$h=60*1e3,Bh="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",gn="https://www.googletagmanager.com/gtag/js";/**
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
*/const Y=new ui("@firebase/analytics");/**
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
*/const Vh={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},Z=new Ve("analytics","Analytics",Vh);/**
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
*/function zh(i){if(!i.startsWith(gn)){const e=Z.create("invalid-gtag-resource",{gtagURL:i});return Y.warn(e.message),""}return i}function Qs(i){return Promise.all(i.map(e=>e.catch(n=>n)))}function qh(i,e){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(i,e)),n}function Kh(i,e){const n=qh("firebase-js-sdk-policy",{createScriptURL:zh}),r=document.createElement("script"),o=`${gn}?l=${i}&id=${e}`;r.src=n?n?.createScriptURL(o):o,r.async=!0,document.head.appendChild(r)}function Wh(i){let e=[];return Array.isArray(window[i])?e=window[i]:window[i]=e,e}async function Gh(i,e,n,r,o,c){const l=r[o];try{if(l)await e[l];else{const f=(await Qs(n)).find(y=>y.measurementId===o);f&&await e[f.appId]}}catch(f){Y.error(f)}i("config",o,c)}async function Jh(i,e,n,r,o){try{let c=[];if(o&&o.send_to){let l=o.send_to;Array.isArray(l)||(l=[l]);const f=await Qs(n);for(const y of l){const T=f.find(k=>k.measurementId===y),S=T&&e[T.appId];if(S)c.push(S);else{c=[];break}}}c.length===0&&(c=Object.values(e)),await Promise.all(c),i("event",r,o||{})}catch(c){Y.error(c)}}function Xh(i,e,n,r){async function o(c,...l){try{if(c==="event"){const[f,y]=l;await Jh(i,e,n,f,y)}else if(c==="config"){const[f,y]=l;await Gh(i,e,n,r,f,y)}else if(c==="consent"){const[f,y]=l;i("consent",f,y)}else if(c==="get"){const[f,y,T]=l;i("get",f,y,T)}else if(c==="set"){const[f]=l;i("set",f)}else i(c,...l)}catch(f){Y.error(f)}}return o}function Yh(i,e,n,r,o){let c=function(...l){window[r].push(arguments)};return window[o]&&typeof window[o]=="function"&&(c=window[o]),window[o]=Xh(c,i,e,n),{gtagCore:c,wrappedGtag:window[o]}}function Qh(i){const e=window.document.getElementsByTagName("script");for(const n of Object.values(e))if(n.src&&n.src.includes(gn)&&n.src.includes(i))return n;return null}/**
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
*/const Zh=30,el=1e3;class tl{constructor(e={},n=el){this.throttleMetadata=e,this.intervalMillis=n}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,n){this.throttleMetadata[e]=n}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const Zs=new tl;function il(i){return new Headers({Accept:"application/json","x-goog-api-key":i})}async function nl(i){var e;const{appId:n,apiKey:r}=i,o={method:"GET",headers:il(r)},c=Bh.replace("{app-id}",n),l=await fetch(c,o);if(l.status!==200&&l.status!==304){let f="";try{const y=await l.json();!((e=y.error)===null||e===void 0)&&e.message&&(f=y.error.message)}catch{}throw Z.create("config-fetch-failed",{httpStatus:l.status,responseMessage:f})}return l.json()}async function rl(i,e=Zs,n){const{appId:r,apiKey:o,measurementId:c}=i.options;if(!r)throw Z.create("no-app-id");if(!o){if(c)return{measurementId:c,appId:r};throw Z.create("no-api-key")}const l=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},f=new al;return setTimeout(async()=>{f.abort()},$h),eo({appId:r,apiKey:o,measurementId:c},l,f,e)}async function eo(i,{throttleEndTimeMillis:e,backoffCount:n},r,o=Zs){var c;const{appId:l,measurementId:f}=i;try{await sl(r,e)}catch(y){if(f)return Y.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${f} provided in the "measurementId" field in the local Firebase config. [${y?.message}]`),{appId:l,measurementId:f};throw y}try{const y=await nl(i);return o.deleteThrottleMetadata(l),y}catch(y){const T=y;if(!ol(T)){if(o.deleteThrottleMetadata(l),f)return Y.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${f} provided in the "measurementId" field in the local Firebase config. [${T?.message}]`),{appId:l,measurementId:f};throw y}const S=Number((c=T?.customData)===null||c===void 0?void 0:c.httpStatus)===503?Or(n,o.intervalMillis,Zh):Or(n,o.intervalMillis),k={throttleEndTimeMillis:Date.now()+S,backoffCount:n+1};return o.setThrottleMetadata(l,k),Y.debug(`Calling attemptFetch again in ${S} millis`),eo(i,k,r,o)}}function sl(i,e){return new Promise((n,r)=>{const o=Math.max(e-Date.now(),0),c=setTimeout(n,o);i.addEventListener(()=>{clearTimeout(c),r(Z.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function ol(i){if(!(i instanceof oe)||!i.customData)return!1;const e=Number(i.customData.httpStatus);return e===429||e===500||e===503||e===504}class al{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function cl(i,e,n,r,o){if(o&&o.global){i("event",n,r);return}else{const c=await e,l=Object.assign(Object.assign({},r),{send_to:c});i("event",n,l)}}/**
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
*/async function hl(){if(ks())try{await As()}catch(i){return Y.warn(Z.create("indexeddb-unavailable",{errorInfo:i?.toString()}).message),!1}else return Y.warn(Z.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function ll(i,e,n,r,o,c,l){var f;const y=rl(i);y.then(L=>{n[L.measurementId]=L.appId,i.options.measurementId&&L.measurementId!==i.options.measurementId&&Y.warn(`The measurement ID in the local Firebase config (${i.options.measurementId}) does not match the measurement ID fetched from the server (${L.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(L=>Y.error(L)),e.push(y);const T=hl().then(L=>{if(L)return r.getId()}),[S,k]=await Promise.all([y,T]);Qh(c)||Kh(c,S.measurementId),o("js",new Date);const A=(f=l?.config)!==null&&f!==void 0?f:{};return A[Hh]="firebase",A.update=!0,k!=null&&(A[Fh]=k),o("config",S.measurementId,A),S.measurementId}/**
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
*/class ul{constructor(e){this.app=e}_delete(){return delete bt[this.app.options.appId],Promise.resolve()}}let bt={},$r=[];const Br={};let Gi="dataLayer",dl="gtag",Vr,to,zr=!1;function pl(){const i=[];if(Ss()&&i.push("This is a browser extension environment."),La()||i.push("Cookies are not available."),i.length>0){const e=i.map((r,o)=>`(${o+1}) ${r}`).join(" "),n=Z.create("invalid-analytics-context",{errorInfo:e});Y.warn(n.message)}}function fl(i,e,n){pl();const r=i.options.appId;if(!r)throw Z.create("no-app-id");if(!i.options.apiKey)if(i.options.measurementId)Y.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${i.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw Z.create("no-api-key");if(bt[r]!=null)throw Z.create("already-exists",{id:r});if(!zr){Wh(Gi);const{wrappedGtag:o,gtagCore:c}=Yh(bt,$r,Br,Gi,dl);to=o,Vr=c,zr=!0}return bt[r]=ll(i,$r,Br,e,Vr,Gi,n),new ul(i)}function gl(i=ln()){i=Ne(i);const e=ze(i,ri);return e.isInitialized()?e.getImmediate():ml(i)}function ml(i,e={}){const n=ze(i,ri);if(n.isInitialized()){const r=n.getImmediate();if(Et(e,n.getOptions()))return r;throw Z.create("already-initialized")}return n.initialize({options:e})}function vl(i,e,n,r){i=Ne(i),cl(to,bt[i.app.options.appId],e,n,r).catch(o=>Y.error(o))}const qr="@firebase/analytics",Kr="0.10.8";function yl(){he(new se(ri,(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),o=e.getProvider("installations-internal").getImmediate();return fl(r,o,n)},"PUBLIC")),he(new se("analytics-internal",i,"PRIVATE")),te(qr,Kr),te(qr,Kr,"esm2017");function i(e){try{const n=e.getProvider(ri).getImmediate();return{logEvent:(r,o,c)=>vl(n,r,o,c)}}catch(n){throw Z.create("interop-component-reg-failed",{reason:n})}}}yl();function mn(i,e){var n={};for(var r in i)Object.prototype.hasOwnProperty.call(i,r)&&e.indexOf(r)<0&&(n[r]=i[r]);if(i!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,r=Object.getOwnPropertySymbols(i);o<r.length;o++)e.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(i,r[o])&&(n[r[o]]=i[r[o]]);return n}function io(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const wl=io,no=new Ve("auth","Firebase",io());/**
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
*/const si=new ui("@firebase/auth");function bl(i,...e){si.logLevel<=O.WARN&&si.warn(`Auth (${it}): ${i}`,...e)}function Yt(i,...e){si.logLevel<=O.ERROR&&si.error(`Auth (${it}): ${i}`,...e)}/**
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
*/function ye(i,...e){throw vn(i,...e)}function ae(i,...e){return vn(i,...e)}function ro(i,e,n){const r=Object.assign(Object.assign({},wl()),{[e]:n});return new Ve("auth","Firebase",r).create(e,{appName:i.name})}function Fe(i){return ro(i,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function vn(i,...e){if(typeof i!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=i.name),i._errorFactory.create(n,...r)}return no.create(i,...e)}function E(i,e,...n){if(!i)throw vn(e,...n)}function fe(i){const e="INTERNAL ASSERTION FAILED: "+i;throw Yt(e),new Error(e)}function we(i,e){i||fe(e)}/**
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
*/function sn(){var i;return typeof self<"u"&&((i=self.location)===null||i===void 0?void 0:i.href)||""}function Il(){return Wr()==="http:"||Wr()==="https:"}function Wr(){var i;return typeof self<"u"&&((i=self.location)===null||i===void 0?void 0:i.protocol)||null}/**
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
*/function Tl(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Il()||Ss()||"connection"in navigator)?navigator.onLine:!0}function _l(){if(typeof navigator>"u")return null;const i=navigator;return i.languages&&i.languages[0]||i.language||null}/**
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
*/class Pt{constructor(e,n){this.shortDelay=e,this.longDelay=n,we(n>e,"Short delay should be less than long delay!"),this.isMobile=Oa()||Na()}get(){return Tl()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
*/function yn(i,e){we(i.emulator,"Emulator should always be set here");const{url:n}=i.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
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
*/class so{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;fe("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;fe("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;fe("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
*/const El={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
*/const Sl=new Pt(3e4,6e4);function wn(i,e){return i.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:i.tenantId}):e}async function nt(i,e,n,r,o={}){return oo(i,o,async()=>{let c={},l={};r&&(e==="GET"?l=r:c={body:JSON.stringify(r)});const f=Ct(Object.assign({key:i.config.apiKey},l)).slice(1),y=await i._getAdditionalHeaders();y["Content-Type"]="application/json",i.languageCode&&(y["X-Firebase-Locale"]=i.languageCode);const T=Object.assign({method:e,headers:y},c);return Ra()||(T.referrerPolicy="no-referrer"),so.fetch()(ao(i,i.config.apiHost,n,f),T)})}async function oo(i,e,n){i._canInitEmulator=!1;const r=Object.assign(Object.assign({},El),e);try{const o=new Al(i),c=await Promise.race([n(),o.promise]);o.clearNetworkTimeout();const l=await c.json();if("needConfirmation"in l)throw Jt(i,"account-exists-with-different-credential",l);if(c.ok&&!("errorMessage"in l))return l;{const f=c.ok?l.errorMessage:l.error.message,[y,T]=f.split(" : ");if(y==="FEDERATED_USER_ID_ALREADY_LINKED")throw Jt(i,"credential-already-in-use",l);if(y==="EMAIL_EXISTS")throw Jt(i,"email-already-in-use",l);if(y==="USER_DISABLED")throw Jt(i,"user-disabled",l);const S=r[y]||y.toLowerCase().replace(/[_\s]+/g,"-");if(T)throw ro(i,S,T);ye(i,S)}}catch(o){if(o instanceof oe)throw o;ye(i,"network-request-failed",{message:String(o)})}}async function kl(i,e,n,r,o={}){const c=await nt(i,e,n,r,o);return"mfaPendingCredential"in c&&ye(i,"multi-factor-auth-required",{_serverResponse:c}),c}function ao(i,e,n,r){const o=`${e}${n}?${r}`;return i.config.emulator?yn(i.config,o):`${i.config.apiScheme}://${o}`}class Al{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(ae(this.auth,"network-request-failed")),Sl.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Jt(i,e,n){const r={appName:i.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const o=ae(i,e,r);return o.customData._tokenResponse=n,o}/**
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
*/async function Cl(i,e){return nt(i,"POST","/v1/accounts:delete",e)}async function co(i,e){return nt(i,"POST","/v1/accounts:lookup",e)}/**
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
*/function It(i){if(i)try{const e=new Date(Number(i));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Pl(i,e=!1){const n=Ne(i),r=await n.getIdToken(e),o=bn(r);E(o&&o.exp&&o.auth_time&&o.iat,n.auth,"internal-error");const c=typeof o.firebase=="object"?o.firebase:void 0,l=c?.sign_in_provider;return{claims:o,token:r,authTime:It(Ji(o.auth_time)),issuedAtTime:It(Ji(o.iat)),expirationTime:It(Ji(o.exp)),signInProvider:l||null,signInSecondFactor:c?.sign_in_second_factor||null}}function Ji(i){return Number(i)*1e3}function bn(i){const[e,n,r]=i.split(".");if(e===void 0||n===void 0||r===void 0)return Yt("JWT malformed, contained fewer than 3 sections"),null;try{const o=Is(n);return o?JSON.parse(o):(Yt("Failed to decode base64 JWT payload"),null)}catch(o){return Yt("Caught error parsing JWT payload as JSON",o?.toString()),null}}function Gr(i){const e=bn(i);return E(e,"internal-error"),E(typeof e.exp<"u","internal-error"),E(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
*/async function kt(i,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof oe&&Ol(r)&&i.auth.currentUser===i&&await i.auth.signOut(),r}}function Ol({code:i}){return i==="auth/user-disabled"||i==="auth/user-token-expired"}/**
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
*/class Rl{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const r=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
*/class on{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=It(this.lastLoginAt),this.creationTime=It(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
*/async function oi(i){var e;const n=i.auth,r=await i.getIdToken(),o=await kt(i,co(n,{idToken:r}));E(o?.users.length,n,"internal-error");const c=o.users[0];i._notifyReloadListener(c);const l=!((e=c.providerUserInfo)===null||e===void 0)&&e.length?ho(c.providerUserInfo):[],f=Dl(i.providerData,l),y=i.isAnonymous,T=!(i.email&&c.passwordHash)&&!f?.length,S=y?T:!1,k={uid:c.localId,displayName:c.displayName||null,photoURL:c.photoUrl||null,email:c.email||null,emailVerified:c.emailVerified||!1,phoneNumber:c.phoneNumber||null,tenantId:c.tenantId||null,providerData:f,metadata:new on(c.createdAt,c.lastLoginAt),isAnonymous:S};Object.assign(i,k)}async function Nl(i){const e=Ne(i);await oi(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Dl(i,e){return[...i.filter(n=>!e.some(r=>r.providerId===n.providerId)),...e]}function ho(i){return i.map(e=>{var{providerId:n}=e,r=mn(e,["providerId"]);return{providerId:n,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
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
*/async function Ll(i,e){const n=await oo(i,{},async()=>{const r=Ct({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:o,apiKey:c}=i.config,l=ao(i,o,"/v1/token",`key=${c}`),f=await i._getAdditionalHeaders();return f["Content-Type"]="application/x-www-form-urlencoded",so.fetch()(l,{method:"POST",headers:f,body:r})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Ml(i,e){return nt(i,"POST","/v2/accounts:revokeToken",wn(i,e))}/**
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
*/class Ye{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){E(e.idToken,"internal-error"),E(typeof e.idToken<"u","internal-error"),E(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Gr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){E(e.length!==0,"internal-error");const n=Gr(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(E(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:o,expiresIn:c}=await Ll(e,n);this.updateTokensAndExpiration(r,o,Number(c))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:o,expirationTime:c}=n,l=new Ye;return r&&(E(typeof r=="string","internal-error",{appName:e}),l.refreshToken=r),o&&(E(typeof o=="string","internal-error",{appName:e}),l.accessToken=o),c&&(E(typeof c=="number","internal-error",{appName:e}),l.expirationTime=c),l}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Ye,this.toJSON())}_performRefresh(){return fe("not implemented")}}/**
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
*/function Ee(i,e){E(typeof i=="string"||typeof i>"u","internal-error",{appName:e})}class ge{constructor(e){var{uid:n,auth:r,stsTokenManager:o}=e,c=mn(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Rl(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=r,this.stsTokenManager=o,this.accessToken=o.accessToken,this.displayName=c.displayName||null,this.email=c.email||null,this.emailVerified=c.emailVerified||!1,this.phoneNumber=c.phoneNumber||null,this.photoURL=c.photoURL||null,this.isAnonymous=c.isAnonymous||!1,this.tenantId=c.tenantId||null,this.providerData=c.providerData?[...c.providerData]:[],this.metadata=new on(c.createdAt||void 0,c.lastLoginAt||void 0)}async getIdToken(e){const n=await kt(this,this.stsTokenManager.getToken(this.auth,e));return E(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return Pl(this,e)}reload(){return Nl(this)}_assign(e){this!==e&&(E(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new ge(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){E(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await oi(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Pe(this.auth.app))return Promise.reject(Fe(this.auth));const e=await this.getIdToken();return await kt(this,Cl(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var r,o,c,l,f,y,T,S;const k=(r=n.displayName)!==null&&r!==void 0?r:void 0,A=(o=n.email)!==null&&o!==void 0?o:void 0,L=(c=n.phoneNumber)!==null&&c!==void 0?c:void 0,P=(l=n.photoURL)!==null&&l!==void 0?l:void 0,j=(f=n.tenantId)!==null&&f!==void 0?f:void 0,M=(y=n._redirectEventId)!==null&&y!==void 0?y:void 0,le=(T=n.createdAt)!==null&&T!==void 0?T:void 0,Q=(S=n.lastLoginAt)!==null&&S!==void 0?S:void 0,{uid:F,emailVerified:ie,isAnonymous:De,providerData:W,stsTokenManager:v}=n;E(F&&v,e,"internal-error");const u=Ye.fromJSON(this.name,v);E(typeof F=="string",e,"internal-error"),Ee(k,e.name),Ee(A,e.name),E(typeof ie=="boolean",e,"internal-error"),E(typeof De=="boolean",e,"internal-error"),Ee(L,e.name),Ee(P,e.name),Ee(j,e.name),Ee(M,e.name),Ee(le,e.name),Ee(Q,e.name);const p=new ge({uid:F,auth:e,email:A,emailVerified:ie,displayName:k,isAnonymous:De,photoURL:P,phoneNumber:L,tenantId:j,stsTokenManager:u,createdAt:le,lastLoginAt:Q});return W&&Array.isArray(W)&&(p.providerData=W.map(g=>Object.assign({},g))),M&&(p._redirectEventId=M),p}static async _fromIdTokenResponse(e,n,r=!1){const o=new Ye;o.updateFromServerResponse(n);const c=new ge({uid:n.localId,auth:e,stsTokenManager:o,isAnonymous:r});return await oi(c),c}static async _fromGetAccountInfoResponse(e,n,r){const o=n.users[0];E(o.localId!==void 0,"internal-error");const c=o.providerUserInfo!==void 0?ho(o.providerUserInfo):[],l=!(o.email&&o.passwordHash)&&!c?.length,f=new Ye;f.updateFromIdToken(r);const y=new ge({uid:o.localId,auth:e,stsTokenManager:f,isAnonymous:l}),T={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:c,metadata:new on(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!c?.length};return Object.assign(y,T),y}}/**
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
*/const Jr=new Map;function me(i){we(i instanceof Function,"Expected a class definition");let e=Jr.get(i);return e?(we(e instanceof i,"Instance stored in cache mismatched with class"),e):(e=new i,Jr.set(i,e),e)}/**
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
*/class lo{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}lo.type="NONE";const Xr=lo;/**
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
*/function Qt(i,e,n){return`firebase:${i}:${e}:${n}`}class Qe{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:o,name:c}=this.auth;this.fullUserKey=Qt(this.userKey,o.apiKey,c),this.fullPersistenceKey=Qt("persistence",o.apiKey,c),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?ge._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new Qe(me(Xr),e,r);const o=(await Promise.all(n.map(async T=>{if(await T._isAvailable())return T}))).filter(T=>T);let c=o[0]||me(Xr);const l=Qt(r,e.config.apiKey,e.name);let f=null;for(const T of n)try{const S=await T._get(l);if(S){const k=ge._fromJSON(e,S);T!==c&&(f=k),c=T;break}}catch{}const y=o.filter(T=>T._shouldAllowMigration);return!c._shouldAllowMigration||!y.length?new Qe(c,e,r):(c=y[0],f&&await c._set(l,f.toJSON()),await Promise.all(n.map(async T=>{if(T!==c)try{await T._remove(l)}catch{}})),new Qe(c,e,r))}}/**
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
*/function Yr(i){const e=i.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(go(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(uo(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(vo(e))return"Blackberry";if(yo(e))return"Webos";if(po(e))return"Safari";if((e.includes("chrome/")||fo(e))&&!e.includes("edge/"))return"Chrome";if(mo(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=i.match(n);if(r?.length===2)return r[1]}return"Other"}function uo(i=K()){return/firefox\//i.test(i)}function po(i=K()){const e=i.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function fo(i=K()){return/crios\//i.test(i)}function go(i=K()){return/iemobile/i.test(i)}function mo(i=K()){return/android/i.test(i)}function vo(i=K()){return/blackberry/i.test(i)}function yo(i=K()){return/webos/i.test(i)}function In(i=K()){return/iphone|ipad|ipod/i.test(i)||/macintosh/i.test(i)&&/mobile/i.test(i)}function Ul(i=K()){var e;return In(i)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function jl(){return Da()&&document.documentMode===10}function wo(i=K()){return In(i)||mo(i)||yo(i)||vo(i)||/windows phone/i.test(i)||go(i)}/**
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
*/function bo(i,e=[]){let n;switch(i){case"Browser":n=Yr(K());break;case"Worker":n=`${Yr(K())}-${i}`;break;default:n=i}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${it}/${r}`}/**
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
*/class xl{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=c=>new Promise((l,f)=>{try{const y=e(c);l(y)}catch(y){f(y)}});r.onAbort=n,this.queue.push(r);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const o of n)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r?.message})}}}/**
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
*/async function Fl(i,e={}){return nt(i,"GET","/v2/passwordPolicy",wn(i,e))}/**
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
*/const Hl=6;class $l{constructor(e){var n,r,o,c;const l=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=l.minPasswordLength)!==null&&n!==void 0?n:Hl,l.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=l.maxPasswordLength),l.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=l.containsLowercaseCharacter),l.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=l.containsUppercaseCharacter),l.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=l.containsNumericCharacter),l.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=l.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(o=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&o!==void 0?o:"",this.forceUpgradeOnSignin=(c=e.forceUpgradeOnSignin)!==null&&c!==void 0?c:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,r,o,c,l,f;const y={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,y),this.validatePasswordCharacterOptions(e,y),y.isValid&&(y.isValid=(n=y.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),y.isValid&&(y.isValid=(r=y.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),y.isValid&&(y.isValid=(o=y.containsLowercaseLetter)!==null&&o!==void 0?o:!0),y.isValid&&(y.isValid=(c=y.containsUppercaseLetter)!==null&&c!==void 0?c:!0),y.isValid&&(y.isValid=(l=y.containsNumericCharacter)!==null&&l!==void 0?l:!0),y.isValid&&(y.isValid=(f=y.containsNonAlphanumericCharacter)!==null&&f!==void 0?f:!0),y}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),o&&(n.meetsMaxPasswordLength=e.length<=o)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let o=0;o<e.length;o++)r=e.charAt(o),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,o,c){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=c))}}/**
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
*/class Bl{constructor(e,n,r,o){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Qr(this),this.idTokenSubscription=new Qr(this),this.beforeStateQueue=new xl(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=no,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=o.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=me(n)),this._initializationPromise=this.queue(async()=>{var r,o;if(!this._deleted&&(this.persistenceManager=await Qe.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((o=this.currentUser)===null||o===void 0?void 0:o.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await co(this,{idToken:e}),r=await ge._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(Pe(this.app)){const l=this.app.settings.authIdToken;return l?new Promise(f=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(l).then(f,f))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let o=r,c=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const l=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,f=o?._redirectEventId,y=await this.tryRedirectSignIn(e);(!l||l===f)&&y?.user&&(o=y.user,c=!0)}if(!o)return this.directlySetCurrentUser(null);if(!o._redirectEventId){if(c)try{await this.beforeStateQueue.runMiddleware(o)}catch(l){o=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(l))}return o?this.reloadAndSetCurrentUserOrClear(o):this.directlySetCurrentUser(null)}return E(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===o._redirectEventId?this.directlySetCurrentUser(o):this.reloadAndSetCurrentUserOrClear(o)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await oi(e)}catch(n){if(n?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=_l()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Pe(this.app))return Promise.reject(Fe(this));const n=e?Ne(e):null;return n&&E(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&E(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Pe(this.app)?Promise.reject(Fe(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Pe(this.app)?Promise.reject(Fe(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(me(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Fl(this),n=new $l(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Ve("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await Ml(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&me(e)||this._popupRedirectResolver;E(n,this,"argument-error"),this.redirectPersistenceManager=await Qe.create(this,[me(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,o){if(this._deleted)return()=>{};const c=typeof n=="function"?n:n.next.bind(n);let l=!1;const f=this._isInitialized?Promise.resolve():this._initializationPromise;if(E(f,this,"internal-error"),f.then(()=>{l||c(this.currentUser)}),typeof n=="function"){const y=e.addObserver(n,r,o);return()=>{l=!0,y()}}else{const y=e.addObserver(n);return()=>{l=!0,y()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return E(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=bo(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(n["X-Firebase-Client"]=r);const o=await this._getAppCheckToken();return o&&(n["X-Firebase-AppCheck"]=o),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n?.error&&bl(`Error while retrieving App Check token: ${n.error}`),n?.token}}function Tn(i){return Ne(i)}class Qr{constructor(e){this.auth=e,this.observer=null,this.addObserver=Fa(n=>this.observer=n)}get next(){return E(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
*/let _n={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Vl(i){_n=i}function zl(i){return _n.loadJS(i)}function ql(){return _n.gapiScript}function Kl(i){return`__${i}${Math.floor(Math.random()*1e6)}`}/**
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
*/function Wl(i,e){const n=ze(i,"auth");if(n.isInitialized()){const r=n.getImmediate(),o=n.getOptions();if(Et(o,e??{}))return r;ye(r,"already-initialized")}return n.initialize({options:e})}function Gl(i,e){const n=e?.persistence||[],r=(Array.isArray(n)?n:[n]).map(me);e?.errorMap&&i._updateErrorMap(e.errorMap),i._initializeWithPersistence(r,e?.popupRedirectResolver)}function Jl(i,e,n){const r=Tn(i);E(r._canInitEmulator,r,"emulator-config-failed"),E(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const o=!1,c=Io(e),{host:l,port:f}=Xl(e),y=f===null?"":`:${f}`;r.config.emulator={url:`${c}//${l}${y}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:l,port:f,protocol:c.replace(":",""),options:Object.freeze({disableWarnings:o})}),Yl()}function Io(i){const e=i.indexOf(":");return e<0?"":i.substr(0,e+1)}function Xl(i){const e=Io(i),n=/(\/\/)?([^?#/]+)/.exec(i.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(r);if(o){const c=o[1];return{host:c,port:Zr(r.substr(c.length+1))}}else{const[c,l]=r.split(":");return{host:c,port:Zr(l)}}}function Zr(i){if(!i)return null;const e=Number(i);return isNaN(e)?null:e}function Yl(){function i(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",i):i())}/**
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
*/class To{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return fe("not implemented")}_getIdTokenResponse(e){return fe("not implemented")}_linkToIdToken(e,n){return fe("not implemented")}_getReauthenticationResolver(e){return fe("not implemented")}}/**
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
*/async function Ze(i,e){return kl(i,"POST","/v1/accounts:signInWithIdp",wn(i,e))}/**
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
*/const Ql="http://localhost";class Be extends To{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Be(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):ye("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:o}=n,c=mn(n,["providerId","signInMethod"]);if(!r||!o)return null;const l=new Be(r,o);return l.idToken=c.idToken||void 0,l.accessToken=c.accessToken||void 0,l.secret=c.secret,l.nonce=c.nonce,l.pendingToken=c.pendingToken||null,l}_getIdTokenResponse(e){const n=this.buildRequest();return Ze(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,Ze(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Ze(e,n)}buildRequest(){const e={requestUri:Ql,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Ct(n)}return e}}/**
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
*/class _o{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
*/class Ot extends _o{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
*/class Se extends Ot{constructor(){super("facebook.com")}static credential(e){return Be._fromParams({providerId:Se.PROVIDER_ID,signInMethod:Se.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Se.credentialFromTaggedObject(e)}static credentialFromError(e){return Se.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Se.credential(e.oauthAccessToken)}catch{return null}}}Se.FACEBOOK_SIGN_IN_METHOD="facebook.com";Se.PROVIDER_ID="facebook.com";/**
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
*/class ke extends Ot{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Be._fromParams({providerId:ke.PROVIDER_ID,signInMethod:ke.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return ke.credentialFromTaggedObject(e)}static credentialFromError(e){return ke.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return ke.credential(n,r)}catch{return null}}}ke.GOOGLE_SIGN_IN_METHOD="google.com";ke.PROVIDER_ID="google.com";/**
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
*/class Ae extends Ot{constructor(){super("github.com")}static credential(e){return Be._fromParams({providerId:Ae.PROVIDER_ID,signInMethod:Ae.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ae.credentialFromTaggedObject(e)}static credentialFromError(e){return Ae.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ae.credential(e.oauthAccessToken)}catch{return null}}}Ae.GITHUB_SIGN_IN_METHOD="github.com";Ae.PROVIDER_ID="github.com";/**
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
*/class Ce extends Ot{constructor(){super("twitter.com")}static credential(e,n){return Be._fromParams({providerId:Ce.PROVIDER_ID,signInMethod:Ce.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Ce.credentialFromTaggedObject(e)}static credentialFromError(e){return Ce.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return Ce.credential(n,r)}catch{return null}}}Ce.TWITTER_SIGN_IN_METHOD="twitter.com";Ce.PROVIDER_ID="twitter.com";/**
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
*/class et{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,o=!1){const c=await ge._fromIdTokenResponse(e,r,o),l=es(r);return new et({user:c,providerId:l,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const o=es(r);return new et({user:e,providerId:o,_tokenResponse:r,operationType:n})}}function es(i){return i.providerId?i.providerId:"phoneNumber"in i?"phone":null}/**
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
*/class ai extends oe{constructor(e,n,r,o){var c;super(n.code,n.message),this.operationType=r,this.user=o,Object.setPrototypeOf(this,ai.prototype),this.customData={appName:e.name,tenantId:(c=e.tenantId)!==null&&c!==void 0?c:void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,o){return new ai(e,n,r,o)}}function Eo(i,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(i):n._getIdTokenResponse(i)).catch(o=>{throw o.code==="auth/multi-factor-auth-required"?ai._fromErrorAndOperation(i,o,e,r):o})}async function Zl(i,e,n=!1){const r=await kt(i,e._linkToIdToken(i.auth,await i.getIdToken()),n);return et._forOperation(i,"link",r)}/**
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
*/async function eu(i,e,n=!1){const{auth:r}=i;if(Pe(r.app))return Promise.reject(Fe(r));const o="reauthenticate";try{const c=await kt(i,Eo(r,o,e,i),n);E(c.idToken,r,"internal-error");const l=bn(c.idToken);E(l,r,"internal-error");const{sub:f}=l;return E(i.uid===f,r,"user-mismatch"),et._forOperation(i,o,c)}catch(c){throw c?.code==="auth/user-not-found"&&ye(r,"user-mismatch"),c}}/**
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
*/async function tu(i,e,n=!1){if(Pe(i.app))return Promise.reject(Fe(i));const r="signIn",o=await Eo(i,r,e),c=await et._fromIdTokenResponse(i,r,o);return n||await i._updateCurrentUser(c.user),c}function iu(i,e,n,r){return Ne(i).onIdTokenChanged(e,n,r)}function nu(i,e,n){return Ne(i).beforeAuthStateChanged(e,n)}const ci="__sak";/**
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
*/class So{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(ci,"1"),this.storage.removeItem(ci),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
*/const ru=1e3,su=10;class ko extends So{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=wo(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),o=this.localCache[n];r!==o&&e(n,o,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((l,f,y)=>{this.notifyListeners(l,y)});return}const r=e.key;n?this.detachListener():this.stopPolling();const o=()=>{const l=this.storage.getItem(r);!n&&this.localCache[r]===l||this.notifyListeners(r,l)},c=this.storage.getItem(r);jl()&&c!==e.newValue&&e.newValue!==e.oldValue?setTimeout(o,su):o()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const o of Array.from(r))o(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},ru)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}ko.type="LOCAL";const ou=ko;/**
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
*/class Ao extends So{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Ao.type="SESSION";const Co=Ao;/**
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
*/function au(i){return Promise.all(i.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
*/class fi{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(o=>o.isListeningto(e));if(n)return n;const r=new fi(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:o,data:c}=n.data,l=this.handlersMap[o];if(!l?.size)return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:o});const f=Array.from(l).map(async T=>T(n.origin,c)),y=await au(f);n.ports[0].postMessage({status:"done",eventId:r,eventType:o,response:y})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}fi.receivers=[];/**
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
*/function En(i="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return i+n}/**
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
*/class cu{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let c,l;return new Promise((f,y)=>{const T=En("",20);o.port1.start();const S=setTimeout(()=>{y(new Error("unsupported_event"))},r);l={messageChannel:o,onMessage(k){const A=k;if(A.data.eventId===T)switch(A.data.status){case"ack":clearTimeout(S),c=setTimeout(()=>{y(new Error("timeout"))},3e3);break;case"done":clearTimeout(c),f(A.data.response);break;default:clearTimeout(S),clearTimeout(c),y(new Error("invalid_response"));break}}},this.handlers.add(l),o.port1.addEventListener("message",l.onMessage),this.target.postMessage({eventType:e,eventId:T,data:n},[o.port2])}).finally(()=>{l&&this.removeMessageHandler(l)})}}/**
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
*/function ce(){return window}function hu(i){ce().location.href=i}/**
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
*/function Po(){return typeof ce().WorkerGlobalScope<"u"&&typeof ce().importScripts=="function"}async function lu(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function uu(){var i;return((i=navigator?.serviceWorker)===null||i===void 0?void 0:i.controller)||null}function du(){return Po()?self:null}/**
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
*/const Oo="firebaseLocalStorageDb",pu=1,hi="firebaseLocalStorage",Ro="fbase_key";class Rt{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function gi(i,e){return i.transaction([hi],e?"readwrite":"readonly").objectStore(hi)}function fu(){const i=indexedDB.deleteDatabase(Oo);return new Rt(i).toPromise()}function an(){const i=indexedDB.open(Oo,pu);return new Promise((e,n)=>{i.addEventListener("error",()=>{n(i.error)}),i.addEventListener("upgradeneeded",()=>{const r=i.result;try{r.createObjectStore(hi,{keyPath:Ro})}catch(o){n(o)}}),i.addEventListener("success",async()=>{const r=i.result;r.objectStoreNames.contains(hi)?e(r):(r.close(),await fu(),e(await an()))})})}async function ts(i,e,n){const r=gi(i,!0).put({[Ro]:e,value:n});return new Rt(r).toPromise()}async function gu(i,e){const n=gi(i,!1).get(e),r=await new Rt(n).toPromise();return r===void 0?null:r.value}function is(i,e){const n=gi(i,!0).delete(e);return new Rt(n).toPromise()}const mu=800,vu=3;class No{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await an(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>vu)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Po()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=fi._getInstance(du()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await lu(),!this.activeServiceWorker)return;this.sender=new cu(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((n=r[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||uu()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await an();return await ts(e,ci,"1"),await is(e,ci),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>ts(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>gu(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>is(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(o=>{const c=gi(o,!1).getAll();return new Rt(c).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:o,value:c}of e)r.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(c)&&(this.notifyListeners(o,c),n.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!r.has(o)&&(this.notifyListeners(o,null),n.push(o));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const o of Array.from(r))o(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),mu)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}No.type="LOCAL";const yu=No;new Pt(3e4,6e4);/**
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
*/function wu(i,e){return e?me(e):(E(i._popupRedirectResolver,i,"argument-error"),i._popupRedirectResolver)}/**
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
*/class Sn extends To{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ze(e,this._buildIdpRequest())}_linkToIdToken(e,n){return Ze(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return Ze(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function bu(i){return tu(i.auth,new Sn(i),i.bypassAuthState)}function Iu(i){const{auth:e,user:n}=i;return E(n,e,"internal-error"),eu(n,new Sn(i),i.bypassAuthState)}async function Tu(i){const{auth:e,user:n}=i;return E(n,e,"internal-error"),Zl(n,new Sn(i),i.bypassAuthState)}/**
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
*/class Do{constructor(e,n,r,o,c=!1){this.auth=e,this.resolver=r,this.user=o,this.bypassAuthState=c,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:o,tenantId:c,error:l,type:f}=e;if(l){this.reject(l);return}const y={auth:this.auth,requestUri:n,sessionId:r,tenantId:c||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(f)(y))}catch(T){this.reject(T)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return bu;case"linkViaPopup":case"linkViaRedirect":return Tu;case"reauthViaPopup":case"reauthViaRedirect":return Iu;default:ye(this.auth,"internal-error")}}resolve(e){we(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){we(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
*/const _u=new Pt(2e3,1e4);class Xe extends Do{constructor(e,n,r,o,c){super(e,n,o,c),this.provider=r,this.authWindow=null,this.pollId=null,Xe.currentPopupAction&&Xe.currentPopupAction.cancel(),Xe.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return E(e,this.auth,"internal-error"),e}async onExecution(){we(this.filter.length===1,"Popup operations only handle one event");const e=En();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(ae(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(ae(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Xe.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if(!((r=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ae(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,_u.get())};e()}}Xe.currentPopupAction=null;/**
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
*/const Eu="pendingRedirect",Zt=new Map;class Su extends Do{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Zt.get(this.auth._key());if(!e){try{const n=await ku(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(n)}catch(n){e=()=>Promise.reject(n)}Zt.set(this.auth._key(),e)}return this.bypassAuthState||Zt.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function ku(i,e){const n=Pu(e),r=Cu(i);if(!await r._isAvailable())return!1;const o=await r._get(n)==="true";return await r._remove(n),o}function Au(i,e){Zt.set(i._key(),e)}function Cu(i){return me(i._redirectPersistence)}function Pu(i){return Qt(Eu,i.config.apiKey,i.name)}async function Ou(i,e,n=!1){if(Pe(i.app))return Promise.reject(Fe(i));const r=Tn(i),o=wu(r,e),c=await new Su(r,o,n).execute();return c&&!n&&(delete c.user._redirectEventId,await r._persistUserIfCurrent(c.user),await r._setRedirectUser(null,e)),c}/**
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
*/const Ru=10*60*1e3;class Nu{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Du(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!Lo(e)){const o=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";n.onError(ae(this.auth,o))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Ru&&this.cachedEventUids.clear(),this.cachedEventUids.has(ns(e))}saveEventToCache(e){this.cachedEventUids.add(ns(e)),this.lastProcessedEventTime=Date.now()}}function ns(i){return[i.type,i.eventId,i.sessionId,i.tenantId].filter(e=>e).join("-")}function Lo({type:i,error:e}){return i==="unknown"&&e?.code==="auth/no-auth-event"}function Du(i){switch(i.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Lo(i);default:return!1}}/**
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
*/async function Lu(i,e={}){return nt(i,"GET","/v1/projects",e)}/**
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
*/const Mu=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Uu=/^https?/;async function ju(i){if(i.config.emulator)return;const{authorizedDomains:e}=await Lu(i);for(const n of e)try{if(xu(n))return}catch{}ye(i,"unauthorized-domain")}function xu(i){const e=sn(),{protocol:n,hostname:r}=new URL(e);if(i.startsWith("chrome-extension://")){const c=new URL(i);return c.hostname===""&&r===""?n==="chrome-extension:"&&i.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&c.hostname===r}if(!Uu.test(n))return!1;if(Mu.test(i))return r===i;const o=i.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(r)}/**
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
*/const Fu=new Pt(3e4,6e4);function rs(){const i=ce().___jsl;if(i?.H){for(const e of Object.keys(i.H))if(i.H[e].r=i.H[e].r||[],i.H[e].L=i.H[e].L||[],i.H[e].r=[...i.H[e].L],i.CP)for(let n=0;n<i.CP.length;n++)i.CP[n]=null}}function Hu(i){return new Promise((e,n)=>{var r,o,c;function l(){rs(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{rs(),n(ae(i,"network-request-failed"))},timeout:Fu.get()})}if(!((o=(r=ce().gapi)===null||r===void 0?void 0:r.iframes)===null||o===void 0)&&o.Iframe)e(gapi.iframes.getContext());else if(!((c=ce().gapi)===null||c===void 0)&&c.load)l();else{const f=Kl("iframefcb");return ce()[f]=()=>{gapi.load?l():n(ae(i,"network-request-failed"))},zl(`${ql()}?onload=${f}`).catch(y=>n(y))}}).catch(e=>{throw ei=null,e})}let ei=null;function $u(i){return ei=ei||Hu(i),ei}/**
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
*/const Bu=new Pt(5e3,15e3),Vu="__/auth/iframe",zu="emulator/auth/iframe",qu={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Ku=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Wu(i){const e=i.config;E(e.authDomain,i,"auth-domain-config-required");const n=e.emulator?yn(e,zu):`https://${i.config.authDomain}/${Vu}`,r={apiKey:e.apiKey,appName:i.name,v:it},o=Ku.get(i.config.apiHost);o&&(r.eid=o);const c=i._getFrameworks();return c.length&&(r.fw=c.join(",")),`${n}?${Ct(r).slice(1)}`}async function Gu(i){const e=await $u(i),n=ce().gapi;return E(n,i,"internal-error"),e.open({where:document.body,url:Wu(i),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:qu,dontclear:!0},r=>new Promise(async(o,c)=>{await r.restyle({setHideOnLeave:!1});const l=ae(i,"network-request-failed"),f=ce().setTimeout(()=>{c(l)},Bu.get());function y(){ce().clearTimeout(f),o(r)}r.ping(y).then(y,()=>{c(l)})}))}/**
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
*/const Ju={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Xu=500,Yu=600,Qu="_blank",Zu="http://localhost";class ss{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function ed(i,e,n,r=Xu,o=Yu){const c=Math.max((window.screen.availHeight-o)/2,0).toString(),l=Math.max((window.screen.availWidth-r)/2,0).toString();let f="";const y=Object.assign(Object.assign({},Ju),{width:r.toString(),height:o.toString(),top:c,left:l}),T=K().toLowerCase();n&&(f=fo(T)?Qu:n),uo(T)&&(e=e||Zu,y.scrollbars="yes");const S=Object.entries(y).reduce((A,[L,P])=>`${A}${L}=${P},`,"");if(Ul(T)&&f!=="_self")return td(e||"",f),new ss(null);const k=window.open(e||"",f,S);E(k,i,"popup-blocked");try{k.focus()}catch{}return new ss(k)}function td(i,e){const n=document.createElement("a");n.href=i,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
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
*/const id="__/auth/handler",nd="emulator/auth/handler",rd=encodeURIComponent("fac");async function os(i,e,n,r,o,c){E(i.config.authDomain,i,"auth-domain-config-required"),E(i.config.apiKey,i,"invalid-api-key");const l={apiKey:i.config.apiKey,appName:i.name,authType:n,redirectUrl:r,v:it,eventId:o};if(e instanceof _o){e.setDefaultLanguage(i.languageCode),l.providerId=e.providerId||"",xa(e.getCustomParameters())||(l.customParameters=JSON.stringify(e.getCustomParameters()));for(const[S,k]of Object.entries({}))l[S]=k}if(e instanceof Ot){const S=e.getScopes().filter(k=>k!=="");S.length>0&&(l.scopes=S.join(","))}i.tenantId&&(l.tid=i.tenantId);const f=l;for(const S of Object.keys(f))f[S]===void 0&&delete f[S];const y=await i._getAppCheckToken(),T=y?`#${rd}=${encodeURIComponent(y)}`:"";return`${sd(i)}?${Ct(f).slice(1)}${T}`}function sd({config:i}){return i.emulator?yn(i,nd):`https://${i.authDomain}/${id}`}/**
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
*/const Xi="webStorageSupport";class od{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Co,this._completeRedirectFn=Ou,this._overrideRedirectResult=Au}async _openPopup(e,n,r,o){var c;we((c=this.eventManagers[e._key()])===null||c===void 0?void 0:c.manager,"_initialize() not called before _openPopup()");const l=await os(e,n,r,sn(),o);return ed(e,l,En())}async _openRedirect(e,n,r,o){await this._originValidation(e);const c=await os(e,n,r,sn(),o);return hu(c),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:o,promise:c}=this.eventManagers[n];return o?Promise.resolve(o):(we(c,"If manager is not set, promise should be"),c)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await Gu(e),r=new Nu(e);return n.register("authEvent",o=>(E(o?.authEvent,e,"invalid-auth-event"),{status:r.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Xi,{type:Xi},r=>{var o;const c=(o=r?.[0])===null||o===void 0?void 0:o[Xi];c!==void 0&&n(!!c),ye(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=ju(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return wo()||po()||In()}}const ad=od;var as="@firebase/auth",cs="1.7.9";/**
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
*/class cd{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e(r?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){E(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
*/function hd(i){switch(i){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function ld(i){he(new se("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),o=e.getProvider("heartbeat"),c=e.getProvider("app-check-internal"),{apiKey:l,authDomain:f}=r.options;E(l&&!l.includes(":"),"invalid-api-key",{appName:r.name});const y={apiKey:l,authDomain:f,clientPlatform:i,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:bo(i)},T=new Bl(r,o,c,y);return Gl(T,n),T},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),he(new se("auth-internal",e=>{const n=Tn(e.getProvider("auth").getImmediate());return(r=>new cd(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),te(as,cs,hd(i)),te(as,cs,"esm2017")}/**
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
*/const ud=5*60,dd=Es("authIdTokenMaxAge")||ud;let hs=null;const pd=i=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>dd)return;const o=n?.token;hs!==o&&(hs=o,await fetch(i,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function fd(i=ln()){const e=ze(i,"auth");if(e.isInitialized())return e.getImmediate();const n=Wl(i,{popupRedirectResolver:ad,persistence:[yu,ou,Co]}),r=Es("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const c=new URL(r,location.origin);if(location.origin===c.origin){const l=pd(c.toString());nu(n,l,()=>l(n.currentUser)),iu(n,f=>l(f))}}const o=Ts("auth");return o&&Jl(n,`http://${o}`),n}function gd(){var i,e;return(e=(i=document.getElementsByTagName("head"))===null||i===void 0?void 0:i[0])!==null&&e!==void 0?e:document}Vl({loadJS(i){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",i),r.onload=e,r.onerror=o=>{const c=ae("internal-error");c.customData=o,n(c)},r.type="text/javascript",r.charset="UTF-8",gd().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});ld("Browser");var ls=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Mo;(function(){var i;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(v,u){function p(){}p.prototype=u.prototype,v.D=u.prototype,v.prototype=new p,v.prototype.constructor=v,v.C=function(g,m,b){for(var d=Array(arguments.length-2),ue=2;ue<arguments.length;ue++)d[ue-2]=arguments[ue];return u.prototype[m].apply(g,d)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,n),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(v,u,p){p||(p=0);var g=Array(16);if(typeof u=="string")for(var m=0;16>m;++m)g[m]=u.charCodeAt(p++)|u.charCodeAt(p++)<<8|u.charCodeAt(p++)<<16|u.charCodeAt(p++)<<24;else for(m=0;16>m;++m)g[m]=u[p++]|u[p++]<<8|u[p++]<<16|u[p++]<<24;u=v.g[0],p=v.g[1],m=v.g[2];var b=v.g[3],d=u+(b^p&(m^b))+g[0]+3614090360&4294967295;u=p+(d<<7&4294967295|d>>>25),d=b+(m^u&(p^m))+g[1]+3905402710&4294967295,b=u+(d<<12&4294967295|d>>>20),d=m+(p^b&(u^p))+g[2]+606105819&4294967295,m=b+(d<<17&4294967295|d>>>15),d=p+(u^m&(b^u))+g[3]+3250441966&4294967295,p=m+(d<<22&4294967295|d>>>10),d=u+(b^p&(m^b))+g[4]+4118548399&4294967295,u=p+(d<<7&4294967295|d>>>25),d=b+(m^u&(p^m))+g[5]+1200080426&4294967295,b=u+(d<<12&4294967295|d>>>20),d=m+(p^b&(u^p))+g[6]+2821735955&4294967295,m=b+(d<<17&4294967295|d>>>15),d=p+(u^m&(b^u))+g[7]+4249261313&4294967295,p=m+(d<<22&4294967295|d>>>10),d=u+(b^p&(m^b))+g[8]+1770035416&4294967295,u=p+(d<<7&4294967295|d>>>25),d=b+(m^u&(p^m))+g[9]+2336552879&4294967295,b=u+(d<<12&4294967295|d>>>20),d=m+(p^b&(u^p))+g[10]+4294925233&4294967295,m=b+(d<<17&4294967295|d>>>15),d=p+(u^m&(b^u))+g[11]+2304563134&4294967295,p=m+(d<<22&4294967295|d>>>10),d=u+(b^p&(m^b))+g[12]+1804603682&4294967295,u=p+(d<<7&4294967295|d>>>25),d=b+(m^u&(p^m))+g[13]+4254626195&4294967295,b=u+(d<<12&4294967295|d>>>20),d=m+(p^b&(u^p))+g[14]+2792965006&4294967295,m=b+(d<<17&4294967295|d>>>15),d=p+(u^m&(b^u))+g[15]+1236535329&4294967295,p=m+(d<<22&4294967295|d>>>10),d=u+(m^b&(p^m))+g[1]+4129170786&4294967295,u=p+(d<<5&4294967295|d>>>27),d=b+(p^m&(u^p))+g[6]+3225465664&4294967295,b=u+(d<<9&4294967295|d>>>23),d=m+(u^p&(b^u))+g[11]+643717713&4294967295,m=b+(d<<14&4294967295|d>>>18),d=p+(b^u&(m^b))+g[0]+3921069994&4294967295,p=m+(d<<20&4294967295|d>>>12),d=u+(m^b&(p^m))+g[5]+3593408605&4294967295,u=p+(d<<5&4294967295|d>>>27),d=b+(p^m&(u^p))+g[10]+38016083&4294967295,b=u+(d<<9&4294967295|d>>>23),d=m+(u^p&(b^u))+g[15]+3634488961&4294967295,m=b+(d<<14&4294967295|d>>>18),d=p+(b^u&(m^b))+g[4]+3889429448&4294967295,p=m+(d<<20&4294967295|d>>>12),d=u+(m^b&(p^m))+g[9]+568446438&4294967295,u=p+(d<<5&4294967295|d>>>27),d=b+(p^m&(u^p))+g[14]+3275163606&4294967295,b=u+(d<<9&4294967295|d>>>23),d=m+(u^p&(b^u))+g[3]+4107603335&4294967295,m=b+(d<<14&4294967295|d>>>18),d=p+(b^u&(m^b))+g[8]+1163531501&4294967295,p=m+(d<<20&4294967295|d>>>12),d=u+(m^b&(p^m))+g[13]+2850285829&4294967295,u=p+(d<<5&4294967295|d>>>27),d=b+(p^m&(u^p))+g[2]+4243563512&4294967295,b=u+(d<<9&4294967295|d>>>23),d=m+(u^p&(b^u))+g[7]+1735328473&4294967295,m=b+(d<<14&4294967295|d>>>18),d=p+(b^u&(m^b))+g[12]+2368359562&4294967295,p=m+(d<<20&4294967295|d>>>12),d=u+(p^m^b)+g[5]+4294588738&4294967295,u=p+(d<<4&4294967295|d>>>28),d=b+(u^p^m)+g[8]+2272392833&4294967295,b=u+(d<<11&4294967295|d>>>21),d=m+(b^u^p)+g[11]+1839030562&4294967295,m=b+(d<<16&4294967295|d>>>16),d=p+(m^b^u)+g[14]+4259657740&4294967295,p=m+(d<<23&4294967295|d>>>9),d=u+(p^m^b)+g[1]+2763975236&4294967295,u=p+(d<<4&4294967295|d>>>28),d=b+(u^p^m)+g[4]+1272893353&4294967295,b=u+(d<<11&4294967295|d>>>21),d=m+(b^u^p)+g[7]+4139469664&4294967295,m=b+(d<<16&4294967295|d>>>16),d=p+(m^b^u)+g[10]+3200236656&4294967295,p=m+(d<<23&4294967295|d>>>9),d=u+(p^m^b)+g[13]+681279174&4294967295,u=p+(d<<4&4294967295|d>>>28),d=b+(u^p^m)+g[0]+3936430074&4294967295,b=u+(d<<11&4294967295|d>>>21),d=m+(b^u^p)+g[3]+3572445317&4294967295,m=b+(d<<16&4294967295|d>>>16),d=p+(m^b^u)+g[6]+76029189&4294967295,p=m+(d<<23&4294967295|d>>>9),d=u+(p^m^b)+g[9]+3654602809&4294967295,u=p+(d<<4&4294967295|d>>>28),d=b+(u^p^m)+g[12]+3873151461&4294967295,b=u+(d<<11&4294967295|d>>>21),d=m+(b^u^p)+g[15]+530742520&4294967295,m=b+(d<<16&4294967295|d>>>16),d=p+(m^b^u)+g[2]+3299628645&4294967295,p=m+(d<<23&4294967295|d>>>9),d=u+(m^(p|~b))+g[0]+4096336452&4294967295,u=p+(d<<6&4294967295|d>>>26),d=b+(p^(u|~m))+g[7]+1126891415&4294967295,b=u+(d<<10&4294967295|d>>>22),d=m+(u^(b|~p))+g[14]+2878612391&4294967295,m=b+(d<<15&4294967295|d>>>17),d=p+(b^(m|~u))+g[5]+4237533241&4294967295,p=m+(d<<21&4294967295|d>>>11),d=u+(m^(p|~b))+g[12]+1700485571&4294967295,u=p+(d<<6&4294967295|d>>>26),d=b+(p^(u|~m))+g[3]+2399980690&4294967295,b=u+(d<<10&4294967295|d>>>22),d=m+(u^(b|~p))+g[10]+4293915773&4294967295,m=b+(d<<15&4294967295|d>>>17),d=p+(b^(m|~u))+g[1]+2240044497&4294967295,p=m+(d<<21&4294967295|d>>>11),d=u+(m^(p|~b))+g[8]+1873313359&4294967295,u=p+(d<<6&4294967295|d>>>26),d=b+(p^(u|~m))+g[15]+4264355552&4294967295,b=u+(d<<10&4294967295|d>>>22),d=m+(u^(b|~p))+g[6]+2734768916&4294967295,m=b+(d<<15&4294967295|d>>>17),d=p+(b^(m|~u))+g[13]+1309151649&4294967295,p=m+(d<<21&4294967295|d>>>11),d=u+(m^(p|~b))+g[4]+4149444226&4294967295,u=p+(d<<6&4294967295|d>>>26),d=b+(p^(u|~m))+g[11]+3174756917&4294967295,b=u+(d<<10&4294967295|d>>>22),d=m+(u^(b|~p))+g[2]+718787259&4294967295,m=b+(d<<15&4294967295|d>>>17),d=p+(b^(m|~u))+g[9]+3951481745&4294967295,v.g[0]=v.g[0]+u&4294967295,v.g[1]=v.g[1]+(m+(d<<21&4294967295|d>>>11))&4294967295,v.g[2]=v.g[2]+m&4294967295,v.g[3]=v.g[3]+b&4294967295}r.prototype.u=function(v,u){u===void 0&&(u=v.length);for(var p=u-this.blockSize,g=this.B,m=this.h,b=0;b<u;){if(m==0)for(;b<=p;)o(this,v,b),b+=this.blockSize;if(typeof v=="string"){for(;b<u;)if(g[m++]=v.charCodeAt(b++),m==this.blockSize){o(this,g),m=0;break}}else for(;b<u;)if(g[m++]=v[b++],m==this.blockSize){o(this,g),m=0;break}}this.h=m,this.o+=u},r.prototype.v=function(){var v=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);v[0]=128;for(var u=1;u<v.length-8;++u)v[u]=0;var p=8*this.o;for(u=v.length-8;u<v.length;++u)v[u]=p&255,p/=256;for(this.u(v),v=Array(16),u=p=0;4>u;++u)for(var g=0;32>g;g+=8)v[p++]=this.g[u]>>>g&255;return v};function c(v,u){var p=f;return Object.prototype.hasOwnProperty.call(p,v)?p[v]:p[v]=u(v)}function l(v,u){this.h=u;for(var p=[],g=!0,m=v.length-1;0<=m;m--){var b=v[m]|0;g&&b==u||(p[m]=b,g=!1)}this.g=p}var f={};function y(v){return-128<=v&&128>v?c(v,function(u){return new l([u|0],0>u?-1:0)}):new l([v|0],0>v?-1:0)}function T(v){if(isNaN(v)||!isFinite(v))return k;if(0>v)return M(T(-v));for(var u=[],p=1,g=0;v>=p;g++)u[g]=v/p|0,p*=4294967296;return new l(u,0)}function S(v,u){if(v.length==0)throw Error("number format error: empty string");if(u=u||10,2>u||36<u)throw Error("radix out of range: "+u);if(v.charAt(0)=="-")return M(S(v.substring(1),u));if(0<=v.indexOf("-"))throw Error('number format error: interior "-" character');for(var p=T(Math.pow(u,8)),g=k,m=0;m<v.length;m+=8){var b=Math.min(8,v.length-m),d=parseInt(v.substring(m,m+b),u);8>b?(b=T(Math.pow(u,b)),g=g.j(b).add(T(d))):(g=g.j(p),g=g.add(T(d)))}return g}var k=y(0),A=y(1),L=y(16777216);i=l.prototype,i.m=function(){if(j(this))return-M(this).m();for(var v=0,u=1,p=0;p<this.g.length;p++){var g=this.i(p);v+=(0<=g?g:4294967296+g)*u,u*=4294967296}return v},i.toString=function(v){if(v=v||10,2>v||36<v)throw Error("radix out of range: "+v);if(P(this))return"0";if(j(this))return"-"+M(this).toString(v);for(var u=T(Math.pow(v,6)),p=this,g="";;){var m=ie(p,u).g;p=le(p,m.j(u));var b=((0<p.g.length?p.g[0]:p.h)>>>0).toString(v);if(p=m,P(p))return b+g;for(;6>b.length;)b="0"+b;g=b+g}},i.i=function(v){return 0>v?0:v<this.g.length?this.g[v]:this.h};function P(v){if(v.h!=0)return!1;for(var u=0;u<v.g.length;u++)if(v.g[u]!=0)return!1;return!0}function j(v){return v.h==-1}i.l=function(v){return v=le(this,v),j(v)?-1:P(v)?0:1};function M(v){for(var u=v.g.length,p=[],g=0;g<u;g++)p[g]=~v.g[g];return new l(p,~v.h).add(A)}i.abs=function(){return j(this)?M(this):this},i.add=function(v){for(var u=Math.max(this.g.length,v.g.length),p=[],g=0,m=0;m<=u;m++){var b=g+(this.i(m)&65535)+(v.i(m)&65535),d=(b>>>16)+(this.i(m)>>>16)+(v.i(m)>>>16);g=d>>>16,b&=65535,d&=65535,p[m]=d<<16|b}return new l(p,p[p.length-1]&-2147483648?-1:0)};function le(v,u){return v.add(M(u))}i.j=function(v){if(P(this)||P(v))return k;if(j(this))return j(v)?M(this).j(M(v)):M(M(this).j(v));if(j(v))return M(this.j(M(v)));if(0>this.l(L)&&0>v.l(L))return T(this.m()*v.m());for(var u=this.g.length+v.g.length,p=[],g=0;g<2*u;g++)p[g]=0;for(g=0;g<this.g.length;g++)for(var m=0;m<v.g.length;m++){var b=this.i(g)>>>16,d=this.i(g)&65535,ue=v.i(m)>>>16,rt=v.i(m)&65535;p[2*g+2*m]+=d*rt,Q(p,2*g+2*m),p[2*g+2*m+1]+=b*rt,Q(p,2*g+2*m+1),p[2*g+2*m+1]+=d*ue,Q(p,2*g+2*m+1),p[2*g+2*m+2]+=b*ue,Q(p,2*g+2*m+2)}for(g=0;g<u;g++)p[g]=p[2*g+1]<<16|p[2*g];for(g=u;g<2*u;g++)p[g]=0;return new l(p,0)};function Q(v,u){for(;(v[u]&65535)!=v[u];)v[u+1]+=v[u]>>>16,v[u]&=65535,u++}function F(v,u){this.g=v,this.h=u}function ie(v,u){if(P(u))throw Error("division by zero");if(P(v))return new F(k,k);if(j(v))return u=ie(M(v),u),new F(M(u.g),M(u.h));if(j(u))return u=ie(v,M(u)),new F(M(u.g),u.h);if(30<v.g.length){if(j(v)||j(u))throw Error("slowDivide_ only works with positive integers.");for(var p=A,g=u;0>=g.l(v);)p=De(p),g=De(g);var m=W(p,1),b=W(g,1);for(g=W(g,2),p=W(p,2);!P(g);){var d=b.add(g);0>=d.l(v)&&(m=m.add(p),b=d),g=W(g,1),p=W(p,1)}return u=le(v,m.j(u)),new F(m,u)}for(m=k;0<=v.l(u);){for(p=Math.max(1,Math.floor(v.m()/u.m())),g=Math.ceil(Math.log(p)/Math.LN2),g=48>=g?1:Math.pow(2,g-48),b=T(p),d=b.j(u);j(d)||0<d.l(v);)p-=g,b=T(p),d=b.j(u);P(b)&&(b=A),m=m.add(b),v=le(v,d)}return new F(m,v)}i.A=function(v){return ie(this,v).h},i.and=function(v){for(var u=Math.max(this.g.length,v.g.length),p=[],g=0;g<u;g++)p[g]=this.i(g)&v.i(g);return new l(p,this.h&v.h)},i.or=function(v){for(var u=Math.max(this.g.length,v.g.length),p=[],g=0;g<u;g++)p[g]=this.i(g)|v.i(g);return new l(p,this.h|v.h)},i.xor=function(v){for(var u=Math.max(this.g.length,v.g.length),p=[],g=0;g<u;g++)p[g]=this.i(g)^v.i(g);return new l(p,this.h^v.h)};function De(v){for(var u=v.g.length+1,p=[],g=0;g<u;g++)p[g]=v.i(g)<<1|v.i(g-1)>>>31;return new l(p,v.h)}function W(v,u){var p=u>>5;u%=32;for(var g=v.g.length-p,m=[],b=0;b<g;b++)m[b]=0<u?v.i(b+p)>>>u|v.i(b+p+1)<<32-u:v.i(b+p);return new l(m,v.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,l.prototype.add=l.prototype.add,l.prototype.multiply=l.prototype.j,l.prototype.modulo=l.prototype.A,l.prototype.compare=l.prototype.l,l.prototype.toNumber=l.prototype.m,l.prototype.toString=l.prototype.toString,l.prototype.getBits=l.prototype.i,l.fromNumber=T,l.fromString=S,Mo=l}).apply(typeof ls<"u"?ls:typeof self<"u"?self:typeof window<"u"?window:{});var Xt=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var i,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(t,s,a){return t==Array.prototype||t==Object.prototype||(t[s]=a.value),t};function n(t){t=[typeof globalThis=="object"&&globalThis,t,typeof window=="object"&&window,typeof self=="object"&&self,typeof Xt=="object"&&Xt];for(var s=0;s<t.length;++s){var a=t[s];if(a&&a.Math==Math)return a}throw Error("Cannot find global object")}var r=n(this);function o(t,s){if(s)e:{var a=r;t=t.split(".");for(var h=0;h<t.length-1;h++){var w=t[h];if(!(w in a))break e;a=a[w]}t=t[t.length-1],h=a[t],s=s(h),s!=h&&s!=null&&e(a,t,{configurable:!0,writable:!0,value:s})}}function c(t,s){t instanceof String&&(t+="");var a=0,h=!1,w={next:function(){if(!h&&a<t.length){var I=a++;return{value:s(I,t[I]),done:!1}}return h=!0,{done:!0,value:void 0}}};return w[Symbol.iterator]=function(){return w},w}o("Array.prototype.values",function(t){return t||function(){return c(this,function(s,a){return a})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var l=l||{},f=this||self;function y(t){var s=typeof t;return s=s!="object"?s:t?Array.isArray(t)?"array":s:"null",s=="array"||s=="object"&&typeof t.length=="number"}function T(t){var s=typeof t;return s=="object"&&t!=null||s=="function"}function S(t,s,a){return t.call.apply(t.bind,arguments)}function k(t,s,a){if(!t)throw Error();if(2<arguments.length){var h=Array.prototype.slice.call(arguments,2);return function(){var w=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(w,h),t.apply(s,w)}}return function(){return t.apply(s,arguments)}}function A(t,s,a){return A=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?S:k,A.apply(null,arguments)}function L(t,s){var a=Array.prototype.slice.call(arguments,1);return function(){var h=a.slice();return h.push.apply(h,arguments),t.apply(this,h)}}function P(t,s){function a(){}a.prototype=s.prototype,t.aa=s.prototype,t.prototype=new a,t.prototype.constructor=t,t.Qb=function(h,w,I){for(var _=Array(arguments.length-2),D=2;D<arguments.length;D++)_[D-2]=arguments[D];return s.prototype[w].apply(h,_)}}function j(t){const s=t.length;if(0<s){const a=Array(s);for(let h=0;h<s;h++)a[h]=t[h];return a}return[]}function M(t,s){for(let a=1;a<arguments.length;a++){const h=arguments[a];if(y(h)){const w=t.length||0,I=h.length||0;t.length=w+I;for(let _=0;_<I;_++)t[w+_]=h[_]}else t.push(h)}}class le{constructor(s,a){this.i=s,this.j=a,this.h=0,this.g=null}get(){let s;return 0<this.h?(this.h--,s=this.g,this.g=s.next,s.next=null):s=this.i(),s}}function Q(t){return/^[\s\xa0]*$/.test(t)}function F(){var t=f.navigator;return t&&(t=t.userAgent)?t:""}function ie(t){return ie[" "](t),t}ie[" "]=function(){};var De=F().indexOf("Gecko")!=-1&&!(F().toLowerCase().indexOf("webkit")!=-1&&F().indexOf("Edge")==-1)&&!(F().indexOf("Trident")!=-1||F().indexOf("MSIE")!=-1)&&F().indexOf("Edge")==-1;function W(t,s,a){for(const h in t)s.call(a,t[h],h,t)}function v(t,s){for(const a in t)s.call(void 0,t[a],a,t)}function u(t){const s={};for(const a in t)s[a]=t[a];return s}const p="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function g(t,s){let a,h;for(let w=1;w<arguments.length;w++){h=arguments[w];for(a in h)t[a]=h[a];for(let I=0;I<p.length;I++)a=p[I],Object.prototype.hasOwnProperty.call(h,a)&&(t[a]=h[a])}}function m(t){var s=1;t=t.split(":");const a=[];for(;0<s&&t.length;)a.push(t.shift()),s--;return t.length&&a.push(t.join(":")),a}function b(t){f.setTimeout(()=>{throw t},0)}function d(){var t=mi;let s=null;return t.g&&(s=t.g,t.g=t.g.next,t.g||(t.h=null),s.next=null),s}class ue{constructor(){this.h=this.g=null}add(s,a){const h=rt.get();h.set(s,a),this.h?this.h.next=h:this.g=h,this.h=h}}var rt=new le(()=>new Fo,t=>t.reset());class Fo{constructor(){this.next=this.g=this.h=null}set(s,a){this.h=s,this.g=a,this.next=null}reset(){this.next=this.g=this.h=null}}let st,ot=!1,mi=new ue,On=()=>{const t=f.Promise.resolve(void 0);st=()=>{t.then(Ho)}};var Ho=()=>{for(var t;t=d();){try{t.h.call(t.g)}catch(a){b(a)}var s=rt;s.j(t),100>s.h&&(s.h++,t.next=s.g,s.g=t)}ot=!1};function be(){this.s=this.s,this.C=this.C}be.prototype.s=!1,be.prototype.ma=function(){this.s||(this.s=!0,this.N())},be.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function H(t,s){this.type=t,this.g=this.target=s,this.defaultPrevented=!1}H.prototype.h=function(){this.defaultPrevented=!0};var $o=function(){if(!f.addEventListener||!Object.defineProperty)return!1;var t=!1,s=Object.defineProperty({},"passive",{get:function(){t=!0}});try{const a=()=>{};f.addEventListener("test",a,s),f.removeEventListener("test",a,s)}catch{}return t}();function at(t,s){if(H.call(this,t?t.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,t){var a=this.type=t.type,h=t.changedTouches&&t.changedTouches.length?t.changedTouches[0]:null;if(this.target=t.target||t.srcElement,this.g=s,s=t.relatedTarget){if(De){e:{try{ie(s.nodeName);var w=!0;break e}catch{}w=!1}w||(s=null)}}else a=="mouseover"?s=t.fromElement:a=="mouseout"&&(s=t.toElement);this.relatedTarget=s,h?(this.clientX=h.clientX!==void 0?h.clientX:h.pageX,this.clientY=h.clientY!==void 0?h.clientY:h.pageY,this.screenX=h.screenX||0,this.screenY=h.screenY||0):(this.clientX=t.clientX!==void 0?t.clientX:t.pageX,this.clientY=t.clientY!==void 0?t.clientY:t.pageY,this.screenX=t.screenX||0,this.screenY=t.screenY||0),this.button=t.button,this.key=t.key||"",this.ctrlKey=t.ctrlKey,this.altKey=t.altKey,this.shiftKey=t.shiftKey,this.metaKey=t.metaKey,this.pointerId=t.pointerId||0,this.pointerType=typeof t.pointerType=="string"?t.pointerType:Bo[t.pointerType]||"",this.state=t.state,this.i=t,t.defaultPrevented&&at.aa.h.call(this)}}P(at,H);var Bo={2:"touch",3:"pen",4:"mouse"};at.prototype.h=function(){at.aa.h.call(this);var t=this.i;t.preventDefault?t.preventDefault():t.returnValue=!1};var Dt="closure_listenable_"+(1e6*Math.random()|0),Vo=0;function zo(t,s,a,h,w){this.listener=t,this.proxy=null,this.src=s,this.type=a,this.capture=!!h,this.ha=w,this.key=++Vo,this.da=this.fa=!1}function Lt(t){t.da=!0,t.listener=null,t.proxy=null,t.src=null,t.ha=null}function Mt(t){this.src=t,this.g={},this.h=0}Mt.prototype.add=function(t,s,a,h,w){var I=t.toString();t=this.g[I],t||(t=this.g[I]=[],this.h++);var _=yi(t,s,h,w);return-1<_?(s=t[_],a||(s.fa=!1)):(s=new zo(s,this.src,I,!!h,w),s.fa=a,t.push(s)),s};function vi(t,s){var a=s.type;if(a in t.g){var h=t.g[a],w=Array.prototype.indexOf.call(h,s,void 0),I;(I=0<=w)&&Array.prototype.splice.call(h,w,1),I&&(Lt(s),t.g[a].length==0&&(delete t.g[a],t.h--))}}function yi(t,s,a,h){for(var w=0;w<t.length;++w){var I=t[w];if(!I.da&&I.listener==s&&I.capture==!!a&&I.ha==h)return w}return-1}var wi="closure_lm_"+(1e6*Math.random()|0),bi={};function Rn(t,s,a,h,w){if(Array.isArray(s)){for(var I=0;I<s.length;I++)Rn(t,s[I],a,h,w);return null}return a=Ln(a),t&&t[Dt]?t.K(s,a,T(h)?!!h.capture:!1,w):qo(t,s,a,!1,h,w)}function qo(t,s,a,h,w,I){if(!s)throw Error("Invalid event type");var _=T(w)?!!w.capture:!!w,D=Ti(t);if(D||(t[wi]=D=new Mt(t)),a=D.add(s,a,h,_,I),a.proxy)return a;if(h=Ko(),a.proxy=h,h.src=t,h.listener=a,t.addEventListener)$o||(w=_),w===void 0&&(w=!1),t.addEventListener(s.toString(),h,w);else if(t.attachEvent)t.attachEvent(Dn(s.toString()),h);else if(t.addListener&&t.removeListener)t.addListener(h);else throw Error("addEventListener and attachEvent are unavailable.");return a}function Ko(){function t(a){return s.call(t.src,t.listener,a)}const s=Wo;return t}function Nn(t,s,a,h,w){if(Array.isArray(s))for(var I=0;I<s.length;I++)Nn(t,s[I],a,h,w);else h=T(h)?!!h.capture:!!h,a=Ln(a),t&&t[Dt]?(t=t.i,s=String(s).toString(),s in t.g&&(I=t.g[s],a=yi(I,a,h,w),-1<a&&(Lt(I[a]),Array.prototype.splice.call(I,a,1),I.length==0&&(delete t.g[s],t.h--)))):t&&(t=Ti(t))&&(s=t.g[s.toString()],t=-1,s&&(t=yi(s,a,h,w)),(a=-1<t?s[t]:null)&&Ii(a))}function Ii(t){if(typeof t!="number"&&t&&!t.da){var s=t.src;if(s&&s[Dt])vi(s.i,t);else{var a=t.type,h=t.proxy;s.removeEventListener?s.removeEventListener(a,h,t.capture):s.detachEvent?s.detachEvent(Dn(a),h):s.addListener&&s.removeListener&&s.removeListener(h),(a=Ti(s))?(vi(a,t),a.h==0&&(a.src=null,s[wi]=null)):Lt(t)}}}function Dn(t){return t in bi?bi[t]:bi[t]="on"+t}function Wo(t,s){if(t.da)t=!0;else{s=new at(s,this);var a=t.listener,h=t.ha||t.src;t.fa&&Ii(t),t=a.call(h,s)}return t}function Ti(t){return t=t[wi],t instanceof Mt?t:null}var _i="__closure_events_fn_"+(1e9*Math.random()>>>0);function Ln(t){return typeof t=="function"?t:(t[_i]||(t[_i]=function(s){return t.handleEvent(s)}),t[_i])}function $(){be.call(this),this.i=new Mt(this),this.M=this,this.F=null}P($,be),$.prototype[Dt]=!0,$.prototype.removeEventListener=function(t,s,a,h){Nn(this,t,s,a,h)};function V(t,s){var a,h=t.F;if(h)for(a=[];h;h=h.F)a.push(h);if(t=t.M,h=s.type||s,typeof s=="string")s=new H(s,t);else if(s instanceof H)s.target=s.target||t;else{var w=s;s=new H(h,t),g(s,w)}if(w=!0,a)for(var I=a.length-1;0<=I;I--){var _=s.g=a[I];w=Ut(_,h,!0,s)&&w}if(_=s.g=t,w=Ut(_,h,!0,s)&&w,w=Ut(_,h,!1,s)&&w,a)for(I=0;I<a.length;I++)_=s.g=a[I],w=Ut(_,h,!1,s)&&w}$.prototype.N=function(){if($.aa.N.call(this),this.i){var t=this.i,s;for(s in t.g){for(var a=t.g[s],h=0;h<a.length;h++)Lt(a[h]);delete t.g[s],t.h--}}this.F=null},$.prototype.K=function(t,s,a,h){return this.i.add(String(t),s,!1,a,h)},$.prototype.L=function(t,s,a,h){return this.i.add(String(t),s,!0,a,h)};function Ut(t,s,a,h){if(s=t.i.g[String(s)],!s)return!0;s=s.concat();for(var w=!0,I=0;I<s.length;++I){var _=s[I];if(_&&!_.da&&_.capture==a){var D=_.listener,x=_.ha||_.src;_.fa&&vi(t.i,_),w=D.call(x,h)!==!1&&w}}return w&&!h.defaultPrevented}function Mn(t,s,a){if(typeof t=="function")a&&(t=A(t,a));else if(t&&typeof t.handleEvent=="function")t=A(t.handleEvent,t);else throw Error("Invalid listener argument");return 2147483647<Number(s)?-1:f.setTimeout(t,s||0)}function Un(t){t.g=Mn(()=>{t.g=null,t.i&&(t.i=!1,Un(t))},t.l);const s=t.h;t.h=null,t.m.apply(null,s)}class Go extends be{constructor(s,a){super(),this.m=s,this.l=a,this.h=null,this.i=!1,this.g=null}j(s){this.h=arguments,this.g?this.i=!0:Un(this)}N(){super.N(),this.g&&(f.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ct(t){be.call(this),this.h=t,this.g={}}P(ct,be);var jn=[];function xn(t){W(t.g,function(s,a){this.g.hasOwnProperty(a)&&Ii(s)},t),t.g={}}ct.prototype.N=function(){ct.aa.N.call(this),xn(this)},ct.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Ei=f.JSON.stringify,Jo=f.JSON.parse,Xo=class{stringify(t){return f.JSON.stringify(t,void 0)}parse(t){return f.JSON.parse(t,void 0)}};function Si(){}Si.prototype.h=null;function Fn(t){return t.h||(t.h=t.i())}function ki(){H.call(this,"d")}P(ki,H);function Ai(){H.call(this,"c")}P(Ai,H);var qe={},Hn=null;function Ci(){return Hn=Hn||new $}qe.La="serverreachability";function $n(t){H.call(this,qe.La,t)}P($n,H);function ht(t){const s=Ci();V(s,new $n(s))}qe.STAT_EVENT="statevent";function Bn(t,s){H.call(this,qe.STAT_EVENT,t),this.stat=s}P(Bn,H);function z(t){const s=Ci();V(s,new Bn(s,t))}qe.Ma="timingevent";function Vn(t,s){H.call(this,qe.Ma,t),this.size=s}P(Vn,H);function lt(t,s){if(typeof t!="function")throw Error("Fn must not be null and must be a function");return f.setTimeout(function(){t()},s)}function ut(){this.g=!0}ut.prototype.xa=function(){this.g=!1};function Yo(t,s,a,h,w,I){t.info(function(){if(t.g)if(I)for(var _="",D=I.split("&"),x=0;x<D.length;x++){var R=D[x].split("=");if(1<R.length){var B=R[0];R=R[1];var G=B.split("_");_=2<=G.length&&G[1]=="type"?_+(B+"="+R+"&"):_+(B+"=redacted&")}}else _=null;else _=I;return"XMLHTTP REQ ("+h+") [attempt "+w+"]: "+s+`
`+a+`
`+_})}function Qo(t,s,a,h,w,I,_){t.info(function(){return"XMLHTTP RESP ("+h+") [ attempt "+w+"]: "+s+`
`+a+`
`+I+" "+_})}function Ke(t,s,a,h){t.info(function(){return"XMLHTTP TEXT ("+s+"): "+ea(t,a)+(h?" "+h:"")})}function Zo(t,s){t.info(function(){return"TIMEOUT: "+s})}ut.prototype.info=function(){};function ea(t,s){if(!t.g)return s;if(!s)return null;try{var a=JSON.parse(s);if(a){for(t=0;t<a.length;t++)if(Array.isArray(a[t])){var h=a[t];if(!(2>h.length)){var w=h[1];if(Array.isArray(w)&&!(1>w.length)){var I=w[0];if(I!="noop"&&I!="stop"&&I!="close")for(var _=1;_<w.length;_++)w[_]=""}}}}return Ei(a)}catch{return s}}var Pi;function jt(){}P(jt,Si),jt.prototype.g=function(){return new XMLHttpRequest},jt.prototype.i=function(){return{}},Pi=new jt;function Ie(t,s,a,h){this.j=t,this.i=s,this.l=a,this.R=h||1,this.U=new ct(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new zn}function zn(){this.i=null,this.g="",this.h=!1}var qn={},Oi={};function Ri(t,s,a){t.L=1,t.v=$t(de(s)),t.m=a,t.P=!0,Kn(t,null)}function Kn(t,s){t.F=Date.now(),xt(t),t.A=de(t.v);var a=t.A,h=t.R;Array.isArray(h)||(h=[String(h)]),or(a.i,"t",h),t.C=0,a=t.j.J,t.h=new zn,t.g=Er(t.j,a?s:null,!t.m),0<t.O&&(t.M=new Go(A(t.Y,t,t.g),t.O)),s=t.U,a=t.g,h=t.ca;var w="readystatechange";Array.isArray(w)||(w&&(jn[0]=w.toString()),w=jn);for(var I=0;I<w.length;I++){var _=Rn(a,w[I],h||s.handleEvent,!1,s.h||s);if(!_)break;s.g[_.key]=_}s=t.H?u(t.H):{},t.m?(t.u||(t.u="POST"),s["Content-Type"]="application/x-www-form-urlencoded",t.g.ea(t.A,t.u,t.m,s)):(t.u="GET",t.g.ea(t.A,t.u,null,s)),ht(),Yo(t.i,t.u,t.A,t.l,t.R,t.m)}Ie.prototype.ca=function(t){t=t.target;const s=this.M;s&&pe(t)==3?s.j():this.Y(t)},Ie.prototype.Y=function(t){try{if(t==this.g)e:{const G=pe(this.g);var s=this.g.Ba();const Je=this.g.Z();if(!(3>G)&&(G!=3||this.g&&(this.h.h||this.g.oa()||pr(this.g)))){this.J||G!=4||s==7||(s==8||0>=Je?ht(3):ht(2)),Ni(this);var a=this.g.Z();this.X=a;t:if(Wn(this)){var h=pr(this.g);t="";var w=h.length,I=pe(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Le(this),dt(this);var _="";break t}this.h.i=new f.TextDecoder}for(s=0;s<w;s++)this.h.h=!0,t+=this.h.i.decode(h[s],{stream:!(I&&s==w-1)});h.length=0,this.h.g+=t,this.C=0,_=this.h.g}else _=this.g.oa();if(this.o=a==200,Qo(this.i,this.u,this.A,this.l,this.R,G,a),this.o){if(this.T&&!this.K){t:{if(this.g){var D,x=this.g;if((D=x.g?x.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!Q(D)){var R=D;break t}}R=null}if(a=R)Ke(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Di(this,a);else{this.o=!1,this.s=3,z(12),Le(this),dt(this);break e}}if(this.P){a=!0;let ne;for(;!this.J&&this.C<_.length;)if(ne=ta(this,_),ne==Oi){G==4&&(this.s=4,z(14),a=!1),Ke(this.i,this.l,null,"[Incomplete Response]");break}else if(ne==qn){this.s=4,z(15),Ke(this.i,this.l,_,"[Invalid Chunk]"),a=!1;break}else Ke(this.i,this.l,ne,null),Di(this,ne);if(Wn(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),G!=4||_.length!=0||this.h.h||(this.s=1,z(16),a=!1),this.o=this.o&&a,!a)Ke(this.i,this.l,_,"[Invalid Chunked Response]"),Le(this),dt(this);else if(0<_.length&&!this.W){this.W=!0;var B=this.j;B.g==this&&B.ba&&!B.M&&(B.j.info("Great, no buffering proxy detected. Bytes received: "+_.length),Fi(B),B.M=!0,z(11))}}else Ke(this.i,this.l,_,null),Di(this,_);G==4&&Le(this),this.o&&!this.J&&(G==4?br(this.j,this):(this.o=!1,xt(this)))}else ya(this.g),a==400&&0<_.indexOf("Unknown SID")?(this.s=3,z(12)):(this.s=0,z(13)),Le(this),dt(this)}}}catch{}finally{}};function Wn(t){return t.g?t.u=="GET"&&t.L!=2&&t.j.Ca:!1}function ta(t,s){var a=t.C,h=s.indexOf(`
`,a);return h==-1?Oi:(a=Number(s.substring(a,h)),isNaN(a)?qn:(h+=1,h+a>s.length?Oi:(s=s.slice(h,h+a),t.C=h+a,s)))}Ie.prototype.cancel=function(){this.J=!0,Le(this)};function xt(t){t.S=Date.now()+t.I,Gn(t,t.I)}function Gn(t,s){if(t.B!=null)throw Error("WatchDog timer not null");t.B=lt(A(t.ba,t),s)}function Ni(t){t.B&&(f.clearTimeout(t.B),t.B=null)}Ie.prototype.ba=function(){this.B=null;const t=Date.now();0<=t-this.S?(Zo(this.i,this.A),this.L!=2&&(ht(),z(17)),Le(this),this.s=2,dt(this)):Gn(this,this.S-t)};function dt(t){t.j.G==0||t.J||br(t.j,t)}function Le(t){Ni(t);var s=t.M;s&&typeof s.ma=="function"&&s.ma(),t.M=null,xn(t.U),t.g&&(s=t.g,t.g=null,s.abort(),s.ma())}function Di(t,s){try{var a=t.j;if(a.G!=0&&(a.g==t||Li(a.h,t))){if(!t.K&&Li(a.h,t)&&a.G==3){try{var h=a.Da.g.parse(s)}catch{h=null}if(Array.isArray(h)&&h.length==3){var w=h;if(w[0]==0){e:if(!a.u){if(a.g)if(a.g.F+3e3<t.F)Wt(a),qt(a);else break e;xi(a),z(18)}}else a.za=w[1],0<a.za-a.T&&37500>w[2]&&a.F&&a.v==0&&!a.C&&(a.C=lt(A(a.Za,a),6e3));if(1>=Yn(a.h)&&a.ca){try{a.ca()}catch{}a.ca=void 0}}else Ue(a,11)}else if((t.K||a.g==t)&&Wt(a),!Q(s))for(w=a.Da.g.parse(s),s=0;s<w.length;s++){let R=w[s];if(a.T=R[0],R=R[1],a.G==2)if(R[0]=="c"){a.K=R[1],a.ia=R[2];const B=R[3];B!=null&&(a.la=B,a.j.info("VER="+a.la));const G=R[4];G!=null&&(a.Aa=G,a.j.info("SVER="+a.Aa));const Je=R[5];Je!=null&&typeof Je=="number"&&0<Je&&(h=1.5*Je,a.L=h,a.j.info("backChannelRequestTimeoutMs_="+h)),h=a;const ne=t.g;if(ne){const Gt=ne.g?ne.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Gt){var I=h.h;I.g||Gt.indexOf("spdy")==-1&&Gt.indexOf("quic")==-1&&Gt.indexOf("h2")==-1||(I.j=I.l,I.g=new Set,I.h&&(Mi(I,I.h),I.h=null))}if(h.D){const Hi=ne.g?ne.g.getResponseHeader("X-HTTP-Session-Id"):null;Hi&&(h.ya=Hi,N(h.I,h.D,Hi))}}a.G=3,a.l&&a.l.ua(),a.ba&&(a.R=Date.now()-t.F,a.j.info("Handshake RTT: "+a.R+"ms")),h=a;var _=t;if(h.qa=_r(h,h.J?h.ia:null,h.W),_.K){Qn(h.h,_);var D=_,x=h.L;x&&(D.I=x),D.B&&(Ni(D),xt(D)),h.g=_}else yr(h);0<a.i.length&&Kt(a)}else R[0]!="stop"&&R[0]!="close"||Ue(a,7);else a.G==3&&(R[0]=="stop"||R[0]=="close"?R[0]=="stop"?Ue(a,7):ji(a):R[0]!="noop"&&a.l&&a.l.ta(R),a.v=0)}}ht(4)}catch{}}var ia=class{constructor(t,s){this.g=t,this.map=s}};function Jn(t){this.l=t||10,f.PerformanceNavigationTiming?(t=f.performance.getEntriesByType("navigation"),t=0<t.length&&(t[0].nextHopProtocol=="hq"||t[0].nextHopProtocol=="h2")):t=!!(f.chrome&&f.chrome.loadTimes&&f.chrome.loadTimes()&&f.chrome.loadTimes().wasFetchedViaSpdy),this.j=t?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Xn(t){return t.h?!0:t.g?t.g.size>=t.j:!1}function Yn(t){return t.h?1:t.g?t.g.size:0}function Li(t,s){return t.h?t.h==s:t.g?t.g.has(s):!1}function Mi(t,s){t.g?t.g.add(s):t.h=s}function Qn(t,s){t.h&&t.h==s?t.h=null:t.g&&t.g.has(s)&&t.g.delete(s)}Jn.prototype.cancel=function(){if(this.i=Zn(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const t of this.g.values())t.cancel();this.g.clear()}};function Zn(t){if(t.h!=null)return t.i.concat(t.h.D);if(t.g!=null&&t.g.size!==0){let s=t.i;for(const a of t.g.values())s=s.concat(a.D);return s}return j(t.i)}function na(t){if(t.V&&typeof t.V=="function")return t.V();if(typeof Map<"u"&&t instanceof Map||typeof Set<"u"&&t instanceof Set)return Array.from(t.values());if(typeof t=="string")return t.split("");if(y(t)){for(var s=[],a=t.length,h=0;h<a;h++)s.push(t[h]);return s}s=[],a=0;for(h in t)s[a++]=t[h];return s}function ra(t){if(t.na&&typeof t.na=="function")return t.na();if(!t.V||typeof t.V!="function"){if(typeof Map<"u"&&t instanceof Map)return Array.from(t.keys());if(!(typeof Set<"u"&&t instanceof Set)){if(y(t)||typeof t=="string"){var s=[];t=t.length;for(var a=0;a<t;a++)s.push(a);return s}s=[],a=0;for(const h in t)s[a++]=h;return s}}}function er(t,s){if(t.forEach&&typeof t.forEach=="function")t.forEach(s,void 0);else if(y(t)||typeof t=="string")Array.prototype.forEach.call(t,s,void 0);else for(var a=ra(t),h=na(t),w=h.length,I=0;I<w;I++)s.call(void 0,h[I],a&&a[I],t)}var tr=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function sa(t,s){if(t){t=t.split("&");for(var a=0;a<t.length;a++){var h=t[a].indexOf("="),w=null;if(0<=h){var I=t[a].substring(0,h);w=t[a].substring(h+1)}else I=t[a];s(I,w?decodeURIComponent(w.replace(/\+/g," ")):"")}}}function Me(t){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,t instanceof Me){this.h=t.h,Ft(this,t.j),this.o=t.o,this.g=t.g,Ht(this,t.s),this.l=t.l;var s=t.i,a=new gt;a.i=s.i,s.g&&(a.g=new Map(s.g),a.h=s.h),ir(this,a),this.m=t.m}else t&&(s=String(t).match(tr))?(this.h=!1,Ft(this,s[1]||"",!0),this.o=pt(s[2]||""),this.g=pt(s[3]||"",!0),Ht(this,s[4]),this.l=pt(s[5]||"",!0),ir(this,s[6]||"",!0),this.m=pt(s[7]||"")):(this.h=!1,this.i=new gt(null,this.h))}Me.prototype.toString=function(){var t=[],s=this.j;s&&t.push(ft(s,nr,!0),":");var a=this.g;return(a||s=="file")&&(t.push("//"),(s=this.o)&&t.push(ft(s,nr,!0),"@"),t.push(encodeURIComponent(String(a)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a=this.s,a!=null&&t.push(":",String(a))),(a=this.l)&&(this.g&&a.charAt(0)!="/"&&t.push("/"),t.push(ft(a,a.charAt(0)=="/"?ca:aa,!0))),(a=this.i.toString())&&t.push("?",a),(a=this.m)&&t.push("#",ft(a,la)),t.join("")};function de(t){return new Me(t)}function Ft(t,s,a){t.j=a?pt(s,!0):s,t.j&&(t.j=t.j.replace(/:$/,""))}function Ht(t,s){if(s){if(s=Number(s),isNaN(s)||0>s)throw Error("Bad port number "+s);t.s=s}else t.s=null}function ir(t,s,a){s instanceof gt?(t.i=s,ua(t.i,t.h)):(a||(s=ft(s,ha)),t.i=new gt(s,t.h))}function N(t,s,a){t.i.set(s,a)}function $t(t){return N(t,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),t}function pt(t,s){return t?s?decodeURI(t.replace(/%25/g,"%2525")):decodeURIComponent(t):""}function ft(t,s,a){return typeof t=="string"?(t=encodeURI(t).replace(s,oa),a&&(t=t.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),t):null}function oa(t){return t=t.charCodeAt(0),"%"+(t>>4&15).toString(16)+(t&15).toString(16)}var nr=/[#\/\?@]/g,aa=/[#\?:]/g,ca=/[#\?]/g,ha=/[#\?@]/g,la=/#/g;function gt(t,s){this.h=this.g=null,this.i=t||null,this.j=!!s}function Te(t){t.g||(t.g=new Map,t.h=0,t.i&&sa(t.i,function(s,a){t.add(decodeURIComponent(s.replace(/\+/g," ")),a)}))}i=gt.prototype,i.add=function(t,s){Te(this),this.i=null,t=We(this,t);var a=this.g.get(t);return a||this.g.set(t,a=[]),a.push(s),this.h+=1,this};function rr(t,s){Te(t),s=We(t,s),t.g.has(s)&&(t.i=null,t.h-=t.g.get(s).length,t.g.delete(s))}function sr(t,s){return Te(t),s=We(t,s),t.g.has(s)}i.forEach=function(t,s){Te(this),this.g.forEach(function(a,h){a.forEach(function(w){t.call(s,w,h,this)},this)},this)},i.na=function(){Te(this);const t=Array.from(this.g.values()),s=Array.from(this.g.keys()),a=[];for(let h=0;h<s.length;h++){const w=t[h];for(let I=0;I<w.length;I++)a.push(s[h])}return a},i.V=function(t){Te(this);let s=[];if(typeof t=="string")sr(this,t)&&(s=s.concat(this.g.get(We(this,t))));else{t=Array.from(this.g.values());for(let a=0;a<t.length;a++)s=s.concat(t[a])}return s},i.set=function(t,s){return Te(this),this.i=null,t=We(this,t),sr(this,t)&&(this.h-=this.g.get(t).length),this.g.set(t,[s]),this.h+=1,this},i.get=function(t,s){return t?(t=this.V(t),0<t.length?String(t[0]):s):s};function or(t,s,a){rr(t,s),0<a.length&&(t.i=null,t.g.set(We(t,s),j(a)),t.h+=a.length)}i.toString=function(){if(this.i)return this.i;if(!this.g)return"";const t=[],s=Array.from(this.g.keys());for(var a=0;a<s.length;a++){var h=s[a];const I=encodeURIComponent(String(h)),_=this.V(h);for(h=0;h<_.length;h++){var w=I;_[h]!==""&&(w+="="+encodeURIComponent(String(_[h]))),t.push(w)}}return this.i=t.join("&")};function We(t,s){return s=String(s),t.j&&(s=s.toLowerCase()),s}function ua(t,s){s&&!t.j&&(Te(t),t.i=null,t.g.forEach(function(a,h){var w=h.toLowerCase();h!=w&&(rr(this,h),or(this,w,a))},t)),t.j=s}function da(t,s){const a=new ut;if(f.Image){const h=new Image;h.onload=L(_e,a,"TestLoadImage: loaded",!0,s,h),h.onerror=L(_e,a,"TestLoadImage: error",!1,s,h),h.onabort=L(_e,a,"TestLoadImage: abort",!1,s,h),h.ontimeout=L(_e,a,"TestLoadImage: timeout",!1,s,h),f.setTimeout(function(){h.ontimeout&&h.ontimeout()},1e4),h.src=t}else s(!1)}function pa(t,s){const a=new ut,h=new AbortController,w=setTimeout(()=>{h.abort(),_e(a,"TestPingServer: timeout",!1,s)},1e4);fetch(t,{signal:h.signal}).then(I=>{clearTimeout(w),I.ok?_e(a,"TestPingServer: ok",!0,s):_e(a,"TestPingServer: server error",!1,s)}).catch(()=>{clearTimeout(w),_e(a,"TestPingServer: error",!1,s)})}function _e(t,s,a,h,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),h(a)}catch{}}function fa(){this.g=new Xo}function ga(t,s,a){const h=a||"";try{er(t,function(w,I){let _=w;T(w)&&(_=Ei(w)),s.push(h+I+"="+encodeURIComponent(_))})}catch(w){throw s.push(h+"type="+encodeURIComponent("_badmap")),w}}function Bt(t){this.l=t.Ub||null,this.j=t.eb||!1}P(Bt,Si),Bt.prototype.g=function(){return new Vt(this.l,this.j)},Bt.prototype.i=function(t){return function(){return t}}({});function Vt(t,s){$.call(this),this.D=t,this.o=s,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}P(Vt,$),i=Vt.prototype,i.open=function(t,s){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=t,this.A=s,this.readyState=1,vt(this)},i.send=function(t){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const s={headers:this.u,method:this.B,credentials:this.m,cache:void 0};t&&(s.body=t),(this.D||f).fetch(new Request(this.A,s)).then(this.Sa.bind(this),this.ga.bind(this))},i.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,mt(this)),this.readyState=0},i.Sa=function(t){if(this.g&&(this.l=t,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=t.headers,this.readyState=2,vt(this)),this.g&&(this.readyState=3,vt(this),this.g)))if(this.responseType==="arraybuffer")t.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof f.ReadableStream<"u"&&"body"in t){if(this.j=t.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;ar(this)}else t.text().then(this.Ra.bind(this),this.ga.bind(this))};function ar(t){t.j.read().then(t.Pa.bind(t)).catch(t.ga.bind(t))}i.Pa=function(t){if(this.g){if(this.o&&t.value)this.response.push(t.value);else if(!this.o){var s=t.value?t.value:new Uint8Array(0);(s=this.v.decode(s,{stream:!t.done}))&&(this.response=this.responseText+=s)}t.done?mt(this):vt(this),this.readyState==3&&ar(this)}},i.Ra=function(t){this.g&&(this.response=this.responseText=t,mt(this))},i.Qa=function(t){this.g&&(this.response=t,mt(this))},i.ga=function(){this.g&&mt(this)};function mt(t){t.readyState=4,t.l=null,t.j=null,t.v=null,vt(t)}i.setRequestHeader=function(t,s){this.u.append(t,s)},i.getResponseHeader=function(t){return this.h&&this.h.get(t.toLowerCase())||""},i.getAllResponseHeaders=function(){if(!this.h)return"";const t=[],s=this.h.entries();for(var a=s.next();!a.done;)a=a.value,t.push(a[0]+": "+a[1]),a=s.next();return t.join(`\r
`)};function vt(t){t.onreadystatechange&&t.onreadystatechange.call(t)}Object.defineProperty(Vt.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(t){this.m=t?"include":"same-origin"}});function cr(t){let s="";return W(t,function(a,h){s+=h,s+=":",s+=a,s+=`\r
`}),s}function Ui(t,s,a){e:{for(h in a){var h=!1;break e}h=!0}h||(a=cr(a),typeof t=="string"?a!=null&&encodeURIComponent(String(a)):N(t,s,a))}function U(t){$.call(this),this.headers=new Map,this.o=t||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}P(U,$);var ma=/^https?$/i,va=["POST","PUT"];i=U.prototype,i.Ha=function(t){this.J=t},i.ea=function(t,s,a,h){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+t);s=s?s.toUpperCase():"GET",this.D=t,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Pi.g(),this.v=this.o?Fn(this.o):Fn(Pi),this.g.onreadystatechange=A(this.Ea,this);try{this.B=!0,this.g.open(s,String(t),!0),this.B=!1}catch(I){hr(this,I);return}if(t=a||"",a=new Map(this.headers),h)if(Object.getPrototypeOf(h)===Object.prototype)for(var w in h)a.set(w,h[w]);else if(typeof h.keys=="function"&&typeof h.get=="function")for(const I of h.keys())a.set(I,h.get(I));else throw Error("Unknown input type for opt_headers: "+String(h));h=Array.from(a.keys()).find(I=>I.toLowerCase()=="content-type"),w=f.FormData&&t instanceof f.FormData,!(0<=Array.prototype.indexOf.call(va,s,void 0))||h||w||a.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[I,_]of a)this.g.setRequestHeader(I,_);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{dr(this),this.u=!0,this.g.send(t),this.u=!1}catch(I){hr(this,I)}};function hr(t,s){t.h=!1,t.g&&(t.j=!0,t.g.abort(),t.j=!1),t.l=s,t.m=5,lr(t),zt(t)}function lr(t){t.A||(t.A=!0,V(t,"complete"),V(t,"error"))}i.abort=function(t){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=t||7,V(this,"complete"),V(this,"abort"),zt(this))},i.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),zt(this,!0)),U.aa.N.call(this)},i.Ea=function(){this.s||(this.B||this.u||this.j?ur(this):this.bb())},i.bb=function(){ur(this)};function ur(t){if(t.h&&typeof l<"u"&&(!t.v[1]||pe(t)!=4||t.Z()!=2)){if(t.u&&pe(t)==4)Mn(t.Ea,0,t);else if(V(t,"readystatechange"),pe(t)==4){t.h=!1;try{const _=t.Z();e:switch(_){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var s=!0;break e;default:s=!1}var a;if(!(a=s)){var h;if(h=_===0){var w=String(t.D).match(tr)[1]||null;!w&&f.self&&f.self.location&&(w=f.self.location.protocol.slice(0,-1)),h=!ma.test(w?w.toLowerCase():"")}a=h}if(a)V(t,"complete"),V(t,"success");else{t.m=6;try{var I=2<pe(t)?t.g.statusText:""}catch{I=""}t.l=I+" ["+t.Z()+"]",lr(t)}}finally{zt(t)}}}}function zt(t,s){if(t.g){dr(t);const a=t.g,h=t.v[0]?()=>{}:null;t.g=null,t.v=null,s||V(t,"ready");try{a.onreadystatechange=h}catch{}}}function dr(t){t.I&&(f.clearTimeout(t.I),t.I=null)}i.isActive=function(){return!!this.g};function pe(t){return t.g?t.g.readyState:0}i.Z=function(){try{return 2<pe(this)?this.g.status:-1}catch{return-1}},i.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},i.Oa=function(t){if(this.g){var s=this.g.responseText;return t&&s.indexOf(t)==0&&(s=s.substring(t.length)),Jo(s)}};function pr(t){try{if(!t.g)return null;if("response"in t.g)return t.g.response;switch(t.H){case"":case"text":return t.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in t.g)return t.g.mozResponseArrayBuffer}return null}catch{return null}}function ya(t){const s={};t=(t.g&&2<=pe(t)&&t.g.getAllResponseHeaders()||"").split(`\r
`);for(let h=0;h<t.length;h++){if(Q(t[h]))continue;var a=m(t[h]);const w=a[0];if(a=a[1],typeof a!="string")continue;a=a.trim();const I=s[w]||[];s[w]=I,I.push(a)}v(s,function(h){return h.join(", ")})}i.Ba=function(){return this.m},i.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function yt(t,s,a){return a&&a.internalChannelParams&&a.internalChannelParams[t]||s}function fr(t){this.Aa=0,this.i=[],this.j=new ut,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=yt("failFast",!1,t),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=yt("baseRetryDelayMs",5e3,t),this.cb=yt("retryDelaySeedMs",1e4,t),this.Wa=yt("forwardChannelMaxRetries",2,t),this.wa=yt("forwardChannelRequestTimeoutMs",2e4,t),this.pa=t&&t.xmlHttpFactory||void 0,this.Xa=t&&t.Tb||void 0,this.Ca=t&&t.useFetchStreams||!1,this.L=void 0,this.J=t&&t.supportsCrossDomainXhr||!1,this.K="",this.h=new Jn(t&&t.concurrentRequestLimit),this.Da=new fa,this.P=t&&t.fastHandshake||!1,this.O=t&&t.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=t&&t.Rb||!1,t&&t.xa&&this.j.xa(),t&&t.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&t&&t.detectBufferingProxy||!1,this.ja=void 0,t&&t.longPollingTimeout&&0<t.longPollingTimeout&&(this.ja=t.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}i=fr.prototype,i.la=8,i.G=1,i.connect=function(t,s,a,h){z(0),this.W=t,this.H=s||{},a&&h!==void 0&&(this.H.OSID=a,this.H.OAID=h),this.F=this.X,this.I=_r(this,null,this.W),Kt(this)};function ji(t){if(gr(t),t.G==3){var s=t.U++,a=de(t.I);if(N(a,"SID",t.K),N(a,"RID",s),N(a,"TYPE","terminate"),wt(t,a),s=new Ie(t,t.j,s),s.L=2,s.v=$t(de(a)),a=!1,f.navigator&&f.navigator.sendBeacon)try{a=f.navigator.sendBeacon(s.v.toString(),"")}catch{}!a&&f.Image&&(new Image().src=s.v,a=!0),a||(s.g=Er(s.j,null),s.g.ea(s.v)),s.F=Date.now(),xt(s)}Tr(t)}function qt(t){t.g&&(Fi(t),t.g.cancel(),t.g=null)}function gr(t){qt(t),t.u&&(f.clearTimeout(t.u),t.u=null),Wt(t),t.h.cancel(),t.s&&(typeof t.s=="number"&&f.clearTimeout(t.s),t.s=null)}function Kt(t){if(!Xn(t.h)&&!t.s){t.s=!0;var s=t.Ga;st||On(),ot||(st(),ot=!0),mi.add(s,t),t.B=0}}function wa(t,s){return Yn(t.h)>=t.h.j-(t.s?1:0)?!1:t.s?(t.i=s.D.concat(t.i),!0):t.G==1||t.G==2||t.B>=(t.Va?0:t.Wa)?!1:(t.s=lt(A(t.Ga,t,s),Ir(t,t.B)),t.B++,!0)}i.Ga=function(t){if(this.s)if(this.s=null,this.G==1){if(!t){this.U=Math.floor(1e5*Math.random()),t=this.U++;const w=new Ie(this,this.j,t);let I=this.o;if(this.S&&(I?(I=u(I),g(I,this.S)):I=this.S),this.m!==null||this.O||(w.H=I,I=null),this.P)e:{for(var s=0,a=0;a<this.i.length;a++){t:{var h=this.i[a];if("__data__"in h.map&&(h=h.map.__data__,typeof h=="string")){h=h.length;break t}h=void 0}if(h===void 0)break;if(s+=h,4096<s){s=a;break e}if(s===4096||a===this.i.length-1){s=a+1;break e}}s=1e3}else s=1e3;s=vr(this,w,s),a=de(this.I),N(a,"RID",t),N(a,"CVER",22),this.D&&N(a,"X-HTTP-Session-Id",this.D),wt(this,a),I&&(this.O?s="headers="+encodeURIComponent(String(cr(I)))+"&"+s:this.m&&Ui(a,this.m,I)),Mi(this.h,w),this.Ua&&N(a,"TYPE","init"),this.P?(N(a,"$req",s),N(a,"SID","null"),w.T=!0,Ri(w,a,null)):Ri(w,a,s),this.G=2}}else this.G==3&&(t?mr(this,t):this.i.length==0||Xn(this.h)||mr(this))};function mr(t,s){var a;s?a=s.l:a=t.U++;const h=de(t.I);N(h,"SID",t.K),N(h,"RID",a),N(h,"AID",t.T),wt(t,h),t.m&&t.o&&Ui(h,t.m,t.o),a=new Ie(t,t.j,a,t.B+1),t.m===null&&(a.H=t.o),s&&(t.i=s.D.concat(t.i)),s=vr(t,a,1e3),a.I=Math.round(.5*t.wa)+Math.round(.5*t.wa*Math.random()),Mi(t.h,a),Ri(a,h,s)}function wt(t,s){t.H&&W(t.H,function(a,h){N(s,h,a)}),t.l&&er({},function(a,h){N(s,h,a)})}function vr(t,s,a){a=Math.min(t.i.length,a);var h=t.l?A(t.l.Na,t.l,t):null;e:{var w=t.i;let I=-1;for(;;){const _=["count="+a];I==-1?0<a?(I=w[0].g,_.push("ofs="+I)):I=0:_.push("ofs="+I);let D=!0;for(let x=0;x<a;x++){let R=w[x].g;const B=w[x].map;if(R-=I,0>R)I=Math.max(0,w[x].g-100),D=!1;else try{ga(B,_,"req"+R+"_")}catch{h&&h(B)}}if(D){h=_.join("&");break e}}}return t=t.i.splice(0,a),s.D=t,h}function yr(t){if(!t.g&&!t.u){t.Y=1;var s=t.Fa;st||On(),ot||(st(),ot=!0),mi.add(s,t),t.v=0}}function xi(t){return t.g||t.u||3<=t.v?!1:(t.Y++,t.u=lt(A(t.Fa,t),Ir(t,t.v)),t.v++,!0)}i.Fa=function(){if(this.u=null,wr(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var t=2*this.R;this.j.info("BP detection timer enabled: "+t),this.A=lt(A(this.ab,this),t)}},i.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,z(10),qt(this),wr(this))};function Fi(t){t.A!=null&&(f.clearTimeout(t.A),t.A=null)}function wr(t){t.g=new Ie(t,t.j,"rpc",t.Y),t.m===null&&(t.g.H=t.o),t.g.O=0;var s=de(t.qa);N(s,"RID","rpc"),N(s,"SID",t.K),N(s,"AID",t.T),N(s,"CI",t.F?"0":"1"),!t.F&&t.ja&&N(s,"TO",t.ja),N(s,"TYPE","xmlhttp"),wt(t,s),t.m&&t.o&&Ui(s,t.m,t.o),t.L&&(t.g.I=t.L);var a=t.g;t=t.ia,a.L=1,a.v=$t(de(s)),a.m=null,a.P=!0,Kn(a,t)}i.Za=function(){this.C!=null&&(this.C=null,qt(this),xi(this),z(19))};function Wt(t){t.C!=null&&(f.clearTimeout(t.C),t.C=null)}function br(t,s){var a=null;if(t.g==s){Wt(t),Fi(t),t.g=null;var h=2}else if(Li(t.h,s))a=s.D,Qn(t.h,s),h=1;else return;if(t.G!=0){if(s.o)if(h==1){a=s.m?s.m.length:0,s=Date.now()-s.F;var w=t.B;h=Ci(),V(h,new Vn(h,a)),Kt(t)}else yr(t);else if(w=s.s,w==3||w==0&&0<s.X||!(h==1&&wa(t,s)||h==2&&xi(t)))switch(a&&0<a.length&&(s=t.h,s.i=s.i.concat(a)),w){case 1:Ue(t,5);break;case 4:Ue(t,10);break;case 3:Ue(t,6);break;default:Ue(t,2)}}}function Ir(t,s){let a=t.Ta+Math.floor(Math.random()*t.cb);return t.isActive()||(a*=2),a*s}function Ue(t,s){if(t.j.info("Error code "+s),s==2){var a=A(t.fb,t),h=t.Xa;const w=!h;h=new Me(h||"//www.google.com/images/cleardot.gif"),f.location&&f.location.protocol=="http"||Ft(h,"https"),$t(h),w?da(h.toString(),a):pa(h.toString(),a)}else z(2);t.G=0,t.l&&t.l.sa(s),Tr(t),gr(t)}i.fb=function(t){t?(this.j.info("Successfully pinged google.com"),z(2)):(this.j.info("Failed to ping google.com"),z(1))};function Tr(t){if(t.G=0,t.ka=[],t.l){const s=Zn(t.h);(s.length!=0||t.i.length!=0)&&(M(t.ka,s),M(t.ka,t.i),t.h.i.length=0,j(t.i),t.i.length=0),t.l.ra()}}function _r(t,s,a){var h=a instanceof Me?de(a):new Me(a);if(h.g!="")s&&(h.g=s+"."+h.g),Ht(h,h.s);else{var w=f.location;h=w.protocol,s=s?s+"."+w.hostname:w.hostname,w=+w.port;var I=new Me(null);h&&Ft(I,h),s&&(I.g=s),w&&Ht(I,w),a&&(I.l=a),h=I}return a=t.D,s=t.ya,a&&s&&N(h,a,s),N(h,"VER",t.la),wt(t,h),h}function Er(t,s,a){if(s&&!t.J)throw Error("Can't create secondary domain capable XhrIo object.");return s=t.Ca&&!t.pa?new U(new Bt({eb:a})):new U(t.pa),s.Ha(t.J),s}i.isActive=function(){return!!this.l&&this.l.isActive(this)};function Sr(){}i=Sr.prototype,i.ua=function(){},i.ta=function(){},i.sa=function(){},i.ra=function(){},i.isActive=function(){return!0},i.Na=function(){};function ee(t,s){$.call(this),this.g=new fr(s),this.l=t,this.h=s&&s.messageUrlParams||null,t=s&&s.messageHeaders||null,s&&s.clientProtocolHeaderRequired&&(t?t["X-Client-Protocol"]="webchannel":t={"X-Client-Protocol":"webchannel"}),this.g.o=t,t=s&&s.initMessageHeaders||null,s&&s.messageContentType&&(t?t["X-WebChannel-Content-Type"]=s.messageContentType:t={"X-WebChannel-Content-Type":s.messageContentType}),s&&s.va&&(t?t["X-WebChannel-Client-Profile"]=s.va:t={"X-WebChannel-Client-Profile":s.va}),this.g.S=t,(t=s&&s.Sb)&&!Q(t)&&(this.g.m=t),this.v=s&&s.supportsCrossDomainXhr||!1,this.u=s&&s.sendRawJson||!1,(s=s&&s.httpSessionIdParam)&&!Q(s)&&(this.g.D=s,t=this.h,t!==null&&s in t&&(t=this.h,s in t&&delete t[s])),this.j=new Ge(this)}P(ee,$),ee.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},ee.prototype.close=function(){ji(this.g)},ee.prototype.o=function(t){var s=this.g;if(typeof t=="string"){var a={};a.__data__=t,t=a}else this.u&&(a={},a.__data__=Ei(t),t=a);s.i.push(new ia(s.Ya++,t)),s.G==3&&Kt(s)},ee.prototype.N=function(){this.g.l=null,delete this.j,ji(this.g),delete this.g,ee.aa.N.call(this)};function kr(t){ki.call(this),t.__headers__&&(this.headers=t.__headers__,this.statusCode=t.__status__,delete t.__headers__,delete t.__status__);var s=t.__sm__;if(s){e:{for(const a in s){t=a;break e}t=void 0}(this.i=t)&&(t=this.i,s=s!==null&&t in s?s[t]:void 0),this.data=s}else this.data=t}P(kr,ki);function Ar(){Ai.call(this),this.status=1}P(Ar,Ai);function Ge(t){this.g=t}P(Ge,Sr),Ge.prototype.ua=function(){V(this.g,"a")},Ge.prototype.ta=function(t){V(this.g,new kr(t))},Ge.prototype.sa=function(t){V(this.g,new Ar)},Ge.prototype.ra=function(){V(this.g,"b")},ee.prototype.send=ee.prototype.o,ee.prototype.open=ee.prototype.m,ee.prototype.close=ee.prototype.close,$.prototype.listen=$.prototype.K,U.prototype.listenOnce=U.prototype.L,U.prototype.getLastError=U.prototype.Ka,U.prototype.getLastErrorCode=U.prototype.Ba,U.prototype.getStatus=U.prototype.Z,U.prototype.getResponseJson=U.prototype.Oa,U.prototype.getResponseText=U.prototype.oa,U.prototype.send=U.prototype.ea,U.prototype.setWithCredentials=U.prototype.Ha}).apply(typeof Xt<"u"?Xt:typeof self<"u"?self:typeof window<"u"?window:{});const us="@firebase/firestore";/**
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
*/class q{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}q.UNAUTHENTICATED=new q(null),q.GOOGLE_CREDENTIALS=new q("google-credentials-uid"),q.FIRST_PARTY=new q("first-party-uid"),q.MOCK_USER=new q("mock-user");/**
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
*/let Nt="10.14.0";/**
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
*/const tt=new ui("@firebase/firestore");function re(i,...e){if(tt.logLevel<=O.DEBUG){const n=e.map(kn);tt.debug(`Firestore (${Nt}): ${i}`,...n)}}function Uo(i,...e){if(tt.logLevel<=O.ERROR){const n=e.map(kn);tt.error(`Firestore (${Nt}): ${i}`,...n)}}function md(i,...e){if(tt.logLevel<=O.WARN){const n=e.map(kn);tt.warn(`Firestore (${Nt}): ${i}`,...n)}}function kn(i){if(typeof i=="string")return i;try{/**
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
*/return function(e){return JSON.stringify(e)}(i)}catch{return i}}/**
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
*/function An(i="Unexpected state"){const e=`FIRESTORE (${Nt}) INTERNAL ASSERTION FAILED: `+i;throw Uo(e),new Error(e)}function Tt(i,e){i||An()}/**
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
*/const J={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class X extends oe{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
*/class _t{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
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
*/class jo{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class vd{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(q.UNAUTHENTICATED))}shutdown(){}}class yd{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class wd{constructor(e){this.t=e,this.currentUser=q.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){Tt(this.o===void 0);let r=this.i;const o=y=>this.i!==r?(r=this.i,n(y)):Promise.resolve();let c=new _t;this.o=()=>{this.i++,this.currentUser=this.u(),c.resolve(),c=new _t,e.enqueueRetryable(()=>o(this.currentUser))};const l=()=>{const y=c;e.enqueueRetryable(async()=>{await y.promise,await o(this.currentUser)})},f=y=>{re("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=y,this.o&&(this.auth.addAuthTokenListener(this.o),l())};this.t.onInit(y=>f(y)),setTimeout(()=>{if(!this.auth){const y=this.t.getImmediate({optional:!0});y?f(y):(re("FirebaseAuthCredentialsProvider","Auth not yet detected"),c.resolve(),c=new _t)}},0),l()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(r=>this.i!==e?(re("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Tt(typeof r.accessToken=="string"),new jo(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Tt(e===null||typeof e=="string"),new q(e)}}class bd{constructor(e,n,r){this.l=e,this.h=n,this.P=r,this.type="FirstParty",this.user=q.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class Id{constructor(e,n,r){this.l=e,this.h=n,this.P=r}getToken(){return Promise.resolve(new bd(this.l,this.h,this.P))}start(e,n){e.enqueueRetryable(()=>n(q.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Td{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class _d{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,n){Tt(this.o===void 0);const r=c=>{c.error!=null&&re("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${c.error.message}`);const l=c.token!==this.R;return this.R=c.token,re("FirebaseAppCheckTokenProvider",`Received ${l?"new":"existing"} token.`),l?n(c.token):Promise.resolve()};this.o=c=>{e.enqueueRetryable(()=>r(c))};const o=c=>{re("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=c,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(c=>o(c)),setTimeout(()=>{if(!this.appCheck){const c=this.A.getImmediate({optional:!0});c?o(c):re("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(Tt(typeof n.token=="string"),this.R=n.token,new Td(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}function Ed(i){return i.name==="IndexedDbTransactionError"}class li{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new li("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof li&&e.projectId===this.projectId&&e.database===this.database}}/**
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
*/var ds,C;(C=ds||(ds={}))[C.OK=0]="OK",C[C.CANCELLED=1]="CANCELLED",C[C.UNKNOWN=2]="UNKNOWN",C[C.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",C[C.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",C[C.NOT_FOUND=5]="NOT_FOUND",C[C.ALREADY_EXISTS=6]="ALREADY_EXISTS",C[C.PERMISSION_DENIED=7]="PERMISSION_DENIED",C[C.UNAUTHENTICATED=16]="UNAUTHENTICATED",C[C.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",C[C.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",C[C.ABORTED=10]="ABORTED",C[C.OUT_OF_RANGE=11]="OUT_OF_RANGE",C[C.UNIMPLEMENTED=12]="UNIMPLEMENTED",C[C.INTERNAL=13]="INTERNAL",C[C.UNAVAILABLE=14]="UNAVAILABLE",C[C.DATA_LOSS=15]="DATA_LOSS";/**
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
*/new Mo([4294967295,4294967295],0);function Yi(){return typeof document<"u"?document:null}/**
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
*/class Sd{constructor(e,n,r=1e3,o=1.5,c=6e4){this.ui=e,this.timerId=n,this.ko=r,this.qo=o,this.Qo=c,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const n=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),o=Math.max(0,n-r);o>0&&re("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.Ko} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,o,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
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
*/class Cn{constructor(e,n,r,o,c){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=r,this.op=o,this.removalCallback=c,this.deferred=new _t,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(l=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,r,o,c){const l=Date.now()+r,f=new Cn(e,n,l,o,c);return f.start(r),f}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new X(J.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var ps,fs;(fs=ps||(ps={})).ea="default",fs.Cache="cache";/**
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
*/function kd(i){const e={};return i.timeoutSeconds!==void 0&&(e.timeoutSeconds=i.timeoutSeconds),e}/**
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
*/const gs=new Map;function Ad(i,e,n,r){if(e===!0&&r===!0)throw new X(J.INVALID_ARGUMENT,`${i} and ${n} cannot be used together.`)}function Cd(i){if(i===void 0)return"undefined";if(i===null)return"null";if(typeof i=="string")return i.length>20&&(i=`${i.substring(0,20)}...`),JSON.stringify(i);if(typeof i=="number"||typeof i=="boolean")return""+i;if(typeof i=="object"){if(i instanceof Array)return"an array";{const e=function(n){return n.constructor?n.constructor.name:null}(i);return e?`a custom ${e} object`:"an object"}}return typeof i=="function"?"a function":An()}function Pd(i,e){if("_delegate"in i&&(i=i._delegate),!(i instanceof e)){if(e.name===i.constructor.name)throw new X(J.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Cd(i);throw new X(J.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return i}/**
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
*/class ms{constructor(e){var n,r;if(e.host===void 0){if(e.ssl!==void 0)throw new X(J.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new X(J.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Ad("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=kd((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(o){if(o.timeoutSeconds!==void 0){if(isNaN(o.timeoutSeconds))throw new X(J.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (must not be NaN)`);if(o.timeoutSeconds<5)throw new X(J.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (minimum allowed value is 5)`);if(o.timeoutSeconds>30)throw new X(J.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(n,r){return n.timeoutSeconds===r.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class xo{constructor(e,n,r,o){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ms({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new X(J.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new X(J.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ms(e),e.credentials!==void 0&&(this._authCredentials=function(n){if(!n)return new vd;switch(n.type){case"firstParty":return new Id(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new X(J.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const n=gs.get(e);n&&(re("ComponentProvider","Removing Datastore"),gs.delete(e),n.terminate())}(this),Promise.resolve()}}function Od(i,e,n,r={}){var o;const c=(i=Pd(i,xo))._getSettings(),l=`${e}:${n}`;if(c.host!=="firestore.googleapis.com"&&c.host!==l&&md("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),i._setSettings(Object.assign(Object.assign({},c),{host:l,ssl:!1})),r.mockUserToken){let f,y;if(typeof r.mockUserToken=="string")f=r.mockUserToken,y=q.MOCK_USER;else{f=Pa(r.mockUserToken,(o=i._app)===null||o===void 0?void 0:o.options.projectId);const T=r.mockUserToken.sub||r.mockUserToken.user_id;if(!T)throw new X(J.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");y=new q(T)}i._authCredentials=new yd(new jo(f,y))}}/**
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
*/class vs{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Sd(this,"async_queue_retry"),this.Vu=()=>{const r=Yi();r&&re("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const n=Yi();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const n=Yi();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const n=new _t;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Ed(e))throw e;re("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const n=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const o=function(c){let l=c.message||"";return c.stack&&(l=c.stack.includes(c.message)?c.stack:c.message+`
`+c.stack),l}(r);throw Uo("INTERNAL UNHANDLED ERROR: ",o),r}).then(r=>(this.du=!1,r))));return this.mu=n,n}enqueueAfterDelay(e,n,r){this.fu(),this.Ru.indexOf(e)>-1&&(n=0);const o=Cn.createAndSchedule(this,e,n,r,c=>this.yu(c));return this.Tu.push(o),o}fu(){this.Eu&&An()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const n of this.Tu)if(n.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((n,r)=>n.targetTimeMs-r.targetTimeMs);for(const n of this.Tu)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const n=this.Tu.indexOf(e);this.Tu.splice(n,1)}}class Rd extends xo{constructor(e,n,r,o){super(e,n,r,o),this.type="firestore",this._queue=new vs,this._persistenceKey=o?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new vs(e),this._firestoreClient=void 0,await e}}}function Nd(i,e){const n=typeof i=="object"?i:ln(),r=typeof i=="string"?i:"(default)",o=ze(n,"firestore").getImmediate({identifier:r});if(!o._initialized){const c=Aa("firestore");c&&Od(o,...c)}return o}(function(i,e=!0){(function(n){Nt=n})(it),he(new se("firestore",(n,{instanceIdentifier:r,options:o})=>{const c=n.getProvider("app").getImmediate(),l=new Rd(new wd(n.getProvider("auth-internal")),new _d(n.getProvider("app-check-internal")),function(f,y){if(!Object.prototype.hasOwnProperty.apply(f.options,["projectId"]))throw new X(J.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new li(f.options.projectId,y)}(c,r),c);return o=Object.assign({useFetchStreams:e},o),l._setSettings(o),l},"PUBLIC").setMultipleInstances(!0)),te(us,"4.7.3",i),te(us,"4.7.3","esm2017")})();const Dd={apiKey:"AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0",authDomain:"ball-network-web.firebaseapp.com",databaseURL:"https://ball-network-web-default-rtdb.firebaseio.com",projectId:"ball-network-web",storageBucket:"ball-network-web.appspot.com",messagingSenderId:"740915998465",appId:"1:740915998465:web:59ac026f3f4c2ec5da3500",measurementId:"G-ZS07SKSRRL"},Pn=Rs(Dd);fd(Pn);Nd(Pn);gl(Pn);class Ld{constructor(){this.registering=!1,this.registration=null}async initialize(){if(!(!("serviceWorker"in navigator)||this.registering)){this.registering=!0;try{this.registration=await navigator.serviceWorker.register("/sw.js"),console.log("SW registered: ",this.registration),this.startUpdateChecking(),this.setupUpdateHandling(),this.setupControllerChangeHandling()}catch(e){console.error("SW registration failed: ",e)}}}startUpdateChecking(){this.registration.update(),setInterval(()=>{this.registration.update()},5e3)}setupUpdateHandling(){this.registration.addEventListener("updatefound",()=>{const e=this.registration.installing;console.log("New service worker found, installing..."),e.addEventListener("statechange",()=>{e.state==="installed"&&(navigator.serviceWorker.controller?(console.log("New version available, updating immediately..."),e.postMessage({type:"SKIP_WAITING"})):console.log("App is cached for the first time"))})})}setupControllerChangeHandling(){navigator.serviceWorker.addEventListener("controllerchange",()=>{console.log("Service worker controller changed, reloading page..."),window.location.reload()})}async clearAllCaches(){if(console.log("Clearing all caches..."),this.registration?.active&&this.registration.active.postMessage({type:"CLEAR_CACHE"}),"caches"in window){const e=await caches.keys();await Promise.all(e.map(n=>caches.delete(n)))}console.log("All caches cleared, reloading..."),window.location.reload()}async forceUpdate(){this.registration&&(await this.registration.update(),console.log("Forced service worker update check"))}}const At=new Ld;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>At.initialize()):At.initialize();window.clearAllCaches=()=>At.clearAllCaches();window.forceUpdate=()=>At.forceUpdate();window.swManager=At;const Md=()=>location.hostname==="localhost"||location.hostname==="127.0.0.1"||location.hostname==="0.0.0.0"||location.port==="3000"||location.search.includes("dev=true")||sessionStorage.getItem("dev_mode")==="true",ys=()=>typeof import.meta<"u"&&void 0;if(Md()){console.log("%c🏀 3 Ball Network - Development Mode","background: linear-gradient(45deg, #00b4d8, #007cba); color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold;"),console.log("🔥 HMR Status:","Not Available"),console.log("🌍 Environment:",{hostname:location.hostname,port:location.port,protocol:location.protocol,viteHMR:ys()});const i=document.createElement("div");i.id="dev-indicator",i.innerHTML=`
    <div style="
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(0, 180, 216, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      z-index: 9999;
      font-family: monospace;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      cursor: pointer;
    ">
      🔥 DEV 
    </div>
  `,document.addEventListener("DOMContentLoaded",()=>{document.body.appendChild(i),i.addEventListener("click",()=>{console.group("🛠️ Development Information"),console.log("📱 Viewport:",{width:window.innerWidth,height:window.innerHeight,devicePixelRatio:window.devicePixelRatio}),console.log("🔄 HMR Features:",{viteHMR:ys(),cssHMR:!!document.querySelector("style[data-vite-dev-id]"),jsHMR:typeof import.meta<"u"&&!1}),console.log("📊 Performance:",{domContentLoaded:performance.timing.domContentLoadedEventEnd-performance.timing.navigationStart,loadComplete:performance.timing.loadEventEnd-performance.timing.navigationStart}),console.groupEnd()})}),window.addEventListener("load",()=>{setTimeout(()=>{const e=performance.getEntriesByType("navigation")[0];e&&console.log("⚡ Performance Metrics:",{"DOM Content Loaded":`${Math.round(e.domContentLoadedEventEnd-e.domContentLoadedEventStart)}ms`,"Load Complete":`${Math.round(e.loadEventEnd-e.loadEventStart)}ms`,"First Paint":performance.getEntriesByType("paint").find(n=>n.name==="first-paint")?.startTime||"N/A"})},1e3)}),window.addEventListener("error",e=>{console.group("❌ JavaScript Error"),console.error("Message:",e.message),console.error("File:",e.filename),console.error("Line:",e.lineno),console.error("Column:",e.colno),console.error("Stack:",e.error?.stack),console.groupEnd()}),window.addEventListener("unhandledrejection",e=>{console.group("❌ Unhandled Promise Rejection"),console.error("Reason:",e.reason),console.groupEnd()})}
//# sourceMappingURL=index-CMmvONJd.js.map
