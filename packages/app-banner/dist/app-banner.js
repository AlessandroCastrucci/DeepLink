function T(e, n) {
  const l = `https://play.google.com/store/apps/details?id=${encodeURIComponent(e)}`;
  return n != null && n !== "" ? `${l}&referrer=${encodeURIComponent(n)}` : l;
}
function I(e) {
  const { deepLink: n, packageName: a, playStoreUrl: l } = e;
  let r;
  try {
    r = new URL(n, typeof window < "u" ? window.location.href : void 0);
  } catch {
    throw new Error(`app-banner: invalid deepLink "${n}"`);
  }
  const s = r.protocol.replace(/:$/, "");
  if (!s)
    throw new Error("app-banner: deepLink must include a scheme (e.g. https://)");
  const c = r.host ? `${r.host}${r.pathname}${r.search}${r.hash}` : `${r.pathname.replace(/^\//, "")}${r.search}${r.hash}`, b = encodeURIComponent(l);
  return `intent://${c}#Intent;scheme=${s};package=${a};S.browser_fallback_url=${b};end`;
}
const U = "app-banner-styles";
function F(e) {
  return e === "light" || e === "dark" ? e : typeof window > "u" || !window.matchMedia ? "light" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function M() {
  if (typeof document > "u" || document.getElementById(U)) return;
  const e = document.createElement("style");
  e.id = U, e.textContent = `
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
function $(e) {
  return `app-banner:${e}`;
}
function R(e) {
  try {
    const n = localStorage.getItem($(e.storageKey));
    if (!n) return !1;
    const a = JSON.parse(n);
    return !(!a.until || Date.now() > a.until);
  } catch {
    return !1;
  }
}
function z(e) {
  const n = Date.now() + e.dismissDays * 864e5;
  try {
    localStorage.setItem($(e.storageKey), JSON.stringify({ until: n }));
  } catch {
  }
}
function C(e) {
  var N;
  M();
  const n = document.createElement("div");
  n.className = "app-banner-host", n.setAttribute("role", "region"), n.setAttribute("aria-label", "App install banner");
  const a = e.topInsetPx ?? 0;
  a > 0 && (n.style.top = `${a}px`);
  const r = F(e.theme) === "dark";
  n.style.setProperty("--app-banner-bg", r ? "var(--app-banner-bg-dark)" : "var(--app-banner-bg-light)"), n.style.setProperty("--app-banner-text", r ? "var(--app-banner-text-dark)" : "var(--app-banner-text-light)"), n.style.setProperty(
    "--app-banner-muted-text",
    r ? "var(--app-banner-muted-dark)" : "var(--app-banner-muted-light)"
  ), n.style.setProperty(
    "--app-banner-border",
    r ? "var(--app-banner-border-dark)" : "var(--app-banner-border-light)"
  );
  const s = document.createElement("div");
  s.className = "app-banner-inner";
  let c;
  if (e.iconUrl) {
    const t = document.createElement("img");
    t.className = "app-banner-icon", t.alt = "", t.src = e.iconUrl, t.referrerPolicy = "no-referrer", c = t;
  } else {
    const t = document.createElement("div");
    t.className = "app-banner-icon app-banner-icon--placeholder", t.textContent = e.title.trim().charAt(0).toUpperCase() || "A", c = t;
  }
  const b = document.createElement("div");
  b.className = "app-banner-text";
  const k = document.createElement("p");
  k.className = "app-banner-title", k.textContent = e.title;
  const x = document.createElement("p");
  x.className = "app-banner-desc", x.textContent = e.description, b.append(k, x);
  const v = document.createElement("div");
  v.className = "app-banner-actions";
  const g = document.createElement("button");
  g.type = "button", g.className = "app-banner-open", g.textContent = e.openButtonText;
  const m = document.createElement("button");
  m.type = "button", m.className = "app-banner-close", m.setAttribute("aria-label", "Dismiss"), m.innerHTML = "×";
  let h = 0, y = null;
  function w() {
    h !== 0 && (window.clearTimeout(h), h = 0), y && (document.removeEventListener("visibilitychange", y), y = null);
  }
  function B() {
    return e.playStoreUrl ?? T(e.packageName, e.playStoreReferrer);
  }
  g.addEventListener("click", () => {
    w();
    const t = B(), u = I({
      deepLink: e.deepLink,
      packageName: e.packageName,
      playStoreUrl: t
    });
    if (window.location.assign(u), !e.openFallbackEnabled || e.openFallbackTimeoutMs <= 0 || typeof document > "u")
      return;
    let f = !1;
    const d = () => {
      document.hidden && (f = !0);
    };
    y = d, document.addEventListener("visibilitychange", d), h = window.setTimeout(() => {
      document.removeEventListener("visibilitychange", d), y = null, h = 0, f || window.location.assign(t);
    }, e.openFallbackTimeoutMs);
  });
  const E = () => {
    w(), n.remove();
    const t = document.documentElement, u = t.style.paddingTop;
    u && u.includes("px") && (t.style.paddingTop = "");
  };
  m.addEventListener("click", () => {
    z(e), E();
  }), v.append(g, m), s.append(c, b, v), n.append(s);
  const D = () => n.getBoundingClientRect().height, L = () => {
    const t = D();
    document.documentElement.style.paddingTop = `${a + t}px`;
  };
  document.body.appendChild(n), L();
  const p = typeof ResizeObserver < "u" ? new ResizeObserver(() => L()) : null;
  if (p == null || p.observe(n), e.theme === "auto" && window.matchMedia) {
    const t = window.matchMedia("(prefers-color-scheme: dark)"), u = () => {
      const d = F("auto") === "dark";
      n.style.setProperty("--app-banner-bg", d ? "var(--app-banner-bg-dark)" : "var(--app-banner-bg-light)"), n.style.setProperty("--app-banner-text", d ? "var(--app-banner-text-dark)" : "var(--app-banner-text-light)"), n.style.setProperty(
        "--app-banner-muted-text",
        d ? "var(--app-banner-muted-dark)" : "var(--app-banner-muted-light)"
      ), n.style.setProperty(
        "--app-banner-border",
        d ? "var(--app-banner-border-dark)" : "var(--app-banner-border-light)"
      );
    };
    return (N = t.addEventListener) == null || N.call(t, "change", u), () => {
      var f;
      (f = t.removeEventListener) == null || f.call(t, "change", u), p == null || p.disconnect(), E();
    };
  }
  return () => {
    w(), p == null || p.disconnect(), E();
  };
}
function P(e) {
  return !(e.showAndroidOnly && typeof navigator < "u" && !/Android/i.test(navigator.userAgent) || R(e));
}
const o = {
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
function S(e, n) {
  if (e === void 0 || e === "") return n;
  const a = Number(e);
  return Number.isFinite(a) ? a : n;
}
function K(e) {
  return e === "light" || e === "dark" || e === "auto" ? e : o.theme;
}
function j(e) {
  const n = e.dataset, a = n.package ?? "";
  if (!a)
    return console.warn("app-banner: missing data-package on script tag"), null;
  const l = n.deepLink ?? (typeof window < "u" ? window.location.href : "https://localhost/"), r = n.title ?? "App", s = n.playStoreUrl, c = n.playReferrer, b = s ?? T(a, c);
  return {
    packageName: a,
    deepLink: l,
    playStoreUrl: b,
    playStoreReferrer: c,
    openFallbackEnabled: A(n.openFallbackEnabled, o.openFallbackEnabled),
    openFallbackTimeoutMs: S(n.openFallbackTimeoutMs, o.openFallbackTimeoutMs),
    title: r,
    description: n.description ?? o.description,
    iconUrl: n.icon,
    dismissDays: S(n.dismissDays, o.dismissDays),
    showAndroidOnly: A(n.showAndroidOnly, o.showAndroidOnly),
    openButtonText: n.openButtonText ?? o.openButtonText,
    theme: K(n.theme),
    storageKey: n.storageKey ?? a,
    topInsetPx: S(n.topInset, 0) || void 0
  };
}
function H(e) {
  const n = e.playStoreUrl ?? T(e.packageName, e.playStoreReferrer);
  return {
    packageName: e.packageName,
    deepLink: e.deepLink,
    title: e.title,
    description: e.description ?? o.description,
    playStoreUrl: n,
    playStoreReferrer: e.playStoreReferrer,
    iconUrl: e.iconUrl,
    dismissDays: e.dismissDays ?? o.dismissDays,
    showAndroidOnly: e.showAndroidOnly ?? o.showAndroidOnly,
    openButtonText: e.openButtonText ?? o.openButtonText,
    theme: e.theme ?? o.theme,
    storageKey: e.storageKey ?? e.packageName,
    openFallbackEnabled: e.openFallbackEnabled ?? o.openFallbackEnabled,
    openFallbackTimeoutMs: e.openFallbackTimeoutMs ?? o.openFallbackTimeoutMs,
    topInsetPx: e.topInsetPx
  };
}
let i;
function J(e) {
  return i == null || i(), P(e) ? (i = C(e), () => {
    i == null || i(), i = void 0;
  }) : (i = void 0, () => {
  });
}
function _() {
  if (typeof document > "u") return null;
  const e = document.currentScript;
  if (e != null && e.hasAttribute("data-app-banner")) return e;
  const n = document.querySelectorAll("script[data-app-banner]");
  return n.length ? n[n.length - 1] : null;
}
function O() {
  const e = _();
  if (!e) return;
  const n = j(e);
  n && P(n) && (i == null || i(), i = C(n));
}
typeof window < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => O(), { once: !0 }) : queueMicrotask(() => O()));
export {
  I as buildIntentUri,
  T as buildPlayStoreUrl,
  H as createBannerOptions,
  J as mountAppBanner
};
//# sourceMappingURL=app-banner.js.map
