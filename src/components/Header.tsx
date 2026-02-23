import { Link } from "react-router-dom";

export default function Header() {
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
      </div>
    </header>
  );
}
