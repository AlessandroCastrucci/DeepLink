import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

export default function SubscribePage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
  }

  async function handleSubmit(e: FormEvent) {
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
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        navigate("/thank-you");
      }
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
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

          <div className="rounded-2xl bg-dark-800/80 p-8 shadow-2xl backdrop-blur-sm border border-dark-700">
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
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white">S'abonner</h1>
              <p className="mt-2 text-gray-400">
                Entrez votre numéro de téléphone pour vous abonner
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="phone-number"
                  className="mb-2 block text-sm font-medium text-gray-300"
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
                    setError("");
                  }}
                  required
                  autoFocus
                  placeholder="+33 6 12 34 56 78"
                  className={`w-full rounded-lg border ${phoneError ? "border-red-500" : "border-dark-500"} bg-dark-700 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20`}
                />
                {phoneError && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-red-400">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent-500/25 transition-all hover:bg-accent-600 hover:shadow-accent-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}
                {loading ? "Abonnement en cours..." : "S'abonner maintenant"}
              </button>

              <div className="rounded-lg border border-dark-600 bg-dark-700 p-4">
                <p className="text-xs leading-relaxed text-gray-400">
                  En vous abonnant avec votre numéro de téléphone, vous acceptez
                  nos conditions d'utilisation et notre politique de
                  confidentialité. Des frais peuvent s'appliquer selon votre
                  opérateur.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
