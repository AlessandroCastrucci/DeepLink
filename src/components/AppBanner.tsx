import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  detectPlatform,
  buildDeepLinkPath,
  buildAppLinkUrl,
  buildReferrer,
  getStoredAuthToken,
  markAppLinkAttempt,
  type Platform,
} from "../utils/deeplink.ts";

const DISMISSED_KEY = "app_banner_dismissed";

export default function AppBanner() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<Platform>("desktop");
  const location = useLocation();

  useEffect(() => {
    const p = detectPlatform();
    setPlatform(p);
    if (p !== "desktop" && !sessionStorage.getItem(DISMISSED_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem(DISMISSED_KEY, "1");
  }

  if (!visible) return null;

  const contentMatch = location.pathname.match(/^\/content\/(\d+)/);
  const contentId = contentMatch?.[1];
  const appPath = buildDeepLinkPath(contentId);
  const appLinkUrl = buildAppLinkUrl(appPath);

  function handleOpen(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const referrer = buildReferrer({
      authToken: getStoredAuthToken(),
      contentId: contentId || undefined,
    });
    markAppLinkAttempt(platform, referrer);
    window.location.href = appLinkUrl;
  }

  return (
    <div className="fixed top-14 right-0 left-0 z-40 border-b border-dark-600 bg-dark-800/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-accent-500"
          >
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">PlayVOD</p>
          <p className="truncate text-xs text-gray-400">
            {platform === "ios"
              ? "Disponible sur l'App Store"
              : "Disponible sur Google Play"}
          </p>
        </div>
        <a
          href={appLinkUrl}
          onClick={handleOpen}
          className="flex-shrink-0 rounded-lg bg-accent-500 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-600"
        >
          Ouvrir
        </a>
        <button
          onClick={dismiss}
          className="flex-shrink-0 p-1 text-gray-500 transition-colors hover:text-gray-300"
          aria-label="Fermer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
