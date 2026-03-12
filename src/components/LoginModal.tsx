import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { openResetPassword } from "../utils/deeplink.ts";

export default function LoginModal() {
  const { showLogin, closeLogin, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (!showLogin) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setUsernameError("");
    setLoading(true);
    try {
      const err = await login(username, password);
      if (err) setError(err);
    } catch {
      setError("Erreur de connexion. Veuillez reessayer.");
    } finally {
      setLoading(false);
    }
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      closeLogin();
      setShowConfirmDialog(false);
    }
  }

  function handleForgotPasswordClick() {
    setError("");
    setUsernameError("");

    if (!username.trim()) {
      setUsernameError("Veuillez saisir votre identifiant d'abord");
      return;
    }

    setShowConfirmDialog(true);
  }

  function handleConfirmReset() {
    setShowConfirmDialog(false);
    closeLogin();
    openResetPassword(username);
  }

  function handleCancelReset() {
    setShowConfirmDialog(false);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
      onClick={handleBackdropClick}
    >
      <div className="relative mx-4 w-full max-w-sm rounded-2xl border border-dark-600 bg-dark-800 p-6 shadow-2xl animate-[slideUp_0.3s_ease]">
        <button
          onClick={() => {
            closeLogin();
            setShowConfirmDialog(false);
          }}
          className="absolute top-4 right-4 rounded-full p-1.5 text-gray-400 transition-all hover:bg-dark-600 hover:text-white hover:scale-110"
          aria-label="Fermer"
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent-500/15 transition-transform hover:scale-105">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
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
          <h2 className="text-2xl font-bold text-white">Connexion</h2>
          <p className="mt-1.5 text-sm text-gray-400">
            Connectez-vous pour accéder au contenu
          </p>
        </div>

        {!showConfirmDialog ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="login-username"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Identifiant
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError("");
                }}
                required
                autoComplete="username"
                autoFocus
                placeholder="email@exemple.com"
                className={`w-full rounded-lg border ${usernameError ? "border-red-500" : "border-dark-500"} bg-dark-700 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20`}
              />
              {usernameError && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400 animate-[slideUp_0.2s_ease]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {usernameError}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="login-password"
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
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className="text-xs text-accent-500 transition-colors hover:text-accent-400 hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5 text-sm text-red-400 animate-[slideUp_0.2s_ease]">
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
          </form>
        ) : (
          <div className="animate-[slideUp_0.2s_ease]">
            <div className="mb-6 rounded-lg bg-dark-700 border border-dark-600 p-4">
              <div className="mb-3 flex items-center gap-2 text-accent-500">
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
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <h3 className="font-semibold text-white">Réinitialisation du mot de passe</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Vous allez être redirigé vers l'application pour réinitialiser le mot de passe du compte :
              </p>
              <p className="mt-2 rounded bg-dark-600 px-3 py-2 text-sm font-medium text-accent-400 break-all">
                {username}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelReset}
                className="flex-1 rounded-lg border border-dark-500 bg-dark-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-dark-600 hover:text-white active:scale-[0.98]"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-all hover:bg-accent-600 hover:shadow-accent-500/40 active:scale-[0.98]"
              >
                Confirmer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
