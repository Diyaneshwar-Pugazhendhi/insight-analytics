import { z } from 'zod';

export const MetricCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  value: z.number(),
  change: z.number(),
  changeType: z.enum(['increase', 'decrease']),
  trend: z.array(z.number()),
  format: z.enum(['currency', 'compact', 'percentage']),
});

export const ChartDataSchema = z.object({
  labels: z.array(z.string()),
  datasets: z.array(z.object({
    label: z.string(),
    data: z.array(z.number()),
    borderColor: z.union([z.string(), z.array(z.string())]),
    backgroundColor: z.union([z.string(), z.array(z.string())]),
    fill: z.boolean().optional(),
    tension: z.number().optional(),
  })),
});

export const TimeSeriesPointSchema = z.object({
  timestamp: z.string(),
  value: z.number(),
  label: z.string().optional(),
});

export const SalesDataSchema = z.object({
  date: z.string(),
  revenue: z.number(),
  orders: z.number(),
  customers: z.number(),
  avgOrderValue: z.number(),
});

export const TopProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  revenue: z.number(),
  unitsSold: z.number(),
  growth: z.number(),
});

export const TrafficSourceSchema = z.object({
  source: z.string(),
  visitors: z.number(),
  percentage: z.number(),
  bounceRate: z.number(),
  avgSessionDuration: z.number(),
});

export const GeoDataSchema = z.object({
  country: z.string(),
  countryCode: z.string(),
  visitors: z.number(),
  revenue: z.number(),
  conversionRate: z.number(),
});

export const RecentActivitySchema = z.object({
  id: z.string(),
  type: z.enum(['sale', 'signup', 'order', 'review', 'support']),
  description: z.string(),
  timestamp: z.string(),
  metadata: z.record(z.unknown()),
});

export const OrderRowSchema = z.object({
  id: z.string(),
  customer: z.string(),
  email: z.string(),
  product: z.string(),
  quantity: z.number(),
  total: z.number(),
  status: z.enum(['processing', 'shipped', 'delivered', 'cancelled', 'returned']),
  date: z.string(),
});

export const UserRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(['admin', 'user', 'moderator', 'viewer']),
  status: z.enum(['active', 'inactive', 'pending', 'suspended']),
  lastLogin: z.string(),
  createdAt: z.string(),
});

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export const SortSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']),
});

export const TableQueryParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  sortField: z.string().default('date'),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  filters: z.record(z.unknown()).optional(),
});

export type MetricCard = z.infer<typeof MetricCardSchema>;
export type ChartData = z.infer<typeof ChartDataSchema>;
export type TimeSeriesPoint = z.infer<typeof TimeSeriesPointSchema>;
export type SalesData = z.infer<typeof SalesDataSchema>;
export type TopProduct = z.infer<typeof TopProductSchema>;
export type TrafficSource = z.infer<typeof TrafficSourceSchema>;
export type GeoData = z.infer<typeof GeoDataSchema>;
export type RecentActivity = z.infer<typeof RecentActivitySchema>;
export type OrderRow = z.infer<typeof OrderRowSchema>;
export type UserRow = z.infer<typeof UserRowSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type Sort = z.infer<typeof SortSchema>;
export type TableQueryParams = z.infer<typeof TableQueryParamsSchema>;
