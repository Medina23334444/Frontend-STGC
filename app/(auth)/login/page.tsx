// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormInputs } from '@/schemas/auth.schema'; 
import Link from 'next/link';

export default function LoginPage() {
  const { login, loading } = useAuth();
  
  const [errorAnuncio, setErrorAnuncio] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema), 
  });

  const alEnviarFormulario = async (datos: LoginFormInputs) => {
    setErrorAnuncio(null);
    try {
      await login({ email: datos.email, password: datos.password });
    } catch (err: any) {
      setErrorAnuncio(err.message || 'Error al conectar con el servidor.');
    }
  };
  return (
    <div className="bg-[#f8fafc] text-[#334155] font-sans h-screen w-screen overflow-hidden flex items-center justify-center relative select-none">

      {/* Luces de fondo */}
      <div className="absolute inset-0 z-0 bg-[#f8fafc] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-200/40 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-100/40 blur-[150px]"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-amber-100/30 blur-[100px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-md px-4 md:px-0">
        <div className="bg-white/70 backdrop-blur-[24px] rounded-2xl p-8 flex flex-col gap-6 items-stretch border border-slate-200/80 shadow-[0_8px_32px_rgba(148,163,184,0.15),inset_0_0_0_1px_rgba(255,255,255,0.6)]">
          
          {/* Logo y Encabezado */}
          <div className="flex flex-col items-center mb-2 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-sky-600 shadow-sm border border-slate-200/60 backdrop-blur-md">
              <span className="material-symbols-outlined" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>
                hexagon
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
              Bienvenido
            </h1>
            <p className="text-base text-slate-500 font-medium">
              STGC — Finca Tierra Fértil
            </p>
          </div>

          {/* Error de Servidor o Credenciales Incorrectas */}
          {errorAnuncio && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-700 flex items-start gap-2 shadow-sm">
              <span className="material-symbols-outlined text-red-600 text-base mt-0.5">error</span>
              <div>
                <span className="font-bold">Error:</span> {errorAnuncio}
              </div>
            </div>
          )}

          {/* Formulario conectado a la librería */}
          <form onSubmit={handleSubmit(alEnviarFormulario)} noValidate className="flex flex-col gap-5">
            
            {/* Input de Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="email">
                Correo Electrónico
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  mail
                </span>
                <input 
                  id="email"
                  type="email"
                  placeholder="usuario@finca.com"
                  disabled={isSubmitting || loading}
                  {...register('email')} // Registro automático en la librería
                  className={`w-full h-12 pl-12 pr-4 bg-white border rounded-xl transition-all text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:opacity-60 shadow-sm ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                      : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500/10'
                  }`}
                />
              </div>
              {/* Mensajes de error controlados por Zod */}
              {errors.email && (
                <span className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'wght' 600" }}>info</span>
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Input de Contraseña */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="password">
                  Contraseña
                </label>
                <Link className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors" href="/recover-password">
                  ¿Olvidaste tu clave?
                </Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  lock
                </span>
                <input 
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  disabled={isSubmitting || loading}
                  {...register('password')} // Registro automático en la librería
                  className={`w-full h-12 pl-12 pr-12 bg-white border rounded-xl transition-all text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:opacity-60 shadow-sm ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                      : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500/10'
                  }`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {/* Mensajes de error controlados por Zod */}
              {errors.password && (
                <span className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'wght' 600" }}>info</span>
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Checkbox */}
            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox"
                    className="peer h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 focus:ring-offset-white bg-white transition-all checked:bg-sky-600 checked:border-sky-600"
                  />
                  <span className="material-symbols-outlined absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" style={{ fontSize: '16px', fontWeight: '700' }}>
                    check
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                  Recordarme
                </span>
              </label>
            </div>

            {/* Botón */}
            <button 
              type="submit"
              disabled={isSubmitting || loading}
              className="mt-2 h-12 w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-base font-semibold rounded-xl shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:scale-100"
            >
              {isSubmitting || loading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Verificando...</span>
                </div>
              ) : (
                <>
                  <span>Ingresar al Terminal</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Soporte */}
          <div className="mt-2 text-center">
            <p className="text-sm text-slate-500 font-medium">
              ¿Problemas de acceso?{' '}
              <a className="text-sky-600 font-semibold hover:text-sky-700 transition-colors" href="#">
                Soporte Técnico
              </a>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}