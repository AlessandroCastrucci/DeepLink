function N(e, n) {
  const s = `https://play.google.com/store/apps/details?id=${encodeURIComponent(e)}`;
  return n != null && n !== "" ? `${s}&referrer=${encodeURIComponent(n)}` : s;
}
function M(e) {
  const { deepLink: n, packageName: t, playStoreUrl: s } = e;
  let r;
  try {
    r = new URL(n, typeof window < "u" ? window.location.href : void 0);
  } catch {
    throw new Error(`app-banner: invalid deepLink "${n}"`);
  }
  const d = r.protocol.replace(/:$/, "");
  if (!d)
    throw new Error("app-banner: deepLink must include a scheme (e.g. https://)");
  const o = r.host ? `${r.host}${r.pathname}${r.search}${r.hash}` : `${r.pathname.replace(/^\//, "")}${r.search}${r.hash}`, c = encodeURIComponent(s);
  return `intent://${o}#Intent;scheme=${d};package=${t};S.browser_fallback_url=${c};end`;
}
const I = "app-banner-styles";
function $(e) {
  return e === "light" || e === "dark" ? e : typeof window > "u" || !window.matchMedia ? "light" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function z() {
  if (typeof document > "u" || document.getElementById(I)) return;
  const e = document.createElement("style");
  e.id = I, e.textContent = `
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
function R(e) {
  return `app-banner:${e}`;
}
function K(e, n, t = 192) {
  if (e.includes("{package}") || e.includes("{size}"))
    return e.replace(/\{package\}/g, encodeURIComponent(n)).replace(/\{size\}/g, String(t));
  const r = e.includes("?") ? "&" : "?";
  return `${e}${r}package=${encodeURIComponent(n)}&size=${t}`;
}
const _ = 7 * 864e5;
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
      JSON.stringify({ url: n, until: Date.now() + _ })
    );
  } catch {
  }
}
async function H(e, n) {
  const t = j(n);
  if (t) return t;
  try {
    const s = await fetch(K(e, n), {
      headers: { Accept: "application/json" }
    });
    if (!s.ok) return null;
    const r = await s.json();
    return r.iconUrl ? (J(n, r.iconUrl), r.iconUrl) : null;
  } catch {
    return null;
  }
}
function G(e) {
  try {
    const n = localStorage.getItem(R(e.storageKey));
    if (!n) return !1;
    const t = JSON.parse(n);
    return !(!t.until || Date.now() > t.until);
  } catch {
    return !1;
  }
}
function V(e) {
  const n = Date.now() + e.dismissDays * 864e5;
  try {
    localStorage.setItem(R(e.storageKey), JSON.stringify({ until: n }));
  } catch {
  }
}
function O(e) {
  var C;
  z();
  const n = document.createElement("div");
  n.className = "app-banner-host", n.setAttribute("role", "region"), n.setAttribute("aria-label", "App install banner");
  const t = e.topInsetPx ?? 0;
  t > 0 && (n.style.top = `${t}px`);
  const r = $(e.theme) === "dark";
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
  const c = document.createElement("div");
  c.className = "app-banner-icon app-banner-icon--placeholder", c.textContent = e.title.trim().charAt(0).toUpperCase() || "A", o.addEventListener("error", () => {
    o.parentNode && o.parentNode.replaceChild(c, o);
  });
  let k;
  e.iconUrl ? (o.src = e.iconUrl, k = o) : e.iconResolverUrl ? (k = c, H(e.iconResolverUrl, e.packageName).then((a) => {
    a && (o.src = a, c.parentNode && c.parentNode.replaceChild(o, c));
  }).catch(() => {
  })) : k = c;
  const x = document.createElement("div");
  x.className = "app-banner-text";
  const v = document.createElement("p");
  v.className = "app-banner-title", v.textContent = e.title;
  const w = document.createElement("p");
  w.className = "app-banner-desc", w.textContent = e.description, x.append(v, w);
  const E = document.createElement("div");
  E.className = "app-banner-actions";
  const h = document.createElement("button");
  h.type = "button", h.className = "app-banner-open", h.textContent = e.openButtonText;
  const m = document.createElement("button");
  m.type = "button", m.className = "app-banner-close", m.setAttribute("aria-label", "Dismiss"), m.innerHTML = "×";
  let g = 0, y = null;
  function S() {
    g !== 0 && (window.clearTimeout(g), g = 0), y && (document.removeEventListener("visibilitychange", y), y = null);
  }
  function D() {
    return e.playStoreUrl ?? N(e.packageName, e.playStoreReferrer);
  }
  h.addEventListener("click", () => {
    S();
    const a = D(), b = M({
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
  const U = () => {
    S(), n.remove();
    const a = document.documentElement, b = a.style.paddingTop;
    b && b.includes("px") && (a.style.paddingTop = "");
  };
  m.addEventListener("click", () => {
    V(e), U();
  }), E.append(h, m), d.append(k, x, E), n.append(d);
  const B = () => n.getBoundingClientRect().height, L = () => {
    const a = B();
    document.documentElement.style.paddingTop = `${t + a}px`;
  };
  document.body.appendChild(n), L();
  const l = typeof ResizeObserver < "u" ? new ResizeObserver(() => L()) : null;
  if (l == null || l.observe(n), e.theme === "auto" && window.matchMedia) {
    const a = window.matchMedia("(prefers-color-scheme: dark)"), b = () => {
      const u = $("auto") === "dark";
      n.style.setProperty("--app-banner-bg", u ? "var(--app-banner-bg-dark)" : "var(--app-banner-bg-light)"), n.style.setProperty("--app-banner-text", u ? "var(--app-banner-text-dark)" : "var(--app-banner-text-light)"), n.style.setProperty(
        "--app-banner-muted-text",
        u ? "var(--app-banner-muted-dark)" : "var(--app-banner-muted-light)"
      ), n.style.setProperty(
        "--app-banner-border",
        u ? "var(--app-banner-border-dark)" : "var(--app-banner-border-light)"
      );
    };
    return (C = a.addEventListener) == null || C.call(a, "change", b), () => {
      var f;
      (f = a.removeEventListener) == null || f.call(a, "change", b), l == null || l.disconnect(), U();
    };
  }
  return () => {
    S(), l == null || l.disconnect(), U();
  };
}
function P(e) {
  return !(e.showAndroidOnly && typeof navigator < "u" && !/Android/i.test(navigator.userAgent) || G(e));
}
const i = {
  description: "Get the app for the best experience.",
  dismissDays: 7,
  showAndroidOnly: !0,
  openButtonText: "Open",
  theme: "auto",
  openFallbackEnabled: !0,
  openFallbackTimeoutMs: 3e3
};
function A(e, n) {
  return e === void 0 || e === "" ? n : e === "1" || e.toLowerCase() === "true" || e.toLowerCase() === "yes";
}
function T(e, n) {
  if (e === void 0 || e === "") return n;
  const t = Number(e);
  return Number.isFinite(t) ? t : n;
}
function Y(e) {
  return e === "light" || e === "dark" || e === "auto" ? e : i.theme;
}
function Q(e) {
  const n = e.dataset, t = n.package ?? "";
  if (!t)
    return console.warn("app-banner: missing data-package on script tag"), null;
  const s = n.deepLink ?? (typeof window < "u" ? window.location.href : "https://localhost/"), r = n.title ?? "App", d = n.playStoreUrl, o = n.playReferrer, c = d ?? N(t, o);
  return {
    packageName: t,
    deepLink: s,
    playStoreUrl: c,
    playStoreReferrer: o,
    openFallbackEnabled: A(n.openFallbackEnabled, i.openFallbackEnabled),
    openFallbackTimeoutMs: T(n.openFallbackTimeoutMs, i.openFallbackTimeoutMs),
    title: r,
    description: n.description ?? i.description,
    iconUrl: n.icon,
    iconResolverUrl: n.iconResolver,
    dismissDays: T(n.dismissDays, i.dismissDays),
    showAndroidOnly: A(n.showAndroidOnly, i.showAndroidOnly),
    openButtonText: n.openButtonText ?? i.openButtonText,
    theme: Y(n.theme),
    storageKey: n.storageKey ?? t,
    topInsetPx: T(n.topInset, 0) || void 0
  };
}
function X(e) {
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
    dismissDays: e.dismissDays ?? i.dismissDays,
    showAndroidOnly: e.showAndroidOnly ?? i.showAndroidOnly,
    openButtonText: e.openButtonText ?? i.openButtonText,
    theme: e.theme ?? i.theme,
    storageKey: e.storageKey ?? e.packageName,
    openFallbackEnabled: e.openFallbackEnabled ?? i.openFallbackEnabled,
    openFallbackTimeoutMs: e.openFallbackTimeoutMs ?? i.openFallbackTimeoutMs,
    topInsetPx: e.topInsetPx
  };
}
let p;
function Z(e) {
  return p == null || p(), P(e) ? (p = O(e), () => {
    p == null || p(), p = void 0;
  }) : (p = void 0, () => {
  });
}
function W() {
  if (typeof document > "u") return null;
  const e = document.currentScript;
  if (e != null && e.hasAttribute("data-app-banner")) return e;
  const n = document.querySelectorAll("script[data-app-banner]");
  return n.length ? n[n.length - 1] : null;
}
function F() {
  const e = W();
  if (!e) return;
  const n = Q(e);
  n && P(n) && (p == null || p(), p = O(n));
}
typeof window < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => F(), { once: !0 }) : queueMicrotask(() => F()));
export {
  M as buildIntentUri,
  N as buildPlayStoreUrl,
  X as createBannerOptions,
  Z as mountAppBanner
};
//# sourceMappingURL=app-banner.js.map
