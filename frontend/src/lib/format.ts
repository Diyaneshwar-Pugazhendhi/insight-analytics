import type { ChartData } from '@/types';

export function formatCurrency(value: number, compact = false): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function formatMetricValue(value: number, format: string): string {
  switch (format) {
    case 'currency':
      return formatCurrency(value, value >= 10000);
    case 'compact':
      return formatCompact(value);
    case 'percentage':
      return formatPercent(value);
    default:
      return formatNumber(value);
  }
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

/** Convert the API ChartData (labels + datasets) into recharts row format. */
export function toRechartsRows(chart: ChartData): Record<string, string | number>[] {
  if (!chart?.labels?.length) return [];
  return chart.labels.map((label, i) => {
    const row: Record<string, string | number> = { label };
    for (const ds of chart.datasets) {
      row[ds.label] = ds.data[i] ?? 0;
    }
    return row;
  });
}
