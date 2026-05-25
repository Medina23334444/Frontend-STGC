// context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import { queueFlashToast } from '@/lib/toastFlash';
import { UserLogin } from '@/types/auth';
import { User } from '@/types/user';
import { ApiError} from '@/lib/errors/ApiErrors';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: ApiError | null;
  login: (credentials: UserLogin) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface AuthProviderProps {
  children: React.ReactNode;
  storage?: StorageAdapter;
}

export function AuthProvider({ children, storage }: Readonly<AuthProviderProps>) {
  const storageAdapter = storage ?? (globalThis.window === undefined ? undefined : globalThis.localStorage);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const router = useRouter();

  // Verificar sesión al montar
  useEffect(() => {
    if (!storageAdapter) {
      setLoading(false);
      return;
    }

    try {
      const savedUser = storageAdapter.getItem('stgc_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Error loading saved user:', err);
      storageAdapter.removeItem('stgc_user');
    } finally {
      setLoading(false);
    }
  }, [storageAdapter]);

  const login = useCallback(async (credentials: UserLogin) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      if (storageAdapter) {
        storageAdapter.setItem('stgc_user', JSON.stringify(data.user));
      }
      queueFlashToast('Sesión iniciada correctamente');
      router.push('/dashboard');
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError(0, 'Error al iniciar sesión');
      setError(apiError);
      toast.error(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [router, storageAdapter]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    let logoutError: ApiError | null = null;

    try {
      await authService.logout();
    } catch (err) {
      logoutError = err instanceof ApiError ? err : new ApiError(0, 'Error al cerrar sesión');
      setError(logoutError);
      // Continuar logout aunque falle la petición
    } finally {
      if (storageAdapter) {
        storageAdapter.removeItem('stgc_user');
      }
      setUser(null);
      setLoading(false);

      if (logoutError) {
        queueFlashToast('Sesión cerrada localmente. No se pudo notificar al servidor.', 'error');
      } else {
        queueFlashToast('Sesión cerrada');
      }

      router.push('/login');
    }
  }, [router, storageAdapter]);

  const contextValue = useMemo(
    () => ({ user, loading, error, login, logout }),
    [user, loading, error, login, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}