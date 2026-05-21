// app/(dashboard)/dashboard/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  // Tarjetas informativas de ejemplo
  const metricas = [
    { id: 1, titulo: 'Lotes en Monitoreo', valor: '12 Lotes', icono: 'potted_plant', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 2, titulo: 'Café en Bodega', valor: '4,250 kg', icono: 'inventory_2', color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 3, titulo: 'Última Catación', valor: '86.5 Pts (SCA)', icono: 'emoji_events', color: 'text-sky-600', bg: 'bg-sky-50' },
    { id: 4, titulo: 'Alertas Activas', valor: '0 Alertas', icono: 'gpp_good', color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 relative z-10 flex-1">
      
     <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[10%] w-[40%] h-[40%] rounded-full bg-sky-200/20 blur-[130px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[35%] rounded-full bg-purple-100/20 blur-[120px]"></div>
      </div>

      <div className="relative z-10 space-y-8">
        
        {/* Encabezado Superior */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Panel de Control</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Bienvenido de vuelta, <span className="text-slate-800 font-semibold">{user?.email}</span>
            </p>
          </div>
          
        {/* Badge del Rol del Personal */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm self-start sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">
              {user?.role?.name?.replace('_', ' ')}
            </span>
          </div>
        </header>

        {/* Rejilla de Métricas en Cristal Premium */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metricas.map((item) => (
            <div key={item.id} className="bg-white/90 backdrop-blur-[20px] p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between transition hover:shadow-md">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.titulo}</p>
                <p className="text-2xl font-black text-slate-900">{item.valor}</p>
              </div>
              <div className={`h-12 w-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center border border-slate-200/40`}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {item.icono}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Resumen Operativo en Cristal */}
        <section className="bg-white/90 backdrop-blur-[24px] rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8 min-h-[300px] flex items-center justify-center text-center">
          <div className="max-w-sm space-y-3">
            <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-2xl">analytics</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Resumen Operativo</h3>
            <p className="text-sm text-slate-500 font-medium">
              Aquí se integrarán los gráficos de producción, trazabilidad de lotes y flujos de procesos según las actividades registradas en la finca.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}