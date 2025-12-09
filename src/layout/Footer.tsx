import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

const navItems = [
  { label: 'Dashboard', icon: <HomeIcon />, path: '/' },
  { label: 'Orders', icon: <AssignmentIcon />, path: '/orders' },
  { label: 'Completed', icon: <CheckCircleIcon />, path: '/completed' }
];

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentIndex = useMemo(
    () => navItems.findIndex((item) => location.pathname === item.path),
    [location.pathname]
  );

  return (
    <Paper elevation={6} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation
        showLabels
        value={currentIndex < 0 ? 0 : currentIndex}
        onChange={(_, newValue) => navigate(navItems[newValue].path)}
      >
        {navItems.map((item) => (
          <BottomNavigationAction key={item.path} label={item.label} icon={item.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default Footer;
