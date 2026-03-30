import { useNavigate, useSearchParams } from 'react-router-dom';
import { detectPlatform, buildResetPasswordPath } from '../utils/deeplink.ts';

export default function ConfirmResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username') || '';

  function handleCancel() {
    navigate(-1);
  }

  function handleConfirm() {
    const platform = detectPlatform();
    const resetPath = buildResetPasswordPath(username);

    if (platform === 'android') {
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
    } else {
      navigate(`/reset-password?username=${encodeURIComponent(username)}`);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 px-4">
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
            Confirmer la réinitialisation
          </h1>
          <p className="text-sm text-gray-400">
            Êtes-vous sûr de vouloir réinitialiser votre mot de passe ?
          </p>
          {username && (
            <p className="text-xs text-gray-500">
              Pour le compte: {username}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 rounded-lg border border-dark-600 bg-dark-700 px-4 py-3 font-medium text-white transition-all hover:bg-dark-600 hover:scale-105"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-lg bg-accent-600 px-4 py-3 font-medium text-white transition-all hover:bg-accent-700 hover:scale-105"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
