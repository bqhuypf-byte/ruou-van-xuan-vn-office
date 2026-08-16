import { useState } from 'react';
import { Plus, Search, Users as UsersIcon, UserCheck, UserX, AlertCircle } from 'lucide-react';
import { Button, Input } from '@/shared/components/ui';
import { useRoles } from '@/features/roles';
import { UserTable } from '../components/UserTable';
import { UserFormModal } from '../components/UserFormModal';
import type { UserFormSubmitData } from '../components/UserFormModal';
import { UserDeleteModal } from '../components/UserDeleteModal';
import { useUsers } from '../hooks/useUsers';
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from '../hooks/useUserMutations';
import type { User } from '../types/user.types';

export const UsersPage = () => {
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { users, allUsers, isLoading, isError, error, refetch } = useUsers({
    search,
  });
  const { roles } = useRoles();

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleSaveForm = async (data: UserFormSubmitData) => {
    setFeedback(null);
    try {
      if (selectedUser) {
        const { password: _password, ...updateInput } = data;
        await updateMutation.mutateAsync({
          id: selectedUser.id,
          input: updateInput,
        });
        setFeedback({
          type: 'success',
          message: `Đã cập nhật người dùng "${data.fullName}" thành công.`,
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          password: data.password ?? '',
        });
        setFeedback({
          type: 'success',
          message: `Đã tạo người dùng "${data.fullName}" thành công.`,
        });
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Có lỗi xảy ra khi lưu người dùng.';
      setFeedback({ type: 'error', message: errMsg });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setFeedback(null);
    try {
      await deleteMutation.mutateAsync(selectedUser.id);
      setFeedback({
        type: 'success',
        message: `Đã xóa người dùng "${selectedUser.fullName}" thành công.`,
      });
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Có lỗi xảy ra khi xóa người dùng.';
      setFeedback({ type: 'error', message: errMsg });
    }
  };

  const totalUsersCount = allUsers.length;
  const activeUsersCount = allUsers.filter((u) => u.isActive).length;
  const inactiveUsersCount = totalUsersCount - activeUsersCount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Page Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Quản Lý Người Dùng (User CRUD)
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Quản lý tài khoản người dùng trong hệ thống e-commerce.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
          size="md"
        >
          Thêm Người Dùng
        </Button>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <UsersIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Tổng Người Dùng
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {totalUsersCount}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Đang Hoạt Động
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {activeUsersCount}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Vô Hiệu Hóa
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {inactiveUsersCount}
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-medium hover:underline ml-4"
          >
            Đóng
          </button>
        </div>
      )}

      {/* API Error State */}
      {isError && (
        <div className="bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 p-4 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>
              Không thể tải danh sách người dùng ({error instanceof Error ? error.message : 'Lỗi kết nối'}).
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Thử Lại
          </Button>
        </div>
      )}

      {/* Search Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Tìm theo tên hoặc email..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users Data Table */}
      <UserTable
        users={users}
        roles={roles}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Create / Edit Form Modal */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveForm}
        userToEdit={selectedUser}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <UserDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        userToDelete={selectedUser}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
