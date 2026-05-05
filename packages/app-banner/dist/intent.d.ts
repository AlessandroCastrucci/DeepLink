/**
 * Build a Chrome Android intent: URL that opens the app for a deep link
 * and falls back to the Play Store if the app is not installed.
 *
 * @see https://developer.chrome.com/docs/android/intents
 */
/**
 * @param referrer - Play install `referrer` query value (e.g. UTM or custom key=value string), not double-encoded
 */
export declare function buildPlayStoreUrl(packageName: string, referrer?: string): string;
export declare function buildIntentUri(options: {
    deepLink: string;
    packageName: string;
    playStoreUrl: string;
}): string;
