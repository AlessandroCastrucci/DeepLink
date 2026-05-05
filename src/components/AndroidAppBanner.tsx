import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { createBannerOptions, mountAppBanner } from "app-banner";
import {
  ANDROID_PACKAGE,
  buildAppLinkUrl,
  buildDeepLinkPath,
  buildReferrer,
  getStoredAuthToken,
} from "../utils/deeplink.ts";

const HEADER_HEIGHT_PX = 56;

/**
 * Android-only smart banner via `app-banner` SDK (intent + Play fallback).
 * iOS uses the native Safari Smart App Banner (`apple-itunes-app` meta).
 */
export default function AndroidAppBanner() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = getStoredAuthToken();
    const contentMatch = pathname.match(/^\/content\/(\d+)/);
    const contentIdRaw = contentMatch?.[1] ?? searchParams.get("id") ?? undefined;
    const contentId = contentIdRaw ?? undefined;

    const appPath = buildDeepLinkPath(contentId, token);
    const deepLink = buildAppLinkUrl(appPath);
    const referrer = buildReferrer({
      authToken: token,
      contentId: contentId != null ? String(contentId) : undefined,
    });

    const cleanup = mountAppBanner(
      createBannerOptions({
        packageName: ANDROID_PACKAGE,
        deepLink,
        title: "PlayVOD",
        description: "Disponible sur Google Play",
        playStoreReferrer: referrer,
        showAndroidOnly: true,
        theme: "dark",
        storageKey: "playvod-android-banner",
        iconResolverUrl: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/play-store-icon`,
        openFallbackEnabled: true,
        openFallbackTimeoutMs: 3000,
        topInsetPx: HEADER_HEIGHT_PX,
        openButtonText: "Ouvrir",
        dismissDuration: "0",
      }),
    );

    return cleanup;
  }, [pathname, searchParams]);

  return null;
}
