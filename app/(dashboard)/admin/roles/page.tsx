'use client';

import { useState } from 'react';
import RoleModal from '@/components/admin/RoleModal'; 
import { PageBackground } from '@/components/shared/PageBackground';
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
    <PageBackground>
      {/* 1. CONTENEDOR PRINCIPAL: 
        Usa las mismas clases que en Usuarios para tener la misma altura y sombra 
      */}
      <div className="bg-white rounded-lg shadow h-[calc(100vh-120px)] flex flex-col overflow-hidden">
        
        {/* 2. HEADER DE LA PÁGINA: 
          Este bloque reemplaza/simula lo que hace tu <UsersHeader /> 
        */}
        <div className="p-6 border-b border-gray-200 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Roles</h1>
            <p className="text-sm text-gray-500 mt-1">
              Administra los roles del sistema y sus permisos asignados.
            </p>
          </div>
          <button
            onClick={() => {/* Lógica para abrir modal de crear */}}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            + Nuevo Rol
          </button>
        </div>

        {/* 3. CONTENEDOR DE LA TABLA: 
          flex-1 toma el resto del espacio y overflow-auto permite el scroll interno 
        */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          
          {/* Aquí colocas tu componente de Tabla de Roles */}
          {/* <RolesTable roles={roles} onEdit={...} onDelete={...} /> */}
          
        </div>
      </div>

      {/* 4. MODALES: Se renderizan fuera del contenedor principal */}
      {/* <RoleModal 
          isOpen={isModalOpen} 
          onClose={...} 
          onSubmit={...} 
          availablePermissions={...} 
        /> 
      */}
    </PageBackground>
  );
}