import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Insight Analytics" subtitle="Real-time business metrics" />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
