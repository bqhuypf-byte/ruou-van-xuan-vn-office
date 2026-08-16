import { useState } from 'react';
import { Plus, Search, Shield, ShieldCheck, Users, AlertCircle } from 'lucide-react';
import { Button, Input } from '@/shared/components/ui';
import { RoleTable } from '../components/RoleTable';
import { RoleFormModal } from '../components/RoleFormModal';
import { RoleDeleteModal } from '../components/RoleDeleteModal';
import { useRoles } from '../hooks/useRoles';
import {
  useCreateRole,
  useDeleteRole,
  useUpdateRole,
} from '../hooks/useRoleMutations';
import type { Role } from '../types/role.types';

export const RolesPage = () => {
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { roles, allRoles, isLoading, isError, error, refetch } = useRoles({
    search,
  });

  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  const handleOpenCreate = () => {
    setSelectedRole(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (role: Role) => {
    setSelectedRole(role);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteOpen(true);
  };

  const handleSaveForm = async (data: { name: string }) => {
    setFeedback(null);
    try {
      if (selectedRole) {
        await updateMutation.mutateAsync({
          id: selectedRole.id,
          input: data,
        });
        setFeedback({
          type: 'success',
          message: `Đã cập nhật vai trò "${data.name}" thành công.`,
        });
      } else {
        await createMutation.mutateAsync(data);
        setFeedback({
          type: 'success',
          message: `Đã tạo vai trò "${data.name}" thành công.`,
        });
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Có lỗi xảy ra khi lưu vai trò.';
      setFeedback({ type: 'error', message: errMsg });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRole) return;
    setFeedback(null);
    try {
      await deleteMutation.mutateAsync(selectedRole.id);
      setFeedback({
        type: 'success',
        message: `Đã xóa vai trò "${selectedRole.name}" thành công.`,
      });
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Có lỗi xảy ra khi xóa vai trò.';
      setFeedback({ type: 'error', message: errMsg });
    }
  };

  const totalRolesCount = allRoles.length;
  const adminRolesCount = allRoles.filter(
    (r) => r.name.toLowerCase() === 'admin',
  ).length;
  const standardRolesCount = totalRolesCount - adminRolesCount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Page Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Quản Lý Vai Trò (Role CRUD)
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Quản lý các danh mục phân quyền người dùng trong hệ thống e-commerce.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
          size="md"
        >
          Thêm Vai Trò
        </Button>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Tổng Vai Trò
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {totalRolesCount}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Admin System Roles
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {adminRolesCount}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Standard Roles
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {standardRolesCount}
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
              Không thể tải danh sách vai trò ({error instanceof Error ? error.message : 'Lỗi kết nối'}).
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
            placeholder="Tìm theo tên vai trò..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Roles Data Table */}
      <RoleTable
        roles={roles}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Create / Edit Form Modal */}
      <RoleFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveForm}
        roleToEdit={selectedRole}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <RoleDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        roleToDelete={selectedRole}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
