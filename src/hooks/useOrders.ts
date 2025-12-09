import { useMemo, useState } from 'react';
import { createOrder, Order, OrderStatus, statusOptions } from '../actions/orderActions';
import { OrderFormValues } from '../pages/OrderFormPage';

const initialOrders: Order[] = [
  {
    id: 'o1',
    orderNumber: '03527',
    date: '2024-12-18',
    fitting: 'Tomorrow 3PM',
    pickUp: 'Dec 22, 5PM',
    name: 'Jordan Blake',
    hotel: 'Four Seasons',
    room: '1203',
    address: 'Lobby concierge desk',
    mobile: '+66 89 555 0012',
    email: 'jordan@example.com',
    lines: [
      { description: 'Navy wool suit - peak lapel, double vent', amount: '18000' },
      { description: 'White pinpoint shirt', amount: '1800' },
      { description: 'Alteration: shorten sleeves', amount: '300' }
    ],
    total: '20100',
    deposit: '5000',
    balance: '15100',
    fabricType: 'Navy wool',
    fabricPerItem: '3.2',
    quantity: '1',
    fabricTotal: '3.2',
    agentId: 'a1',
    status: 'Intake: ID / Name Card',
    createdAt: new Date().toISOString(),
    attachment: undefined
  }
];

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const addOrder = (values: OrderFormValues, attachment?: string) => {
    const newOrder = createOrder(values, attachment);
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)));
  };

  const statusCounts = useMemo(
    () =>
      statusOptions.map((status) => ({
        status,
        count: orders.filter((order) => order.status === status).length
      })),
    [orders]
  );

  return { orders, addOrder, updateStatus, statusCounts };
};
