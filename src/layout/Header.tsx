import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => (
  <AppBar position="sticky" color="default">
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton edge="start" aria-label="menu" size="small">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div">
          SuitCut Orders
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        Bespoke Management
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
