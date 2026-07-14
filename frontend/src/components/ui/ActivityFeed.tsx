import {
  ShoppingBag,
  UserPlus,
  Package,
  Star,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react';
import type { ActivityType, RecentActivity } from '@/types';
import { timeAgo } from '@/lib/format';
import { cn } from '@/lib/cn';

const META: Record<ActivityType, { icon: LucideIcon; tone: string }> = {
  sale: { icon: ShoppingBag, tone: 'text-emerald-400 bg-emerald-400/10' },
  signup: { icon: UserPlus, tone: 'text-sky-400 bg-sky-400/10' },
  order: { icon: Package, tone: 'text-violet-400 bg-violet-400/10' },
  review: { icon: Star, tone: 'text-amber-400 bg-amber-400/10' },
  support: { icon: LifeBuoy, tone: 'text-rose-400 bg-rose-400/10' },
};

export function ActivityFeed({ items }: { items: RecentActivity[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const { icon: Icon, tone } = META[item.type];
        return (
          <li key={item.id} className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-slate-800/40">
            <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg', tone)}>
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-slate-200">{item.description}</p>
              <p className="text-xs text-slate-500">{timeAgo(item.timestamp)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
