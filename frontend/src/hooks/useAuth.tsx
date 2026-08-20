import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Usuario } from '../types/usuario';
import * as authService from '../services/auth.service';
import { clearToken, getToken, setToken } from '../services/api';

interface AuthContextValue {
  usuario: Usuario | null;
  cargando: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setCargando(false);
      return;
    }

    authService
      .me()
      .then(setUsuario)
      .catch(() => {
        clearToken();
        setUsuario(null);
      })
      .finally(() => setCargando(false));
  }, []);

  async function login(email: string, password: string) {
    const { accessToken, usuario: usuarioLogueado } = await authService.login(
      email,
      password,
    );
    setToken(accessToken);
    setUsuario(usuarioLogueado);
  }

  function logout() {
    clearToken();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider.');
  }
  return ctx;
}
