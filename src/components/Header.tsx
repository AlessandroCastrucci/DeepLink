import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

export default function Header() {
  const { user, openLogin, logout } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-dark-700/50 bg-dark-900/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent-500"
          >
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
          <span className="text-lg font-bold tracking-tight text-white">
            PlayVOD
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-300 sm:block">
              {user.dve_login || user.email || user.user_id}
            </span>
            <button
              onClick={logout}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500/15 text-accent-400 transition-colors hover:bg-accent-500/25"
              title="Se deconnecter"
            >
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
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={openLogin}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-600"
            title="Se connecter"
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
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
