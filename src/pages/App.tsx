import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import DashboardPage from './DashboardPage';
import OrdersPage from './OrdersPage';
import { OrdersProvider } from '../hooks/OrdersContext';

const App = () => (
  <OrdersProvider>
    <MainLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/completed" element={<OrdersPage filter="Completed" />} />
        <Route path="*" element={<DashboardPage />} />
      </Routes>
    </MainLayout>
  </OrdersProvider>
);

export default App;
