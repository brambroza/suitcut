import { Box, Card, CardContent, Chip, Stack, Typography, Button } from '@mui/material';
import { useMemo } from 'react';
import { useAgent } from '../auth/AgentContext';
import { Order, statusOptions } from '../actions/orderActions';
import StatusBadge from './StatusBadge';

const OrderCard = ({ order, onStatusChange }: { order: Order; onStatusChange: (status: Order['status']) => void }) => {
  const { agents } = useAgent();
  const nextStatus = useMemo(() => {
    const currentIndex = statusOptions.indexOf(order.status);
    return statusOptions[currentIndex + 1];
  }, [order.status]);

  const agent = agents.find((item) => item.id === order.agentId);
  const previewLines = order.lines.filter((line) => line.description).slice(0, 2);
  const canMarkNotFit = order.status === 'Final Fitting' || order.status === 'Fit Check';

  const handlePrint = () => {
    const win = window.open('', '_blank', 'width=900,height=1200');
    if (!win) return;
    const linesHtml = order.lines
      .filter((l) => l.description)
      .map((l) => `<tr><td>${l.description}</td><td style="text-align:right;">${l.amount || ''}</td></tr>`)
      .join('');
    win.document.write(`
      <html>
        <head>
          <title>Order ${order.orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1c2a52; }
            h1 { margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            td { border: 1px solid #ccd4e0; padding: 8px; }
            .muted { color: #6b7280; font-size: 13px; }
          </style>
        </head>
        <body>
          <h1>Order #${order.orderNumber}</h1>
          <div class="muted">Date: ${order.date || ''} • Agent: ${agent?.name ?? order.agentId}</div>
          <div class="muted">Customer: ${order.name} • Tel: ${order.mobile || ''} • Email: ${order.email || ''}</div>
          <div class="muted">Hotel: ${order.hotel || ''} Room: ${order.room || ''}</div>
          <table>
            <thead><tr><td>Description</td><td style="text-align:right;">Amount</td></tr></thead>
            <tbody>${linesHtml}</tbody>
          </table>
          <p>Total: ${order.total || '-'} | Deposit: ${order.deposit || '-'} | Balance: ${order.balance || '-'}</p>
          <p>Fabric: ${order.fabricType || '-'} | ${order.fabricPerItem ? `${order.fabricPerItem} m/ea` : '-'} | Qty: ${order.quantity || '-'} | Total: ${order.fabricTotal || '-'} m</p>
          <script>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box>
            <Typography variant="h6">
              {order.name}{' '}
              <Typography component="span" variant="subtitle2" color="text.secondary">
                #{order.orderNumber}
              </Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Agent: {agent?.name ?? order.agentId} • Date: {order.date || '—'}
            </Typography>
          </Box>
          <StatusBadge status={order.status} />
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Hotel: {order.hotel || '—'} • Room: {order.room || '—'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fitting: {order.fitting || '—'} • Pick up: {order.pickUp || '—'}
        </Typography>

        {previewLines.length > 0 && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {previewLines.map((line) => line.description).join(' • ')}
          </Typography>
        )}

        {(order.fabricType || order.fabricTotal) && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Fabric: {order.fabricType || '—'} • {order.fabricPerItem ? `${order.fabricPerItem} m/ea` : '—'} • Qty:{' '}
            {order.quantity || '—'} • Total: {order.fabricTotal || '—'} m
          </Typography>
        )}

        {(order.total || order.deposit || order.balance) && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Total: {order.total || '—'} | Deposit: {order.deposit || '—'} | Balance: {order.balance || '—'} Baht
          </Typography>
        )}

        {order.attachment && (
          <Box mt={1}>
            <Chip label="Canvas attachment saved" size="small" />
          </Box>
        )}
        {(nextStatus || canMarkNotFit) && (
          <Stack direction="row" gap={1} mt={1} flexWrap="wrap">
            {nextStatus && (
              <Chip
                label={`Next: ${nextStatus}`}
                onClick={() => onStatusChange(nextStatus)}
                variant="outlined"
                color="primary"
              />
            )}
            {canMarkNotFit && (
              <Chip
                label="Not fit → back to Final Cutting"
                onClick={() => onStatusChange('Final Cutting')}
                variant="outlined"
                color="warning"
              />
            )}
          </Stack>
        )}
        <Box mt={1}>
          <Button variant="outlined" size="small" onClick={handlePrint}>
            Export / Print
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
