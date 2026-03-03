const ANDROID_PACKAGE = "com.virgoplay.playvod.af";
const IOS_APP_STORE_ID = "1210318173";
const IOS_APP_STORE_URL = `https://apps.apple.com/app/playvod/id${IOS_APP_STORE_ID}`;
const ANDROID_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

const APP_LINK_ATTEMPT_KEY = "app_link_attempt";
const ATTEMPT_TTL_MS = 3000;

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

export function getStoreUrl(platform: Platform): string {
  if (platform === "ios") return IOS_APP_STORE_URL;
  if (platform === "android") return ANDROID_STORE_URL;
  return ANDROID_STORE_URL;
}

export function markAppLinkAttempt(platform: Platform): void {
  sessionStorage.setItem(
    APP_LINK_ATTEMPT_KEY,
    JSON.stringify({ timestamp: Date.now(), platform }),
  );
}

export function checkAppLinkAttempt(): Platform | null {
  const raw = sessionStorage.getItem(APP_LINK_ATTEMPT_KEY);
  if (!raw) return null;

  sessionStorage.removeItem(APP_LINK_ATTEMPT_KEY);

  try {
    const { timestamp, platform } = JSON.parse(raw);
    if (Date.now() - timestamp < ATTEMPT_TTL_MS) {
      return platform as Platform;
    }
  } catch {
    /* corrupted entry */
  }

  return null;
}

export function openAppWithFallback(
  platform: Platform,
  appPath: string,
): void {
  if (platform === "desktop") {
    window.location.href = getStoreUrl(platform);
    return;
  }

  const url = buildAppLinkUrl(appPath);

  markAppLinkAttempt(platform);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  let didLeave = false;
  const onVisibilityChange = () => {
    if (document.hidden) didLeave = true;
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  setTimeout(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    if (!didLeave) {
      window.location.href = getStoreUrl(platform);
    }
  }, ATTEMPT_TTL_MS);
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
