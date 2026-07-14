/**
 * Shared type definitions for the Dashboard API
 * Used by both frontend and backend for type safety
 */

/**
 * Time range presets for dashboard filtering
 */
export type TimeRangePreset =
  | '1h'
  | '6h'
  | '24h'
  | '7d'
  | '30d'
  | '90d'
  | 'custom';

/**
 * Custom date range for custom time range preset
 */
export interface DateRange {
  start: string; // ISO 8601 date string
  end: string;   // ISO 8601 date string
}

/**
 * Metric card/KPI data point
 */
export interface MetricCard {
  id: string;
  title: string;
  value: number | string;
  change: number; // percentage change
  changeLabel: string; // e.g., "vs last week"
  trend: 'up' | 'down' | 'neutral';
  icon: string; // Lucide icon name
  format?: 'number' | 'currency' | 'percentage' | 'compact';
}

/**
 * Time series data point for charts
 */
export interface TimeSeriesPoint {
  timestamp: string; // ISO 8601
  value: number;
  label?: string;
}

/**
 * Time series dataset for charts
 */
export interface TimeSeriesDataset {
  label: string;
  data: TimeSeriesPoint[];
  color?: string;
}

/**
 * Category data for bar/pie charts
 */
export interface CategoryDataPoint {
  category: string;
  value: number;
  color?: string;
}

/**
 * Dashboard metrics response
 */
export interface DashboardMetricsResponse {
  metrics: MetricCard[];
  timeSeries: TimeSeriesDataset[];
  categories: CategoryDataPoint[];
  lastUpdated: string;
}

/**
 * Query parameters for dashboard metrics
 */
export interface DashboardMetricsQuery {
  timeRange?: TimeRangePreset;
  customRange?: DateRange;
  metrics?: string[]; // specific metric IDs to fetch
  interval?: 'minute' | 'hour' | 'day' | 'week' | 'month';
}

/**
 * Table column definition
 */
export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

/**
 * Paginated table response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  filters?: Record<string, unknown>;
}

/**
 * Table query parameters
 */
export interface TableQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: Record<string, string | number | boolean>;
  search?: string;
}

/**
 * Sample data row for transactions table
 */
export interface TransactionRow {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
}

/**
 * Sample data row for users table
 */
export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator' | 'viewer';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

/**
 * Sample data row for orders table
 */
export interface OrderRow {
  id: string;
  customer: string;
  email: string;
  product: string;
  quantity: number;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  date: string;
}

/**
 * Chart configuration for different chart types
 */
export interface ChartConfig {
  type: 'line' | 'area' | 'bar' | 'pie' | 'radar' | 'composed';
  dataKey: string;
  name: string;
  color?: string;
  strokeWidth?: number;
  dot?: boolean;
  fill?: string | { fill: string; opacity: number };
}

/**
 * Dashboard layout configuration
 */
export interface DashboardLayout {
  widgets: DashboardWidget[];
  gridCols: number;
  rowHeight: number;
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'list';
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  config: Record<string, unknown>;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    database: 'healthy' | 'unhealthy';
    cache: 'healthy' | 'unhealthy';
  };
}