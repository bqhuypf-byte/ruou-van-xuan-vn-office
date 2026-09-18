import { useMemo, useState } from 'react';
import { AlertCircle, CalendarDays, LockKeyhole, Mail, Phone, Search, UnlockKeyhole, UserCheck, Users } from 'lucide-react';
import { useRoles } from '@/features/roles';
import { Badge, Button, Input } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useUpdateUser } from '../hooks/useUserMutations';
import { useUsers } from '../hooks/useUsers';

const formatRegistrationDate = (value?: string) => {
  if (!value) return 'Chưa có dữ liệu';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const CustomersPage = () => {
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const { allUsers, isLoading, isError, refetch } = useUsers();
  const { allRoles } = useRoles();
  const updateUser = useUpdateUser();
  const customerRole = allRoles.find((role) => role.name.toLowerCase() === 'customer');

  const customers = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('vi-VN');
    return allUsers.filter((user) => {
      if (!customerRole || user.roleId !== customerRole.id) return false;
      if (!normalizedSearch) return true;
      return [user.fullName, user.email, user.phone ?? '', String(user.id)].some((value) =>
        value.toLocaleLowerCase('vi-VN').includes(normalizedSearch),
      );
    });
  }, [allUsers, customerRole, search]);

  const activeCount = customers.filter((customer) => customer.isActive).length;

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    setFeedback(null);
    try {
      await updateUser.mutateAsync({ id, input: { isActive: !isActive } });
    } catch (error) {
      setFeedback(getApiErrorMessage(error, 'Không thể cập nhật trạng thái khách hàng.'));
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Khách Hàng Đăng Ký
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Quản lý các tài khoản khách hàng tự đăng ký trên website.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
            <Users className="h-6 w-6" />
          </div>
          <div><p className="text-xs text-slate-500">Tổng khách đăng ký</p><p className="text-2xl font-bold">{customers.length}</p></div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <UserCheck className="h-6 w-6" />
          </div>
          <div><p className="text-xs text-slate-500">Đang hoạt động</p><p className="text-2xl font-bold">{activeCount}</p></div>
        </div>
      </div>

      {feedback && <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><AlertCircle className="h-4 w-4" />{feedback}</div>}
      {isError && <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><span>Không thể tải danh sách khách hàng.</span><Button size="sm" variant="outline" onClick={() => refetch()}>Thử lại</Button></div>}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="w-full sm:w-96"><Input aria-label="Tìm khách hàng" placeholder="Tìm theo tên, email, số điện thoại..." leftIcon={<Search className="h-4 w-4" />} value={search} onChange={(event) => setSearch(event.target.value)} /></div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
              <tr><th className="px-5 py-3.5">Khách hàng</th><th className="px-5 py-3.5">Điện thoại</th><th className="px-5 py-3.5">Ngày đăng ký</th><th className="px-5 py-3.5">Trạng thái</th><th className="px-5 py-3.5 text-right">Thao tác</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-4"><p className="font-semibold text-slate-900 dark:text-white">{customer.fullName}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><Mail className="h-3 w-3" />{customer.email}</p></td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300"><span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{customer.phone || 'Chưa cập nhật'}</span></td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300"><span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatRegistrationDate(customer.createdAt)}</span></td>
                  <td className="px-5 py-4"><Badge variant={customer.isActive ? 'success' : 'danger'}>{customer.isActive ? 'Đang hoạt động' : 'Đã khóa'}</Badge></td>
                  <td className="px-5 py-4 text-right"><Button size="sm" variant="outline" isLoading={updateUser.isPending} onClick={() => handleToggleStatus(customer.id, customer.isActive)} leftIcon={customer.isActive ? <LockKeyhole className="h-4 w-4" /> : <UnlockKeyhole className="h-4 w-4" />}>{customer.isActive ? 'Khóa' : 'Mở khóa'}</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && customers.length === 0 && <div className="p-12 text-center text-sm text-slate-500">Chưa có khách hàng đăng ký phù hợp.</div>}
        {isLoading && <div className="p-12 text-center text-sm text-slate-500">Đang tải danh sách khách hàng...</div>}
      </div>
    </div>
  );
};
