import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { openResetPassword, buildTVLoginDeeplink } from "../utils/deeplink.ts";
import QRCode from "qrcode";

type LoginMode = "password" | "qrcode" | "phone";

export default function LoginModal() {
  const { showLogin, closeLogin, login } = useAuth();
  const [loginMode, setLoginMode] = useState<LoginMode>("password");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (showLogin && loginMode === "qrcode" && qrCanvasRef.current) {
      const pairingId = "abc123";
      const deeplink = buildTVLoginDeeplink(pairingId);

      QRCode.toCanvas(
        qrCanvasRef.current,
        deeplink,
        {
          width: 220,
          margin: 2,
          color: {
            dark: "#0f1629",
            light: "#ffffff",
          },
        },
        (error) => {
          if (error) console.error("QR Code generation error:", error);
        }
      );
    }
  }, [showLogin, loginMode]);

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

  function validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
  }

  async function handlePhoneSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setPhoneError("");

    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError("Numéro de téléphone invalide");
      return;
    }

    setLoading(true);
    try {
      const err = await login(phoneNumber, "", "msisdn-nopin");
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

        <div className="mb-6 flex gap-2 rounded-lg bg-dark-700 p-1">
          <button
            type="button"
            onClick={() => setLoginMode("password")}
            className={`flex-1 rounded-md px-2 py-2 text-sm font-medium transition-all ${
              loginMode === "password"
                ? "bg-accent-500 text-white shadow-md"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Mot de passe
          </button>
          <button
            type="button"
            onClick={() => setLoginMode("phone")}
            className={`flex-1 rounded-md px-2 py-2 text-sm font-medium transition-all ${
              loginMode === "phone"
                ? "bg-accent-500 text-white shadow-md"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Téléphone
          </button>
          <button
            type="button"
            onClick={() => setLoginMode("qrcode")}
            className={`flex-1 rounded-md px-2 py-2 text-sm font-medium transition-all ${
              loginMode === "qrcode"
                ? "bg-accent-500 text-white shadow-md"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Code QR
          </button>
        </div>

        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent-500/15 transition-transform hover:scale-105">
            {loginMode === "password" ? (
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
            ) : loginMode === "phone" ? (
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
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            ) : (
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
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <rect x="7" y="7" width="3" height="3" />
                <rect x="14" y="7" width="3" height="3" />
                <rect x="7" y="14" width="3" height="3" />
                <rect x="14" y="14" width="3" height="3" />
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white">Connexion</h2>
          <p className="mt-1.5 text-sm text-gray-400">
            {loginMode === "password"
              ? "Connectez-vous pour accéder au contenu"
              : loginMode === "phone"
                ? "Connectez-vous avec votre numéro de téléphone"
                : "Scannez le code QR avec votre mobile"}
          </p>
        </div>

        {!showConfirmDialog && loginMode === "phone" ? (
          <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="phone-number"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Numéro de téléphone
              </label>
              <input
                id="phone-number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setPhoneError("");
                }}
                required
                autoFocus
                placeholder="+33 6 12 34 56 78"
                className={`w-full rounded-lg border ${phoneError ? "border-red-500" : "border-dark-500"} bg-dark-700 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20`}
              />
              {phoneError && (
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
                  {phoneError}
                </div>
              )}
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
              {loading ? "Connexion..." : "S'abonner"}
            </button>

            <div className="mt-2 rounded-lg bg-dark-700 border border-dark-600 p-3">
              <p className="text-xs text-gray-400 leading-relaxed">
                En vous abonnant avec votre numéro de téléphone, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
              </p>
            </div>
          </form>
        ) : !showConfirmDialog && loginMode === "password" ? (
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
        ) : !showConfirmDialog && loginMode === "qrcode" ? (
          <div className="flex flex-col items-center animate-[slideUp_0.2s_ease]">
            <div className="rounded-2xl bg-white p-4 shadow-lg">
              <canvas ref={qrCanvasRef} />
            </div>

            <div className="mt-6 w-full rounded-lg bg-dark-700 border border-dark-600 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
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
                  className="text-accent-500"
                >
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
                  <path d="M12 6v6l4 2" />
                </svg>
                Comment ça marche ?
              </h3>
              <ol className="space-y-2 text-xs text-gray-300">
                <li className="flex gap-2">
                  <span className="flex-shrink-0 font-semibold text-accent-400">1.</span>
                  <span>Ouvrez l'application mobile sur votre téléphone</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 font-semibold text-accent-400">2.</span>
                  <span>Scannez ce code QR avec l'appareil photo ou depuis l'app</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 font-semibold text-accent-400">3.</span>
                  <span>Confirmez la connexion sur votre mobile</span>
                </li>
              </ol>
            </div>

            <div className="mt-4 rounded-lg bg-accent-500/10 border border-accent-500/20 px-4 py-2.5">
              <p className="text-center text-xs text-accent-400">
                <span className="font-semibold">ID de couplage:</span> abc123
              </p>
            </div>
          </div>
        ) : showConfirmDialog ? (
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
        ) : null}
      </div>
    </div>
  );
}
