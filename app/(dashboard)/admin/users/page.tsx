'use client';

import { PageHeader } from '@/components/shared/PageHeader'; 
import UserModal from '@/components/admin/UserModal';
import { useUsers } from '@/hooks/user/useUsers';
import { useUsersHandlers } from '@/hooks/user/useUsersHandlers';
import { UsersTable } from '@/components/admin/UsersTable';
import { PageBackground } from '@/components/shared/PageBackground';
import { UsersError } from '@/components/admin/UsersError';
import { ConfirmModal } from '@/components/shared/ConfirmModal';

export default function AdminUsersPage() {
  const {
    users,
    loading,
    error,
    fetchUsers,
    getStatusBadge,
    getStatusLabel,
    formatUserName,
    
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    userToEdit,

    isStatusModalOpen,
    closeStatusModal,
    statusChangeData,
    openStatusModal,
  } = useUsers();

  const { handleCreateUser, handleEditUser, handleStatusChange } = useUsersHandlers();

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

        {/* Modal para Crear Usuario */}
        <UserModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onSuccess={fetchUsers}
          onSubmit={handleCreateUser}
        />

        {/* Modal para Editar Usuario  */}
        <UserModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSuccess={fetchUsers}
          initialData={userToEdit}
          onSubmit={async (data) => {
            if (userToEdit) {
              await handleEditUser(userToEdit.id, data);
            }
          }}
        />

        {/* Modal de Confirmación de Cambio de Estado */}
        <ConfirmModal
          isOpen={isStatusModalOpen}
          onClose={closeStatusModal}
          variant="warning"
          icon="warning"
          title="¿Cambiar estado del usuario?"
          description={
            <p>
              Estás a punto de cambiar el estado de <strong>{statusChangeData?.user.email}</strong> a <strong className="text-sky-600">{statusChangeData?.newStatus && getStatusLabel(statusChangeData.newStatus)}</strong>. ¿Estás seguro?
            </p>
          }
          confirmText="Sí, cambiar"
          onConfirm={async () => {
            if (statusChangeData) {
              await handleStatusChange(statusChangeData.user.id, statusChangeData.newStatus);
              await fetchUsers(); 
            }
          }}
        />
      </div>
    </div>
  );
}