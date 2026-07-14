import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  padded?: boolean;
}

export function Card({ children, className, title, subtitle, action, padded = true }: CardProps) {
  return (
    <section className={cn('card', className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-slate-800 px-5 py-4">
          <div>
            {title && <h3 className="text-sm font-semibold text-slate-100">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn(padded && 'p-5')}>{children}</div>
    </section>
  );
}
