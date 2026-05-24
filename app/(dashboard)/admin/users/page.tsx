// app/(dashboard)/admin/users/page.tsx
'use client';

import UserModal from '@/components/admin/UserModal';
import { useUsers } from '@/hooks/useUsers';
import { useUsersHandlers } from '@/hooks/useUsersHandlers';
import { UsersHeader } from '@/components/admin/UsersHeader';
import { UsersTable } from '@/components/admin/UsersTable';
import { PageBackground } from '@/components/admin/PageBackground';
import { UsersError } from '@/components/admin/UsersError';


export default function AdminUsersPage() {
  const {
    users,
    loading,
    error,
    fetchUsers,
    getStatusBadge,
    getStatusDot,
    getStatusLabel,
    formatUserName,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    openEditModal,
  } = useUsers();

  const { handleCreateUser } = useUsersHandlers();

  if (error) return <UsersError error={error} />;

  return (
    <div className="p-6 md:p-10 space-y-6 relative z-10 flex-1">
      <PageBackground />

      <div className="relative z-10 space-y-6">
        <UsersHeader onOpenCreate={openCreateModal} />

        <UsersTable
          users={users}
          loading={loading}
          formatUserName={formatUserName}
          getStatusBadge={getStatusBadge}
          getStatusDot={getStatusDot}
          getStatusLabel={getStatusLabel}
          onEdit={openEditModal}
        />

        <UserModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onSuccess={fetchUsers}
          onSubmit={handleCreateUser}
        />
      </div>
    </div>
  );
}