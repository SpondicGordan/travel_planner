// components/TripPdfReport.js
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontFamily: 'Helvetica-Bold'
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginTop: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 4
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4
  },
  label: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    width: 120
  },
  value: {
    fontSize: 11,
    flex: 1
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    marginBottom: 6,
    borderRadius: 4
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3
  },
  cardText: {
    fontSize: 10,
    color: '#444',
    marginBottom: 2
  },
  budgetBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e8f4f8',
    padding: 10,
    marginTop: 10,
    borderRadius: 4
  },
  budgetItem: {
    alignItems: 'center'
  },
  budgetLabel: {
    fontSize: 10,
    color: '#666'
  },
  budgetValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold'
  }
});

const STATUS_LABELS = {
  PLANNED: 'Planirano',
  RESERVED: 'Rezervisano',
  COMPLETED: 'Zavrseno',
  CANCELLED: 'Otkazano'
};

const CATEGORY_LABELS = {
  TRANSPORT: 'Transport',
  ACCOMMODATION: 'Smestaj',
  FOOD: 'Hrana',
  TICKETS: 'Ulaznice',
  SHOPPING: 'Kupovina',
  OTHER: 'Ostalo'
};

export default function TripPdfReport({ trip, destinations, activities, expenses, checklistItems }) {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = trip.budget - totalSpent;

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>{trip.name}</Text>
        {trip.description && <Text style={styles.subtitle}>{trip.description}</Text>}

        <View style={styles.row}>
          <Text style={styles.label}>Period:</Text>
          <Text style={styles.value}>
            {new Date(trip.startDate).toLocaleDateString('sr-RS')} —{' '}
            {new Date(trip.endDate).toLocaleDateString('sr-RS')}
          </Text>
        </View>

        {trip.notes && (
          <View style={styles.row}>
            <Text style={styles.label}>Napomene:</Text>
            <Text style={styles.value}>{trip.notes}</Text>
          </View>
        )}

        <View style={styles.budgetBox}>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Planirani budzet</Text>
            <Text style={styles.budgetValue}>{trip.budget} EUR</Text>
          </View>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Potroseno</Text>
            <Text style={styles.budgetValue}>{totalSpent} EUR</Text>
          </View>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Preostalo</Text>
            <Text style={styles.budgetValue}>{remaining} EUR</Text>
          </View>
        </View>

        {destinations.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Destinacije</Text>
            {destinations.map((dest, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>{dest.name}</Text>
                <Text style={styles.cardText}>Lokacija: {dest.location}</Text>
                <Text style={styles.cardText}>
                  {new Date(dest.arrivalDate).toLocaleDateString('sr-RS')} —{' '}
                  {new Date(dest.departureDate).toLocaleDateString('sr-RS')}
                </Text>
                {dest.description && <Text style={styles.cardText}>{dest.description}</Text>}
              </View>
            ))}
          </>
        )}

        {activities.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Aktivnosti</Text>
            {activities.map((act, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>{act.name}</Text>
                <Text style={styles.cardText}>
                  Datum: {new Date(act.date).toLocaleDateString('sr-RS')} u {act.time?.substring(0, 5)}
                </Text>
                {act.location && <Text style={styles.cardText}>Lokacija: {act.location}</Text>}
                <Text style={styles.cardText}>Status: {STATUS_LABELS[act.status]}</Text>
                {act.estimatedCost > 0 && (
                  <Text style={styles.cardText}>Procenjeni trosak: {act.estimatedCost} EUR</Text>
                )}
              </View>
            ))}
          </>
        )}

        {expenses.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Troskovi</Text>
            {expenses.map((exp, i) => (
              <View key={i} style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.cardTitle}>{exp.name}</Text>
                  <Text style={styles.cardTitle}>{exp.amount} EUR</Text>
                </View>
                <Text style={styles.cardText}>Kategorija: {CATEGORY_LABELS[exp.category]}</Text>
                <Text style={styles.cardText}>
                  Datum: {new Date(exp.date).toLocaleDateString('sr-RS')}
                </Text>
              </View>
            ))}
          </>
        )}

        {checklistItems.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Checklist</Text>
            {checklistItems.map((item, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.cardText}>
                  {item.isCompleted ? '[x]' : '[ ]'} {item.text}
                </Text>
              </View>
            ))}
          </>
        )}
      </Page>
    </Document>
  );
}