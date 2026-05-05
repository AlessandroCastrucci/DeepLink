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
/**
 * Parse options from a loader `<script data-app-banner …>` element.
 */
export declare function parseOptionsFromScript(el: HTMLScriptElement): AppBannerOptions | null;
/**
 * Build options programmatically (e.g. SPA consumers updating deep links on navigation).
 */
export declare function createBannerOptions(partial: Pick<AppBannerOptions, "packageName" | "deepLink" | "title"> & Partial<Omit<AppBannerOptions, "packageName" | "deepLink" | "title">>): AppBannerOptions;
