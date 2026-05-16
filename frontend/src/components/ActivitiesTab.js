// components/ActivitiesTab.js
import { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Card, CardContent, CardActions,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress, Select, MenuItem,
  FormControl, InputLabel, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { activityService } from '../services/activityService';

const STATUS_COLORS = {
  PLANNED: 'default',
  RESERVED: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'error'
};

const STATUS_LABELS = {
  PLANNED: 'Planirano',
  RESERVED: 'Rezervisano',
  COMPLETED: 'Završeno',
  CANCELLED: 'Otkazano'
};

export default function ActivitiesTab({ travelPlanId, readOnly }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formError, setFormError] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    name: '', date: '', time: '', location: '',
    description: '', estimatedCost: '', status: 'PLANNED'
  });

  useEffect(() => {
    loadActivities();
  }, [travelPlanId]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await activityService.getAll(travelPlanId);
      setActivities(data);
    } catch (err) {
      setError('Greška pri učitavanju aktivnosti.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (item = null) => {
    if (item) {
      setEditItem(item);
      setForm({
        name: item.name,
        date: item.date.split('T')[0],
        time: item.time.substring(0, 5),
        location: item.location,
        description: item.description,
        estimatedCost: item.estimatedCost,
        status: item.status
      });
    } else {
      setEditItem(null);
      setForm({ name: '', date: '', time: '', location: '', description: '', estimatedCost: '', status: 'PLANNED' });
    }
    setFormError('');
    setOpenDialog(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.name || !form.date || !form.time) {
      setFormError('Naziv, datum i vreme su obavezni.');
      return;
    }
    try {
      const data = { ...form, estimatedCost: parseFloat(form.estimatedCost) || 0 };
      if (editItem) {
        await activityService.update(travelPlanId, editItem.id, data);
      } else {
        await activityService.create(travelPlanId, data);
      }
      setOpenDialog(false);
      loadActivities();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Greška pri čuvanju.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Obrisati ovu aktivnost?')) return;
    try {
      await activityService.delete(travelPlanId, id);
      loadActivities();
    } catch (err) {
      setError('Greška pri brisanju.');
    }
  };

  if (loading) return <CircularProgress />;

  // Grupisanje po datumu
  const grouped = activities.reduce((acc, act) => {
    const date = act.date.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(act);
    return acc;
  }, {});

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!readOnly && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
          Dodaj aktivnost
        </Button>
      )}

      {activities.length === 0 ? (
        <Typography color="text.secondary">Nema aktivnosti.</Typography>
      ) : (
        Object.keys(grouped).sort().map((date) => (
          <Box key={date} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              📅 {new Date(date).toLocaleDateString('sr-RS', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
            {grouped[date].map((act) => (
              <Card key={act.id} sx={{ mb: 1 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{act.name}</Typography>
                    <Chip label={STATUS_LABELS[act.status]} color={STATUS_COLORS[act.status]} size="small" />
                  </Box>
                  <Typography variant="body2">🕐 {act.time?.substring(0, 5)}</Typography>
                  {act.location && <Typography variant="body2">📍 {act.location}</Typography>}
                  {act.estimatedCost > 0 && <Typography variant="body2">💰 {act.estimatedCost} €</Typography>}
                  {act.description && <Typography variant="body2" color="text.secondary">{act.description}</Typography>}
                </CardContent>
                {!readOnly && (
                  <CardActions>
                    <Button size="small" onClick={() => handleOpen(act)}>Izmijeni</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(act.id)}>Obriši</Button>
                  </CardActions>
                )}
              </Card>
            ))}
          </Box>
        ))
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? 'Izmeni aktivnost' : 'Nova aktivnost'}</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{formError}</Alert>}
          <TextField fullWidth label="Naziv" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            margin="normal" required />
          <TextField fullWidth label="Datum" type="date" value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            margin="normal" InputLabelProps={{ shrink: true }} required />
          <TextField fullWidth label="Vreme" type="time" value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            margin="normal" InputLabelProps={{ shrink: true }} required />
          <TextField fullWidth label="Lokacija" value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            margin="normal" />
          <TextField fullWidth label="Procenjeni trošak (€)" type="number" value={form.estimatedCost}
            onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })}
            margin="normal" />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select value={form.status} label="Status"
              onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <MenuItem value="PLANNED">Planirano</MenuItem>
              <MenuItem value="RESERVED">Rezervisano</MenuItem>
              <MenuItem value="COMPLETED">Završeno</MenuItem>
              <MenuItem value="CANCELLED">Otkazano</MenuItem>
            </Select>
          </FormControl>
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