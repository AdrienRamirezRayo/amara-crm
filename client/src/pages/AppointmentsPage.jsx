const appointments = [
  {
    client: 'Daniel Perez',
    time: '9:00 AM',
    type: 'Phone Call',
  },
  {
    client: 'Ashley Moore',
    time: '11:30 AM',
    type: 'Zoom',
  },
  {
    client: 'Luis Hernandez',
    time: '2:00 PM',
    type: 'In Person',
  },
];

export default function AppointmentsPage() {
  return (
    <div>
      <h2 style={styles.heading}>Appointments</h2>

      <div style={styles.list}>
        {appointments.map((appt) => (
          <div key={`${appt.client}-${appt.time}`} style={styles.card}>
            <h3 style={styles.client}>{appt.client}</h3>
            <p style={styles.detail}>Time: {appt.time}</p>
            <p style={styles.detail}>Type: {appt.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  heading: {
    marginTop: 0,
    marginBottom: '20px',
    fontSize: '28px',
  },
  list: {
    display: 'grid',
    gap: '16px',
  },
  card: {
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '18px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  client: {
    margin: '0 0 8px 0',
  },
  detail: {
    margin: '4px 0',
    opacity: 0.85,
  },
};