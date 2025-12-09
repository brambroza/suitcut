import type React from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Stack,
  Typography
} from '@mui/material';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useAgent } from '../auth/AgentContext';
import CustomerPicker from '../components/CustomerPicker';

type OrderLine = { description: string; amount: string };

export type OrderFormValues = {
  orderNumber: string;
  date: string;
  fitting: string;
  pickUp: string;
  name: string;
  hotel: string;
  room: string;
  address: string;
  mobile: string;
  email: string;
  lines: OrderLine[];
  total: string;
  deposit: string;
  balance: string;
  fabricType?: string;
  fabricPerItem?: string;
  quantity?: string;
  fabricTotal?: string;
  agentId: string;
};

type Props = {
  onSubmit: (values: OrderFormValues, attachment?: string) => void;
  compact?: boolean;
};

type Point = { x: number; y: number; pressure: number };

const blankLine: OrderLine = { description: '', amount: '' };

const generateOrderNumber = () => Math.floor(Math.random() * 99999)
  .toString()
  .padStart(5, '0');

const blueInk = '#1c2a52';

const linedInputStyles = {
  flex: 1,
  borderBottom: `1.5px solid ${blueInk}`,
  pb: 0.75,
  px: 1,
  borderRadius: 0,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: 0,
    fontSize: 16,
    letterSpacing: 0.2,
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif'
  },
  '& input[type="date"]::-webkit-calendar-picker-indicator': {
    filter: 'grayscale(1)'
  }
};

const labelStyles = {
  fontSize: 13,
  fontWeight: 700,
  color: blueInk,
  letterSpacing: 0.6,
  fontFamily: '"Georgia", "Times New Roman", serif',
  whiteSpace: 'nowrap'
};

const paperStyles = {
  background: 'linear-gradient(180deg, #fdfdfb 0%, #f7f8fb 100%)',
  border: '1px solid #d5d7e3',
  boxShadow: '0 10px 30px rgba(17, 24, 39, 0.08)',
  borderRadius: 1,
  p: { xs: 2, sm: 3 },
  position: 'relative'
};

const canvasStyle = {
  position: 'absolute',
  inset: 0,
  borderRadius: 1,
  zIndex: 2,
  background: 'transparent'
};

const LinedField = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  inputProps
}: {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
    <Typography sx={labelStyles}>{label}</Typography>
    <InputBase
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      inputProps={inputProps}
      required={required}
      sx={linedInputStyles}
    />
  </Box>
);

const OrderFormPage = ({ onSubmit, compact = false }: Props) => {
  const { selectedAgent } = useAgent();
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [cardImage, setCardImage] = useState<string | undefined>(undefined);
  const [cardExtract, setCardExtract] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(undefined);
  const [values, setValues] = useState<OrderFormValues>({
    orderNumber: generateOrderNumber(),
    date: new Date().toISOString().slice(0, 10),
    fitting: '',
    pickUp: '',
    name: '',
    hotel: '',
    room: '',
    address: '',
    mobile: '',
    email: '',
    lines: Array.from({ length: 3 }, () => ({ ...blankLine })),
    total: '',
    deposit: '',
    balance: '',
    fabricType: '',
    fabricPerItem: '',
    quantity: '',
    fabricTotal: '',
    agentId: selectedAgent.id
  });
  const [attachment, setAttachment] = useState<string | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [drawMode, setDrawMode] = useState(false);
  const drawing = useRef(false);
  const lastPoint = useRef<Point | null>(null);

  useEffect(() => {
    setValues((prev) => ({ ...prev, agentId: selectedAgent.id }));
  }, [selectedAgent.id]);

  useEffect(() => {
    const syncCanvas = () => {
      const sheet = sheetRef.current;
      const canvas = canvasRef.current;
      if (!sheet || !canvas) return;
      const rect = sheet.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#1f1f1f';
        ctx.lineWidth = 2.5;
        contextRef.current = ctx;
      }
    };
    syncCanvas();
    window.addEventListener('resize', syncCanvas);
    return () => window.removeEventListener('resize', syncCanvas);
  }, [values.lines.length]);

  const drawLine = useCallback((from: Point, to: Point) => {
    const ctx = contextRef.current;
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.lineWidth = Math.max(1.5, 4 * to.pressure);
    ctx.stroke();
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawMode) return;
    drawing.current = true;
    const rect = event.currentTarget.getBoundingClientRect();
    lastPoint.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      pressure: event.pressure || 0.5
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawMode || !drawing.current || !lastPoint.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const newPoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      pressure: event.pressure || 0.5
    };
    drawLine(lastPoint.current, newPoint);
    lastPoint.current = newPoint;
  };

  const handlePointerUp = () => {
    drawing.current = false;
    lastPoint.current = null;
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setAttachment(undefined);
    }
  };

  const handleSaveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setAttachment(dataUrl);
    }
  };

  const handleFieldChange =
    (field: Exclude<keyof OrderFormValues, 'lines'>) =>
      (event: React.ChangeEvent<HTMLInputElement>) =>
        setValues((prev) => ({ ...prev, [field]: event.target.value }));

  const handleLineChange =
    (index: number, key: keyof OrderLine) => (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => {
        const lines = [...prev.lines];
        lines[index] = { ...lines[index], [key]: event.target.value };
        return { ...prev, lines };
      });

  const handleAddLine = () => {
    setValues((prev) => ({ ...prev, lines: [...prev.lines, { ...blankLine }] }));
  };

  const handleFabricChange = (field: 'fabricType' | 'fabricPerItem' | 'quantity') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value;
      setValues((prev) => {
        const next = { ...prev, [field]: rawValue };
        const qty = parseFloat(next.quantity || '0');
        const per = parseFloat(next.fabricPerItem || '0');
        const total = qty && per ? (qty * per).toFixed(2) : '';
        return { ...next, fabricTotal: total };
      });
    };

  const applyCardToForm = () => {
    setValues((prev) => ({
      ...prev,
      name: cardExtract.name ?? prev.name,
      mobile: cardExtract.phone ?? prev.mobile,
      email: cardExtract.email ?? prev.email
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const latestAttachment = attachment ?? canvasRef.current?.toDataURL('image/png');
    onSubmit(values, latestAttachment);
    setValues({
      orderNumber: generateOrderNumber(),
      date: new Date().toISOString().slice(0, 10),
      fitting: '',
      pickUp: '',
      name: '',
      hotel: '',
      room: '',
      address: '',
      mobile: '',
      email: '',
      lines: Array.from({ length: 3 }, () => ({ ...blankLine })),
      total: '',
      deposit: '',
      balance: '',
      fabricType: '',
      fabricPerItem: '',
      quantity: '',
      fabricTotal: '',
      agentId: selectedAgent.id
    });
    setAttachment(undefined);
    handleClearCanvas();
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} component="form" onSubmit={handleSubmit}>
          <Box display="flex" justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Box>
              <Typography variant={compact ? 'h6' : 'h5'}>Sales Order Sheet</Typography>
              <Typography variant="body2" color="text.secondary">
                Step 1) OCR นามบัตร → Step 2) เลือกลูกค้า → Step 3) ฟอร์ม → Step 4) คำนวณผ้า
              </Typography>
            </Box>
            <Stack spacing={1} alignItems="flex-end">
              <Box textAlign="right">
                <Typography sx={{ ...labelStyles, fontSize: 12 }}>ORDER NO.</Typography>
                <Typography sx={{ color: '#c24836', fontWeight: 700, letterSpacing: 2, fontSize: 22 }}>
                  {values.orderNumber}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button
                  variant={drawMode ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setDrawMode((prev) => !prev)}
                >
                  {drawMode ? 'Draw mode: on' : 'Draw mode: off'}
                </Button>
                <Button variant="outlined" size="small" onClick={handleClearCanvas}>
                  Clear
                </Button>
                <Button variant="outlined" size="small" onClick={handleSaveCanvas}>
                  Save
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Step 1: OCR นามบัตร / แนบรูป
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
                <Button variant="outlined" component="label">
                  แนบรูปบัตร
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setCardImage(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </Button>
                <Button
                  variant="text"
                  onClick={() =>
                    setCardExtract({
                      name: 'Sample OCR Name',
                      phone: '+66 81 000 0000',
                      email: 'ocr@example.com'
                    })
                  }
                >
                  จำลอง OCR
                </Button>
                <Button variant="outlined" onClick={applyCardToForm} disabled={!cardExtract.name && !cardExtract.phone && !cardExtract.email}>
                  เติมข้อมูลลงฟอร์ม
                </Button>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    ข้อมูลจากบัตร (แก้ไขได้)
                  </Typography>
                  <Stack spacing={1} mt={0.5}>
                    <InputBase
                      placeholder="Name"
                      value={cardExtract.name ?? ''}
                      onChange={(e) => setCardExtract((p) => ({ ...p, name: e.target.value }))}
                      sx={{ px: 1, py: 0.5, border: '1px solid #e0e0e0', borderRadius: 1 }}
                    />
                    <InputBase
                      placeholder="Phone"
                      value={cardExtract.phone ?? ''}
                      onChange={(e) => setCardExtract((p) => ({ ...p, phone: e.target.value }))}
                      sx={{ px: 1, py: 0.5, border: '1px solid #e0e0e0', borderRadius: 1 }}
                    />
                    <InputBase
                      placeholder="Email"
                      value={cardExtract.email ?? ''}
                      onChange={(e) => setCardExtract((p) => ({ ...p, email: e.target.value }))}
                      sx={{ px: 1, py: 0.5, border: '1px solid #e0e0e0', borderRadius: 1 }}
                    />
                  </Stack>
                </Box>
                {cardImage && (
                  <Box
                    component="img"
                    src={cardImage}
                    alt="card preview"
                    sx={{ width: 220, borderRadius: 1, border: '1px solid #e0e0e0' }}
                  />
                )}
              </Stack>
            </CardContent>
          </Card>

          <CustomerPicker
            selectedCustomerId={selectedCustomerId}
            onSelect={(customer) => {
              setSelectedCustomerId(customer.id);
              setValues((prev) => ({
                ...prev,
                name: customer.name,
                mobile: customer.phone ?? prev.mobile,
                email: customer.email ?? prev.email,
                hotel: customer.hotel ?? prev.hotel,
                room: customer.room ?? prev.room
              }));
            }}
          />

          <Box sx={{ position: 'relative' }} ref={sheetRef}>
            <Box sx={paperStyles}>
              <Stack spacing={2.5}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={7}>
                    <LinedField
                      label="NAME"
                      required
                      value={values.name}
                      onChange={handleFieldChange('name')}
                      placeholder="Customer name"
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <LinedField
                      label="DATE"
                      required
                      value={values.date}
                      onChange={handleFieldChange('date')}
                      inputProps={{ type: 'date' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LinedField
                      label="HOTEL"
                      value={values.hotel}
                      onChange={handleFieldChange('hotel')}
                      placeholder="Hotel name"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <LinedField
                      label="ROOM #"
                      value={values.room}
                      onChange={handleFieldChange('room')}
                      placeholder="1203"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <LinedField
                      label="FITTING"
                      value={values.fitting}
                      onChange={handleFieldChange('fitting')}
                      placeholder="Fitting date/time"
                    />
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <LinedField
                      label="ADDRESS"
                      value={values.address}
                      onChange={handleFieldChange('address')}
                      placeholder="Delivery address"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <LinedField
                      label="PICK UP"
                      value={values.pickUp}
                      onChange={handleFieldChange('pickUp')}
                      placeholder="Pick up date"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LinedField
                      label="MOBILE #"
                      value={values.mobile}
                      onChange={handleFieldChange('mobile')}
                      placeholder="+66 8x xxx xxxx"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LinedField
                      label="E-MAIL #"
                      value={values.email}
                      onChange={handleFieldChange('email')}
                      placeholder="contact@example.com"
                    />
                  </Grid>
                </Grid>

                <Divider />

                <Box
                  sx={{
                    border: `1.5px solid ${blueInk}`,
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.04)'
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 0.22fr',
                      background: 'rgba(28,42,82,0.08)',
                      color: blueInk,
                      fontWeight: 700,
                      letterSpacing: 0.8,
                      px: 2,
                      py: 0.75,
                      fontFamily: '"Georgia", "Times New Roman", serif'
                    }}
                  >
                    <Box />
                    <Box textAlign="center">BAHT</Box>
                  </Box>

                  {values.lines.map((line, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 0.22fr',
                        borderTop: `1px solid ${blueInk}`,
                        alignItems: 'center'
                      }}
                    >
                      <InputBase
                        value={line.description}
                        onChange={handleLineChange(index, 'description')}
                        placeholder="รายการ / garment / fitting note"
                        sx={{
                          px: 2,
                          py: 1.1,
                          fontSize: 16,
                          fontFamily: '"Inter", "Helvetica", "Arial", sans-serif'
                        }}
                      />
                      <InputBase
                        value={line.amount}
                        onChange={handleLineChange(index, 'amount')}
                        placeholder="0"
                        inputProps={{ inputMode: 'decimal' }}
                        sx={{
                          px: 2,
                          py: 1.1,
                          fontSize: 16,
                          fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                          borderLeft: `1px solid ${blueInk}`,
                          textAlign: 'right'
                        }}
                      />
                    </Box>
                  ))}

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      px: 1,
                      py: 0.5
                    }}
                  >
                    <IconButton color="primary" size="small" onClick={handleAddLine}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', ml: 0.5 }}>
                      Add another line
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 0.22fr',
                      borderTop: `1.5px solid ${blueInk}`
                    }}
                  >
                    <Box
                      sx={{
                        borderRight: `1.5px solid ${blueInk}`,
                        px: 2,
                        py: 2,
                        display: 'grid',
                        gap: 1.2
                      }}
                    >
                      <Typography sx={{ ...labelStyles, fontSize: 12, color: '#4b4f66' }}>Fabric</Typography>
                      <InputBase
                        placeholder="ประเภทผ้า"
                        value={values.fabricType}
                        onChange={handleFabricChange('fabricType')}
                        sx={{ px: 1, py: 0.5, border: '1px dashed #d0d4e4', borderRadius: 1 }}
                      />
                      <Stack direction="row" spacing={1}>
                        <InputBase
                          placeholder="เมตร/ตัว"
                          value={values.fabricPerItem}
                          onChange={handleFabricChange('fabricPerItem')}
                          inputProps={{ inputMode: 'decimal' }}
                          sx={{ px: 1, py: 0.5, border: '1px dashed #d0d4e4', borderRadius: 1, flex: 1 }}
                        />
                        <InputBase
                          placeholder="จำนวนตัว"
                          value={values.quantity}
                          onChange={handleFabricChange('quantity')}
                          inputProps={{ inputMode: 'decimal' }}
                          sx={{ px: 1, py: 0.5, border: '1px dashed #d0d4e4', borderRadius: 1, width: 120 }}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        รวมใช้ผ้า: {values.fabricTotal || '—'} m
                      </Typography>
                    </Box>
                    <Box sx={{ px: 2, py: 1.2, display: 'grid', gap: 1.2 }}>
                      <LinedField
                        label="BAHT"
                        value={values.total}
                        onChange={handleFieldChange('total')}
                        placeholder="0"
                      />
                      <LinedField
                        label="DEPOSITE"
                        value={values.deposit}
                        onChange={handleFieldChange('deposit')}
                        placeholder="0"
                      />
                      <LinedField
                        label="BALANCE"
                        value={values.balance}
                        onChange={handleFieldChange('balance')}
                        placeholder="0"
                      />
                    </Box>
                  </Box>
                </Box>

                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                  <Button type="submit" variant="contained" color="primary">
                    Submit Order
                  </Button>
                </Stack>
              </Stack>
            </Box>

            <Box
              sx={{ ...canvasStyle, touchAction: 'none', pointerEvents: drawMode ? 'auto' : 'none' }}
              component="canvas"
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OrderFormPage;
