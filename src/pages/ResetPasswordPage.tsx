import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { updateSmartBanner, getStoredAuthToken } from "../utils/deeplink.ts";
import { checkMsisdnExists } from "../api/kliento.ts";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    const usernameParam = searchParams.get("username");
    if (usernameParam) {
      setUsername(usernameParam);
      validateUsername(usernameParam);
    }
  }, [searchParams]);

  async function validateUsername(msisdn: string) {
    if (!msisdn) return;

    setValidating(true);
    try {
      const exists = await checkMsisdnExists(msisdn);
      if (!exists) {
        setError("Ce numéro n'existe pas dans notre système");
      }
    } catch (err) {
      console.error("Error validating username:", err);
    } finally {
      setValidating(false);
    }
  }

  useEffect(() => {
    updateSmartBanner(`${location.pathname}${location.search}`, getStoredAuthToken());
  }, [location]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!username) {
      setError("Identifiant manquant");
      return;
    }

    if (!password) {
      setError("Veuillez entrer un nouveau mot de passe");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    try {
      const exists = await checkMsisdnExists(username);
      if (!exists) {
        setError("Ce numéro n'existe pas dans notre système");
        setLoading(false);
        return;
      }
      const params = new URLSearchParams({
        action: "create",
        login: username,
        email: username,
        password: password,
      });

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kliento-proxy?${params.toString()}`;
      const headers = {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(apiUrl, { headers });

      if (!response.ok) {
        throw new Error("Account creation failed");
      }

      navigate("/");
    } catch {
      setError("Erreur lors de la réinitialisation. Veuillez réessayer.");
      setLoading(false);
    }
  }

  function handleCancel() {
    navigate("/");
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 overflow-auto">
      <div className="flex min-h-full items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <button
            onClick={handleCancel}
            className="mb-4 sm:mb-6 flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Retour
          </button>

          <div className="rounded-2xl bg-dark-800/80 p-6 sm:p-8 shadow-2xl backdrop-blur-sm border border-dark-700">
            <div className="mb-6 sm:mb-8 text-center">
              <div className="mx-auto mb-3 sm:mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-accent-500/15">
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
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Réinitialiser le mot de passe
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-400">
                Entrez votre nouveau mot de passe
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="mb-1.5 sm:mb-2 block text-sm font-medium text-gray-300"
                >
                  Identifiant
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    readOnly
                    className="w-full rounded-lg border border-dark-500 bg-dark-700/50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-400 outline-none cursor-not-allowed"
                  />
                  {validating && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400/30 border-t-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 sm:mb-2 block text-sm font-medium text-gray-300"
                >
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    required
                    autoFocus
                    placeholder="Entrez votre nouveau mot de passe"
                    className="w-full rounded-lg border border-dark-500 bg-dark-700 px-3.5 sm:px-4 py-2.5 sm:py-3 pr-11 sm:pr-12 text-sm sm:text-base text-white placeholder-gray-500 outline-none transition-all focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
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
                        width="20"
                        height="20"
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
                <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
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

              <div className="flex gap-2.5 sm:gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-dark-500 bg-dark-700 px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white transition-all hover:bg-dark-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading || validating}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-accent-500/25 transition-all hover:bg-accent-600 hover:shadow-accent-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && (
                    <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}
                  {loading ? "Réinitialisation..." : "Confirmer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
