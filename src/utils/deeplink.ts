const ANDROID_PACKAGE = "com.virgoplay.playvod.af";
const IOS_APP_STORE_ID = "1210318173";
export const IOS_APP_STORE_URL = `https://apps.apple.com/app/playvod/id${IOS_APP_STORE_ID}`;
export const ANDROID_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

const APP_LINK_ATTEMPT_KEY = "app_link_attempt";
const KLIENTO_SESSION_KEY = "kliento_session";
const ATTEMPT_TTL_MS = 3000;

export type Platform = "ios" | "android" | "desktop";

export interface ReferrerData {
  authToken?: string;
  contentId?: string;
}

export function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

export function buildDeepLinkPath(
  contentId?: number | string,
  authToken?: string,
): string {
  const params = new URLSearchParams();
  if (contentId) params.set("id", String(contentId));
  if (authToken) params.set("authToken", authToken);
  const qs = params.toString();
  if (contentId) return `/detail${qs ? `?${qs}` : ""}`;
  return qs ? `/app?${qs}` : "/app";
}

export function buildResetPasswordPath(username: string): string {
  const params = new URLSearchParams();
  params.set("username", username);
  return `/reset-password?${params.toString()}`;
}

export function openResetPassword(username: string): void {
  const platform = detectPlatform();
  const path = buildResetPasswordPath(username);
  const authToken = getStoredAuthToken();
  openAppWithFallback(platform, path, authToken ? `authToken=${authToken}` : undefined);
}

export function buildAppLinkUrl(appPath: string): string {
  return `${window.location.origin}${appPath}`;
}

export function buildReferrer(data: ReferrerData): string {
  const params = new URLSearchParams();
  params.set("utm_source", "webapp");
  if (data.authToken) params.set("authToken", data.authToken);
  if (data.contentId) params.set("contentId", data.contentId);
  return params.toString();
}

export function getStoredAuthToken(): string | undefined {
  try {
    const raw = localStorage.getItem(KLIENTO_SESSION_KEY);
    if (!raw) return undefined;
    const session = JSON.parse(raw);
    return session.authToken || undefined;
  } catch {
    return undefined;
  }
}

export function getStoreUrl(platform: Platform, referrer?: string): string {
  if (platform === "ios") return IOS_APP_STORE_URL;
  if (referrer) {
    return `${ANDROID_STORE_URL}&referrer=${encodeURIComponent(referrer)}`;
  }
  return ANDROID_STORE_URL;
}

export function markAppLinkAttempt(platform: Platform, referrer?: string): void {
  sessionStorage.setItem(
    APP_LINK_ATTEMPT_KEY,
    JSON.stringify({ timestamp: Date.now(), platform, referrer }),
  );
}

export function checkAppLinkAttempt(): { platform: Platform; referrer?: string } | null {
  const raw = sessionStorage.getItem(APP_LINK_ATTEMPT_KEY);
  if (!raw) return null;

  sessionStorage.removeItem(APP_LINK_ATTEMPT_KEY);

  try {
    const { timestamp, platform, referrer } = JSON.parse(raw);
    if (Date.now() - timestamp < ATTEMPT_TTL_MS) {
      return { platform, referrer };
    }
  } catch {
    /* corrupted entry */
  }

  return null;
}

export function openAppWithFallback(
  platform: Platform,
  appPath: string,
  referrer?: string,
): void {
  if (platform === "desktop") {
    window.location.href = getStoreUrl(platform, referrer);
    return;
  }

  const url = buildAppLinkUrl(appPath);

  markAppLinkAttempt(platform, referrer);

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
      window.location.href = getStoreUrl(platform, referrer);
    }
  }, ATTEMPT_TTL_MS);
}

export function updateSmartBanner(currentPath: string, authToken?: string): void {
  const meta = document.querySelector('meta[name="apple-itunes-app"]');
  if (meta) {
    const separator = currentPath.includes("?") ? "&" : "?";
    const url = authToken
      ? `${window.location.origin}${currentPath}${separator}authToken=${encodeURIComponent(authToken)}`
      : `${window.location.origin}${currentPath}`;
    meta.setAttribute(
      "content",
      `app-id=${IOS_APP_STORE_ID}, app-argument=${url}`,
    );
  }
}
