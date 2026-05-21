'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import UserModal from '@/components/admin/UserModal';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 md:p-10 space-y-6 relative z-10 flex-1">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[20%] w-[40%] h-[40%] rounded-full bg-sky-200/10 blur-[130px]"></div>
      </div>

      <div className="relative z-10 space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestionar Personal</h1>
          <p className="text-sm text-slate-500 mt-1">Administra los accesos y roles del equipo de trabajo.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-md flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nuevo Empleado
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Usuario / Email</th>
                <th className="px-6 py-4 font-semibold">Rol</th>
                <th className="px-6 py-4 font-semibold text-center">Estado</th>
                <th className="px-6 py-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent mx-auto"></div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">No hay usuarios registrados.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase border border-slate-200">
                          {u.email.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-700">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-100 text-sky-700 border border-sky-200">
                        {u.role?.name || 'DESCONOCIDO'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                        u.status === 'ACTIVO' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'ACTIVO' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-slate-400 hover:text-sky-600 p-2 rounded-lg hover:bg-sky-50 transition-colors inline-block">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Componente Modal */}
      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          // Cuando el modal de crear termine con éxito, refrescamos la tabla
          fetchUsers();
        }}
      />
    </div>
    </div>
  );
}