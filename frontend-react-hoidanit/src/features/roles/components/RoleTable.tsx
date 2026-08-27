import { Shield, Edit2, Trash2, Key } from 'lucide-react';
import type { Role } from '../types/role.types';
import { Badge, Button } from '@/shared/components/ui';

export interface RoleTableProps {
  roles: Role[];
  isLoading: boolean;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export const RoleTable = ({
  roles,
  isLoading,
  onEdit,
  onDelete,
}: RoleTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <div className="flex items-center gap-4 w-1/3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
              </div>
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-20" />
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Không tìm thấy vai trò nào
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Thử thay đổi từ khóa tìm kiếm hoặc thêm vai trò mới cho hệ thống.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <th className="py-3.5 px-6">ID</th>
              <th className="py-3.5 px-6">Tên Vai Trò (Role Name)</th>
              <th className="py-3.5 px-6">Phân Loại</th>
              <th className="py-3.5 px-6 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {roles.map((role) => {
              const isAdmin = role.name.toLowerCase() === 'admin';
              return (
                <tr
                  key={role.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-6 font-mono text-xs text-slate-500 dark:text-slate-400">
                    #{role.id}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isAdmin
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                            : 'bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400'
                        }`}
                      >
                        {isAdmin ? (
                          <Shield className="w-4 h-4" />
                        ) : (
                          <Key className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white capitalize">
                          {role.name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {isAdmin ? (
                      <Badge variant="danger" size="md">
                        System Admin
                      </Badge>
                    ) : (
                      <Badge variant="primary" size="md">
                        Standard Role
                      </Badge>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(role)}
                        title="Chỉnh sửa"
                        leftIcon={<Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(role)}
                        title="Xóa"
                        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50"
                        leftIcon={<Trash2 className="w-4 h-4" />}
                      >
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
