// components/ExpensesTab.js
import { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Card, CardContent, CardActions,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress, Select, MenuItem,
  FormControl, InputLabel, Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { expenseService } from '../services/expenseService';

const CATEGORY_LABELS = {
  TRANSPORT: 'Transport',
  ACCOMMODATION: 'Smeštaj',
  FOOD: 'Hrana',
  TICKETS: 'Ulaznice',
  SHOPPING: 'Kupovina',
  OTHER: 'Ostalo'
};

export default function ExpensesTab({ travelPlanId, readOnly }) {
  const [expenses, setExpenses] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formError, setFormError] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    name: '', category: 'OTHER', amount: '', date: '', description: ''
  });

  useEffect(() => {
    loadData();
  }, [travelPlanId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expensesData, summaryData] = await Promise.all([
        expenseService.getAll(travelPlanId),
        expenseService.getBudgetSummary(travelPlanId)
      ]);
      setExpenses(expensesData);
      setBudgetSummary(summaryData);
    } catch (err) {
      setError('Greška pri učitavanju troškova.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (item = null) => {
    if (item) {
      setEditItem(item);
      setForm({
        name: item.name,
        category: item.category,
        amount: item.amount,
        date: item.date.split('T')[0],
        description: item.description
      });
    } else {
      setEditItem(null);
      setForm({ name: '', category: 'OTHER', amount: '', date: '', description: '' });
    }
    setFormError('');
    setOpenDialog(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.name || !form.amount || !form.date) {
      setFormError('Naziv, iznos i datum su obavezni.');
      return;
    }
    if (parseFloat(form.amount) < 0) {
      setFormError('Iznos ne može biti negativan.');
      return;
    }
    try {
      const data = { ...form, amount: parseFloat(form.amount) };
      if (editItem) {
        await expenseService.update(travelPlanId, editItem.id, data);
      } else {
        await expenseService.create(travelPlanId, data);
      }
      setOpenDialog(false);
      loadData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Greška pri čuvanju.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Obrisati ovaj trošak?')) return;
    try {
      await expenseService.delete(travelPlanId, id);
      loadData();
    } catch (err) {
      setError('Greška pri brisanju.');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Pregled budžeta */}
      {budgetSummary && (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Pregled budžeta</Typography>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Planirani budžet</Typography>
              <Typography variant="h6">{budgetSummary.plannedBudget} €</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Potrošeno</Typography>
              <Typography variant="h6">{budgetSummary.totalSpent} €</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Preostalo</Typography>
              <Typography variant="h6"
                color={budgetSummary.remainingBudget < 0 ? 'error' : 'success.main'}>
                {budgetSummary.remainingBudget} €
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {!readOnly && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
          Dodaj trošak
        </Button>
      )}

      {expenses.length === 0 ? (
        <Typography color="text.secondary">Nema troškova.</Typography>
      ) : (
        expenses.map((exp) => (
          <Card key={exp.id} sx={{ mb: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">{exp.name}</Typography>
                <Typography variant="h6" color="error">{exp.amount} €</Typography>
              </Box>
              <Typography variant="body2">🏷️ {CATEGORY_LABELS[exp.category]}</Typography>
              <Typography variant="body2">📅 {new Date(exp.date).toLocaleDateString('sr-RS')}</Typography>
              {exp.description && <Typography variant="body2" color="text.secondary">{exp.description}</Typography>}
            </CardContent>
            {!readOnly && (
              <CardActions>
                <Button size="small" onClick={() => handleOpen(exp)}>Izmeni</Button>
                <Button size="small" color="error" onClick={() => handleDelete(exp.id)}>Obriši</Button>
              </CardActions>
            )}
          </Card>
        ))
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? 'Izmeni trošak' : 'Novi trošak'}</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{formError}</Alert>}
          <TextField fullWidth label="Naziv" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            margin="normal" required />
          <FormControl fullWidth margin="normal">
            <InputLabel>Kategorija</InputLabel>
            <Select value={form.category} label="Kategorija"
              onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField fullWidth label="Iznos (€)" type="number" value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            margin="normal" required />
          <TextField fullWidth label="Datum" type="date" value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
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