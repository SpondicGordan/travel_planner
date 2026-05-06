// components/ChecklistTab.js
import { useState, useEffect } from 'react';
import {
  Box, Button, Typography, List, ListItem, ListItemText,
  ListItemIcon, ListItemSecondaryAction, IconButton,
  TextField, Alert, CircularProgress, Checkbox, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { checklistService } from '../services/checklistService';

export default function ChecklistTab({ travelPlanId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    loadItems();
  }, [travelPlanId]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await checklistService.getAll(travelPlanId);
      setItems(data);
    } catch (err) {
      setError('Greška pri učitavanju checkliste.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newItemText.trim()) return;
    try {
      await checklistService.create(travelPlanId, newItemText.trim());
      setNewItemText('');
      loadItems();
    } catch (err) {
      setError('Greška pri dodavanju stavke.');
    }
  };

  const handleToggle = async (item) => {
    try {
      await checklistService.toggle(travelPlanId, item.id, !item.isCompleted);
      loadItems();
    } catch (err) {
      setError('Greška pri ažuriranju stavke.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await checklistService.delete(travelPlanId, id);
      loadItems();
    } catch (err) {
      setError('Greška pri brisanju stavke.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  if (loading) return <CircularProgress />;

  const completed = items.filter(i => i.isCompleted).length;

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Završeno: {completed}/{items.length}
      </Typography>

      {/* Dodavanje nove stavke */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          label="Nova stavka"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="npr. Pasoš, karta, punjač..."
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Dodaj
        </Button>
      </Box>

      {items.length === 0 ? (
        <Typography color="text.secondary">Nema stavki na listi.</Typography>
      ) : (
        <Paper elevation={1}>
          <List>
            {items.map((item) => (
              <ListItem key={item.id} divider>
                <ListItemIcon>
                  <Checkbox
                    checked={item.isCompleted}
                    onChange={() => handleToggle(item)}
                    color="primary"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    textDecoration: item.isCompleted ? 'line-through' : 'none',
                    color: item.isCompleted ? 'text.secondary' : 'text.primary'
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleDelete(item.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}