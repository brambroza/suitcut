import { Box, Button, Stack, Typography } from '@mui/material';
import OrderCard from '../components/OrderCard';
import { useOrdersContext } from '../hooks/OrdersContext';
import OrderFormPage from './OrderFormPage';
import { useState } from 'react';
import { OrderStatus } from '../actions/orderActions';

const OrdersPage = ({ filter }: { filter?: OrderStatus }) => {
  const { orders, addOrder, updateStatus } = useOrdersContext();
  const [showForm, setShowForm] = useState(false);

  const visibleOrders = filter ? orders.filter((order) => order.status === filter) : orders;

  return (
    <Stack spacing={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">{filter ? `${filter} Orders` : 'Orders'}</Typography>
        <Button variant="contained" color="primary" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? 'Close Form' : 'New Order'}
        </Button>
      </Box>

      {showForm && <OrderFormPage onSubmit={addOrder} compact />}

      {visibleOrders.map((order) => (
        <OrderCard key={order.id} order={order} onStatusChange={(status) => updateStatus(order.id, status)} />
      ))}

      {!visibleOrders.length && (
        <Typography variant="body2" color="text.secondary">
          No orders in this stage yet.
        </Typography>
      )}
    </Stack>
  );
};

export default OrdersPage;
