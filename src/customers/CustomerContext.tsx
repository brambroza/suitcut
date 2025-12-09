import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

export type Customer = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  hotel?: string;
  room?: string;
};

type CustomerContextValue = {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => Customer;
};

const CustomerContext = createContext<CustomerContextValue | undefined>(undefined);

const initialCustomers: Customer[] = [
  { id: 'c1', name: 'Jordan Blake', phone: '+66 89 555 0012', email: 'jordan@example.com', hotel: 'Four Seasons', room: '1203' },
  { id: 'c2', name: 'Riley Chen', phone: '+66 82 111 2222', email: 'riley@example.com' }
];

export const CustomerProvider = ({ children }: PropsWithChildren) => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const created: Customer = { ...customer, id: crypto.randomUUID() };
    setCustomers((prev) => [created, ...prev]);
    return created;
  };

  const value = useMemo(() => ({ customers, addCustomer }), [customers]);

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
};

export const useCustomerContext = () => {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomerContext must be used within CustomerProvider');
  return ctx;
};
