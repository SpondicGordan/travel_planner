// pages/SharedTripPage.js
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Container, Typography, CircularProgress, Alert,
  Tabs, Tab, Paper
} from '@mui/material';
import { sharingService } from '../services/sharingService';
import { tripService } from '../services/tripService';
import { destinationService } from '../services/destinationService';
import { activityService } from '../services/activityService';
import { expenseService } from '../services/expenseService';
import { checklistService } from '../services/checklistService';
import DestinationsTab from '../components/DestinationsTab';
import ActivitiesTab from '../components/ActivitiesTab';
import ExpensesTab from '../components/ExpensesTab';
import ChecklistTab from '../components/ChecklistTab';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SharedTripPage() {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [shareInfo, setShareInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadSharedPlan();
  }, [token]);

  const loadSharedPlan = async () => {
    try {
      setLoading(true);
      const share = await sharingService.getByToken(token);
      setShareInfo(share);

      const tripData = await tripService.getById(share.travelPlanId);
      setTrip(tripData);
    } catch (err) {
      setError('Nevažeći ili istekli link za dijeljenje.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Container sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );

  const isReadOnly = shareInfo?.accessType === 'VIEW';

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: isReadOnly ? '#e3f2fd' : '#e8f5e9' }}>
        <Container maxWidth="lg">
          <Typography variant="body2">
            {isReadOnly ? '👁️ Pregledate tuđi plan putovanja (samo čitanje)' : '✏️ Pregledate tuđi plan putovanja (možete uređivati)'}
          </Typography>
        </Container>
      </Paper>

      <Container maxWidth="lg">
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
          <DestinationsTab travelPlanId={trip?.id} readOnly={isReadOnly} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ActivitiesTab travelPlanId={trip?.id} readOnly={isReadOnly} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <ExpensesTab travelPlanId={trip?.id} readOnly={isReadOnly} />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <ChecklistTab travelPlanId={trip?.id} readOnly={isReadOnly} />
        </TabPanel>
      </Container>
    </Box>
  );
}