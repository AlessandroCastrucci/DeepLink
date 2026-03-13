import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function TVLoginPage() {
  const [searchParams] = useSearchParams();
  const pairingId = searchParams.get('pairing_id');

  useEffect(() => {
    if (pairingId) {
      const deeplinkUrl = `dvapp://tv-login?pairing_id=${pairingId}`;
      window.location.href = deeplinkUrl;
    }
  }, [pairingId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">TV Login</h1>
          {pairingId && (
            <p className="text-gray-400 text-sm">
              Pairing Code: <span className="text-blue-400 font-mono">{pairingId}</span>
            </p>
          )}
        </div>

        <div className="space-y-4 text-left">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-white font-semibold mb-2">Opening App...</h2>
            <p className="text-gray-300 text-sm">
              If the app doesn't open automatically, please install it first.
            </p>
          </div>

          <div className="text-gray-400 text-xs space-y-2">
            <p>This QR code is for pairing your TV with your mobile device.</p>
            <p>Make sure you have the app installed on your phone.</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={() => pairingId && (window.location.href = `dvapp://tv-login?pairing_id=${pairingId}`)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Open in App
          </button>
        </div>
      </div>
    </div>
  );
}
