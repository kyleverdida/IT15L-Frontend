/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authService.getStoredSession());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const activeSession = authService.getStoredSession();
      if (!activeSession && session) {
        setSession(null);
      }
    }, 5000);

    return () => window.clearInterval(interval);
  }, [session]);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const nextSession = await authService.login(credentials);
      setSession(nextSession);
      return nextSession;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setSession(null);
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      isLoading,
      login,
      logout,
    }),
    [isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
