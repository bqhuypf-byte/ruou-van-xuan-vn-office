import { Edit2, MapPin, Star, Trash2 } from 'lucide-react';
import { Badge, Button } from '@/shared/components/ui';
import type { Address } from '../types/address.types';

export interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
  isSettingDefault?: boolean;
}

export const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isSettingDefault = false,
}: AddressCardProps) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-slate-900 dark:text-white">{address.fullName}</p>
            {address.isDefault && (
              <Badge variant="primary" size="sm">
                Mặc Định
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{address.phone}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            {address.addressLine}, {address.city}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {!address.isDefault && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSetDefault(address)}
            isLoading={isSettingDefault}
            title="Đặt làm mặc định"
            leftIcon={<Star className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
          >
            Mặc Định
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(address)}
          title="Chỉnh sửa"
          leftIcon={<Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
        >
          Sửa
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(address)}
          title="Xóa"
          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50"
          leftIcon={<Trash2 className="w-4 h-4" />}
        >
          Xóa
        </Button>
      </div>
    </div>
  </div>
);
