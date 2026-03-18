import PageMeta from '../components/PageMeta'
import PatientCard from '../components/PatientCard'
import './Patients.css'

const patients = [
  {
    id: '1',
    name: 'Margaret Johnson',
    age: 78,
    status: 'Stable',
    alerts: 0,
    condition: 'Diabetes Type 2',
    heartRate: '72',
    bloodPressure: '120/80',
    adherence: '95',
    lastUpdate: '2 hours ago',
  },
  {
    id: '2',
    name: 'Robert Chen',
    age: 65,
    status: 'Needs Attention',
    alerts: 2,
    condition: 'Hypertension',
    heartRate: '88',
    bloodPressure: '145/92',
    adherence: '78',
    lastUpdate: '15 min ago',
  },
  {
    id: '3',
    name: 'Sarah Williams',
    age: 82,
    status: 'Stable',
    alerts: 0,
    condition: 'Heart Disease',
    heartRate: '68',
    bloodPressure: '118/76',
    adherence: '92',
    lastUpdate: '1 hour ago',
  },
]

export default function Patients() {
  return (
    <>
      <PageMeta
        title="Patients – CareConnect"
        description="Browse and manage your active patients."
        path="/patients"
      />

      <header className="patients-header">
        <div>
          <h1 className="patients-title">Patients</h1>
          <p className="patients-subtitle">All active patients under your care</p>
        </div>
      </header>

      <section aria-label="Patients list" className="patients-grid">
        {patients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </section>
    </>
  )
}

