import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import AgentSelector from '../components/AgentSelector';
import { useAgent } from '../auth/AgentContext';
import StatusBoard from '../components/StatusBoard'; 
import { useOrdersContext } from '../hooks/OrdersContext';

const DashboardPage = () => {
  const { selectedAgent } = useAgent();
  const { addOrder, statusCounts } = useOrdersContext();

  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6">Sales Agent</Typography>
          <Box mt={1}>
            <AgentSelector />
          </Box>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Currently managing orders for {selectedAgent.shop}.
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Health
          </Typography>
          <StatusBoard counts={statusCounts} />
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tailor Flow (ตามแผนภาพ)
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            ใช้เพื่อไล่สถานะ order ให้ตรงกับ flow intake → cutting → fitting → deliver.
          </Typography>
          <Divider sx={{ my: 1.5 }} />
          <Stack spacing={1}>
            <Typography variant="subtitle2">Intake</Typography>
            <Typography variant="body2" color="text.secondary">
              1) รับบัตร/ID → 2) ถ่ายรูป OCR → 3) สร้าง/ตรวจลูกค้า → 4) เก็บ order (type/design/fabric/qty) → 5)
              คำนวณผ้า → 6) พิมพ์ใบสำหรับช่าง
            </Typography>
            <Typography variant="subtitle2">Production</Typography>
            <Typography variant="body2" color="text.secondary">
              7) Cutting fabric → 8) Tailor processing → 9) Fitting process → 10) Final cutting → 11) Final fitting →
              12) Fit check (หากไม่พอดี ย้อนกลับไป Final cutting)
            </Typography>
            <Typography variant="subtitle2">Handover</Typography>
            <Typography variant="body2" color="text.secondary">
              13) ส่งกระดาษช่างกลับ → 14) ถ่าย/สแกนเข้า system → 15) Deliver & billing → 16) Completed
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default DashboardPage;
