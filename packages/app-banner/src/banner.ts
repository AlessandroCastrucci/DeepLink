import type { AppBannerOptions } from "./config.js";
import { buildIntentUri, buildPlayStoreUrl } from "./intent.js";

const STYLE_ID = "app-banner-styles";

function resolvedTheme(theme: AppBannerOptions["theme"]): "light" | "dark" {
  if (theme === "light" || theme === "dark") return theme;
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function injectStyles(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
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
`;
  document.head.appendChild(style);
}

function storageKeyFull(key: string): string {
  return `app-banner:${key}`;
}

function isDismissed(options: AppBannerOptions): boolean {
  try {
    const raw = localStorage.getItem(storageKeyFull(options.storageKey));
    if (!raw) return false;
    const data = JSON.parse(raw) as { until?: number };
    if (!data.until || Date.now() > data.until) return false;
    return true;
  } catch {
    return false;
  }
}

function rememberDismiss(options: AppBannerOptions): void {
  const until = Date.now() + options.dismissDays * 86400000;
  try {
    localStorage.setItem(storageKeyFull(options.storageKey), JSON.stringify({ until }));
  } catch {
    /* ignore quota */
  }
}

export function mountBanner(options: AppBannerOptions): () => void {
  injectStyles();

  const root = document.createElement("div");
  root.className = "app-banner-host";
  root.setAttribute("role", "region");
  root.setAttribute("aria-label", "App install banner");

  const topInsetPx = options.topInsetPx ?? 0;
  if (topInsetPx > 0) {
    root.style.top = `${topInsetPx}px`;
  }

  const mode = resolvedTheme(options.theme);
  const isDark = mode === "dark";
  root.style.setProperty("--app-banner-bg", isDark ? "var(--app-banner-bg-dark)" : "var(--app-banner-bg-light)");
  root.style.setProperty("--app-banner-text", isDark ? "var(--app-banner-text-dark)" : "var(--app-banner-text-light)");
  root.style.setProperty(
    "--app-banner-muted-text",
    isDark ? "var(--app-banner-muted-dark)" : "var(--app-banner-muted-light)"
  );
  root.style.setProperty(
    "--app-banner-border",
    isDark ? "var(--app-banner-border-dark)" : "var(--app-banner-border-light)"
  );

  const inner = document.createElement("div");
  inner.className = "app-banner-inner";

  let iconEl: HTMLImageElement | HTMLDivElement;
  if (options.iconUrl) {
    const img = document.createElement("img");
    img.className = "app-banner-icon";
    img.alt = "";
    img.src = options.iconUrl;
    img.referrerPolicy = "no-referrer";
    iconEl = img;
  } else {
    const ph = document.createElement("div");
    ph.className = "app-banner-icon app-banner-icon--placeholder";
    ph.textContent = options.title.trim().charAt(0).toUpperCase() || "A";
    iconEl = ph;
  }

  const text = document.createElement("div");
  text.className = "app-banner-text";
  const title = document.createElement("p");
  title.className = "app-banner-title";
  title.textContent = options.title;
  const desc = document.createElement("p");
  desc.className = "app-banner-desc";
  desc.textContent = options.description;
  text.append(title, desc);

  const actions = document.createElement("div");
  actions.className = "app-banner-actions";

  const openBtn = document.createElement("button");
  openBtn.type = "button";
  openBtn.className = "app-banner-open";
  openBtn.textContent = options.openButtonText;

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "app-banner-close";
  closeBtn.setAttribute("aria-label", "Dismiss");
  closeBtn.innerHTML = "×";

  let fallbackTimerId = 0;
  let fallbackOnVisibility: (() => void) | null = null;

  function clearOpenFallback(): void {
    if (fallbackTimerId !== 0) {
      window.clearTimeout(fallbackTimerId);
      fallbackTimerId = 0;
    }
    if (fallbackOnVisibility) {
      document.removeEventListener("visibilitychange", fallbackOnVisibility);
      fallbackOnVisibility = null;
    }
  }

  function resolvePlayStoreUrl(): string {
    return (
      options.playStoreUrl ??
      buildPlayStoreUrl(options.packageName, options.playStoreReferrer)
    );
  }

  openBtn.addEventListener("click", () => {
    clearOpenFallback();

    const playStoreUrl = resolvePlayStoreUrl();
    const intentUrl = buildIntentUri({
      deepLink: options.deepLink,
      packageName: options.packageName,
      playStoreUrl,
    });

    window.location.assign(intentUrl);

    if (
      !options.openFallbackEnabled ||
      options.openFallbackTimeoutMs <= 0 ||
      typeof document === "undefined"
    ) {
      return;
    }

    let didLeave = false;
    const onVisibilityChange = (): void => {
      if (document.hidden) didLeave = true;
    };
    fallbackOnVisibility = onVisibilityChange;
    document.addEventListener("visibilitychange", onVisibilityChange);

    fallbackTimerId = window.setTimeout(() => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      fallbackOnVisibility = null;
      fallbackTimerId = 0;
      if (!didLeave) {
        window.location.assign(playStoreUrl);
      }
    }, options.openFallbackTimeoutMs);
  });

  const remove = (): void => {
    clearOpenFallback();
    root.remove();
    const docEl = document.documentElement;
    const pad = docEl.style.paddingTop;
    if (pad && pad.includes("px")) {
      docEl.style.paddingTop = "";
    }
  };

  closeBtn.addEventListener("click", () => {
    rememberDismiss(options);
    remove();
  });

  actions.append(openBtn, closeBtn);
  inner.append(iconEl, text, actions);
  root.append(inner);

  const bannerHeight = (): number => root.getBoundingClientRect().height;

  const applyBodyOffset = (): void => {
    const h = bannerHeight();
    document.documentElement.style.paddingTop = `${topInsetPx + h}px`;
  };

  document.body.appendChild(root);
  applyBodyOffset();

  const ro =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => applyBodyOffset())
      : null;
  ro?.observe(root);

  if (options.theme === "auto" && window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (): void => {
      const m = resolvedTheme("auto");
      const d = m === "dark";
      root.style.setProperty("--app-banner-bg", d ? "var(--app-banner-bg-dark)" : "var(--app-banner-bg-light)");
      root.style.setProperty("--app-banner-text", d ? "var(--app-banner-text-dark)" : "var(--app-banner-text-light)");
      root.style.setProperty(
        "--app-banner-muted-text",
        d ? "var(--app-banner-muted-dark)" : "var(--app-banner-muted-light)"
      );
      root.style.setProperty(
        "--app-banner-border",
        d ? "var(--app-banner-border-dark)" : "var(--app-banner-border-light)"
      );
    };
    mq.addEventListener?.("change", onChange);
    return () => {
      mq.removeEventListener?.("change", onChange);
      ro?.disconnect();
      remove();
    };
  }

  return () => {
    clearOpenFallback();
    ro?.disconnect();
    remove();
  };
}

export function shouldShow(options: AppBannerOptions): boolean {
  if (options.showAndroidOnly && typeof navigator !== "undefined") {
    if (!/Android/i.test(navigator.userAgent)) return false;
  }
  if (isDismissed(options)) return false;
  return true;
}
