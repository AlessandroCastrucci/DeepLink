import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/AuthContext.tsx";

export default function LoginModal() {
  const { showLogin, closeLogin, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!showLogin) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
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
    if (e.target === e.currentTarget) closeLogin();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
      onClick={handleBackdropClick}
    >
      <div className="relative mx-4 w-full max-w-sm rounded-2xl border border-dark-600 bg-dark-800 p-6 shadow-2xl animate-[slideUp_0.3s_ease]">
        <button
          onClick={closeLogin}
          className="absolute top-4 right-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-dark-600 hover:text-white"
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

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/15">
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
              className="text-accent-500"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Connexion</h2>
          <p className="mt-1 text-sm text-gray-400">
            Connectez-vous pour acceder au contenu
          </p>
        </div>

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
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              autoFocus
              placeholder="email@exemple.com"
              className="w-full rounded-lg border border-dark-500 bg-dark-700 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-sm font-medium text-gray-300"
            >
              Mot de passe
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Votre mot de passe"
              className="w-full rounded-lg border border-dark-500 bg-dark-700 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : null}
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
