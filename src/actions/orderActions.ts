import { OrderFormValues } from '../pages/OrderFormPage';

export type OrderStatus =
  | 'Intake: ID / Name Card'
  | 'OCR Captured'
  | 'Customer Verified'
  | 'Order Info Collected'
  | 'Fabric Calculated'
  | 'Printed For Tailor'
  | 'Cutting Fabric'
  | 'Tailor Processing'
  | 'Fitting Process'
  | 'Final Cutting'
  | 'Final Fitting'
  | 'Fit Check'
  | 'Tailor Final Paper Sent'
  | 'Final Paper Scanned'
  | 'Deliver & Billing'
  | 'Completed';

export type Order = OrderFormValues & {
  id: string;
  status: OrderStatus;
  createdAt: string;
  attachment?: string;
};

export const statusOptions: OrderStatus[] = [
  'Intake: ID / Name Card',
  'OCR Captured',
  'Customer Verified',
  'Order Info Collected',
  'Fabric Calculated',
  'Printed For Tailor',
  'Cutting Fabric',
  'Tailor Processing',
  'Fitting Process',
  'Final Cutting',
  'Final Fitting',
  'Fit Check',
  'Tailor Final Paper Sent',
  'Final Paper Scanned',
  'Deliver & Billing',
  'Completed'
];

export const createOrder = (values: OrderFormValues, attachment?: string): Order => ({
  ...values,
  id: crypto.randomUUID(),
  status: 'Intake: ID / Name Card',
  createdAt: new Date().toISOString(),
  attachment
});
