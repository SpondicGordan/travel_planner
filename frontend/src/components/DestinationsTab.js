// components/DestinationsTab.js
import { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Card, CardContent, CardActions,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { destinationService } from '../services/destinationService';

export default function DestinationsTab({ travelPlanId }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formError, setFormError] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    name: '', location: '', arrivalDate: '', departureDate: '', description: ''
  });

  useEffect(() => {
    loadDestinations();
  }, [travelPlanId]);

  const loadDestinations = async () => {
    try {
      setLoading(true);
      const data = await destinationService.getAll(travelPlanId);
      setDestinations(data);
    } catch (err) {
      setError('Greška pri učitavanju destinacija.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (item = null) => {
    if (item) {
      setEditItem(item);
      setForm({
        name: item.name,
        location: item.location,
        arrivalDate: item.arrivalDate.split('T')[0],
        departureDate: item.departureDate.split('T')[0],
        description: item.description
      });
    } else {
      setEditItem(null);
      setForm({ name: '', location: '', arrivalDate: '', departureDate: '', description: '' });
    }
    setFormError('');
    setOpenDialog(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.name || !form.location || !form.arrivalDate || !form.departureDate) {
      setFormError('Sva obavezna polja moraju biti popunjena.');
      return;
    }
    try {
      if (editItem) {
        await destinationService.update(travelPlanId, editItem.id, form);
      } else {
        await destinationService.create(travelPlanId, form);
      }
      setOpenDialog(false);
      loadDestinations();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Greška pri čuvanju.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Obrisati ovu destinaciju?')) return;
    try {
      await destinationService.delete(travelPlanId, id);
      loadDestinations();
    } catch (err) {
      setError('Greška pri brisanju.');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Dodaj destinaciju
      </Button>

      {destinations.length === 0 ? (
        <Typography color="text.secondary">Nema destinacija.</Typography>
      ) : (
        destinations.map((dest) => (
          <Card key={dest.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{dest.name}</Typography>
              <Typography variant="body2">📍 {dest.location}</Typography>
              <Typography variant="body2">
                📅 {new Date(dest.arrivalDate).toLocaleDateString('sr-RS')} —{' '}
                {new Date(dest.departureDate).toLocaleDateString('sr-RS')}
              </Typography>
              {dest.description && (
                <Typography variant="body2" color="text.secondary">{dest.description}</Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleOpen(dest)}>Izmeni</Button>
              <Button size="small" color="error" onClick={() => handleDelete(dest.id)}>Obriši</Button>
            </CardActions>
          </Card>
        ))
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? 'Izmijeni destinaciju' : 'Nova destinacija'}</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{formError}</Alert>}
          <TextField fullWidth label="Naziv" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            margin="normal" required />
          <TextField fullWidth label="Lokacija" value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            margin="normal" required />
          <TextField fullWidth label="Datum dolaska" type="date" value={form.arrivalDate}
            onChange={(e) => setForm({ ...form, arrivalDate: e.target.value })}
            margin="normal" InputLabelProps={{ shrink: true }} required />
          <TextField fullWidth label="Datum odlaska" type="date" value={form.departureDate}
            onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
            margin="normal" InputLabelProps={{ shrink: true }} required />
          <TextField fullWidth label="Opis" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            margin="normal" multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Otkaži</Button>
          <Button variant="contained" onClick={handleSave}>Sačuvaj</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}