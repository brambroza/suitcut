import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { statusOptions } from '../actions/orderActions';

const StatusBoard = ({ counts }: { counts: { status: string; count: number }[] }) => (
  <Grid container spacing={2} sx={{ mt: 1 }}>
    {statusOptions.map((status) => {
      const record = counts.find((item) => item.status === status);
      return (
        <Grid item xs={6} sm={4} key={status}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {status}
              </Typography>
              <Box display="flex" alignItems="baseline" gap={0.5}>
                <Typography variant="h4">{record?.count ?? 0}</Typography>
                <Typography variant="caption" color="text.secondary">
                  orders
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      );
    })}
  </Grid>
);

export default StatusBoard;
