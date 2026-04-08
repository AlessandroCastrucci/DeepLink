import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import AppBanner from '../components/AppBanner.tsx';
import Toast from '../components/Toast.tsx';
import {
  buildResetPasswordPath,
  checkAppLinkAttempt,
  getStoreUrl,
  updateSmartBanner,
  getStoredAuthToken,
} from '../utils/deeplink.ts';
import { checkMsisdnExists } from '../api/kliento.ts';

export default function ConfirmResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState(searchParams.get('username') || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const attempt = checkAppLinkAttempt();
    if (attempt) {
      window.location.href = getStoreUrl(attempt.platform, attempt.referrer);
    }
  }, []);

  useEffect(() => {
    updateSmartBanner(`${location.pathname}${location.search}`, getStoredAuthToken());
  }, [location]);

  function handleCancel() {
    navigate(-1);
  }

  async function handleConfirm() {
    if (!username.trim()) {
      setError('Veuillez entrer votre numéro de téléphone');
      return;
    }

    setLoading(true);
    setError('');
    setShowToast(true);

    try {
      const exists = await checkMsisdnExists(username);

      if (!exists) {
        setError('Ce numéro de téléphone n\'est pas enregistré');
        setLoading(false);
        return;
      }

      const resetPath = buildResetPasswordPath(username);
      const appLinkUrl = `${window.location.origin}${resetPath}`;
      window.location.href = appLinkUrl;
      let didLeave = false;
      const onVisibilityChange = () => {
        if (document.hidden) didLeave = true;
      };
      document.addEventListener('visibilitychange', onVisibilityChange);
      setTimeout(() => {
        document.removeEventListener('visibilitychange', onVisibilityChange);
        if (!didLeave) {
          navigate(`/reset-password?username=${encodeURIComponent(username)}`);
          }
        }, 3000);
    } catch {
      setError('Erreur lors de la vérification. Veuillez réessayer.');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 px-4">
      <AppBanner />
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-dark-600 bg-dark-800 p-8 shadow-2xl">
        <div className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/10">
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
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Réinitialiser le mot de passe
          </h1>
          <p className="text-sm text-gray-400">
            Entrez votre numéro de téléphone pour continuer
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-300">
              Numéro de téléphone
            </label>
            <input
              id="username"
              type="tel"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: 221771234567"
              className="w-full rounded-lg border border-dark-600 bg-dark-700 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 rounded-lg border border-dark-600 bg-dark-700 px-4 py-3 font-medium text-white transition-all hover:bg-dark-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 rounded-lg bg-accent-600 px-4 py-3 font-medium text-white transition-all hover:bg-accent-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Vérification...' : 'Confirmer'}
          </button>
        </div>
      </div>
      {showToast && (
        <Toast
          message="You'll be sent to native app for reset password"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
