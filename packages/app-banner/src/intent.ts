/**
 * Build a Chrome Android intent: URL that opens the app for a deep link
 * and falls back to the Play Store if the app is not installed.
 *
 * @see https://developer.chrome.com/docs/android/intents
 */
/**
 * @param referrer - Play install `referrer` query value (e.g. UTM or custom key=value string), not double-encoded
 */
export function buildPlayStoreUrl(packageName: string, referrer?: string): string {
  const id = encodeURIComponent(packageName);
  const base = `https://play.google.com/store/apps/details?id=${id}`;
  if (referrer != null && referrer !== "") {
    return `${base}&referrer=${encodeURIComponent(referrer)}`;
  }
  return base;
}

export function buildIntentUri(options: {
  deepLink: string;
  packageName: string;
  playStoreUrl: string;
}): string {
  const { deepLink, packageName, playStoreUrl } = options;
  let url: URL;
  try {
    url = new URL(deepLink, typeof window !== "undefined" ? window.location.href : undefined);
  } catch {
    throw new Error(`app-banner: invalid deepLink "${deepLink}"`);
  }

  const scheme = url.protocol.replace(/:$/, "");
  if (!scheme) {
    throw new Error("app-banner: deepLink must include a scheme (e.g. https://)");
  }

  const intentPath = url.host
    ? `${url.host}${url.pathname}${url.search}${url.hash}`
    : `${url.pathname.replace(/^\//, "")}${url.search}${url.hash}`;

  const fallback = encodeURIComponent(playStoreUrl);
  return `intent://${intentPath}#Intent;scheme=${scheme};package=${packageName};S.browser_fallback_url=${fallback};end`;
}
