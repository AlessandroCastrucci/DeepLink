import { buildPlayStoreUrl } from "./intent.js";

export type AppBannerTheme = "light" | "dark" | "auto";

export type AppBannerOptions = {
  /** Google Play applicationId / package name (required). */
  packageName: string;
  /** Deep link opened when the user taps Open (https App Links or custom scheme). */
  deepLink: string;
  /** Overrides default Play Store listing URL (if set, `playStoreReferrer` is not appended). */
  playStoreUrl?: string;
  /**
   * Appended as Play `&referrer=` when `playStoreUrl` is not overridden.
   * Use for install attribution (e.g. `utm_source=webapp&...`).
   */
  playStoreReferrer?: string;
  /**
   * If the app does not take focus after Open, redirect to the Play URL after a short delay
   * (mirrors visibility + timeout fallback). Default true.
   */
  openFallbackEnabled: boolean;
  /** Milliseconds to wait before redirecting to Play when the page stays visible. Default 3000. */
  openFallbackTimeoutMs: number;
  title: string;
  description: string;
  /** Optional square icon URL (png/webp). */
  iconUrl?: string;
  /**
   * Optional URL that returns `{ iconUrl: string }` JSON for the banner's `packageName`.
   * Used only when `iconUrl` is not set. `{package}` and `{size}` placeholders are
   * substituted in the URL; otherwise `?package=…&size=…` is appended.
   */
  iconResolverUrl?: string;
  /** Hide banner after dismiss for this many days (default 7). */
  dismissDays: number;
  /** If true (default), only render when the user agent looks like Android. */
  showAndroidOnly: boolean;
  openButtonText: string;
  theme: AppBannerTheme;
  /** localStorage key suffix; full key is `app-banner:${storageKey}`. */
  storageKey: string;
  /** Fixed layout offset from the top of the viewport (px), e.g. below a site header. */
  topInsetPx?: number;
};

const DEFAULTS: Omit<AppBannerOptions, "packageName" | "deepLink" | "title"> = {
  description: "Get the app for the best experience.",
  dismissDays: 7,
  showAndroidOnly: true,
  openButtonText: "Open",
  theme: "auto",
  storageKey: "default",
  openFallbackEnabled: true,
  openFallbackTimeoutMs: 3000,
};

function readBool(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value === "") return defaultValue;
  return value === "1" || value.toLowerCase() === "true" || value.toLowerCase() === "yes";
}

function readNumber(value: string | undefined, defaultValue: number): number {
  if (value === undefined || value === "") return defaultValue;
  const n = Number(value);
  return Number.isFinite(n) ? n : defaultValue;
}

function readTheme(value: string | undefined): AppBannerTheme {
  if (value === "light" || value === "dark" || value === "auto") return value;
  return DEFAULTS.theme;
}

/**
 * Parse options from a loader `<script data-app-banner …>` element.
 */
export function parseOptionsFromScript(el: HTMLScriptElement): AppBannerOptions | null {
  const ds = el.dataset;
  const packageName = ds["package"] ?? "";
  if (!packageName) {
    console.warn("app-banner: missing data-package on script tag");
    return null;
  }

  const deepLink =
    ds.deepLink ??
    (typeof window !== "undefined" ? window.location.href : "https://localhost/");
  const title = ds.title ?? "App";
  const explicitPlayUrl = ds.playStoreUrl;
  const playStoreReferrer = ds.playReferrer;
  const playStoreUrl =
    explicitPlayUrl ??
    buildPlayStoreUrl(packageName, playStoreReferrer);

  return {
    packageName,
    deepLink,
    playStoreUrl,
    playStoreReferrer,
    openFallbackEnabled: readBool(ds.openFallbackEnabled, DEFAULTS.openFallbackEnabled),
    openFallbackTimeoutMs: readNumber(ds.openFallbackTimeoutMs, DEFAULTS.openFallbackTimeoutMs),
    title,
    description: ds.description ?? DEFAULTS.description,
    iconUrl: ds.icon,
    iconResolverUrl: ds.iconResolver,
    dismissDays: readNumber(ds.dismissDays, DEFAULTS.dismissDays),
    showAndroidOnly: readBool(ds.showAndroidOnly, DEFAULTS.showAndroidOnly),
    openButtonText: ds.openButtonText ?? DEFAULTS.openButtonText,
    theme: readTheme(ds.theme),
    storageKey: ds.storageKey ?? packageName,
    topInsetPx: readNumber(ds.topInset, 0) || undefined,
  };
}

/**
 * Build options programmatically (e.g. SPA consumers updating deep links on navigation).
 */
export function createBannerOptions(
  partial: Pick<AppBannerOptions, "packageName" | "deepLink" | "title"> &
    Partial<Omit<AppBannerOptions, "packageName" | "deepLink" | "title">>,
): AppBannerOptions {
  const playStoreUrl =
    partial.playStoreUrl ??
    buildPlayStoreUrl(partial.packageName, partial.playStoreReferrer);

  return {
    packageName: partial.packageName,
    deepLink: partial.deepLink,
    title: partial.title,
    description: partial.description ?? DEFAULTS.description,
    playStoreUrl,
    playStoreReferrer: partial.playStoreReferrer,
    iconUrl: partial.iconUrl,
    iconResolverUrl: partial.iconResolverUrl,
    dismissDays: partial.dismissDays ?? DEFAULTS.dismissDays,
    showAndroidOnly: partial.showAndroidOnly ?? DEFAULTS.showAndroidOnly,
    openButtonText: partial.openButtonText ?? DEFAULTS.openButtonText,
    theme: partial.theme ?? DEFAULTS.theme,
    storageKey: partial.storageKey ?? partial.packageName,
    openFallbackEnabled: partial.openFallbackEnabled ?? DEFAULTS.openFallbackEnabled,
    openFallbackTimeoutMs: partial.openFallbackTimeoutMs ?? DEFAULTS.openFallbackTimeoutMs,
    topInsetPx: partial.topInsetPx,
  };
}
