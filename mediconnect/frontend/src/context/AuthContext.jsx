import { createContext, useContext, useState, useCallback } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("mc_user")); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("mc_token") || null);

  const login = useCallback(async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: t, user: u } = res.data.data;
    localStorage.setItem("mc_token", t);
    localStorage.setItem("mc_user", JSON.stringify(u));
    setToken(t);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (name, email, password, role) => {
    const res = await api.post("/auth/register", { name, email, password, role });
    const { token: t, user: u } = res.data.data;
    localStorage.setItem("mc_token", t);
    localStorage.setItem("mc_user", JSON.stringify(u));
    setToken(t);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("mc_token");
    localStorage.removeItem("mc_user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
