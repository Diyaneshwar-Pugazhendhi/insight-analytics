import axios from 'axios';
import type {
  ActivityResponse,
  DashboardResponse,
  HealthResponse,
  PaginatedOrders,
  PaginatedUsers,
  ProductsResponse,
  SalesResponse,
  TableQuery,
  TrafficResponse,
} from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
// Sent as a Bearer token / x-api-key to authenticate with the backend.
// Defaults to the local dev key so the app runs with no setup; override with
// VITE_API_KEY (and the backend's API_KEY) in production.
const API_KEY = import.meta.env.VITE_API_KEY || 'dev-key-change-me';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
  timeout: 15000,
});

export async function getHealth() {
  const { data } = await api.get<HealthResponse>('/health');
  return data;
}

export async function getDashboard() {
  const { data } = await api.get<DashboardResponse>('/dashboard');
  return data;
}

export async function getMetrics() {
  const { data } = await api.get<DashboardResponse['metrics']>('/metrics');
  return data;
}

export async function getSales(period: '7d' | '30d' | '90d' | '1y' = '30d') {
  const { data } = await api.get<SalesResponse>('/sales', { params: { period } });
  return data;
}

export async function getProducts() {
  const { data } = await api.get<ProductsResponse>('/products');
  return data;
}

export async function getTraffic() {
  const { data } = await api.get<TrafficResponse>('/traffic');
  return data;
}

export async function getActivity(limit = 20) {
  const { data } = await api.get<ActivityResponse>('/activity', { params: { limit } });
  return data;
}

export async function getOrders(query: TableQuery = {}) {
  const { data } = await api.get<PaginatedOrders>('/orders', { params: query });
  return data;
}

export async function getUsers(query: TableQuery = {}) {
  const { data } = await api.get<PaginatedUsers>('/users', { params: query });
  return data;
}
