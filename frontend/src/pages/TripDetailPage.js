// pages/TripDetailPage.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Tabs, Tab, CircularProgress, Alert, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, FormControl, InputLabel
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from '../components/Navbar';
import DestinationsTab from '../components/DestinationsTab';
import ActivitiesTab from '../components/ActivitiesTab';
import ExpensesTab from '../components/ExpensesTab';
import ChecklistTab from '../components/ChecklistTab';
import { tripService } from '../services/tripService';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TripPdfReport from '../components/TripPdfReport';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { destinationService } from '../services/destinationService';
import { activityService } from '../services/activityService';
import { expenseService } from '../services/expenseService';
import { checklistService } from '../services/checklistService';
import { sharingService } from '../services/sharingService';

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
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [checklistItems, setChecklistItems] = useState([]);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState('');

  useEffect(() => {
    loadTrip();
    loadPdfData();
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

  const loadPdfData = async () => {
  try {
    const [dest, act, exp, check] = await Promise.all([
      destinationService.getAll(id),
      activityService.getAll(id),
      expenseService.getAll(id),
      checklistService.getAll(id)
    ]);
    setDestinations(dest);
    setActivities(act);
    setExpenses(exp);
    setChecklistItems(check);
  } catch (err) {
    console.error('Greška pri učitavanju PDF podataka.');
  }
};

  const handleShare = async (accessType) => {
    try {
      setShareLoading(true);
      setShareError('');
      const share = await sharingService.createShare(parseInt(id), accessType);
      const link = `${window.location.origin}/shared/${share.token}`;
      setShareLink(link);
    } catch (err) {
      setShareError('Greška pri generisanju linka.');
    } finally {
      setShareLoading(false);
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
          >
            Nazad
          </Button>

          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={() => {
              setShareLink('');
              setShareError('');
              setOpenShareDialog(true);
            }}
          >
            Podeli
          </Button>

          {trip && (
            <PDFDownloadLink
              document={
                <TripPdfReport
                  trip={trip}
                  destinations={destinations}
                  activities={activities}
                  expenses={expenses}
                  checklistItems={checklistItems}
                />
              }
              fileName={`${trip.name}-plan.pdf`}
            >
              {({ loading }) => (
                <Button
                  variant="outlined"
                  startIcon={<PictureAsPdfIcon />}
                  disabled={loading}
                >
                  {loading ? 'Generišem PDF...' : 'Preuzmi PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          )}
          <Dialog open={openShareDialog} onClose={() => setOpenShareDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Podijeli plan putovanja</DialogTitle>
            <DialogContent>
              {shareError && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{shareError}</Alert>}
              
              {!shareLink ? (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Izaberite tip pristupa za dijeljenje:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleShare('VIEW')}
                      disabled={shareLoading}
                    >
                      👁️ Samo pregled
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleShare('EDIT')}
                      disabled={shareLoading}
                    >
                      ✏️ Uređivanje
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Link za dijeljenje:
                  </Typography>
                  <TextField
                    fullWidth
                    value={shareLink}
                    slotProps={{ input: { readOnly: true } }}
                    onClick={(e) => e.target.select()}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Kopirajte link i podijelite ga sa drugima.
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenShareDialog(false)}>Zatvori</Button>
            </DialogActions>
          </Dialog>


        </Box>

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