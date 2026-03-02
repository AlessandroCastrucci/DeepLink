const APP_SCHEME = "playvod";
const ANDROID_PACKAGE = "com.virgoplay.playvod.af";
const IOS_APP_STORE_ID = "1210318173";
const IOS_APP_STORE_URL = `https://apps.apple.com/app/playvod/id${IOS_APP_STORE_ID}`;
const ANDROID_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

export type Platform = "ios" | "android" | "desktop";

export function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

export function buildDeepLinkPath(
  contentId?: number | string,
): string {
  if (contentId) {
    return `/detail?id=${contentId}`;
  }
  return "/app";
}

export function buildIntentUrl(
  appPath: string,
  fallbackUrl: string,
): string {
  return (
    `https://${window.location.host}${appPath}#Intent;` +
    `scheme=${APP_SCHEME};` +
    `package=${ANDROID_PACKAGE};` +
    `S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};` +
    `end;`
  );
}

export function buildCustomSchemeUrl(appPath: string): string {
  const cleanPath = appPath.startsWith("/") ? appPath.slice(1) : appPath;
  return `${APP_SCHEME}://${cleanPath}`;
}

export function getStoreUrl(platform: Platform): string {
  if (platform === "ios") return IOS_APP_STORE_URL;
  if (platform === "android") return ANDROID_STORE_URL;
  return ANDROID_STORE_URL;
}

export function getOpenInAppUrl(
  platform: Platform,
  appPath: string,
  webFallbackUrl: string,
): string {
  if (platform === "android") {
    return buildIntentUrl(appPath, webFallbackUrl);
  }
  return buildCustomSchemeUrl(appPath);
}

export function updateSmartBanner(currentPath: string): void {
  const meta = document.querySelector('meta[name="apple-itunes-app"]');
  if (meta) {
    meta.setAttribute(
      "content",
      `app-id=${IOS_APP_STORE_ID}, app-argument=${window.location.origin}${currentPath}`,
    );
  }
}
