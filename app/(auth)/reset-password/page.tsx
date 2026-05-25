'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetSchema, ResetFormInputs } from '@/schemas/auth.schema';
import { authService } from '@/services/auth.service';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [errorAnuncio, setErrorAnuncio] = useState<string | null>(null);
  const [successAnuncio, setSuccessAnuncio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormInputs>({
    resolver: zodResolver(resetSchema),
  });

  const alEnviarFormulario = async (datos: ResetFormInputs) => {
    if (!token) {
      setErrorAnuncio('Token inválido o faltante.');
      return;
    }
    setErrorAnuncio(null);
    setSuccessAnuncio(null);
    setIsLoading(true);
    
    try {
      await authService.resetPassword(token, datos.password);
      setSuccessAnuncio('Tu contraseña se actualizó correctamente.');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setErrorAnuncio(err.message || 'El enlace es inválido o ha expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center">
        <span className="material-symbols-outlined text-red-600 text-3xl mb-2">error</span>
        <h3 className="font-bold text-red-800">Token no proporcionado</h3>
        <p className="text-sm text-red-600 mb-4 mt-1">Verifica el enlace enviado a tu correo electrónico.</p>
        <Link href="/login" className="text-sm font-bold text-red-700 hover:underline">Volver al Login</Link>
      </div>
    );
  }

  return (
    <>
      {errorAnuncio && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-700 flex items-start gap-2 shadow-sm mb-5">
          <span className="material-symbols-outlined text-red-600 text-base mt-0.5">error</span>
          <div>
            <span className="font-bold">Error:</span> {errorAnuncio}
          </div>
        </div>
      )}

      {successAnuncio ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex flex-col items-center gap-3 shadow-sm text-center">
          <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: '40px' }}>check_circle</span>
          <h3 className="font-bold text-emerald-800 text-lg">¡Éxito!</h3>
          <p className="text-sm font-medium text-emerald-700">{successAnuncio}</p>
          <p className="text-xs text-emerald-600 mt-2">Redirigiendo al inicio de sesión...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(alEnviarFormulario)} noValidate className="flex flex-col gap-5">
          {/* Input Nueva Contraseña */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="password">
              Nueva Contraseña
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                key
              </span>
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                disabled={isLoading}
                {...register('password')}
                className={`w-full h-12 pl-12 pr-12 bg-white border rounded-xl transition-all text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 shadow-sm ${
                  errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500/10'
                }`}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            {errors.password && (
              <span className="text-xs font-semibold text-red-600 mt-1 flex items-start gap-1">
                <span className="material-symbols-outlined text-xs mt-0.5">info</span>
                <span>{errors.password.message}</span>
              </span>
            )}
          </div>

          {/* Input Confirmar Contraseña */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="confirmPassword">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                lock_reset
              </span>
              <input 
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                disabled={isLoading}
                {...register('confirmPassword')}
                className={`w-full h-12 pl-12 pr-4 bg-white border rounded-xl transition-all text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 shadow-sm ${
                  errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500/10'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">info</span>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="mt-2 h-12 w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-base font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Actualizando...</span>
              </div>
            ) : (
              <>
                <span>Guardar Contraseña</span>
                <span className="material-symbols-outlined">save</span>
              </>
            )}
          </button>
        </form>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-[#f8fafc] text-[#334155] font-sans h-screen w-screen overflow-hidden flex items-center justify-center relative select-none">
      <div className="absolute inset-0 z-0 bg-[#f8fafc] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-200/40 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-100/40 blur-[150px]"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-amber-100/30 blur-[100px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-md px-4 md:px-0">
        <div className="bg-white/70 backdrop-blur-[24px] rounded-2xl p-8 flex flex-col gap-6 items-stretch border border-slate-200/80 shadow-[0_8px_32px_rgba(148,163,184,0.15),inset_0_0_0_1px_rgba(255,255,255,0.6)]">
          
          <div className="flex flex-col items-center mb-2 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-sky-600 shadow-sm border border-slate-200/60 backdrop-blur-md">
              <span className="material-symbols-outlined" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>
                password
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
              Nueva Clave
            </h1>
            <p className="text-base text-slate-500 font-medium text-center">
              Ingresa tu nueva contraseña a continuación.
            </p>
          </div>

          <Suspense fallback={
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600"></div>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>

        </div>
      </main>
    </div>
  );
}