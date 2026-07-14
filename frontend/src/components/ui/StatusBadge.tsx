import { Badge } from './Badge';
import type { OrderStatus, UserStatus } from '@/types';

const ORDER_TONES: Record<OrderStatus, 'sky' | 'emerald' | 'violet' | 'rose' | 'slate'> = {
  processing: 'sky',
  shipped: 'violet',
  delivered: 'emerald',
  cancelled: 'rose',
  returned: 'slate',
};

const USER_TONES: Record<UserStatus, 'emerald' | 'slate' | 'amber' | 'rose'> = {
  active: 'emerald',
  inactive: 'slate',
  pending: 'amber',
  suspended: 'rose',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={ORDER_TONES[status]}>{status}</Badge>;
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return <Badge tone={USER_TONES[status]}>{status}</Badge>;
}
