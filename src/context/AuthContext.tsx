import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { login as klientoLogin, getAccountInfo } from "../api/kliento.ts";
import type { KlientoUser } from "../api/kliento.ts";

interface AuthState {
  user: KlientoUser | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
  showLogin: boolean;
  openLogin: () => void;
  closeLogin: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "kliento_session";

function loadSession(): { userId: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSession(userId: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId }));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const session = loadSession();
    if (!session) {
      setState({ user: null, loading: false });
      return;
    }
    getAccountInfo(session.userId)
      .then((user) => {
        setState({ user, loading: false });
        if (!user) clearSession();
      })
      .catch(() => {
        clearSession();
        setState({ user: null, loading: false });
      });
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<string | null> => {
      const result = await klientoLogin(username, password);
      if ("error" in result) return result.error;

      saveSession(result.userId);
      const user = await getAccountInfo(result.userId);
      setState({ user, loading: false });
      setShowLogin(false);
      return null;
    },
    [],
  );

  const logout = useCallback(() => {
    clearSession();
    setState({ user: null, loading: false });
  }, []);

  const openLogin = useCallback(() => setShowLogin(true), []);
  const closeLogin = useCallback(() => setShowLogin(false), []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, showLogin, openLogin, closeLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
