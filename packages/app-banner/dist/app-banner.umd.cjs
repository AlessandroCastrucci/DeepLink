(function(l,u){typeof exports=="object"&&typeof module<"u"?u(exports):typeof define=="function"&&define.amd?define(["exports"],u):(l=typeof globalThis<"u"?globalThis:l||self,u(l.AppBanner={}))})(this,(function(l){"use strict";function u(e,n){const s=`https://play.google.com/store/apps/details?id=${encodeURIComponent(e)}`;return n!=null&&n!==""?`${s}&referrer=${encodeURIComponent(n)}`:s}function L(e){const{deepLink:n,packageName:t,playStoreUrl:s}=e;let r;try{r=new URL(n,typeof window<"u"?window.location.href:void 0)}catch{throw new Error(`app-banner: invalid deepLink "${n}"`)}const b=r.protocol.replace(/:$/,"");if(!b)throw new Error("app-banner: deepLink must include a scheme (e.g. https://)");const o=r.host?`${r.host}${r.pathname}${r.search}${r.hash}`:`${r.pathname.replace(/^\//,"")}${r.search}${r.hash}`,p=encodeURIComponent(s);return`intent://${o}#Intent;scheme=${b};package=${t};S.browser_fallback_url=${p};end`}const C="app-banner-styles";function A(e){return e==="light"||e==="dark"?e:typeof window>"u"||!window.matchMedia?"light":window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function z(){if(typeof document>"u"||document.getElementById(C))return;const e=document.createElement("style");e.id=C,e.textContent=`
.app-banner-host {
  --app-banner-bg-light: rgba(248, 248, 248, 0.94);
  --app-banner-bg-dark: rgba(28, 28, 30, 0.94);
  --app-banner-text-light: #111;
  --app-banner-text-dark: #f5f5f7;
  --app-banner-muted-light: #555;
  --app-banner-muted-dark: #a1a1a6;
  --app-banner-border-light: rgba(0,0,0,0.08);
  --app-banner-border-dark: rgba(255,255,255,0.12);
  --app-banner-btn-bg: #007aff;
  --app-banner-btn-fg: #fff;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 2147483000;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  padding-top: env(safe-area-inset-top, 0);
}
.app-banner-host *, .app-banner-host *::before, .app-banner-host *::after { box-sizing: border-box; }
.app-banner-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px 10px 14px;
  border-bottom: 1px solid var(--app-banner-border);
  backdrop-filter: blur(12px);
  background: var(--app-banner-bg);
  color: var(--app-banner-text);
}
.app-banner-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
  background: var(--app-banner-muted);
  object-fit: cover;
}
.app-banner-icon--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: var(--app-banner-btn-bg);
  background: rgba(0, 122, 255, 0.12);
}
.app-banner-text {
  flex: 1;
  min-width: 0;
}
.app-banner-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.25;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.app-banner-desc {
  font-size: 12px;
  line-height: 1.3;
  margin: 2px 0 0;
  color: var(--app-banner-muted-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.app-banner-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.app-banner-open {
  appearance: none;
  border: none;
  border-radius: 14px;
  padding: 7px 14px;
  font-size: 15px;
  font-weight: 600;
  background: var(--app-banner-btn-bg);
  color: var(--app-banner-btn-fg);
  cursor: pointer;
}
.app-banner-open:active { opacity: 0.85; }
.app-banner-close {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--app-banner-muted-text);
  font-size: 22px;
  line-height: 1;
  padding: 4px 6px;
  cursor: pointer;
  border-radius: 8px;
}
.app-banner-close:active { background: rgba(0,0,0,0.06); }
@media (prefers-reduced-motion: reduce) {
  .app-banner-inner { transition: none; }
}
`,document.head.appendChild(e)}function v(e){return`app-banner:${e}`}function K(e,n,t=192){if(e.includes("{package}")||e.includes("{size}"))return e.replace(/\{package\}/g,encodeURIComponent(n)).replace(/\{size\}/g,String(t));const r=e.includes("?")?"&":"?";return`${e}${r}package=${encodeURIComponent(n)}&size=${t}`}const _=7*864e5;function j(e){try{const n=localStorage.getItem(`app-banner:icon:${e}`);if(!n)return null;const t=JSON.parse(n);return!t.url||!t.until||Date.now()>t.until?null:t.url}catch{return null}}function J(e,n){try{localStorage.setItem(`app-banner:icon:${e}`,JSON.stringify({url:n,until:Date.now()+_}))}catch{}}async function H(e,n){const t=j(n);if(t)return t;try{const s=await fetch(K(e,n),{headers:{Accept:"application/json"}});if(!s.ok)return null;const r=await s.json();return r.iconUrl?(J(n,r.iconUrl),r.iconUrl):null}catch{return null}}function G(e){if($(e.dismissDuration)<=0){try{localStorage.removeItem(v(e.storageKey))}catch{}return!1}try{const n=localStorage.getItem(v(e.storageKey));if(!n)return!1;const t=JSON.parse(n);return!(!t.until||Date.now()>t.until)}catch{return!1}}const V=/^\s*(\d+(?:\.\d+)?)\s*(ms|s|m|h|d)?\s*$/i,Y={ms:1,s:1e3,m:6e4,h:36e5,d:864e5};function $(e){if(e==null)return 0;if(typeof e=="number")return Number.isFinite(e)&&e>0?e:0;const n=V.exec(e);if(!n)return 0;const t=Number(n[1]);if(!Number.isFinite(t)||t<=0)return 0;const s=(n[2]??"ms").toLowerCase();return t*(Y[s]??1)}function Q(e){const n=$(e.dismissDuration);if(n<=0)return;const t=Date.now()+n;try{localStorage.setItem(v(e.storageKey),JSON.stringify({until:t}))}catch{}}function F(e){var M;z();const n=document.createElement("div");n.className="app-banner-host",n.setAttribute("role","region"),n.setAttribute("aria-label","App install banner");const t=e.topInsetPx??0;t>0&&(n.style.top=`${t}px`);const r=A(e.theme)==="dark";n.style.setProperty("--app-banner-bg",r?"var(--app-banner-bg-dark)":"var(--app-banner-bg-light)"),n.style.setProperty("--app-banner-text",r?"var(--app-banner-text-dark)":"var(--app-banner-text-light)"),n.style.setProperty("--app-banner-muted-text",r?"var(--app-banner-muted-dark)":"var(--app-banner-muted-light)"),n.style.setProperty("--app-banner-border",r?"var(--app-banner-border-dark)":"var(--app-banner-border-light)");const b=document.createElement("div");b.className="app-banner-inner";const o=document.createElement("img");o.className="app-banner-icon",o.alt="",o.referrerPolicy="no-referrer";const p=document.createElement("div");p.className="app-banner-icon app-banner-icon--placeholder",p.textContent=e.title.trim().charAt(0).toUpperCase()||"A",o.addEventListener("error",()=>{o.parentNode&&o.parentNode.replaceChild(p,o)});let w;e.iconUrl?(o.src=e.iconUrl,w=o):e.iconResolverUrl?(w=p,H(e.iconResolverUrl,e.packageName).then(a=>{a&&(o.src=a,p.parentNode&&p.parentNode.replaceChild(o,p))}).catch(()=>{})):w=p;const S=document.createElement("div");S.className="app-banner-text";const U=document.createElement("p");U.className="app-banner-title",U.textContent=e.title;const E=document.createElement("p");E.className="app-banner-desc",E.textContent=e.description,S.append(U,E);const T=document.createElement("div");T.className="app-banner-actions";const y=document.createElement("button");y.type="button",y.className="app-banner-open",y.textContent=e.openButtonText;const h=document.createElement("button");h.type="button",h.className="app-banner-close",h.setAttribute("aria-label","Dismiss"),h.innerHTML="×";let k=0,x=null;function N(){k!==0&&(window.clearTimeout(k),k=0),x&&(document.removeEventListener("visibilitychange",x),x=null)}function ne(){return e.playStoreUrl??u(e.packageName,e.playStoreReferrer)}y.addEventListener("click",()=>{N();const a=ne(),f=L({deepLink:e.deepLink,packageName:e.packageName,playStoreUrl:a});if(window.location.assign(f),!e.openFallbackEnabled||e.openFallbackTimeoutMs<=0||typeof document>"u")return;let g=!1;const m=()=>{document.hidden&&(g=!0)};x=m,document.addEventListener("visibilitychange",m),k=window.setTimeout(()=>{document.removeEventListener("visibilitychange",m),x=null,k=0,g||window.location.assign(a)},e.openFallbackTimeoutMs)});const I=()=>{N(),n.remove();const a=document.documentElement,f=a.style.paddingTop;f&&f.includes("px")&&(a.style.paddingTop="")};h.addEventListener("click",()=>{Q(e),I()}),T.append(y,h),b.append(w,S,T),n.append(b);const te=()=>n.getBoundingClientRect().height,B=()=>{const a=te();document.documentElement.style.paddingTop=`${t+a}px`};document.body.appendChild(n),B();const d=typeof ResizeObserver<"u"?new ResizeObserver(()=>B()):null;if(d==null||d.observe(n),e.theme==="auto"&&window.matchMedia){const a=window.matchMedia("(prefers-color-scheme: dark)"),f=()=>{const m=A("auto")==="dark";n.style.setProperty("--app-banner-bg",m?"var(--app-banner-bg-dark)":"var(--app-banner-bg-light)"),n.style.setProperty("--app-banner-text",m?"var(--app-banner-text-dark)":"var(--app-banner-text-light)"),n.style.setProperty("--app-banner-muted-text",m?"var(--app-banner-muted-dark)":"var(--app-banner-muted-light)"),n.style.setProperty("--app-banner-border",m?"var(--app-banner-border-dark)":"var(--app-banner-border-light)")};return(M=a.addEventListener)==null||M.call(a,"change",f),()=>{var g;(g=a.removeEventListener)==null||g.call(a,"change",f),d==null||d.disconnect(),I()}}return()=>{N(),d==null||d.disconnect(),I()}}function O(e){return!(e.showAndroidOnly&&typeof navigator<"u"&&!/Android/i.test(navigator.userAgent)||G(e))}const i={description:"Get the app for the best experience.",dismissDuration:"7d",showAndroidOnly:!0,openButtonText:"Open",theme:"auto",openFallbackEnabled:!0,openFallbackTimeoutMs:3e3};function R(e,n){return e===void 0||e===""?n:e==="1"||e.toLowerCase()==="true"||e.toLowerCase()==="yes"}function D(e,n){if(e===void 0||e==="")return n;const t=Number(e);return Number.isFinite(t)?t:n}function W(e){return e==="light"||e==="dark"||e==="auto"?e:i.theme}function X(e){const n=e.dataset,t=n.package??"";if(!t)return console.warn("app-banner: missing data-package on script tag"),null;const s=n.deepLink??(typeof window<"u"?window.location.href:"https://localhost/"),r=n.title??"App",b=n.playStoreUrl,o=n.playReferrer,p=b??u(t,o);return{packageName:t,deepLink:s,playStoreUrl:p,playStoreReferrer:o,openFallbackEnabled:R(n.openFallbackEnabled,i.openFallbackEnabled),openFallbackTimeoutMs:D(n.openFallbackTimeoutMs,i.openFallbackTimeoutMs),title:r,description:n.description??i.description,iconUrl:n.icon,iconResolverUrl:n.iconResolver,dismissDuration:n.dismissDuration??n.dismissDays??i.dismissDuration,showAndroidOnly:R(n.showAndroidOnly,i.showAndroidOnly),openButtonText:n.openButtonText??i.openButtonText,theme:W(n.theme),storageKey:n.storageKey??t,topInsetPx:D(n.topInset,0)||void 0}}function Z(e){const n=e.playStoreUrl??u(e.packageName,e.playStoreReferrer);return{packageName:e.packageName,deepLink:e.deepLink,title:e.title,description:e.description??i.description,playStoreUrl:n,playStoreReferrer:e.playStoreReferrer,iconUrl:e.iconUrl,iconResolverUrl:e.iconResolverUrl,dismissDuration:e.dismissDuration??i.dismissDuration,showAndroidOnly:e.showAndroidOnly??i.showAndroidOnly,openButtonText:e.openButtonText??i.openButtonText,theme:e.theme??i.theme,storageKey:e.storageKey??e.packageName,openFallbackEnabled:e.openFallbackEnabled??i.openFallbackEnabled,openFallbackTimeoutMs:e.openFallbackTimeoutMs??i.openFallbackTimeoutMs,topInsetPx:e.topInsetPx}}let c;function q(e){return c==null||c(),O(e)?(c=F(e),()=>{c==null||c(),c=void 0}):(c=void 0,()=>{})}function ee(){if(typeof document>"u")return null;const e=document.currentScript;if(e!=null&&e.hasAttribute("data-app-banner"))return e;const n=document.querySelectorAll("script[data-app-banner]");return n.length?n[n.length-1]:null}function P(){const e=ee();if(!e)return;const n=X(e);n&&O(n)&&(c==null||c(),c=F(n))}typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>P(),{once:!0}):queueMicrotask(()=>P())),l.buildIntentUri=L,l.buildPlayStoreUrl=u,l.createBannerOptions=Z,l.mountAppBanner=q,Object.defineProperty(l,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=app-banner.umd.cjs.map
