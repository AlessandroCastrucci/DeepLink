import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { requestDeviceCode, pollDeviceAuth, buildPairingDeeplink } from '../api/deviceAuth.ts';
import { getAccountInfo } from '../api/kliento.ts';
import QRCode from 'qrcode';

type LoginMode = 'password' | 'qrcode';

export default function TVLoginPage() {
  const navigate = useNavigate();
  const { login, setUser } = useAuth();

  const [loginMode, setLoginMode] = useState<LoginMode>('qrcode');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pairingCode, setPairingCode] = useState<string>('');
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const pollIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    async function initializeQRCode() {
      if (loginMode !== 'qrcode') return;

      setQrCodeLoading(true);
      setError('');

      try {
        const { code } = await requestDeviceCode();
        setPairingCode(code);

        if (qrCanvasRef.current) {
          const deeplink = buildPairingDeeplink(code);
          await QRCode.toCanvas(
            qrCanvasRef.current,
            deeplink,
            {
              width: 280,
              margin: 2,
              color: {
                dark: '#1a2332',
                light: '#ffffff',
              },
            }
          );
        }

        startPolling(code);
      } catch (err) {
        setError('Impossible de générer le code QR. Veuillez réessayer.');
        console.error('QR Code initialization error:', err);
      } finally {
        setQrCodeLoading(false);
      }
    }

    if (loginMode === 'qrcode') {
      initializeQRCode();
    }

    return () => {
      stopPolling();
    };
  }, [loginMode]);

  function startPolling(code: string) {
    stopPolling();

    pollIntervalRef.current = window.setInterval(async () => {
      try {
        const result = await pollDeviceAuth(code);

        if (result.status === 'complete' && result.user) {
          stopPolling();
          await handleQRLoginSuccess(result.user.user_id);
        } else if (result.status === 'expired') {
          stopPolling();
          setError('Le code a expiré. Veuillez recharger la page.');
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);
  }

  function stopPolling() {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }

  async function handleQRLoginSuccess(userId: string) {
    try {
      const userInfo = await getAccountInfo(userId);
      if (userInfo) {
        setUser(userInfo);
        navigate('/');
      } else {
        setError('Échec de récupération des informations utilisateur');
      }
    } catch (err) {
      setError('Erreur lors de la connexion');
      console.error('Login success handler error:', err);
    }
  }

  async function handlePasswordLogin() {
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
      navigate('/');
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex border-b border-dark-600">
          <button
            onClick={() => setLoginMode('password')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              loginMode === 'password'
                ? 'bg-dark-700 text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Mot de passe
          </button>
          <buttond
            onClick={() => setLoginMode('qrcode')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              loginMode === 'qrcode'
                ? 'bg-accent-500 text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Code QR
          </button>
        </div>

        <div className="p-8">
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
            <h1 className="text-2xl font-bold text-white mb-2">Connexion</h1>
            <p className="text-sm text-gray-400">
              {loginMode === 'qrcode'
                ? 'Scannez le code QR avec votre mobile'
                : 'Connectez-vous avec votre mot de passe'}
            </p>
          </div>

          {loginMode === 'password' ? (
            <div className="space-y-4">
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
                    onKeyDown={(e) => e.key === 'Enter' && handlePasswordLogin()}
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
                onClick={handlePasswordLogin}
                disabled={loading}
                className="w-full rounded-lg bg-accent-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-accent-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {qrCodeLoading ? (
                <div className="flex flex-col items-center justify-center h-[280px] w-full rounded-2xl bg-white p-4 shadow-lg">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-accent-500" />
                  <p className="mt-3 text-xs text-gray-600">Génération du code...</p>
                </div>
              ) : (
                <div className="rounded-2xl bg-white p-4 shadow-lg">
                  <canvas ref={qrCanvasRef} />
                </div>
              )}

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5 text-sm text-red-400">
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

              <div className="mt-6 w-full rounded-lg bg-dark-700/50 border border-accent-500/30 p-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-accent-400">
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
                    className="text-accent-400"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
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

              {pairingCode && (
                <div className="mt-4 rounded-lg bg-accent-500/10 border border-accent-500/30 px-4 py-3">
                  <p className="text-center text-sm text-accent-300">
                    <span className="font-medium">Code de couplage:</span>{' '}
                    <span className="font-mono text-lg font-bold text-accent-400">{pairingCode}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
