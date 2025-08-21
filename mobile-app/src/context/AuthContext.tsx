import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/client';

type User = { id: string; email: string; role: string };
type AuthCtx = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
const Ctx = createContext<AuthCtx>(null as any);
export const useAuth = () => useContext(Ctx);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => { (async () => {
    const t = await AsyncStorage.getItem('token');
    if (t) {
      setToken(t);
      try {
        const me = await api.get<User>('/auth/me');
        setUser(me.data);
      } catch { /* token eskimiş olabilir */ }
    }
  })(); }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post<{ access_token: string }>('/auth/login', { email, password });
    await AsyncStorage.setItem('token', data.access_token);
    setToken(data.access_token);
    const me = await api.get<User>('/auth/me');
    setUser(me.data);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, token, login, logout }}>{children}</Ctx.Provider>;
};
