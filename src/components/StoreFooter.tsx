import { useParams, useSearchParams } from "react-router-dom";
import {
  ANDROID_STORE_URL,
  IOS_APP_STORE_URL,
  getStoredAuthToken,
  buildReferrer,
} from "../utils/deeplink.ts";

function useContentId(): string | undefined {
  const { contentId } = useParams<{ contentId: string }>();
  const [searchParams] = useSearchParams();
  return contentId || searchParams.get("id") || undefined;
}

function buildAndroidUrl(contentId?: string): string {
  const token = getStoredAuthToken();
  if (token || contentId) {
    const referrer = buildReferrer({
      authToken: token,
      contentId,
    });
    return `${ANDROID_STORE_URL}&referrer=${encodeURIComponent(referrer)}`;
  }
  return ANDROID_STORE_URL;
}

function GooglePlayBadge() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 53.3" className="h-10">
      <rect width="180" height="53.3" rx="6" fill="#000" />
      <rect x="0.7" y="0.7" width="178.6" height="51.9" rx="5.3" fill="none" stroke="#a6a6a6" strokeWidth="0.7" />
      <text fill="#fff" fontFamily="system-ui, -apple-system, sans-serif" fontSize="8" x="60" y="15" letterSpacing="0.3">GET IT ON</text>
      <text fill="#fff" fontFamily="system-ui, -apple-system, sans-serif" fontSize="16" fontWeight="500" x="60" y="36">Google Play</text>
      <g transform="translate(16, 8) scale(0.65)">
        <path d="M6.1 4.2c-.4.4-.6 1-.6 1.8v44c0 .8.2 1.4.6 1.8l.1.1L31 27.1v-.2L6.1 4.2z" fill="#00d2ff" />
        <path d="M39.8 36l-8.8-8.8v-.4L39.8 18l.2.1 10.4 5.9c3 1.7 3 4.4 0 6.1L40 36h-.2z" fill="#ffbc00" />
        <path d="M40 35.9L31 27 6.1 51.8c1 1 2.5 1.1 4.2.2L40 35.9" fill="#ff3a44" />
        <path d="M40 18.1L10.3 2c-1.7-1-3.3-.8-4.2.2L31 27l9-8.9z" fill="#00f076" />
      </g>
    </svg>
  );
}

function AppStoreBadge() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 53.3" className="h-10">
      <rect width="180" height="53.3" rx="6" fill="#000" />
      <rect x="0.7" y="0.7" width="178.6" height="51.9" rx="5.3" fill="none" stroke="#a6a6a6" strokeWidth="0.7" />
      <text fill="#fff" fontFamily="system-ui, -apple-system, sans-serif" fontSize="8" x="52" y="15" letterSpacing="0.3">Download on the</text>
      <text fill="#fff" fontFamily="system-ui, -apple-system, sans-serif" fontSize="16" fontWeight="600" x="52" y="36">App Store</text>
      <g transform="translate(16, 7) scale(1.6)">
        <path d="M15.77 12.79c-.03-2.72 2.22-4.03 2.32-4.09-1.26-1.84-3.22-2.1-3.92-2.13-1.67-.17-3.26.98-4.11.98-.85 0-2.17-.96-3.56-.93-1.83.03-3.52 1.07-4.46 2.71-1.9 3.3-.49 8.19 1.37 10.87.91 1.31 1.99 2.79 3.41 2.74 1.37-.05 1.89-.89 3.55-.89 1.66 0 2.13.89 3.58.86 1.47-.02 2.41-1.34 3.31-2.66 1.04-1.53 1.47-3.01 1.5-3.08-.03-.01-2.87-1.1-2.9-4.37z" fill="#fff" />
        <path d="M13.05 5c.75-.92 1.26-2.19 1.12-3.46-1.09.04-2.4.72-3.18 1.64-.7.81-1.31 2.1-1.14 3.34 1.21.09 2.44-.61 3.2-1.52z" fill="#fff" />
      </g>
    </svg>
  );
}

export default function StoreFooter() {
  const contentId = useContentId();

  return (
    <div className="fixed right-0 bottom-16 left-0 z-50 border-t border-dark-600 bg-dark-900/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-center gap-4 px-4">
        <a
          href={buildAndroidUrl(contentId)}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:opacity-80"
        >
          <GooglePlayBadge />
        </a>
        <a
          href={IOS_APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:opacity-80"
        >
          <AppStoreBadge />
        </a>
      </div>
    </div>
  );
}
