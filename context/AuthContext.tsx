// context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
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

export function AuthProvider({ children, storage = typeof window !== 'undefined' ? localStorage : undefined }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const router = useRouter();

  // Verificar sesión al montar
  useEffect(() => {
    if (!storage) {
      setLoading(false);
      return;
    }

    try {
      const savedUser = storage.getItem('stgc_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Error loading saved user:', err);
      storage.removeItem('stgc_user');
    } finally {
      setLoading(false);
    }
  }, [storage]);

  const login = async (credentials: UserLogin) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      if (storage) {
        storage.setItem('stgc_user', JSON.stringify(data.user));
      }
      router.push('/dashboard');
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError(0, 'Error al iniciar sesión');
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError(0, 'Error al cerrar sesión');
      setError(apiError);
      // Continuar logout aunque falle la petición
    } finally {
      if (storage) {
        storage.removeItem('stgc_user');
      }
      setUser(null);
      setLoading(false);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
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