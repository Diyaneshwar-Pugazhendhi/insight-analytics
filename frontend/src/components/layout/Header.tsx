import { Search, Bell, Circle } from 'lucide-react';

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/60 px-6 backdrop-blur">
      <div>
        <h1 className="text-lg font-semibold text-slate-100">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            className="input w-64 pl-9"
            placeholder="Search…"
            aria-label="Search"
          />
        </div>
        <button
          type="button"
          className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1.5">
          <Circle className="h-2.5 w-2.5 fill-emerald-400 text-emerald-400" />
          <span className="text-xs font-medium text-slate-300">Live</span>
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-sm font-semibold text-white">
          DP
        </div>
      </div>
    </header>
  );
}
