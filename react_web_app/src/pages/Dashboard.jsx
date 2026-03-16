import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import PatientCard from '../components/PatientCard'
import TaskItem from '../components/TaskItem'
import '../components/Button.css'
import './Dashboard.css'

const stats = [
  { label: 'Total Patients', value: '12' },
  { label: 'Active Alerts', value: '2' },
  { label: 'Avg Adherence', value: '88%' },
  { label: "Today's Tasks", value: '8' },
]

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

const tasks = [
  { title: 'Medication reminder', patientName: 'Margaret Johnson', time: '2:00 PM' },
  { title: 'Blood pressure check', patientName: 'Robert Chen', time: '3:30 PM' },
  { title: 'Virtual check-in', patientName: 'Sarah Williams', time: '4:00 PM' },
]

export default function Dashboard() {
  return (
    <>
      <header role="banner" className="page-header">
        <div>
          <h2 className="page-title">Caregiver Dashboard</h2>
          <p className="page-subtitle">
            Monitor multiple patients, track vitals, manage tasks, and receive real-time alerts.
          </p>
        </div>
      </header>

      <section aria-label="Quick statistics" className="stats-grid">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </section>

      <section aria-label="Patient list" className="section">
        <div className="section-header">
          <h3 className="section-title">Active Patients</h3>
          <Link to="/" className="link">View All</Link>
        </div>
        <div className="patient-grid">
          {patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      </section>

      <section aria-label="Upcoming tasks" className="section">
        <h3 className="section-title">Upcoming Tasks</h3>
        <div className="task-list" role="list">
          {tasks.map((task, i) => (
            <TaskItem
              key={i}
              task={{
                ...task,
                onStart: () => console.log('Start task', task.title),
              }}
            />
          ))}
        </div>
      </section>
    </>
  )
}
