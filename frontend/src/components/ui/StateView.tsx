import { Loader2, AlertCircle, Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
      <Loader2 className="h-5 w-5 animate-spin" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <AlertCircle className="h-8 w-8 text-rose-400" />
      <p className="text-sm text-slate-300">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost text-xs">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyView({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
      <Inbox className="h-8 w-8" />
      <p className="text-sm">{message ?? 'No data available'}</p>
    </div>
  );
}

export function PageState({
  loading,
  error,
  empty,
  onRetry,
  children,
}: {
  loading: boolean;
  error: string | null;
  empty?: boolean;
  onRetry?: () => void;
  children: ReactNode;
}) {
  if (loading) return <Spinner />;
  if (error) return <ErrorView message={error} onRetry={onRetry} />;
  if (empty) return <EmptyView />;
  return <>{children}</>;
}
