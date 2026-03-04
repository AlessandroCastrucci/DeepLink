import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import StoreFooter from "./StoreFooter.tsx";
import AppBanner from "./AppBanner.tsx";
import LoginModal from "./LoginModal.tsx";
import {
  updateSmartBanner,
  checkAppLinkAttempt,
  getStoreUrl,
  getStoredAuthToken,
} from "../utils/deeplink.ts";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    const attempt = checkAppLinkAttempt();
    if (attempt) {
      window.location.href = getStoreUrl(attempt.platform, attempt.referrer);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    updateSmartBanner(pathname, getStoredAuthToken());
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <AppBanner />
      <main className="flex-1 pb-32">
        <Outlet />
      </main>
      <StoreFooter />
      <Footer />
      <LoginModal />
    </div>
  );
}
