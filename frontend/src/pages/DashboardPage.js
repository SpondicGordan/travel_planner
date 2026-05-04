// pages/DashboardPage.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button, Grid, Card, CardContent,
  CardActions, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import Navbar from '../components/Navbar';
import { tripService } from '../services/tripService';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    notes: ''
  });

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await tripService.getAll();
      setTrips(data);
    } catch (err) {
      setError('Greška pri učitavanju planova.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setForm({ name: '', description: '', startDate: '', endDate: '', budget: '', notes: '' });
    setFormError('');
    setOpenDialog(true);
  };

  const handleCreate = async () => {
    setFormError('');

    if (!form.name || !form.startDate || !form.endDate || !form.budget) {
      setFormError('Naziv, datumi i budžet su obavezni.');
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setFormError('Krajnji datum ne može biti prije početnog.');
      return;
    }

    if (parseFloat(form.budget) < 0) {
      setFormError('Budžet ne može biti negativan.');
      return;
    }

    try {
      await tripService.create({
        ...form,
        budget: parseFloat(form.budget)
      });
      setOpenDialog(false);
      loadTrips();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Greška pri kreiranju plana.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite obrisati ovaj plan?')) return;
    try {
      await tripService.delete(id);
      loadTrips();
    } catch (err) {
      setError('Greška pri brisanju plana.');
    }
  };

  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Moji planovi putovanja</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
            Novi plan
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : trips.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <FlightTakeoffIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Nemate još nijedan plan putovanja.
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleOpenDialog}>
              Kreirajte prvi plan
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {trips.map((trip) => (
              <Grid item xs={12} sm={6} md={4} key={trip.id}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{trip.name}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {trip.description}
                    </Typography>
                    <Typography variant="body2">
                      📅 {new Date(trip.startDate).toLocaleDateString('sr-RS')} —{' '}
                      {new Date(trip.endDate).toLocaleDateString('sr-RS')}
                    </Typography>
                    <Typography variant="body2">
                      💰 Budžet: {trip.budget} €
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/trips/${trip.id}`)}>
                      Otvori
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(trip.id)}>
                      Obriši
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Dialog za kreiranje plana */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Novi plan putovanja</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{formError}</Alert>}
          <TextField fullWidth label="Naziv" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            margin="normal" required />
          <TextField fullWidth label="Opis" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            margin="normal" multiline rows={2} />
          <TextField fullWidth label="Početni datum" type="date" value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            margin="normal" InputLabelProps={{ shrink: true }} required />
          <TextField fullWidth label="Krajnji datum" type="date" value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            margin="normal" InputLabelProps={{ shrink: true }} required />
          <TextField fullWidth label="Budžet (€)" type="number" value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            margin="normal" required />
          <TextField fullWidth label="Napomene" value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            margin="normal" multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Otkaži</Button>
          <Button variant="contained" onClick={handleCreate}>Kreiraj</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}