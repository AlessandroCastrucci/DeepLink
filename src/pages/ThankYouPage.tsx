import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { buildAppDeeplink } from "../utils/deeplink.ts";

export default function ThankYouPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleOpenApp() {
    if (user?.authToken) {
      const deeplink = buildAppDeeplink(user.authToken);
      window.location.href = deeplink;
    }
  }

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl bg-dark-800/80 p-8 shadow-2xl backdrop-blur-sm border border-dark-700 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-500"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>

            <h1 className="mb-3 text-3xl font-bold text-white">
              Merci pour votre abonnement!
            </h1>
            <p className="mb-8 text-lg text-gray-400">
              Votre compte a été créé avec succès. Profitez maintenant de tout
              notre contenu exclusif.
            </p>

            <div className="space-y-4">
              <button
                onClick={handleOpenApp}
                className="w-full flex items-center justify-center gap-3 rounded-lg bg-accent-500 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-accent-500/25 transition-all hover:bg-accent-600 hover:shadow-accent-500/40 active:scale-[0.98]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
                Ouvrir l'application
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full rounded-lg border border-dark-600 bg-dark-700 px-6 py-4 text-base font-medium text-gray-300 transition-all hover:bg-dark-600 hover:text-white active:scale-[0.98]"
              >
                Continuer sur le web
              </button>
            </div>

            {user.authToken && (
              <div className="mt-6 rounded-lg border border-dark-600 bg-dark-700 p-4">
                <p className="text-xs text-gray-500">
                  Bienvenue, {user.nickname || user.email || "utilisateur"}!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
