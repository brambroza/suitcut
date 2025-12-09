import { Box, Container } from '@mui/material';
import { PropsWithChildren } from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }: PropsWithChildren) => (
  <Box sx={{ minHeight: '100vh', background: '#f7f7f7' }}>
    <Header />
    <Container maxWidth="md" sx={{  flex: 1, pb: 9, pt: 3 }}>
      {children}
    </Container>
    <Footer />
  </Box>
);

export default MainLayout;
