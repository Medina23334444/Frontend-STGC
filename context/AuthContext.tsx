// context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { UserLogin } from '@/types/auth';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Cuando la página se carga, ahora solo revisamos si existe la sesión del usuario
    const savedUser = localStorage.getItem('stgc_user');

    if (savedUser) {
      // Usamos un flag sencillo para indicar que existe una sesión HTTP Only
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: UserLogin) => {
    try {
      // Delegamos la petición a tu servicio
      const data = await authService.login(credentials);
      
      localStorage.setItem('stgc_user', JSON.stringify(data.user));
      setUser(data.user);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      throw error;
    }
  };

  const logout = async () => {
    // Llamamos a nuestro puente para que destruya la cookie segura
    await authService.logout();
    
    // Limpiamos todo el rastro visual de la sesión al salir
    localStorage.removeItem('stgc_user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar la sesión en cualquier pantalla con una sola línea
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}