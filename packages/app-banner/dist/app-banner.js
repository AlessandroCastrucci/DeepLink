function N(e, n) {
  const c = `https://play.google.com/store/apps/details?id=${encodeURIComponent(e)}`;
  return n != null && n !== "" ? `${c}&referrer=${encodeURIComponent(n)}` : c;
}
function B(e) {
  const { deepLink: n, packageName: t, playStoreUrl: c } = e;
  let r;
  try {
    r = new URL(n, typeof window < "u" ? window.location.href : void 0);
  } catch {
    throw new Error(`app-banner: invalid deepLink "${n}"`);
  }
  const d = r.protocol.replace(/:$/, "");
  if (!d)
    throw new Error("app-banner: deepLink must include a scheme (e.g. https://)");
  const o = r.host ? `${r.host}${r.pathname}${r.search}${r.hash}` : `${r.pathname.replace(/^\//, "")}${r.search}${r.hash}`, p = encodeURIComponent(c);
  return `intent://${o}#Intent;scheme=${d};package=${t};S.browser_fallback_url=${p};end`;
}
const C = "app-banner-styles";
function I(e) {
  return e === "light" || e === "dark" ? e : typeof window > "u" || !window.matchMedia ? "light" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function z() {
  if (typeof document > "u" || document.getElementById(C)) return;
  const e = document.createElement("style");
  e.id = C, e.textContent = `
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
`, document.head.appendChild(e);
}
function A(e) {
  return `app-banner:${e}`;
}
function _(e, n, t = 192) {
  if (e.includes("{package}") || e.includes("{size}"))
    return e.replace(/\{package\}/g, encodeURIComponent(n)).replace(/\{size\}/g, String(t));
  const r = e.includes("?") ? "&" : "?";
  return `${e}${r}package=${encodeURIComponent(n)}&size=${t}`;
}
const K = 7 * 864e5;
function j(e) {
  try {
    const n = localStorage.getItem(`app-banner:icon:${e}`);
    if (!n) return null;
    const t = JSON.parse(n);
    return !t.url || !t.until || Date.now() > t.until ? null : t.url;
  } catch {
    return null;
  }
}
function J(e, n) {
  try {
    localStorage.setItem(
      `app-banner:icon:${e}`,
      JSON.stringify({ url: n, until: Date.now() + K })
    );
  } catch {
  }
}
async function H(e, n) {
  const t = j(n);
  if (t) return t;
  try {
    const c = await fetch(_(e, n), {
      headers: { Accept: "application/json" }
    });
    if (!c.ok) return null;
    const r = await c.json();
    return r.iconUrl ? (J(n, r.iconUrl), r.iconUrl) : null;
  } catch {
    return null;
  }
}
function G(e) {
  try {
    const n = localStorage.getItem(A(e.storageKey));
    if (!n) return !1;
    const t = JSON.parse(n);
    return !(!t.until || Date.now() > t.until);
  } catch {
    return !1;
  }
}
const V = /^\s*(\d+(?:\.\d+)?)\s*(ms|s|m|h|d)?\s*$/i, Y = {
  ms: 1,
  s: 1e3,
  m: 6e4,
  h: 36e5,
  d: 864e5
};
function Q(e) {
  if (e == null) return 0;
  if (typeof e == "number") return Number.isFinite(e) && e > 0 ? e : 0;
  const n = V.exec(e);
  if (!n) return 0;
  const t = Number(n[1]);
  if (!Number.isFinite(t) || t <= 0) return 0;
  const c = (n[2] ?? "ms").toLowerCase();
  return t * (Y[c] ?? 1);
}
function W(e) {
  const n = Q(e.dismissDuration);
  if (n <= 0) return;
  const t = Date.now() + n;
  try {
    localStorage.setItem(A(e.storageKey), JSON.stringify({ until: t }));
  } catch {
  }
}
function O(e) {
  var L;
  z();
  const n = document.createElement("div");
  n.className = "app-banner-host", n.setAttribute("role", "region"), n.setAttribute("aria-label", "App install banner");
  const t = e.topInsetPx ?? 0;
  t > 0 && (n.style.top = `${t}px`);
  const r = I(e.theme) === "dark";
  n.style.setProperty("--app-banner-bg", r ? "var(--app-banner-bg-dark)" : "var(--app-banner-bg-light)"), n.style.setProperty("--app-banner-text", r ? "var(--app-banner-text-dark)" : "var(--app-banner-text-light)"), n.style.setProperty(
    "--app-banner-muted-text",
    r ? "var(--app-banner-muted-dark)" : "var(--app-banner-muted-light)"
  ), n.style.setProperty(
    "--app-banner-border",
    r ? "var(--app-banner-border-dark)" : "var(--app-banner-border-light)"
  );
  const d = document.createElement("div");
  d.className = "app-banner-inner";
  const o = document.createElement("img");
  o.className = "app-banner-icon", o.alt = "", o.referrerPolicy = "no-referrer";
  const p = document.createElement("div");
  p.className = "app-banner-icon app-banner-icon--placeholder", p.textContent = e.title.trim().charAt(0).toUpperCase() || "A", o.addEventListener("error", () => {
    o.parentNode && o.parentNode.replaceChild(p, o);
  });
  let k;
  e.iconUrl ? (o.src = e.iconUrl, k = o) : e.iconResolverUrl ? (k = p, H(e.iconResolverUrl, e.packageName).then((a) => {
    a && (o.src = a, p.parentNode && p.parentNode.replaceChild(o, p));
  }).catch(() => {
  })) : k = p;
  const x = document.createElement("div");
  x.className = "app-banner-text";
  const w = document.createElement("p");
  w.className = "app-banner-title", w.textContent = e.title;
  const v = document.createElement("p");
  v.className = "app-banner-desc", v.textContent = e.description, x.append(w, v);
  const E = document.createElement("div");
  E.className = "app-banner-actions";
  const h = document.createElement("button");
  h.type = "button", h.className = "app-banner-open", h.textContent = e.openButtonText;
  const m = document.createElement("button");
  m.type = "button", m.className = "app-banner-close", m.setAttribute("aria-label", "Dismiss"), m.innerHTML = "×";
  let g = 0, y = null;
  function U() {
    g !== 0 && (window.clearTimeout(g), g = 0), y && (document.removeEventListener("visibilitychange", y), y = null);
  }
  function P() {
    return e.playStoreUrl ?? N(e.packageName, e.playStoreReferrer);
  }
  h.addEventListener("click", () => {
    U();
    const a = P(), b = B({
      deepLink: e.deepLink,
      packageName: e.packageName,
      playStoreUrl: a
    });
    if (window.location.assign(b), !e.openFallbackEnabled || e.openFallbackTimeoutMs <= 0 || typeof document > "u")
      return;
    let f = !1;
    const u = () => {
      document.hidden && (f = !0);
    };
    y = u, document.addEventListener("visibilitychange", u), g = window.setTimeout(() => {
      document.removeEventListener("visibilitychange", u), y = null, g = 0, f || window.location.assign(a);
    }, e.openFallbackTimeoutMs);
  });
  const S = () => {
    U(), n.remove();
    const a = document.documentElement, b = a.style.paddingTop;
    b && b.includes("px") && (a.style.paddingTop = "");
  };
  m.addEventListener("click", () => {
    W(e), S();
  }), E.append(h, m), d.append(k, x, E), n.append(d);
  const M = () => n.getBoundingClientRect().height, T = () => {
    const a = M();
    document.documentElement.style.paddingTop = `${t + a}px`;
  };
  document.body.appendChild(n), T();
  const l = typeof ResizeObserver < "u" ? new ResizeObserver(() => T()) : null;
  if (l == null || l.observe(n), e.theme === "auto" && window.matchMedia) {
    const a = window.matchMedia("(prefers-color-scheme: dark)"), b = () => {
      const u = I("auto") === "dark";
      n.style.setProperty("--app-banner-bg", u ? "var(--app-banner-bg-dark)" : "var(--app-banner-bg-light)"), n.style.setProperty("--app-banner-text", u ? "var(--app-banner-text-dark)" : "var(--app-banner-text-light)"), n.style.setProperty(
        "--app-banner-muted-text",
        u ? "var(--app-banner-muted-dark)" : "var(--app-banner-muted-light)"
      ), n.style.setProperty(
        "--app-banner-border",
        u ? "var(--app-banner-border-dark)" : "var(--app-banner-border-light)"
      );
    };
    return (L = a.addEventListener) == null || L.call(a, "change", b), () => {
      var f;
      (f = a.removeEventListener) == null || f.call(a, "change", b), l == null || l.disconnect(), S();
    };
  }
  return () => {
    U(), l == null || l.disconnect(), S();
  };
}
function D(e) {
  return !(e.showAndroidOnly && typeof navigator < "u" && !/Android/i.test(navigator.userAgent) || G(e));
}
const i = {
  description: "Get the app for the best experience.",
  dismissDuration: "7d",
  showAndroidOnly: !0,
  openButtonText: "Open",
  theme: "auto",
  openFallbackEnabled: !0,
  openFallbackTimeoutMs: 3e3
};
function $(e, n) {
  return e === void 0 || e === "" ? n : e === "1" || e.toLowerCase() === "true" || e.toLowerCase() === "yes";
}
function F(e, n) {
  if (e === void 0 || e === "") return n;
  const t = Number(e);
  return Number.isFinite(t) ? t : n;
}
function X(e) {
  return e === "light" || e === "dark" || e === "auto" ? e : i.theme;
}
function Z(e) {
  const n = e.dataset, t = n.package ?? "";
  if (!t)
    return console.warn("app-banner: missing data-package on script tag"), null;
  const c = n.deepLink ?? (typeof window < "u" ? window.location.href : "https://localhost/"), r = n.title ?? "App", d = n.playStoreUrl, o = n.playReferrer, p = d ?? N(t, o);
  return {
    packageName: t,
    deepLink: c,
    playStoreUrl: p,
    playStoreReferrer: o,
    openFallbackEnabled: $(n.openFallbackEnabled, i.openFallbackEnabled),
    openFallbackTimeoutMs: F(n.openFallbackTimeoutMs, i.openFallbackTimeoutMs),
    title: r,
    description: n.description ?? i.description,
    iconUrl: n.icon,
    iconResolverUrl: n.iconResolver,
    dismissDuration: n.dismissDuration ?? n.dismissDays ?? i.dismissDuration,
    showAndroidOnly: $(n.showAndroidOnly, i.showAndroidOnly),
    openButtonText: n.openButtonText ?? i.openButtonText,
    theme: X(n.theme),
    storageKey: n.storageKey ?? t,
    topInsetPx: F(n.topInset, 0) || void 0
  };
}
function ee(e) {
  const n = e.playStoreUrl ?? N(e.packageName, e.playStoreReferrer);
  return {
    packageName: e.packageName,
    deepLink: e.deepLink,
    title: e.title,
    description: e.description ?? i.description,
    playStoreUrl: n,
    playStoreReferrer: e.playStoreReferrer,
    iconUrl: e.iconUrl,
    iconResolverUrl: e.iconResolverUrl,
    dismissDuration: e.dismissDuration ?? i.dismissDuration,
    showAndroidOnly: e.showAndroidOnly ?? i.showAndroidOnly,
    openButtonText: e.openButtonText ?? i.openButtonText,
    theme: e.theme ?? i.theme,
    storageKey: e.storageKey ?? e.packageName,
    openFallbackEnabled: e.openFallbackEnabled ?? i.openFallbackEnabled,
    openFallbackTimeoutMs: e.openFallbackTimeoutMs ?? i.openFallbackTimeoutMs,
    topInsetPx: e.topInsetPx
  };
}
let s;
function ne(e) {
  return s == null || s(), D(e) ? (s = O(e), () => {
    s == null || s(), s = void 0;
  }) : (s = void 0, () => {
  });
}
function q() {
  if (typeof document > "u") return null;
  const e = document.currentScript;
  if (e != null && e.hasAttribute("data-app-banner")) return e;
  const n = document.querySelectorAll("script[data-app-banner]");
  return n.length ? n[n.length - 1] : null;
}
function R() {
  const e = q();
  if (!e) return;
  const n = Z(e);
  n && D(n) && (s == null || s(), s = O(n));
}
typeof window < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => R(), { once: !0 }) : queueMicrotask(() => R()));
export {
  B as buildIntentUri,
  N as buildPlayStoreUrl,
  ee as createBannerOptions,
  ne as mountAppBanner
};
//# sourceMappingURL=app-banner.js.map
