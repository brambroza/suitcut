import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { Customer, useCustomerContext } from '../customers/CustomerContext';

const CustomerPicker = ({
  selectedCustomerId,
  onSelect
}: {
  selectedCustomerId?: string;
  onSelect: (customer: Customer) => void;
}) => {
  const { customers, addCustomer } = useCustomerContext();
  const [open, setOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    name: '',
    phone: '',
    email: '',
    hotel: '',
    room: ''
  });

  const selected = customers.find((c) => c.id === selectedCustomerId);

  const handleCreate = () => {
    if (!newCustomer.name.trim()) return;
    const created = addCustomer({ ...newCustomer, name: newCustomer.name.trim() });
    onSelect(created);
    setNewCustomer({ name: '', phone: '', email: '', hotel: '', room: '' });
    setOpen(false);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="subtitle1">Step 2: เลือก/เพิ่มลูกค้า</Typography>
          <TextField
            select
            label="เลือกลูกค้า"
            value={selectedCustomerId ?? ''}
            onChange={(e) => {
              const customer = customers.find((c) => c.id === e.target.value);
              if (customer) onSelect(customer);
            }}
            size="small"
          >
            {customers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.name} {customer.phone ? `• ${customer.phone}` : ''}
              </MenuItem>
            ))}
          </TextField>
          {selected && (
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                {selected.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tel: {selected.phone || '—'} | Email: {selected.email || '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hotel: {selected.hotel || '—'} Room: {selected.room || '—'}
              </Typography>
            </Box>
          )}
          <Button variant="outlined" size="small" onClick={() => setOpen(true)}>
            เพิ่มลูกค้าใหม่
          </Button>
        </Stack>
      </CardContent>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>เพิ่มลูกค้าใหม่</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} mt={1}>
            <TextField
              label="ชื่อ"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer((p) => ({ ...p, name: e.target.value }))}
              required
              autoFocus
            />
            <TextField
              label="เบอร์"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer((p) => ({ ...p, phone: e.target.value }))}
            />
            <TextField
              label="อีเมล"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer((p) => ({ ...p, email: e.target.value }))}
            />
            <TextField
              label="โรงแรม"
              value={newCustomer.hotel}
              onChange={(e) => setNewCustomer((p) => ({ ...p, hotel: e.target.value }))}
            />
            <TextField
              label="ห้อง"
              value={newCustomer.room}
              onChange={(e) => setNewCustomer((p) => ({ ...p, room: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>ยกเลิก</Button>
          <Button onClick={handleCreate} variant="contained">
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CustomerPicker;
