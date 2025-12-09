import { Chip } from '@mui/material';
import { OrderStatus } from '../actions/orderActions';

const statusColors: Record<OrderStatus, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
  'Intake: ID / Name Card': 'warning',
  'OCR Captured': 'warning',
  'Customer Verified': 'primary',
  'Order Info Collected': 'primary',
  'Fabric Calculated': 'secondary',
  'Printed For Tailor': 'secondary',
  'Cutting Fabric': 'secondary',
  'Tailor Processing': 'secondary',
  'Fitting Process': 'info',
  'Final Cutting': 'info',
  'Final Fitting': 'info',
  'Fit Check': 'warning',
  'Tailor Final Paper Sent': 'primary',
  'Final Paper Scanned': 'primary',
  'Deliver & Billing': 'success',
  Completed: 'success'
};

const StatusBadge = ({ status }: { status: OrderStatus }) => (
  <Chip label={status} color={statusColors[status]} variant="outlined" size="small" sx={{ fontWeight: 600 }} />
);

export default StatusBadge;
