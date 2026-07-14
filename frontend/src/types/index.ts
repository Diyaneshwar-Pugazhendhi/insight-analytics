// Type definitions mirroring the Dashboard API (backend Zod schemas).
// Kept in sync with backend/src/schemas/index.ts and backend/src/routes/index.ts.

export type MetricFormat = 'currency' | 'compact' | 'percentage';
export type ChangeType = 'increase' | 'decrease';

export interface MetricCard {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: ChangeType;
  trend: number[];
  format: MetricFormat;
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string | string[];
  backgroundColor?: string | string[];
  fill?: boolean;
  tension?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  revenue: number;
  unitsSold: number;
  growth: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export interface GeoData {
  country: string;
  countryCode: string;
  visitors: number;
  revenue: number;
  conversionRate: number;
}

export type ActivityType = 'sale' | 'signup' | 'order' | 'review' | 'support';

export interface RecentActivity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface DashboardResponse {
  metrics: MetricCard[];
  revenueChart: ChartData;
  trafficChart: ChartData;
  conversionChart: ChartData;
  topProducts: TopProduct[];
  trafficSources: TrafficSource[];
  geoData: GeoData[];
  recentActivity: RecentActivity[];
}

export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
}

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
  avgOrderValue: number;
}

export interface SalesResponse {
  period: string;
  summary: SalesSummary;
  chartData: ChartData;
  dailyData: SalesDataPoint[];
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
  products: number;
}

export interface ProductsResponse {
  topProducts: TopProduct[];
  byCategory: CategoryRevenue[];
  allProducts: TopProduct[];
}

export interface TrafficResponse {
  sources: TrafficSource[];
  geo: GeoData[];
  chartData: ChartData;
  conversionChart: ChartData;
}

export interface ActivityResponse {
  activities: RecentActivity[];
}

export type OrderStatus =
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface OrderRow {
  id: string;
  customer: string;
  email: string;
  product: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  date: string;
}

export type UserRole = 'admin' | 'user' | 'moderator' | 'viewer';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedOrders {
  data: OrderRow[];
  pagination: Pagination;
}

export interface PaginatedUsers {
  data: UserRow[];
  pagination: Pagination;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export type SortDirection = 'asc' | 'desc';

export interface TableQuery {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: SortDirection;
  search?: string;
  filters?: Record<string, string>;
}
