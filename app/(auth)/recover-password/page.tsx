'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recoverSchema, RecoverFormInputs } from '@/schemas/auth.schema';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';

export default function RecoverPasswordPage() {
  const [errorAnuncio, setErrorAnuncio] = useState<string | null>(null);
  const [successAnuncio, setSuccessAnuncio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverFormInputs>({
    resolver: zodResolver(recoverSchema),
  });

  const alEnviarFormulario = async (datos: RecoverFormInputs) => {
    setErrorAnuncio(null);
    setSuccessAnuncio(null);
    setIsLoading(true);
    try {
      await authService.recoverPassword(datos.email);
      const msg = 'Si el correo existe en nuestro sistema, te hemos enviado las instrucciones para recuperar tu contraseña.';
      setSuccessAnuncio(msg);
      toast.success(msg);
    } catch (err: any) {
      const message = err?.message || 'Error al procesar la solicitud.';
      setErrorAnuncio(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
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
          
          <div className="flex flex-col items-center mb-2 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-sky-600 shadow-sm border border-slate-200/60 backdrop-blur-md">
              <span className="material-symbols-outlined" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>
                lock_reset
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
              Recuperar Clave
            </h1>
            <p className="text-base text-slate-500 font-medium text-center">
              Ingresa tu correo para recibir un enlace de restablecimiento.
            </p>
          </div>

          {errorAnuncio && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-700 flex items-start gap-2 shadow-sm">
              <span className="material-symbols-outlined text-red-600 text-base mt-0.5">error</span>
              <div>
                <span className="font-bold">Error:</span> {errorAnuncio}
              </div>
            </div>
          )}

          {successAnuncio ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex flex-col items-center gap-3 shadow-sm text-center">
              <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: '40px' }}>check_circle</span>
              <p className="text-sm font-medium text-emerald-800">{successAnuncio}</p>
              <Link href="/login" className="mt-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 underline">
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(alEnviarFormulario)} noValidate className="flex flex-col gap-5">
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
                    disabled={isLoading}
                    {...register('email')}
                    className={`w-full h-12 pl-12 pr-4 bg-white border rounded-xl transition-all text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:opacity-60 shadow-sm ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                        : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500/10'
                    }`}
                  />
                </div>
                {errors.email && (
                  <span className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'wght' 600" }}>info</span>
                    {errors.email.message}
                  </span>
                )}
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="mt-2 h-12 w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-base font-semibold rounded-xl shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Enviando...</span>
                  </div>
                ) : (
                  <>
                    <span>Enviar instrucciones</span>
                    <span className="material-symbols-outlined">send</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-2 text-center">
            <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Volver al Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}