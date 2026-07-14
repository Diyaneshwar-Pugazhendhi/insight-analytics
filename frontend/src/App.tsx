import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DashboardPage } from '@/pages/DashboardPage';
import { SalesPage } from '@/pages/SalesPage';
import { ProductsPage } from '@/pages/ProductsPage';
import { TrafficPage } from '@/pages/TrafficPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { UsersPage } from '@/pages/UsersPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/traffic" element={<TrafficPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
