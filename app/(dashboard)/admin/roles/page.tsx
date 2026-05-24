'use client';

import { useState } from 'react';
import RoleModal from '@/components/admin/RoleModal'; 
import { RoleCreate } from '@/types/rol';

export default function RolesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleRoleSubmit = async (data: RoleCreate) => {
    try {
      console.log('Datos a enviar:', data);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      throw error; 
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Roles</h1>
          <p className="text-sm text-gray-500">Administra los roles y permisos del sistema.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
        >
          Crear Nuevo Rol
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <p className="text-gray-500 text-center py-8">
          Aquí irá la tabla donde se muestran los roles...
        </p>
      </div>
      <RoleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRoleSubmit}
        availablePermissions={[]} 
        initialData={null}
      />
    </div>
  );
}