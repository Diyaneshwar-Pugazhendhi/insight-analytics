import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  Globe,
  ShoppingCart,
  Users,
  PanelLeftClose,
  PanelLeft,
  BarChart3,
} from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/cn';

const NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/sales', label: 'Sales', icon: TrendingUp },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/traffic', label: 'Traffic', icon: Globe },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/users', label: 'Users', icon: Users },
];

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col border-r border-slate-800 bg-slate-900/50 transition-all duration-200',
        collapsed ? 'w-[72px]' : 'w-60',
      )}
    >
      <div className={cn('flex h-16 items-center gap-2 px-4', collapsed && 'justify-center px-0')}>
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white">
          <BarChart3 className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-100">Insight</p>
            <p className="text-[11px] text-slate-500">Analytics Suite</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-brand-600/15 text-brand-300 ring-1 ring-inset ring-brand-600/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200',
              )
            }
            title={label}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={toggle}
        className="m-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-800/60 hover:text-slate-300"
      >
        {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}
