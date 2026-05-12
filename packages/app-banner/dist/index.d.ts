import { type AppBannerOptions } from "./config.js";
export type { AppBannerOptions, AppBannerTheme } from "./config.js";
export { createBannerOptions } from "./config.js";
export { buildIntentUri, buildPlayStoreUrl } from "./intent.js";
/**
 * Mount or replace the banner from React / bundled apps (updates deep link when options change).
 */
export declare function mountAppBanner(options: AppBannerOptions): () => void;
