import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type BadgeTone = 'slate' | 'emerald' | 'sky' | 'violet' | 'amber' | 'rose' | 'teal';

const TONES: Record<BadgeTone, string> = {
  slate: 'bg-slate-700/40 text-slate-300 ring-slate-600/50',
  emerald: 'bg-emerald-400/10 text-emerald-400 ring-emerald-400/30',
  sky: 'bg-sky-400/10 text-sky-400 ring-sky-400/30',
  violet: 'bg-violet-400/10 text-violet-400 ring-violet-400/30',
  amber: 'bg-amber-400/10 text-amber-400 ring-amber-400/30',
  rose: 'bg-rose-400/10 text-rose-400 ring-rose-400/30',
  teal: 'bg-teal-400/10 text-teal-400 ring-teal-400/30',
};

export function Badge({
  children,
  tone = 'slate',
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
