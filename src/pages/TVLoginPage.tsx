import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

export default function TVLoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const confirmationCode = searchParams.get('pairing_id') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'apple-itunes-app';
    meta.content = `app-id=YOUR_APP_ID, app-argument=dvapp://tv-login${confirmationCode ? `?pairing_id=${confirmationCode}` : ''}`;
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, [confirmationCode]);

  async function handleConfirm() {
    if (!user) {
      if (!email || !password) {
        setError('Veuillez remplir tous les champs');
        return;
      }

      setError('');
      setLoading(true);

      try {
        const err = await login(email, password);
        if (err) {
          setError(err);
          setLoading(false);
          return;
        }
      } catch {
        setError('Erreur de connexion. Veuillez réessayer.');
        setLoading(false);
        return;
      }
    }

    navigate('/');
  }

  function handleCancel() {
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl p-8">
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
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
              <polyline points="17 2 12 7 7 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Connexion TV</h1>
          <p className="text-sm text-gray-400">
            {user ? 'Confirmez votre connexion' : 'Connectez-vous pour continuer'}
          </p>
        </div>

        {!user ? (
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="tv-email" className="mb-1.5 block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="tv-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                placeholder="email@exemple.com"
                className="w-full rounded-lg border border-dark-500 bg-dark-700 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
              />
            </div>

            <div>
              <label htmlFor="tv-password" className="mb-1.5 block text-sm font-medium text-gray-300">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="tv-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Votre mot de passe"
                  className="w-full rounded-lg border border-dark-500 bg-dark-700 px-3.5 py-2.5 pr-10 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-300"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
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
          </div>
        ) : null}

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5 text-sm text-red-400 mb-6">
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

        <div className="mb-6">
          <label htmlFor="confirmation-code" className="mb-1.5 block text-sm font-medium text-gray-300">
            Code de confirmation
          </label>
          <input
            id="confirmation-code"
            type="text"
            value={confirmationCode}
            readOnly
            className="w-full rounded-lg border border-dark-500 bg-dark-700 px-3.5 py-2.5 text-sm text-white font-mono outline-none cursor-not-allowed opacity-75"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 rounded-lg border-2 border-dark-500 bg-transparent px-4 py-3 text-sm font-semibold text-gray-300 transition-all hover:bg-dark-700 hover:border-dark-400 active:scale-[0.98]"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 rounded-lg bg-accent-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-accent-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {loading ? 'Connexion...' : 'Confirmer'}
          </button>
        </div>

        {confirmationCode && (
          <div className="mt-6 rounded-lg bg-dark-700 border border-dark-600 p-4">
            <div className="flex items-start gap-3">
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
                className="text-accent-500 flex-shrink-0 mt-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Connexion depuis votre TV
                </h3>
                <p className="text-xs text-gray-400">
                  Confirmez ce code sur votre téléviseur pour autoriser la connexion.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
