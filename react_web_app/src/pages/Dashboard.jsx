import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import PatientCard from '../components/PatientCard'
import TaskItem from '../components/TaskItem'
import PageMeta from '../components/PageMeta'
import { VideoIcon, BellIcon } from '../components/Icons'
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
      <PageMeta
        title="Caregiver Dashboard – CareConnect"
        description="Monitor patients, track vitals, and manage care tasks with CareConnect."
        path="/"
      />
      <header role="banner" className="page-header">
        <div>
          <h1 className="page-title">Caregiver Dashboard</h1>
          <p className="page-subtitle">Welcome back, Dr. Anderson</p>
        </div>
        <nav aria-label="Dashboard actions" className="page-header__actions">
          <button type="button" className="btn btn--primary" aria-label="Start video call">
            <VideoIcon size={18} />
            Start Video Call
          </button>
          <button type="button" className="btn btn--secondary" aria-label="View 2 alerts">
            <BellIcon size={18} />
            Alerts (2)
          </button>
        </nav>
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
          <h2 className="section-title">Active Patients</h2>
          <Link to="/" className="link">View All</Link>
        </div>
        <div className="patient-grid">
          {patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      </section>

      <section aria-label="Upcoming tasks" className="section">
        <h2 className="section-title">Upcoming Tasks</h2>
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
