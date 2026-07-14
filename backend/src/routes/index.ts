import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { mockDataService } from '../services/dataService.js';
import {
  MetricCardSchema,
  ChartDataSchema,
  SalesDataSchema,
  TopProductSchema,
  TrafficSourceSchema,
  GeoDataSchema,
  RecentActivitySchema,
  OrderRowSchema,
  UserRowSchema,
  PaginationSchema,
  TableQueryParamsSchema,
} from '../schemas/index.js';

const TimeRangeSchema = z.object({
  period: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
});

const DashboardResponseSchema = z.object({
  metrics: z.array(MetricCardSchema),
  revenueChart: ChartDataSchema,
  trafficChart: ChartDataSchema,
  conversionChart: ChartDataSchema,
  topProducts: z.array(TopProductSchema),
  trafficSources: z.array(TrafficSourceSchema),
  geoData: z.array(GeoDataSchema),
  recentActivity: z.array(RecentActivitySchema),
});

const SalesResponseSchema = z.object({
  period: z.string(),
  summary: z.object({
    totalRevenue: z.number(),
    totalOrders: z.number(),
    totalCustomers: z.number(),
    avgOrderValue: z.number(),
  }),
  chartData: ChartDataSchema,
  dailyData: z.array(SalesDataSchema),
});

const ProductsResponseSchema = z.object({
  topProducts: z.array(TopProductSchema),
  byCategory: z.array(z.object({
    category: z.string(),
    revenue: z.number(),
    products: z.number(),
  })),
  allProducts: z.array(TopProductSchema),
});

const TrafficResponseSchema = z.object({
  sources: z.array(TrafficSourceSchema),
  geo: z.array(GeoDataSchema),
  chartData: ChartDataSchema,
  conversionChart: ChartDataSchema,
});

const ActivityResponseSchema = z.object({
  activities: z.array(RecentActivitySchema),
});

const PaginatedOrdersSchema = z.object({
  data: z.array(OrderRowSchema),
  pagination: PaginationSchema,
});

const PaginatedUsersSchema = z.object({
  data: z.array(UserRowSchema),
  pagination: PaginationSchema,
});

export async function registerRoutes(fastify: FastifyInstance) {
  // Dashboard Overview
  fastify.get('/dashboard', {
    schema: { response: { 200: DashboardResponseSchema } },
  }, async () => {
    const metrics = mockDataService.getMetrics();
    const revenueChart = mockDataService.getRevenueChart();
    const trafficChart = mockDataService.getTrafficChart();
    const conversionChart = mockDataService.getConversionChart();
    const topProducts = mockDataService.getTopProducts(5);
    const trafficSources = mockDataService.getTrafficSources();
    const geoData = mockDataService.getGeoData();
    const recentActivity = mockDataService.getRecentActivity(10);
    
    return { metrics, revenueChart, trafficChart, conversionChart, topProducts, trafficSources, geoData, recentActivity };
  });

  // Metrics
  fastify.get('/metrics', {
    schema: { response: { 200: z.array(MetricCardSchema) } },
  }, async () => mockDataService.getMetrics());

  // Sales Analytics
  fastify.get('/sales', {
    schema: { 
      querystring: TimeRangeSchema,
      response: { 200: SalesResponseSchema },
    },
  }, async (request) => {
    const { period } = request.query;
    const salesData = mockDataService.getSalesData(period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365);
    
    const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
    const totalCustomers = salesData.reduce((sum, d) => sum + d.customers, 0);
    const avgOrderValue = totalRevenue / totalOrders || 0;
    
    const chartData = {
      labels: salesData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        { label: 'Revenue', data: salesData.map(d => d.revenue), borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.4 },
        { label: 'Orders', data: salesData.map(d => d.orders * 20), borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.4 },
      ],
    };
    
    return {
      period,
      summary: { totalRevenue, totalOrders, totalCustomers, avgOrderValue: Math.round(avgOrderValue * 100) / 100 },
      chartData,
      dailyData: salesData,
    };
  });

  // Products Analytics
  fastify.get('/products', {
    schema: { response: { 200: ProductsResponseSchema } },
  }, async () => {
    const topProducts = mockDataService.getTopProducts(10);
    const allProducts = mockDataService.getTopProducts(20);
    
    const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Toys', 'Automotive'];
    const byCategory = categories.map(cat => ({
      category: cat,
      revenue: allProducts.filter(p => p.category === cat).reduce((sum, p) => sum + p.revenue, 0),
      products: allProducts.filter(p => p.category === cat).length,
    })).filter(c => c.revenue > 0);
    
    return { topProducts, byCategory, allProducts };
  });

  // Traffic Analytics
  fastify.get('/traffic', {
    schema: { response: { 200: TrafficResponseSchema } },
  }, async () => {
    return {
      sources: mockDataService.getTrafficSources(),
      geo: mockDataService.getGeoData(),
      chartData: mockDataService.getTrafficChart(),
      conversionChart: mockDataService.getConversionChart(),
    };
  });

  // Recent Activity
  fastify.get('/activity', {
    schema: { 
      querystring: z.object({ limit: z.coerce.number().int().positive().max(100).default(20) }),
      response: { 200: ActivityResponseSchema },
    },
  }, async (request) => {
    return { activities: mockDataService.getRecentActivity(request.query.limit) };
  });

  // Orders Table
  fastify.get('/orders', {
    schema: { 
      querystring: TableQueryParamsSchema,
      response: { 200: PaginatedOrdersSchema },
    },
  }, async (request) => {
    const { page, pageSize, sortField, sortDirection, search, filters } = request.query;
    const result = mockDataService.getOrders({
      page: page ?? 1,
      pageSize: pageSize ?? 20,
      sortField: sortField ?? 'date',
      sortDirection: sortDirection ?? 'desc',
      filters: filters ?? {},
      search,
    });
    return result;
  });

  // Users Table
  fastify.get('/users', {
    schema: { 
      querystring: TableQueryParamsSchema,
      response: { 200: PaginatedUsersSchema },
    },
  }, async (request) => {
    const { page, pageSize, sortField, sortDirection, search, filters } = request.query;
    const result = mockDataService.getUsers({
      page: page ?? 1,
      pageSize: pageSize ?? 20,
      sortField: sortField ?? 'createdAt',
      sortDirection: sortDirection ?? 'desc',
      filters: filters ?? {},
      search,
    });
    return result;
  });

  // Health check
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));
}
