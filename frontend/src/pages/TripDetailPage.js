// pages/TripDetailPage.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Tabs, Tab, CircularProgress, Alert, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from '../components/Navbar';
import DestinationsTab from '../components/DestinationsTab';
import ActivitiesTab from '../components/ActivitiesTab';
import ExpensesTab from '../components/ExpensesTab';
import ChecklistTab from '../components/ChecklistTab';
import { tripService } from '../services/tripService';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      const data = await tripService.getById(id);
      setTrip(data);
    } catch (err) {
      setError('Greška pri učitavanju plana putovanja.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Box>
      <Navbar />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    </Box>
  );

  if (error) return (
    <Box>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    </Box>
  );

  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Nazad
        </Button>

        <Typography variant="h4" gutterBottom>{trip?.name}</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {trip?.description}
        </Typography>
        <Typography variant="body2" gutterBottom>
          📅 {new Date(trip?.startDate).toLocaleDateString('sr-RS')} —{' '}
          {new Date(trip?.endDate).toLocaleDateString('sr-RS')}
        </Typography>
        <Typography variant="body2" gutterBottom>
          💰 Budžet: {trip?.budget} €
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="Destinacije" />
            <Tab label="Aktivnosti" />
            <Tab label="Troškovi" />
            <Tab label="Checklist" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <DestinationsTab travelPlanId={parseInt(id)} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ActivitiesTab travelPlanId={parseInt(id)} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <ExpensesTab travelPlanId={parseInt(id)} />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <ChecklistTab travelPlanId={parseInt(id)} />
        </TabPanel>
      </Container>
    </Box>
  );
}