!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=2)}([function(e,t,n){"use strict";function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}Object.defineProperty(t,"__esModule",{value:!0}),t.refreshView=t.getExpandedCellData=void 0;var o=n(10),i=r(o),s=n(13),a=r(s),u=new Date,c=(t.getExpandedCellData=function(e){return new Promise(function(t,n){i.getExpandedMSPMap(e).then(function(e){t(e)})})},t.refreshView=function(e,t){i.getMSPMap(e).then(function(n){a.refreshCells(n,e,t)})});a.init(u),c(u,"party")},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.strToDate=function(e){var t=e.indexOf("T");-1!=t&&(e=e.substring(0,t),e=e.replace(/\s+/g,""));var n=e.split("-"),r=n[0],o=n[1],i=n[2];return new Date(r,o-1,i)},t.dateToStr=function(e){var t=e.getFullYear(),n=""+(e.getMonth()+1);n=n.length<2?"0"+n:n;var r=""+e.getDate();return r=r.length<2?"0"+r:r,t+"-"+n+"-"+r},t.replaceNewlines=function(e){return e.replace(/(?:\\[rn])+/g,". ")}},function(e,t,n){n(3),n(4),n(9),e.exports=n(0)},function(e,t,n){"use strict";/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */
"document"in window.self&&("classList"in document.createElement("_")&&(!document.createElementNS||"classList"in document.createElementNS("http://www.w3.org/2000/svg","g"))||function(e){if("Element"in e){var t=e.Element.prototype,n=Object,r=String.prototype.trim||function(){return this.replace(/^\s+|\s+$/g,"")},o=Array.prototype.indexOf||function(e){for(var t=0,n=this.length;t<n;t++)if(t in this&&this[t]===e)return t;return-1},i=function(e,t){this.name=e,this.code=DOMException[e],this.message=t},s=function(e,t){if(""===t)throw new i("SYNTAX_ERR","An invalid or illegal string was specified");if(/\s/.test(t))throw new i("INVALID_CHARACTER_ERR","String contains an invalid character");return o.call(e,t)},a=function(e){for(var t=r.call(e.getAttribute("class")||""),n=t?t.split(/\s+/):[],o=0,i=n.length;o<i;o++)this.push(n[o]);this._updateClassName=function(){e.setAttribute("class",this.toString())}},u=a.prototype=[],c=function(){return new a(this)};if(i.prototype=Error.prototype,u.item=function(e){return this[e]||null},u.contains=function(e){return e+="",-1!==s(this,e)},u.add=function(){var e,t=arguments,n=0,r=t.length,o=!1;do{e=t[n]+"",-1===s(this,e)&&(this.push(e),o=!0)}while(++n<r);o&&this._updateClassName()},u.remove=function(){var e,t,n=arguments,r=0,o=n.length,i=!1;do{for(e=n[r]+"",t=s(this,e);-1!==t;)this.splice(t,1),i=!0,t=s(this,e)}while(++r<o);i&&this._updateClassName()},u.toggle=function(e,t){e+="";var n=this.contains(e),r=n?!0!==t&&"remove":!1!==t&&"add";return r&&this[r](e),!0===t||!1===t?t:!n},u.toString=function(){return this.join(" ")},n.defineProperty){var l={get:c,enumerable:!0,configurable:!0};try{n.defineProperty(t,"classList",l)}catch(e){void 0!==e.number&&-2146823252!==e.number||(l.enumerable=!1,n.defineProperty(t,"classList",l))}}else n.prototype.__defineGetter__&&t.__defineGetter__("classList",c)}}(window.self),function(){var e=document.createElement("_");if(e.classList.add("c1","c2"),!e.classList.contains("c2")){var t=function(e){var t=DOMTokenList.prototype[e];DOMTokenList.prototype[e]=function(e){var n,r=arguments.length;for(n=0;n<r;n++)e=arguments[n],t.call(this,e)}};t("add"),t("remove")}if(e.classList.toggle("c3",!1),e.classList.contains("c3")){var n=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(e,t){return 1 in arguments&&!this.contains(e)==!t?t:n.call(this,e)}}e=null}())},function(e,t,n){"use strict";(function(t){var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(r){function o(){}function i(e,t){return function(){e.apply(t,arguments)}}function s(e){if("object"!==n(this))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],d(e,this)}function a(e,t){for(;3===e._state;)e=e._value;if(0===e._state)return void e._deferreds.push(t);e._handled=!0,s._immediateFn(function(){var n=1===e._state?t.onFulfilled:t.onRejected;if(null===n)return void(1===e._state?u:c)(t.promise,e._value);var r;try{r=n(e._value)}catch(e){return void c(t.promise,e)}u(t.promise,r)})}function u(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"===(void 0===t?"undefined":n(t))||"function"==typeof t)){var r=t.then;if(t instanceof s)return e._state=3,e._value=t,void l(e);if("function"==typeof r)return void d(i(r,t),e)}e._state=1,e._value=t,l(e)}catch(t){c(e,t)}}function c(e,t){e._state=2,e._value=t,l(e)}function l(e){2===e._state&&0===e._deferreds.length&&s._immediateFn(function(){e._handled||s._unhandledRejectionFn(e._value)});for(var t=0,n=e._deferreds.length;t<n;t++)a(e,e._deferreds[t]);e._deferreds=null}function f(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n}function d(e,t){var n=!1;try{e(function(e){n||(n=!0,u(t,e))},function(e){n||(n=!0,c(t,e))})}catch(e){if(n)return;n=!0,c(t,e)}}var p=setTimeout;s.prototype.catch=function(e){return this.then(null,e)},s.prototype.then=function(e,t){var n=new this.constructor(o);return a(this,new f(e,t,n)),n},s.all=function(e){var t=Array.prototype.slice.call(e);return new s(function(e,r){function o(s,a){try{if(a&&("object"===(void 0===a?"undefined":n(a))||"function"==typeof a)){var u=a.then;if("function"==typeof u)return void u.call(a,function(e){o(s,e)},r)}t[s]=a,0==--i&&e(t)}catch(e){r(e)}}if(0===t.length)return e([]);for(var i=t.length,s=0;s<t.length;s++)o(s,t[s])})},s.resolve=function(e){return e&&"object"===(void 0===e?"undefined":n(e))&&e.constructor===s?e:new s(function(t){t(e)})},s.reject=function(e){return new s(function(t,n){n(e)})},s.race=function(e){return new s(function(t,n){for(var r=0,o=e.length;r<o;r++)e[r].then(t,n)})},s._immediateFn="function"==typeof t&&function(e){t(e)}||function(e){p(e,0)},s._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},s._setImmediateFn=function(e){s._immediateFn=e},s._setUnhandledRejectionFn=function(e){s._unhandledRejectionFn=e},void 0!==e&&e.exports?e.exports=s:r.Promise||(r.Promise=s)}(void 0)}).call(t,n(5).setImmediate)},function(e,t,n){"use strict";function r(e,t){this._id=e,this._clearFn=t}var o=Function.prototype.apply;t.setTimeout=function(){return new r(o.call(setTimeout,window,arguments),clearTimeout)},t.setInterval=function(){return new r(o.call(setInterval,window,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e&&e.close()},r.prototype.unref=r.prototype.ref=function(){},r.prototype.close=function(){this._clearFn.call(window,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},n(6),t.setImmediate=setImmediate,t.clearImmediate=clearImmediate},function(e,t,n){"use strict";(function(e,t){!function(e,n){function r(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),n=0;n<t.length;n++)t[n]=arguments[n+1];var r={callback:e,args:t};return c[u]=r,a(u),u++}function o(e){delete c[e]}function i(e){var t=e.callback,r=e.args;switch(r.length){case 0:t();break;case 1:t(r[0]);break;case 2:t(r[0],r[1]);break;case 3:t(r[0],r[1],r[2]);break;default:t.apply(n,r)}}function s(e){if(l)setTimeout(s,0,e);else{var t=c[e];if(t){l=!0;try{i(t)}finally{o(e),l=!1}}}}if(!e.setImmediate){var a,u=1,c={},l=!1,f=e.document,d=Object.getPrototypeOf&&Object.getPrototypeOf(e);d=d&&d.setTimeout?d:e,"[object process]"==={}.toString.call(e.process)?function(){a=function(e){t.nextTick(function(){s(e)})}}():function(){if(e.postMessage&&!e.importScripts){var t=!0,n=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage("","*"),e.onmessage=n,t}}()?function(){var t="setImmediate$"+Math.random()+"$",n=function(n){n.source===e&&"string"==typeof n.data&&0===n.data.indexOf(t)&&s(+n.data.slice(t.length))};e.addEventListener?e.addEventListener("message",n,!1):e.attachEvent("onmessage",n),a=function(n){e.postMessage(t+n,"*")}}():e.MessageChannel?function(){var e=new MessageChannel;e.port1.onmessage=function(e){s(e.data)},a=function(t){e.port2.postMessage(t)}}():f&&"onreadystatechange"in f.createElement("script")?function(){var e=f.documentElement;a=function(t){var n=f.createElement("script");n.onreadystatechange=function(){s(t),n.onreadystatechange=null,e.removeChild(n),n=null},e.appendChild(n)}}():function(){a=function(e){setTimeout(s,0,e)}}(),d.setImmediate=r,d.clearImmediate=o}}("undefined"==typeof self?void 0===e?void 0:e:self)}).call(t,n(7),n(8))},function(e,t,n){"use strict";var r,o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};r=function(){return this}();try{r=r||Function("return this")()||(0,eval)("this")}catch(e){"object"===("undefined"==typeof window?"undefined":o(window))&&(r=window)}e.exports=r},function(e,t,n){"use strict";function r(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function i(e){if(f===setTimeout)return setTimeout(e,0);if((f===r||!f)&&setTimeout)return f=setTimeout,setTimeout(e,0);try{return f(e,0)}catch(t){try{return f.call(null,e,0)}catch(t){return f.call(this,e,0)}}}function s(e){if(d===clearTimeout)return clearTimeout(e);if((d===o||!d)&&clearTimeout)return d=clearTimeout,clearTimeout(e);try{return d(e)}catch(t){try{return d.call(null,e)}catch(t){return d.call(this,e)}}}function a(){y&&m&&(y=!1,m.length?h=m.concat(h):v=-1,h.length&&u())}function u(){if(!y){var e=i(a);y=!0;for(var t=h.length;t;){for(m=h,h=[];++v<t;)m&&m[v].run();v=-1,t=h.length}m=null,y=!1,s(e)}}function c(e,t){this.fun=e,this.array=t}function l(){}var f,d,p=e.exports={};!function(){try{f="function"==typeof setTimeout?setTimeout:r}catch(e){f=r}try{d="function"==typeof clearTimeout?clearTimeout:o}catch(e){d=o}}();var m,h=[],y=!1,v=-1;p.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];h.push(new c(e,t)),1!==h.length||y||i(u)},c.prototype.run=function(){this.fun.apply(null,this.array)},p.title="browser",p.browser=!0,p.env={},p.argv=[],p.version="",p.versions={},p.on=l,p.addListener=l,p.once=l,p.off=l,p.removeListener=l,p.removeAllListeners=l,p.emit=l,p.prependListener=l,p.prependOnceListener=l,p.listeners=function(e){return[]},p.binding=function(e){throw new Error("process.binding is not supported")},p.cwd=function(){return"/"},p.chdir=function(e){throw new Error("process.chdir is not supported")},p.umask=function(){return 0}},function(e,t,n){"use strict";!function(e){function t(e){if("string"!=typeof e&&(e=String(e)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(e))throw new TypeError("Invalid character in header field name");return e.toLowerCase()}function n(e){return"string"!=typeof e&&(e=String(e)),e}function r(e){var t={next:function(){var t=e.shift();return{done:void 0===t,value:t}}};return v.iterable&&(t[Symbol.iterator]=function(){return t}),t}function o(e){this.map={},e instanceof o?e.forEach(function(e,t){this.append(t,e)},this):Array.isArray(e)?e.forEach(function(e){this.append(e[0],e[1])},this):e&&Object.getOwnPropertyNames(e).forEach(function(t){this.append(t,e[t])},this)}function i(e){if(e.bodyUsed)return Promise.reject(new TypeError("Already read"));e.bodyUsed=!0}function s(e){return new Promise(function(t,n){e.onload=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function a(e){var t=new FileReader,n=s(t);return t.readAsArrayBuffer(e),n}function u(e){var t=new FileReader,n=s(t);return t.readAsText(e),n}function c(e){for(var t=new Uint8Array(e),n=new Array(t.length),r=0;r<t.length;r++)n[r]=String.fromCharCode(t[r]);return n.join("")}function l(e){if(e.slice)return e.slice(0);var t=new Uint8Array(e.byteLength);return t.set(new Uint8Array(e)),t.buffer}function f(){return this.bodyUsed=!1,this._initBody=function(e){if(this._bodyInit=e,e)if("string"==typeof e)this._bodyText=e;else if(v.blob&&Blob.prototype.isPrototypeOf(e))this._bodyBlob=e;else if(v.formData&&FormData.prototype.isPrototypeOf(e))this._bodyFormData=e;else if(v.searchParams&&URLSearchParams.prototype.isPrototypeOf(e))this._bodyText=e.toString();else if(v.arrayBuffer&&v.blob&&g(e))this._bodyArrayBuffer=l(e.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!v.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(e)&&!w(e))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=l(e)}else this._bodyText="";this.headers.get("content-type")||("string"==typeof e?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):v.searchParams&&URLSearchParams.prototype.isPrototypeOf(e)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},v.blob&&(this.blob=function(){var e=i(this);if(e)return e;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?i(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(a)}),this.text=function(){var e=i(this);if(e)return e;if(this._bodyBlob)return u(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(c(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},v.formData&&(this.formData=function(){return this.text().then(m)}),this.json=function(){return this.text().then(JSON.parse)},this}function d(e){var t=e.toUpperCase();return _.indexOf(t)>-1?t:e}function p(e,t){t=t||{};var n=t.body;if(e instanceof p){if(e.bodyUsed)throw new TypeError("Already read");this.url=e.url,this.credentials=e.credentials,t.headers||(this.headers=new o(e.headers)),this.method=e.method,this.mode=e.mode,n||null==e._bodyInit||(n=e._bodyInit,e.bodyUsed=!0)}else this.url=String(e);if(this.credentials=t.credentials||this.credentials||"omit",!t.headers&&this.headers||(this.headers=new o(t.headers)),this.method=d(t.method||this.method||"GET"),this.mode=t.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&n)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(n)}function m(e){var t=new FormData;return e.trim().split("&").forEach(function(e){if(e){var n=e.split("="),r=n.shift().replace(/\+/g," "),o=n.join("=").replace(/\+/g," ");t.append(decodeURIComponent(r),decodeURIComponent(o))}}),t}function h(e){var t=new o;return e.split(/\r?\n/).forEach(function(e){var n=e.split(":"),r=n.shift().trim();if(r){var o=n.join(":").trim();t.append(r,o)}}),t}function y(e,t){t||(t={}),this.type="default",this.status="status"in t?t.status:200,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in t?t.statusText:"OK",this.headers=new o(t.headers),this.url=t.url||"",this._initBody(e)}if(!e.fetch){var v={searchParams:"URLSearchParams"in e,iterable:"Symbol"in e&&"iterator"in Symbol,blob:"FileReader"in e&&"Blob"in e&&function(){try{return new Blob,!0}catch(e){return!1}}(),formData:"FormData"in e,arrayBuffer:"ArrayBuffer"in e};if(v.arrayBuffer)var b=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],g=function(e){return e&&DataView.prototype.isPrototypeOf(e)},w=ArrayBuffer.isView||function(e){return e&&b.indexOf(Object.prototype.toString.call(e))>-1};o.prototype.append=function(e,r){e=t(e),r=n(r);var o=this.map[e];this.map[e]=o?o+","+r:r},o.prototype.delete=function(e){delete this.map[t(e)]},o.prototype.get=function(e){return e=t(e),this.has(e)?this.map[e]:null},o.prototype.has=function(e){return this.map.hasOwnProperty(t(e))},o.prototype.set=function(e,r){this.map[t(e)]=n(r)},o.prototype.forEach=function(e,t){for(var n in this.map)this.map.hasOwnProperty(n)&&e.call(t,this.map[n],n,this)},o.prototype.keys=function(){var e=[];return this.forEach(function(t,n){e.push(n)}),r(e)},o.prototype.values=function(){var e=[];return this.forEach(function(t){e.push(t)}),r(e)},o.prototype.entries=function(){var e=[];return this.forEach(function(t,n){e.push([n,t])}),r(e)},v.iterable&&(o.prototype[Symbol.iterator]=o.prototype.entries);var _=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];p.prototype.clone=function(){return new p(this,{body:this._bodyInit})},f.call(p.prototype),f.call(y.prototype),y.prototype.clone=function(){return new y(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new o(this.headers),url:this.url})},y.error=function(){var e=new y(null,{status:0,statusText:""});return e.type="error",e};var T=[301,302,303,307,308];y.redirect=function(e,t){if(-1===T.indexOf(t))throw new RangeError("Invalid status code");return new y(null,{status:t,headers:{location:e}})},e.Headers=o,e.Request=p,e.Response=y,e.fetch=function(e,t){return new Promise(function(n,r){var o=new p(e,t),i=new XMLHttpRequest;i.onload=function(){var e={status:i.status,statusText:i.statusText,headers:h(i.getAllResponseHeaders()||"")};e.url="responseURL"in i?i.responseURL:e.headers.get("X-Request-URL");var t="response"in i?i.response:i.responseText;n(new y(t,e))},i.onerror=function(){r(new TypeError("Network request failed"))},i.ontimeout=function(){r(new TypeError("Network request failed"))},i.open(o.method,o.url,!0),"include"===o.credentials&&(i.withCredentials=!0),"responseType"in i&&v.blob&&(i.responseType="blob"),o.headers.forEach(function(e,t){i.setRequestHeader(t,e)}),i.send(void 0===o._bodyInit?null:o._bodyInit)})},e.fetch.polyfill=!0}}("undefined"!=typeof self?self:void 0)},function(e,t,n){"use strict";function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}Object.defineProperty(t,"__esModule",{value:!0}),t.getExpandedMSPMap=t.getMSPMap=void 0;var o=n(1),i=r(o),s=n(11),a=r(s),u=n(12),c=r(u),l=null,f=null,d=null,p=function(e,t){var n=i.strToDate(t.ValidFromDate),r=null!=t.ValidUntilDate?i.strToDate(t.ValidUntilDate):null;return e>=n&&e<=r||e>=n&&null==r},m=function(e,t,n){return n?function(r){return r[e]===t&&p(n,r)}:function(n){return n[e]===t}},h=function(e){return e.includes("Parliamentary Liaison Officer")?9:e.includes("Deputy First Minister")?1:e.includes("First Minister")?0:e.includes("Minister")?3:e.includes("Cabinet Secretary")?2:e.includes("Deputy Party Spokesperson on")||e.includes("Deputy Whip")?8:e.includes("Party Spokesperson on")||e.includes("Chief Whip")?7:e.includes("Deputy Party Leader")?6:e.includes("Party Leader")?5:"Substitute Member"===e?13:"Member"===e?12:"Deputy Convener"===e?11:"Co-Convener"===e?10:"Convener"===e?9:15},y=function(e,t,n,r,o,s,u,c){n.forEach(function(n){var l=t.get(n.PersonID);if(l&&p(e,n)){var f=r.find(m("ID",n[o])),d=i.replaceNewlines(f.Name),y=h(f.Name);if(s&&u){var v=s.find(m("ID",n[u]));l[c].push(new a.Role(d,y,v.Name))}else{l[c].find(function(e){return e.name===d})||l[c].push(new a.Role(d,y,"SG"))}}})},v=function(e,t,n,r,o,i){t.forEach(function(t){var s=e.get(t.PersonID);if(s){var u=r.find(m("ID",t[o])).Name;if("Line1"===n){var c=t.Line1+", "+t.Line2,l=new a.Address(u,c,t.PostCode,t.Region,t.Town);s[i].push(l)}else if(t[n]){var f=new a.Contact(u,t[n]);s[i].push(f)}}})},b=function(e){e.forEach(function(e){for(var t in e)Array.isArray(e[t])&&"govtRoles"!=t&&"partyRoles"!=t&&(e[t]=[])})},g=function(e,t){var n=new Map;return t.regResults.concat(t.constitResults).forEach(function(r){if(p(e,r)){var o=new a.MSP;if(r.ConstituencyID){var i=t.constituencies.find(m("ID",r.ConstituencyID));o.constit=new a.Area(i.Name,i.ConstituencyCode);var s=t.regions.find(m("ID",i.RegionID));o.region=new a.Area(s.Name,s.RegionCode)}else{var u=t.regions.find(m("ID",r.RegionID));o.region=new a.Area(u.Name,u.RegionCode)}n.set(r.PersonID,o)}}),t.basicMSPData.forEach(function(e){var t=n.get(e.PersonID);if(t){var r=e.ParliamentaryName.split(",");t.firstName=r[1],t.lastName=r[0],e.BirthDateIsProtected||(t.DOB=i.strToDate(e.BirthDate)),t.photoURL=e.PhotoURL}}),t.partyMemberships.forEach(function(r){var o=n.get(r.PersonID);if(o&&p(e,r)){var s=t.parties.find(m("ID",r.PartyID));s.Abbreviation="*"===s.Abbreviation?"Ind":s.Abbreviation,o.party=new a.Party(s.ActualName,s.Abbreviation);var u=t.partyMemberRoles.filter(m("MemberPartyID",r.ID,e));u&&u.forEach(function(e){var n=t.partyRoles.find(m("ID",e.PartyRoleTypeID)),r=n.Name,s=i.replaceNewlines(e.Notes),u=h(r);o.partyRoles.push(new a.Role(r,u,s))}),"NPA"===o.party.abbreviation&&o.partyRoles.push(new a.Role("Presiding Officer",0,"Presiding Officer"))}}),y(e,n,t.govtMemberRoles,t.govtRoles,"GovernmentRoleID","","","govtRoles"),n},w=function(e,t){b(d),y(e,d,t.membercpgRoles,t.cpgRoles,"CrossPartyGroupRoleID",t.cpgs,"CrossPartyGroupID","cpgRoles"),y(e,d,t.memberCommitteeRoles,t.committeeRoles,"CommitteeRoleID",t.committees,"CommitteeID","committeeRoles"),v(d,t.addresses,"Line1",t.addressTypes,"AddressTypeID","addresses"),v(d,t.emails,"Address",t.emailTypes,"EmailAddressTypeID","emails"),v(d,t.telephones,"Telephone1",t.telephoneTypes,"TelephoneTypeID","telephones"),v(d,t.websites,"WebURL",t.websiteTypes,"WebSiteTypeID","websites")};t.getMSPMap=function(e){return new Promise(function(t,n){l?(d=g(e,l),t(d)):c.getInitialMSPData().then(function(n){l=n,d=g(e,l),t(d)})})},t.getExpandedMSPMap=function(e){return new Promise(function(t,n){f?(w(e,f),t(d)):c.getExpandedMSPData().then(function(n){f=n,w(e,f),t(d)})})}},function(e,t,n){"use strict";function r(e,t){this.name=e,this.code=t}function o(e,t){this.name=e,this.abbreviation=t}function i(e,t,n){this.name=e,this.rank=t,this.altText=n}function s(e,t,n,r,o){this.type=e,this.street=t,this.postCode=n,this.region=r,this.town=o}function a(e,t){this.type=e,this.value=t}function u(e,t,n,r,o,i,s,a){this.constit=t,this.region=n,this.firstName=r,this.lastName=o,this.DOB=i,this.photoURL=s,this.party=a,this.partyRoles=[],this.govtRoles=[],this.committeeRoles=[],this.cpgRoles=[],this.addresses=[],this.emails=[],this.telephones=[],this.websites=[]}Object.defineProperty(t,"__esModule",{value:!0}),t.Area=r,t.Party=o,t.Role=i,t.Address=s,t.Contact=a,t.MSP=u},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r="https://data.parliament.scot/api/",o=function(e){return new Promise(function(t,n){fetch(e,{method:"get"}).then(function(e){return e.json()}).then(function(e){t(e)})})};t.getInitialMSPData=function(){return new Promise(function(e,t){Promise.all([o(r+"members"),o(r+"MemberElectionConstituencyStatuses"),o(r+"MemberElectionregionStatuses"),o(r+"constituencies"),o(r+"regions"),o(r+"parties"),o(r+"memberparties"),o(r+"partyroles"),o(r+"memberpartyroles"),o(r+"governmentroles"),o(r+"membergovernmentroles")]).then(function(t){var n={basicMSPData:t[0],constitResults:t[1],regResults:t[2],constituencies:t[3],regions:t[4],parties:t[5],partyMemberships:t[6],partyRoles:t[7],partyMemberRoles:t[8],govtRoles:t[9],govtMemberRoles:t[10]};e(n)})})},t.getExpandedMSPData=function(){return new Promise(function(e,t){Promise.all([o(r+"addresses"),o(r+"addresstypes"),o(r+"telephones"),o(r+"telephonetypes"),o(r+"emailaddresses"),o(r+"emailaddresstypes"),o(r+"websites"),o(r+"websitetypes"),o(r+"membercrosspartyroles"),o(r+"crosspartygrouproles"),o(r+"crosspartygroups"),o(r+"personcommitteeroles"),o(r+"committeeroles"),o(r+"committees"),o(r+"committeetypelinks"),o(r+"committeetypes")]).then(function(t){var n={addresses:t[0],addressTypes:t[1],telephones:t[2],telephoneTypes:t[3],emails:t[4],emailTypes:t[5],websites:t[6],websiteTypes:t[7],membercpgRoles:t[8],cpgRoles:t[9],cpgs:t[10],memberCommitteeRoles:t[11],committeeRoles:t[12],committees:t[13],committeeTypeLinks:t[14],committeeTypes:t[15]};e(n)})})}},function(e,t,n){"use strict";function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}Object.defineProperty(t,"__esModule",{value:!0}),t.refreshCells=t.init=void 0;var o=n(1),i=r(o),s=n(0),a=r(s),u=document.getElementsByTagName("main")[0],c=function(e){return document.createRange().createContextualFragment(e)},l=function(e){if(e.DOB){var t=e.DOB;return"<p>"+(t.getDate()+"/"+(t.getMonth()+1)+"/"+t.getFullYear())+"</p>"}return""},f=function(e,t){if(e.partyRoles&&e.partyRoles.length>0){var n=e.partyRoles.map(function(t){var n=t.name.trim();return"Party Leader"!==n||"Green"!==e.party.abbreviation&&"SSP"!==e.party.abbreviation&&"Sol"!==e.party.abbreviation||(n="Co-Convener"),n}).join(", ");return'<p class="msp-role">'+(n=n.replace(/Party Spokesperson on /g,""))+"</p>"}return""},d=function(e){if(e.govtRoles&&e.govtRoles.length>0){return'<p class="msp-role">'+e.govtRoles.map(function(e){return e.name.trim()}).join(", ")+"</p>"}return""},p=function(e){var t="";return t=e.constit?e.constit.name:e.region.name,t=t.replace(/ and /g," & ")},m=function(e,t){return e.sort(function(e,n){var r=e[t],o=n[t];return r<o?-1:r>o?1:r===o?0:void 0})},h=function(e,t,n){return e.sort(function(e,r){var o=e[t][n],i=r[t][n];return o<i?-1:o>i?1:o===i?0:void 0})},y=function(e,t){var n=l(e),r=f(e),o=d(e),i="";e.emails&&e.emails.length>0&&(i=e.emails.map(function(e){return'<li> <a href="mailto:'+e.value+'">'+e.type+"</a></li>"}).join(""));var s="";e.websites&&e.websites.length>0&&(s=e.websites.map(function(e){return'<li> <a href="'+e.value+'">'+e.type+"</a></li>"}).join(""));var a="";e.addresses&&e.addresses.length>0&&(a=e.addresses.map(function(e){return"<p>\n<strong> "+e.type+" Address: </strong>\n"+e.street+"\n"+e.postCode+"\n"+(e.region?e.region:"")+"\n"+e.town+"\n\n</p>"}).join(""));var u=m(e.committeeRoles,"rank").map(function(e){return"<li>\n"+("Member"===e.name?"":e.name+" &ndash;").replace(/Substitute Member/g,"Substitute")+"\n"+e.altText+"\n</li>"}).join(""),c=m(e.cpgRoles,"rank").map(function(e){return"<li>\n"+("Member"===e.name?"":e.name+" &ndash;")+"\n"+e.altText.replace(/Cross-Party Group in the Scottish Parliament on/g,"")+"\n</li>"}).join("");return'\n<div class="modal--box-pbox">\n\n<img class="modal--box-img" src="http://via.placeholder.com/250x250"></img>\n\n<h3 class="msp-name">'+e.firstName+" "+e.lastName+"</h3>\n"+(n||"")+"\n<p>"+e.party.name+"</p>\n<p>"+(e.constit?e.constit.name+", ":"")+e.region.name+"</p>\n"+(r||"")+"\n"+(o||"")+'\n\n</div>\n\n<div class="modal--box-txtbox">\n\n<h4>Contact</h4>\n\n'+(a||"")+"\n\n"+(i||"")+"\n\n"+(s||"")+"\n\n"+(u&&u.length>0?"\n<h4>Committees</h4>\n<ul>"+u+"</ul>\n":"")+"\n\n"+(c&&c.length>0?"\n<h4>Cross-Party Groups</h4>\n<ul>"+c+"</ul>\n":"")+"\n\n</div>\n"},v=function(e,t){return function(){var n=document.getElementsByClassName("modal")[0];if(n.classList.contains("modal__hidden")){var r=document.getElementsByClassName("modal--box")[0],o=document.getElementsByClassName("modal--box-content")[0];n.classList.toggle("modal__hidden"),a.getExpandedCellData(t).then(function(t){var n=t.get(e);o.innerHTML=y(n),r.appendChild(o)})}}},b=function(e,t,n,r){var o=p(e),i="/img/portraits/"+e.firstName.trim()+e.lastName.trim()+".jpg";console.log(i);var s=e.firstName+" portrait",a="";return a=r?r.name:d(e)?d(e):f(e),'\n<div id="'+t+'" class="cell cell__pty-'+e.party.abbreviation+" "+(n?"cell__mini":"")+'">\n<div class="portrait-box">\n<img class="portrait-img" src="'+i+'" alt="'+s+'">\n</div>\n<div class="txtbox">\n<h4 class="msp-name">'+e.firstName+" "+e.lastName+'</h4>\n<p>\n<span class="msp-party">('+e.party.abbreviation+')</span>\n<span class="msp-location">('+o+")</span>\n</p>\n\n"+a+"\n\n</div>\n</div>\n"},g=function(e,t){var n=[];if(t){if(!(t.length>0))return 20;n=t}else if(e.partyRoles.length>0&&(n=e.partyRoles),e.govtRoles.length>0&&(n=e.govtRoles),n.length<1)return 20;return m(n,"rank")[0].rank},w=function(e,t){var n=document.createElement("div");return n.classList.add("cell-group-container"),t.forEach(function(e){for(var t=[],r=0;r<15;r++)!function(n){var r=[];e.msps.forEach(function(e){e.ranking===n&&r.push(e)}),r.length>0&&(r=h(r,"msp","lastName"),t=t.concat(r))}(r);var o=document.createElement("div");o.classList.add("cell-group");var i="";t.forEach(function(e){var t=e.ranking<=3;i+=b(e.msp,e.mspID,t,e.displayRole)}),o.innerHTML=i;var s=document.createElement("h4");s.classList.add("group-header"),s.innerHTML=e.name,n.appendChild(s),n.appendChild(o)}),n},_=function(e){var t=[];return e.forEach(function(e,n){var r=t.find(function(t){return t.name===e.party.abbreviation});if(r)r.msps.push({mspID:n,msp:e,ranking:g(e)});else{t.push({name:e.party.abbreviation,msps:[]});t[t.length-1].msps.push({mspID:n,msp:e,ranking:g(e)})}}),t.sort(function(e,t){return t.msps.length>e.msps.length}),w(0,t)},T=function(e,t){var n="";"committee"===t&&(n="committeeRoles"),"cpg"===t&&(n="cpgRoles");var r=[];return e.forEach(function(e,t){var o=e[n];o.length>0&&o.forEach(function(n){var i=r.find(function(e){return e.name===n.altText});if(i)i.msps.push({mspID:t,msp:e,ranking:g(e,o),displayRole:n});else{r.push({name:n.altText,msps:[]});r[r.length-1].msps.push({mspID:t,msp:e,ranking:g(e,o),displayRole:n})}})}),r.sort(function(e,t){return t.msps.length>e.msps.length}),w(0,r)},P=function(e,t,n){return new Promise(function(r,o){"party"===t&&r(_(e)),"committee"!==t&&"cpg"!==t||a.getExpandedCellData(n).then(function(e){r(T(e,t))})})},R=function(){u.appendChild(c('\n<div class="modal">\n<div class="modal--box">\n<div class="modal--close">&times;</div>\n<div class ="modal--box-content"><div>\n</div>\n</div>\n'));var e=document.getElementsByClassName("modal")[0];document.getElementsByClassName("modal--close")[0].addEventListener("click",function(e){return function(){e.classList.toggle("modal__hidden")}}(e)),e.classList.toggle("modal__hidden")},E=function(e){var t='\n<div class=pref-bar>\n<form id="pref-form" onsubmit="return false">\n<div>\n<label for="date-input">Date:</label>\n<input type="date" id="date-input" value="'+i.dateToStr(e)+'" name="date-input" max="'+i.dateToStr(e)+'" min="1999-05-12" required>\n<span class="validity"></span>\n</div>\n\n</form>\n</div>\n';u.appendChild(c(t));var n=document.getElementById("pref-form"),r=document.getElementById("date-input"),o=document.getElementById("group-by");n.addEventListener("change",function(e){a.refreshView(i.strToDate(r.value),o.value)})};t.init=function(e){E(e),R()},t.refreshCells=function(e,t,n){var r=document.getElementsByClassName("cell-group-container")[0];r&&u.removeChild(r),P(e,n,t).then(function(e){u.appendChild(e);for(var n=document.getElementsByClassName("cell"),r=0;r<n.length;r++)n[r].addEventListener("click",v(Number(n[r].id),t))})}}]);