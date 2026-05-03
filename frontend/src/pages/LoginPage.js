// pages/LoginPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, Box, TextField, Button, Typography, Alert, Paper
} from '@mui/material';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Unesite email i lozinku.');
      return;
    }

    try {
      setLoading(true);
      const data = await authService.login(email, password);
      
      // Dekodiramo token da dobijemo podatke o korisniku
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const user = {
        id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        role: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role']
      };

      login(user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Neispravni pristupni podaci.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Travel Planner
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            Prijava
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Lozinka"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Prijava...' : 'Prijavi se'}
            </Button>
          </Box>

          <Typography align="center" sx={{ mt: 2 }}>
            Nemate nalog?{' '}
            <Link to="/register">Registrujte se</Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}