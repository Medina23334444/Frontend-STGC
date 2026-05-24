// app/(dashboard)/layout.tsx
'use client';

import {  } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Estado para controlar el menú desplegable en móviles
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Filtro de seguridad: Si no hay token, rebota al Login
    if (!loading && !user) {
   router.push('/login');
  }
  }, [user, loading, router]);

  // Cierra automáticamente el menú móvil cuando el usuario cambia de página
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm font-semibold text-slate-600">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const getNavLinkClass = (path: string) => {
    const baseClass = "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition duration-150 font-medium select-none";
    const activeClass = "bg-slate-950 text-white font-bold shadow-sm shadow-slate-950/20";
    const inactiveClass = "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
    return `${baseClass} ${pathname === path ? activeClass : inactiveClass}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans flex flex-col md:flex-row">
      
      {/* BARRA LATERAL GLOBAL */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-4 md:p-6 flex flex-col justify-between shadow-sm z-20">
        
        {/* Contenedor Superior: Logo + Botón Hamburguesa */}
        <div className="flex flex-col space-y-6 md:space-y-8">
          <div className="flex items-center justify-between md:block">
            
            {/* Identificador de la Finca */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center text-white font-bold">☕</div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">STGC</h2>
                <p className="text-xs text-slate-500 font-medium">Tierra Fértil</p>
              </div>
            </div>

            {/* Botón Hamburguesa (Solo visible en móviles) */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition cursor-pointer"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

          {/* Bloque de Navegación: Se oculta o muestra en móviles según el estado */}
          <nav className={`${menuOpen ? 'block' : 'hidden'} md:block space-y-1.5 transition-all duration-200`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Módulos</p>
            
            <Link href="/dashboard" className={getNavLinkClass('/dashboard')}>
              <span className="material-symbols-outlined text-xl">dashboard</span>
              <span>Inicio</span>
            </Link>
            
            <Link href="#" className={getNavLinkClass('/traceability')}>
              <span className="material-symbols-outlined text-xl">route</span> 
              <span>Trazabilidad</span>
            </Link>

            <Link href="/inventory" className={getNavLinkClass('/inventory')}>
              <span className="material-symbols-outlined text-xl">warehouse</span>
              <span>Inventario</span>
            </Link>

            
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Seguridad</p>
                {/* Control de roles basado en el requerimiento del negocio */}
                {(user?.role.name === 'ADMIN' || user?.role.name === 'GERENTE_GENERAL') && (
                  <>
                    <Link href="/admin/users" className={getNavLinkClass('/admin/users')}>
                      <span className="material-symbols-outlined text-xl">group</span>
                      <span>Gestionar Personal</span>
                    </Link>
                    <Link href="/admin/logs" className={getNavLinkClass('/admin/logs')}>
                      <span className="material-symbols-outlined text-xl">receipt_long</span>
                      <span>Logs de Auditoría</span>
                    </Link>
                    
                    <Link href="/admin/roles" className={getNavLinkClass('/admin/roles')}>
                      <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                      <span>Roles y Permisos</span>
                    </Link>
                  </>
                )}
              </div>
            
          </nav>
        </div>

        {/* Botón de Cerrar Sesión: También se acopla al colapso móvil */}
        <div className={`${menuOpen ? 'block' : 'hidden'} md:block mt-6 md:mt-0`}>
          <button 
            onClick={logout} 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-semibold text-sm transition w-full text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>

      </aside>

      {/* ÁREA DE CONTENIDO DINÁMICO */}
      <main className="flex-1 flex flex-col overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
}