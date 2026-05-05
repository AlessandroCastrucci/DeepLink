(function(p,d){typeof exports=="object"&&typeof module<"u"?d(exports):typeof define=="function"&&define.amd?define(["exports"],d):(p=typeof globalThis<"u"?globalThis:p||self,d(p.AppBanner={}))})(this,(function(p){"use strict";function d(e,n){const u=`https://play.google.com/store/apps/details?id=${encodeURIComponent(e)}`;return n!=null&&n!==""?`${u}&referrer=${encodeURIComponent(n)}`:u}function U(e){const{deepLink:n,packageName:r,playStoreUrl:u}=e;let a;try{a=new URL(n,typeof window<"u"?window.location.href:void 0)}catch{throw new Error(`app-banner: invalid deepLink "${n}"`)}const c=a.protocol.replace(/:$/,"");if(!c)throw new Error("app-banner: deepLink must include a scheme (e.g. https://)");const l=a.host?`${a.host}${a.pathname}${a.search}${a.hash}`:`${a.pathname.replace(/^\//,"")}${a.search}${a.hash}`,m=encodeURIComponent(u);return`intent://${l}#Intent;scheme=${c};package=${r};S.browser_fallback_url=${m};end`}const N="app-banner-styles";function A(e){return e==="light"||e==="dark"?e:typeof window>"u"||!window.matchMedia?"light":window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function D(){if(typeof document>"u"||document.getElementById(N))return;const e=document.createElement("style");e.id=N,e.textContent=`
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
`,document.head.appendChild(e)}function F(e){return`app-banner:${e}`}function M(e){try{const n=localStorage.getItem(F(e.storageKey));if(!n)return!1;const r=JSON.parse(n);return!(!r.until||Date.now()>r.until)}catch{return!1}}function R(e){const n=Date.now()+e.dismissDays*864e5;try{localStorage.setItem(F(e.storageKey),JSON.stringify({until:n}))}catch{}}function O(e){var I;D();const n=document.createElement("div");n.className="app-banner-host",n.setAttribute("role","region"),n.setAttribute("aria-label","App install banner");const r=e.topInsetPx??0;r>0&&(n.style.top=`${r}px`);const a=A(e.theme)==="dark";n.style.setProperty("--app-banner-bg",a?"var(--app-banner-bg-dark)":"var(--app-banner-bg-light)"),n.style.setProperty("--app-banner-text",a?"var(--app-banner-text-dark)":"var(--app-banner-text-light)"),n.style.setProperty("--app-banner-muted-text",a?"var(--app-banner-muted-dark)":"var(--app-banner-muted-light)"),n.style.setProperty("--app-banner-border",a?"var(--app-banner-border-dark)":"var(--app-banner-border-light)");const c=document.createElement("div");c.className="app-banner-inner";let l;if(e.iconUrl){const t=document.createElement("img");t.className="app-banner-icon",t.alt="",t.src=e.iconUrl,t.referrerPolicy="no-referrer",l=t}else{const t=document.createElement("div");t.className="app-banner-icon app-banner-icon--placeholder",t.textContent=e.title.trim().charAt(0).toUpperCase()||"A",l=t}const m=document.createElement("div");m.className="app-banner-text";const w=document.createElement("p");w.className="app-banner-title",w.textContent=e.title;const E=document.createElement("p");E.className="app-banner-desc",E.textContent=e.description,m.append(w,E);const S=document.createElement("div");S.className="app-banner-actions";const y=document.createElement("button");y.type="button",y.className="app-banner-open",y.textContent=e.openButtonText;const g=document.createElement("button");g.type="button",g.className="app-banner-close",g.setAttribute("aria-label","Dismiss"),g.innerHTML="×";let k=0,x=null;function T(){k!==0&&(window.clearTimeout(k),k=0),x&&(document.removeEventListener("visibilitychange",x),x=null)}function J(){return e.playStoreUrl??d(e.packageName,e.playStoreReferrer)}y.addEventListener("click",()=>{T();const t=J(),f=U({deepLink:e.deepLink,packageName:e.packageName,playStoreUrl:t});if(window.location.assign(f),!e.openFallbackEnabled||e.openFallbackTimeoutMs<=0||typeof document>"u")return;let h=!1;const b=()=>{document.hidden&&(h=!0)};x=b,document.addEventListener("visibilitychange",b),k=window.setTimeout(()=>{document.removeEventListener("visibilitychange",b),x=null,k=0,h||window.location.assign(t)},e.openFallbackTimeoutMs)});const L=()=>{T(),n.remove();const t=document.documentElement,f=t.style.paddingTop;f&&f.includes("px")&&(t.style.paddingTop="")};g.addEventListener("click",()=>{R(e),L()}),S.append(y,g),c.append(l,m,S),n.append(c);const G=()=>n.getBoundingClientRect().height,C=()=>{const t=G();document.documentElement.style.paddingTop=`${r+t}px`};document.body.appendChild(n),C();const s=typeof ResizeObserver<"u"?new ResizeObserver(()=>C()):null;if(s==null||s.observe(n),e.theme==="auto"&&window.matchMedia){const t=window.matchMedia("(prefers-color-scheme: dark)"),f=()=>{const b=A("auto")==="dark";n.style.setProperty("--app-banner-bg",b?"var(--app-banner-bg-dark)":"var(--app-banner-bg-light)"),n.style.setProperty("--app-banner-text",b?"var(--app-banner-text-dark)":"var(--app-banner-text-light)"),n.style.setProperty("--app-banner-muted-text",b?"var(--app-banner-muted-dark)":"var(--app-banner-muted-light)"),n.style.setProperty("--app-banner-border",b?"var(--app-banner-border-dark)":"var(--app-banner-border-light)")};return(I=t.addEventListener)==null||I.call(t,"change",f),()=>{var h;(h=t.removeEventListener)==null||h.call(t,"change",f),s==null||s.disconnect(),L()}}return()=>{T(),s==null||s.disconnect(),L()}}function B(e){return!(e.showAndroidOnly&&typeof navigator<"u"&&!/Android/i.test(navigator.userAgent)||M(e))}const o={description:"Get the app for the best experience.",dismissDays:7,showAndroidOnly:!0,openButtonText:"Open",theme:"auto",openFallbackEnabled:!0,openFallbackTimeoutMs:3e3};function P(e,n){return e===void 0||e===""?n:e==="1"||e.toLowerCase()==="true"||e.toLowerCase()==="yes"}function v(e,n){if(e===void 0||e==="")return n;const r=Number(e);return Number.isFinite(r)?r:n}function z(e){return e==="light"||e==="dark"||e==="auto"?e:o.theme}function K(e){const n=e.dataset,r=n.package??"";if(!r)return console.warn("app-banner: missing data-package on script tag"),null;const u=n.deepLink??(typeof window<"u"?window.location.href:"https://localhost/"),a=n.title??"App",c=n.playStoreUrl,l=n.playReferrer,m=c??d(r,l);return{packageName:r,deepLink:u,playStoreUrl:m,playStoreReferrer:l,openFallbackEnabled:P(n.openFallbackEnabled,o.openFallbackEnabled),openFallbackTimeoutMs:v(n.openFallbackTimeoutMs,o.openFallbackTimeoutMs),title:a,description:n.description??o.description,iconUrl:n.icon,dismissDays:v(n.dismissDays,o.dismissDays),showAndroidOnly:P(n.showAndroidOnly,o.showAndroidOnly),openButtonText:n.openButtonText??o.openButtonText,theme:z(n.theme),storageKey:n.storageKey??r,topInsetPx:v(n.topInset,0)||void 0}}function j(e){const n=e.playStoreUrl??d(e.packageName,e.playStoreReferrer);return{packageName:e.packageName,deepLink:e.deepLink,title:e.title,description:e.description??o.description,playStoreUrl:n,playStoreReferrer:e.playStoreReferrer,iconUrl:e.iconUrl,dismissDays:e.dismissDays??o.dismissDays,showAndroidOnly:e.showAndroidOnly??o.showAndroidOnly,openButtonText:e.openButtonText??o.openButtonText,theme:e.theme??o.theme,storageKey:e.storageKey??e.packageName,openFallbackEnabled:e.openFallbackEnabled??o.openFallbackEnabled,openFallbackTimeoutMs:e.openFallbackTimeoutMs??o.openFallbackTimeoutMs,topInsetPx:e.topInsetPx}}let i;function _(e){return i==null||i(),B(e)?(i=O(e),()=>{i==null||i(),i=void 0}):(i=void 0,()=>{})}function H(){if(typeof document>"u")return null;const e=document.currentScript;if(e!=null&&e.hasAttribute("data-app-banner"))return e;const n=document.querySelectorAll("script[data-app-banner]");return n.length?n[n.length-1]:null}function $(){const e=H();if(!e)return;const n=K(e);n&&B(n)&&(i==null||i(),i=O(n))}typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>$(),{once:!0}):queueMicrotask(()=>$())),p.buildIntentUri=U,p.buildPlayStoreUrl=d,p.createBannerOptions=j,p.mountAppBanner=_,Object.defineProperty(p,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=app-banner.umd.cjs.map
