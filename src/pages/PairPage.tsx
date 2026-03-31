import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { detectPlatform, IOS_APP_STORE_URL } from "../utils/deeplink.ts";

export default function PairPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login } = useAuth();
  const code = searchParams.get("code");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [platform] = useState<ReturnType<typeof detectPlatform>>(detectPlatform());

  useEffect(() => {
    if (!code) {
      navigate("/");
      return;
    }

    if (platform === "ios") {
      const meta = document.querySelector('meta[name="apple-itunes-app"]');
      if (meta) {
        const url = `${window.location.origin}/pair?code=${encodeURIComponent(code)}`;
        meta.setAttribute(
          "content",
          `app-id=1210318173, app-argument=${url}`,
        );
      }
    }
  }, [code, platform, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const err = await login(username, password);
      if (err) {
        setError(err);
      } else {
        navigate("/");
      }
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  if (!code) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {platform === "ios" && (
        <div className="bg-accent-500/10 border-b border-accent-500/20 px-4 py-3">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-accent-500"
              >
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-white">Installer l'application</p>
                <p className="text-xs text-gray-400">Téléchargez depuis l'App Store</p>
              </div>
            </div>
            <a
              href={`${IOS_APP_STORE_URL}?code=${encodeURIComponent(code)}`}
              className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-accent-600 active:scale-95"
            >
              Installer
            </a>
          </div>
        </div>
      )}

      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm rounded-2xl border border-dark-600 bg-dark-800 p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/15">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent-500"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Connexion</h1>
            <p className="text-sm text-gray-400">
              Connectez-vous pour continuer
            </p>
          </div>

          {user ? (
            <div className="text-center">
              <div className="rounded-lg bg-dark-700 border border-dark-600 p-6">
                <p className="text-sm text-gray-400 mb-2">Code d'appairage</p>
                <p className="text-3xl font-bold text-white tracking-wider mb-4">{code}</p>
                <div className="pt-4 border-t border-dark-600">
                  <p className="text-xs text-gray-500">
                    Connecté en tant que {user.nickname || user.email || "utilisateur"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/")}
                className="mt-6 w-full rounded-lg border border-dark-600 bg-dark-700 px-4 py-3 text-sm font-medium text-gray-300 transition-all hover:bg-dark-600 hover:text-white active:scale-[0.98]"
              >
                Retour à l'accueil
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="rounded-lg bg-accent-500/10 border border-accent-500/20 px-4 py-3 mb-2">
                <p className="text-center text-sm text-accent-400">
                  <span className="font-semibold">Code:</span>{" "}
                  <span className="font-mono text-lg font-bold">{code}</span>
                </p>
              </div>

              <div>
                <label
                  htmlFor="pair-username"
                  className="mb-1.5 block text-sm font-medium text-gray-300"
                >
                  Identifiant
                </label>
                <input
                  id="pair-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  autoFocus
                  placeholder="email@exemple.com"
                  className="w-full rounded-lg border border-dark-500 bg-dark-700 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="pair-password"
                  className="mb-1.5 block text-sm font-medium text-gray-300"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="pair-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Votre mot de passe"
                    className="w-full rounded-lg border border-dark-500 bg-dark-700 px-3.5 py-2.5 pr-10 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-300"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5 text-sm text-red-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 flex-shrink-0"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-all hover:bg-accent-600 hover:shadow-accent-500/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : null}
                {loading ? "Connexion..." : "Se connecter"}
              </button>

              <div className="mt-4 border-t border-dark-600 pt-4">
                <p className="mb-3 text-center text-sm text-gray-400">
                  Vous n'avez pas de compte ?
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/subscribe")}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-accent-500 bg-transparent px-4 py-3 text-sm font-semibold text-accent-500 transition-all hover:bg-accent-500/10 active:scale-[0.98]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                  S'abonner maintenant
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
