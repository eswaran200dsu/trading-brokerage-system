import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthUser } from "./api";

interface AuthCtx {
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "tcbms.auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUserState(JSON.parse(raw));
    } catch {}
  }, []);

  const setUser = (u: AuthUser | null) => {
    setUserState(u);
    if (typeof window !== "undefined") {
      if (u) {
        localStorage.setItem(KEY, JSON.stringify(u));
      } else {
        localStorage.removeItem(KEY);
        localStorage.removeItem("auth_token");
      }
    }
  };

  return (
    <Ctx.Provider value={{ user, setUser, logout: () => setUser(null) }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
