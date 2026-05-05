import { mountBanner, shouldShow } from "./banner.js";
import { parseOptionsFromScript, type AppBannerOptions } from "./config.js";

export type { AppBannerOptions, AppBannerTheme } from "./config.js";
export { createBannerOptions } from "./config.js";
export { buildIntentUri, buildPlayStoreUrl } from "./intent.js";

let teardown: (() => void) | undefined;

/**
 * Mount or replace the banner from React / bundled apps (updates deep link when options change).
 */
export function mountAppBanner(options: AppBannerOptions): () => void {
  teardown?.();
  if (!shouldShow(options)) {
    teardown = undefined;
    return () => {};
  }
  teardown = mountBanner(options);
  return () => {
    teardown?.();
    teardown = undefined;
  };
}

function findLoaderScript(): HTMLScriptElement | null {
  if (typeof document === "undefined") return null;
  const current = document.currentScript as HTMLScriptElement | null;
  if (current?.hasAttribute("data-app-banner")) return current;
  const list = document.querySelectorAll("script[data-app-banner]");
  if (!list.length) return null;
  return list[list.length - 1] as HTMLScriptElement;
}

function initFromCurrentScript(): void {
  const el = findLoaderScript();
  if (!el) return;
  const parsed = parseOptionsFromScript(el);
  if (!parsed) return;
  if (!shouldShow(parsed)) return;
  teardown?.();
  teardown = mountBanner(parsed);
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initFromCurrentScript(), { once: true });
  } else {
    queueMicrotask(() => initFromCurrentScript());
  }
}
