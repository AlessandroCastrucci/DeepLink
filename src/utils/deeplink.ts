const APP_SCHEME = "playvod";
const ANDROID_PACKAGE = "com.virgoplay.playvod.af";
const IOS_APP_STORE_ID = "1210318173";
const IOS_APP_STORE_URL = `https://apps.apple.com/app/playvod/id${IOS_APP_STORE_ID}`;
const ANDROID_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

const FALLBACK_DELAY = 1500;

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

export function buildAppLinkUrl(appPath: string): string {
  return `${window.location.origin}${appPath}`;
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

function openWithVisibilityFallback(url: string, fallbackUrl: string): void {
  let didLeave = false;

  const onVisibilityChange = () => {
    if (document.hidden) didLeave = true;
  };

  document.addEventListener("visibilitychange", onVisibilityChange);

  window.location.href = url;

  setTimeout(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    if (!didLeave) {
      window.location.href = fallbackUrl;
    }
  }, FALLBACK_DELAY);
}

export function openAppWithFallback(
  platform: Platform,
  appPath: string,
): void {
  if (platform === "android") {
    openWithVisibilityFallback(buildAppLinkUrl(appPath), ANDROID_STORE_URL);
    return;
  }

  if (platform === "ios") {
    openWithVisibilityFallback(buildCustomSchemeUrl(appPath), IOS_APP_STORE_URL);
    return;
  }

  window.location.href = getStoreUrl(platform);
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
