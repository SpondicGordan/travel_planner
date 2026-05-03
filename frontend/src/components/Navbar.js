// components/Navbar.js
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <FlightTakeoffIcon sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          Travel Planner
        </Typography>
        <Box>
          {user?.role === 'ADMIN' && (
            <Button color="inherit" onClick={() => navigate('/admin')}>
              Admin
            </Button>
          )}
          <Button color="inherit" onClick={handleLogout}>
            Odjavi se
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}