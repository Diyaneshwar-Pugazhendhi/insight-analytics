import { faker } from '@faker-js/faker';
import { env } from '../env.js';
import {
  SalesData,
  TopProduct,
  TrafficSource,
  GeoData,
  RecentActivity,
  MetricCard,
  ChartData,
  TimeSeriesPoint,
  OrderRow,
  UserRow,
} from '../schemas/index.js';

faker.seed(env.SEED);

const CATEGORIES = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Toys', 'Automotive'];
const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IN', name: 'India' },
  { code: 'CN', name: 'China' },
];
const TRAFFIC_SOURCES = ['Direct', 'Organic Search', 'Paid Search', 'Social', 'Email', 'Referral', 'Display'];
const ORDER_STATUSES = ['processing', 'shipped', 'delivered', 'cancelled', 'returned'] as const;

function generateDateRange(period: string): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  switch (period) {
    case '7d': start.setDate(end.getDate() - 7); break;
    case '30d': start.setDate(end.getDate() - 30); break;
    case '90d': start.setDate(end.getDate() - 90); break;
    case '1y': start.setFullYear(end.getFullYear() - 1); break;
    default: start.setFullYear(end.getFullYear() - 1);
  }
  return { start, end };
}

function generateTimeSeriesPoints(count: number, baseValue: number, variance: number): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  const now = new Date();
  const interval = Math.floor((7 * 24 * 60 * 60 * 1000) / count);
  
  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * interval);
    const variation = (Math.random() - 0.5) * 2 * variance;
    const trend = Math.sin(i / count * Math.PI * 4) * variance * 0.3;
    const value = Math.max(0, Math.round(baseValue + variation + trend));
    points.push({
      timestamp: timestamp.toISOString(),
      value,
      label: timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
  }
  return points;
}

export function generateMetricCards(): MetricCard[] {
  const baseRevenue = 125000;
  const baseOrders = 1240;
  const baseCustomers = 890;
  const baseConversion = 3.24;

  return [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: baseRevenue + faker.number.int({ min: -5000, max: 15000 }),
      change: faker.number.float({ min: -8, max: 15, fractionDigits: 1 }),
      changeType: faker.helpers.arrayElement(['increase', 'decrease', 'increase', 'increase']),
      trend: generateTimeSeriesPoints(7, baseRevenue / 7, baseRevenue * 0.1).map(p => p.value),
      format: 'currency',
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: baseOrders + faker.number.int({ min: -50, max: 200 }),
      change: faker.number.float({ min: -5, max: 12, fractionDigits: 1 }),
      changeType: faker.helpers.arrayElement(['increase', 'decrease', 'increase', 'increase']),
      trend: generateTimeSeriesPoints(7, baseOrders / 7, baseOrders * 0.15).map(p => p.value),
      format: 'compact',
    },
    {
      id: 'customers',
      title: 'Active Customers',
      value: baseCustomers + faker.number.int({ min: -20, max: 100 }),
      change: faker.number.float({ min: -3, max: 8, fractionDigits: 1 }),
      changeType: faker.helpers.arrayElement(['increase', 'decrease', 'increase']),
      trend: generateTimeSeriesPoints(7, baseCustomers / 7, baseCustomers * 0.1).map(p => p.value),
      format: 'compact',
    },
    {
      id: 'conversion',
      title: 'Conversion Rate',
      value: baseConversion + faker.number.float({ min: -0.5, max: 1.2, fractionDigits: 2 }),
      change: faker.number.float({ min: -1, max: 2, fractionDigits: 2 }),
      changeType: faker.helpers.arrayElement(['increase', 'decrease', 'increase']),
      trend: generateTimeSeriesPoints(7, baseConversion, 0.3).map(p => p.value),
      format: 'percentage',
    },
  ];
}

export function generateSalesData(count: number = env.DATA_POINTS_COUNT): SalesData[] {
  const data: SalesData[] = [];
  const { start, end } = generateDateRange('30d');
  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.ceil((end.getTime() - start.getTime()) / dayMs);
  
  for (let i = 0; i < Math.min(count, days); i++) {
    const date = new Date(start.getTime() + i * dayMs);
    const baseRevenue = 3000 + Math.sin(i / days * Math.PI * 4) * 1500;
    const noise = (Math.random() - 0.5) * 1000;
    const revenue = Math.max(500, Math.round(baseRevenue + noise));
    const orders = Math.max(10, Math.round(revenue / (80 + Math.random() * 40)));
    const customers = Math.max(5, Math.round(orders * (0.6 + Math.random() * 0.3)));
    
    data.push({
      date: date.toISOString(),
      revenue,
      orders,
      customers,
      avgOrderValue: Math.round(revenue / orders * 100) / 100,
    });
  }
  return data;
}

export function generateTopProducts(count: number = 10): TopProduct[] {
  const products: TopProduct[] = [];
  for (let i = 0; i < count; i++) {
    const category = faker.helpers.arrayElement(CATEGORIES);
    const revenue = faker.number.int({ min: 5000, max: 50000 });
    const unitsSold = faker.number.int({ min: 50, max: 500 });
    products.push({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      category,
      revenue,
      unitsSold,
      growth: faker.number.float({ min: -20, max: 50, fractionDigits: 1 }),
    });
  }
  return products.sort((a, b) => b.revenue - a.revenue);
}

export function generateTrafficSources(): TrafficSource[] {
  const totalVisitors = 125000;
  const sources: TrafficSource[] = [];
  
  let remaining = totalVisitors;
  TRAFFIC_SOURCES.forEach((source, i) => {
    const isLast = i === TRAFFIC_SOURCES.length - 1;
    const visitors = isLast ? remaining : faker.number.int({ min: 1000, max: remaining - (TRAFFIC_SOURCES.length - i - 1) * 1000 });
    remaining -= visitors;
    
    sources.push({
      source,
      visitors,
      percentage: Math.round((visitors / totalVisitors) * 1000) / 10,
      bounceRate: faker.number.float({ min: 20, max: 70, fractionDigits: 1 }),
      avgSessionDuration: faker.number.int({ min: 45, max: 420 }),
    });
  });
  
  return sources.sort((a, b) => b.visitors - a.visitors);
}

export function generateGeoData(): GeoData[] {
  return COUNTRIES.map(({ code, name }) => ({
    country: name,
    countryCode: code,
    visitors: faker.number.int({ min: 500, max: 25000 }),
    revenue: faker.number.float({ min: 1000, max: 80000, fractionDigits: 2 }),
    conversionRate: faker.number.float({ min: 1.5, max: 5.5, fractionDigits: 2 }),
  })).sort((a, b) => b.visitors - a.visitors);
}

export function generateRecentActivity(count: number = 20): RecentActivity[] {
  const types: RecentActivity['type'][] = ['sale', 'signup', 'order', 'review', 'support'];
  const activities: RecentActivity[] = [];
  
  for (let i = 0; i < count; i++) {
    const type = faker.helpers.arrayElement(types);
    const minutesAgo = faker.number.int({ min: 1, max: 60 * 24 * 7 });
    const timestamp = new Date(Date.now() - minutesAgo * 60 * 1000);
    
    let description = '';
    const metadata: Record<string, unknown> = {};
    
    switch (type) {
      case 'sale':
        const amount = faker.number.float({ min: 20, max: 500, fractionDigits: 2 });
        description = `New sale: $${amount}`;
        metadata.amount = amount;
        metadata.product = faker.commerce.productName();
        break;
      case 'signup':
        description = `New user registered`;
        metadata.source = faker.helpers.arrayElement(TRAFFIC_SOURCES);
        break;
      case 'order':
        const orderValue = faker.number.float({ min: 50, max: 1000, fractionDigits: 2 });
        description = `Order #${faker.string.alphanumeric(8).toUpperCase()} - $${orderValue}`;
        metadata.orderValue = orderValue;
        metadata.items = faker.number.int({ min: 1, max: 5 });
        break;
      case 'review':
        const rating = faker.number.int({ min: 3, max: 5 });
        description = `${rating}-star review for ${faker.commerce.productName()}`;
        metadata.rating = rating;
        break;
      case 'support':
        description = `Support ticket: ${faker.helpers.arrayElement(['Shipping inquiry', 'Return request', 'Technical issue', 'Billing question'])}`;
        metadata.priority = faker.helpers.arrayElement(['low', 'medium', 'high']);
        break;
    }
    
    activities.push({
      id: faker.string.uuid(),
      type,
      description,
      timestamp: timestamp.toISOString(),
      metadata,
    });
  }
  
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function generateRevenueChartData(): ChartData {
  const salesData = generateSalesData(30);
  return {
    labels: salesData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Revenue',
        data: salesData.map(d => d.revenue),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Orders',
        data: salesData.map(d => d.orders * 50),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
}

export function generateTrafficChartData(): ChartData {
  const points = generateTimeSeriesPoints(24, 500, 200);
  return {
    labels: points.map(p => p.label || ''),
    datasets: [{
      label: 'Hourly Visitors',
      data: points.map(p => p.value),
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };
}

export function generateConversionChartData(): ChartData {
  const categories = ['Direct', 'Organic', 'Paid', 'Social', 'Email', 'Referral'];
  return {
    labels: categories,
    datasets: [{
      label: 'Conversion Rate %',
      data: categories.map(() => faker.number.float({ min: 1, max: 6, fractionDigits: 2 })),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(6, 182, 212, 0.8)',
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(139, 92, 246)',
        'rgb(236, 72, 153)',
        'rgb(6, 182, 212)',
      ],
    }],
  };
}

export const mockDataService = {
  initialize: async () => {
    console.log('Initializing mock data service...');
    return true;
  },
  getMetrics: () => generateMetricCards(),
  getSalesData: (count?: number) => generateSalesData(count),
  getTopProducts: (count?: number) => generateTopProducts(count),
  getTrafficSources: () => generateTrafficSources(),
  getGeoData: () => generateGeoData(),
  getRecentActivity: (count?: number) => generateRecentActivity(count),
  getRevenueChart: () => generateRevenueChartData(),
  getTrafficChart: () => generateTrafficChartData(),
  getConversionChart: () => generateConversionChartData(),
  getOrders: (params: {
    page: number;
    pageSize: number;
    sortField: string;
    sortDirection: 'asc' | 'desc';
    filters: Record<string, unknown>;
    search?: string;
  }) => generateOrdersData(params),
  getUsers: (params: {
    page: number;
    pageSize: number;
    sortField: string;
    sortDirection: 'asc' | 'desc';
    filters: Record<string, unknown>;
    search?: string;
  }) => generateUsersData(params),
};

export function generateOrdersData(params: {
  page: number;
  pageSize: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  filters: Record<string, unknown>;
  search?: string;
}): { data: OrderRow[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } } {
  const { page, pageSize, sortField, sortDirection, filters, search } = params;
  
  // Generate full dataset
  const total = 500;
  const data: OrderRow[] = [];
  for (let i = 0; i < total; i++) {
    const date = new Date(Date.now() - faker.number.int({ min: 0, max: 90 * 24 * 60 * 60 * 1000 }));
    const quantity = faker.number.int({ min: 1, max: 5 });
    const unitPrice = faker.number.float({ min: 15, max: 500, fractionDigits: 2 });
    
    data.push({
      id: `ord_${String(i + 1).padStart(6, '0')}`,
      customer: faker.person.fullName(),
      email: faker.internet.email(),
      product: faker.commerce.productName(),
      quantity,
      total: Math.round(quantity * unitPrice * 100) / 100,
      status: faker.helpers.arrayElement(ORDER_STATUSES),
      date: date.toISOString().split('T')[0],
    });
  }
  
  let filtered = data;
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(o => 
      o.customer.toLowerCase().includes(s) ||
      o.email.toLowerCase().includes(s) ||
      o.product.toLowerCase().includes(s) ||
      o.id.toLowerCase().includes(s)
    );
  }
  if (filters.status) filtered = filtered.filter(o => o.status === filters.status);
  
  filtered.sort((a, b) => {
    const aVal = a[sortField as keyof OrderRow];
    const bVal = b[sortField as keyof OrderRow];
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  
  return { data: paginated, pagination: { page, pageSize, total: filtered.length, totalPages } };
}

export function generateUsersData(params: {
  page: number;
  pageSize: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  filters: Record<string, unknown>;
  search?: string;
}): { data: UserRow[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } } {
  const { page, pageSize, sortField, sortDirection, filters, search } = params;
  
  const total = 200;
  const data: UserRow[] = [];
  const roles = ['admin', 'user', 'moderator', 'viewer'] as const;
  const statuses = ['active', 'inactive', 'pending', 'suspended'] as const;
  
  for (let i = 0; i < total; i++) {
    const createdAt = new Date(Date.now() - faker.number.int({ min: 0, max: 365 * 24 * 60 * 60 * 1000 }));
    const lastLogin = faker.datatype.boolean(0.8) 
      ? new Date(Date.now() - faker.number.int({ min: 0, max: 30 * 24 * 60 * 60 * 1000 }))
      : new Date(createdAt.getTime() + faker.number.int({ min: 0, max: 7 * 24 * 60 * 60 * 1000 }));
    
    data.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(roles),
      status: faker.helpers.arrayElement(statuses),
      lastLogin: lastLogin.toISOString(),
      createdAt: createdAt.toISOString(),
    });
  }
  
  let filtered = data;
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(u => 
      u.name.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s) ||
      u.id.toLowerCase().includes(s)
    );
  }
  if (filters.role) filtered = filtered.filter(u => u.role === filters.role);
  if (filters.status) filtered = filtered.filter(u => u.status === filters.status);
  
  filtered.sort((a, b) => {
    const aVal = a[sortField as keyof UserRow];
    const bVal = b[sortField as keyof UserRow];
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  
  return { data: paginated, pagination: { page, pageSize, total: filtered.length, totalPages } };
}
