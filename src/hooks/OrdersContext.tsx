import { createContext, PropsWithChildren, useContext } from 'react';
import { useOrders } from './useOrders';

const OrdersContext = createContext<ReturnType<typeof useOrders> | undefined>(undefined);

export const OrdersProvider = ({ children }: PropsWithChildren) => {
  const value = useOrders();
  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

export const useOrdersContext = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrdersContext must be used inside OrdersProvider');
  }
  return context;
};
