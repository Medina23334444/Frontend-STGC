'use client';

import { PageHeader } from '@/components/shared/PageHeader'; 
import UserModal from '@/components/admin/UserModal';
import { useUsers } from '@/hooks/user/useUsers';
import { useUsersHandlers } from '@/hooks/user/useUsersHandlers';
import { UsersTable } from '@/components/admin/UsersTable';
import { PageBackground } from '@/components/shared/PageBackground';
import { UsersError } from '@/components/admin/UsersError';
import {Pagination} from '@/components/shared/Pagination';

export default function AdminUsersPage() {
  const {
    users,
    loading,
    error,
    fetchUsers,
    getStatusBadge,
    formatUserName,
    
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    userToEdit,

    openStatusModal,

    currentPage,
    setCurrentPage,
    totalPages,
  } = useUsers();

  const { handleCreateUser, handleEditUser } = useUsersHandlers();

  if (error) return <UsersError error={error} />;

  return (
    <div className="p-6 md:p-10 space-y-6 relative z-10 flex-1">
      <PageBackground />

      <div className="relative z-10 space-y-6">
        <PageHeader 
          title="Gestionar Personal"
          description="Crea, edita o elimina empleados"
          buttonLabel="Nuevo Empleado"
          onOpenCreate={openCreateModal}
        />

        <UsersTable
          users={users}
          loading={loading}
          formatUserName={formatUserName}
          getStatusBadge={getStatusBadge}
          onEdit={openEditModal}
          onChangeStatusClick={openStatusModal}
        />
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />

        {/* Modal para Crear Usuario */}
        <UserModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onSuccess={fetchUsers}
          onSubmit={handleCreateUser}
        />
        {/* Modal de Confirmación de Cambio de Estado */}
        {isEditModalOpen && userToEdit && (
          <UserModal
            key={userToEdit.id}
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            onSuccess={fetchUsers}
            initialData={userToEdit}
            onSubmit={async (data) => {
              const { email, phone_number, role_name, status } = data;
              await handleEditUser(userToEdit.id, { email, phone_number, role_name, status });
            }}
          />
        )}
      </div>
    </div>
  );
}