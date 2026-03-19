import { useParams, Link } from 'react-router-dom'
import { useState, useRef } from 'react'
import PageMeta from '../components/PageMeta'
import { BackArrowIcon, VideoIcon, MessageIcon, PhoneIcon, HeartIcon, CircleIcon, DropletIcon, ScaleIcon } from '../components/Icons'
import '../components/Button.css'
import './PatientDetails.css'

const tabs = [
  { id: 'vitals', label: 'Vitals & Health' },
  { id: 'medications', label: 'Medications' },
  { id: 'activity', label: 'Activity' },
]

const vitalIcons = {
  'Heart Rate': HeartIcon,
  'Blood Pressure': CircleIcon,
  'Blood Glucose': DropletIcon,
  'Weight': ScaleIcon,
}

const vitals = [
  { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'Normal' },
  { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'Normal' },
  { label: 'Blood Glucose', value: '105', unit: 'mg/dL', status: 'Normal' },
  { label: 'Weight', value: '152', unit: 'lbs', status: 'Normal' },
]

const trends = [
  { label: 'Medication Adherence', value: 95 },
  { label: 'Exercise Goals', value: 80 },
  { label: 'Vitals Monitoring', value: 92 },
]

const achievements = [
  { title: '7-Day Streak', subtitle: 'Medication adherence' },
  { title: 'Health Champion', subtitle: '30 days perfect vitals' },
  { title: 'Active Lifestyle', subtitle: 'Exercise 5 days/week' },
]

const patientData = {
  '1': {
    name: 'Margaret Johnson',
    age: 78,
    status: 'Stable',
    patientId: 'P-2024-001',
    primaryCaregiver: 'Dr. Sarah Anderson',
    conditions: 'Diabetes Type 2, Hypertension',
    lastCheckin: '2 hours ago',
    initials: 'MJ',
  },
  '2': {
    name: 'Robert Chen',
    age: 65,
    status: 'Needs Attention',
    patientId: 'P-2024-002',
    primaryCaregiver: 'Dr. Sarah Anderson',
    conditions: 'Hypertension',
    lastCheckin: '15 min ago',
    initials: 'RC',
  },
  '3': {
    name: 'Sarah Williams',
    age: 82,
    status: 'Stable',
    patientId: 'P-2024-003',
    primaryCaregiver: 'Dr. Sarah Anderson',
    conditions: 'Heart Disease',
    lastCheckin: '1 hour ago',
    initials: 'SW',
  },
}

export default function PatientDetails() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('vitals')
  const tabRefs = useRef({})
  const panelRef = useRef(null)

  const handleTabKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      panelRef.current?.focus()
    }
  }

  const patient = patientData[id] || {
    name: 'Patient',
    age: '',
    status: 'Stable',
    patientId: '—',
    primaryCaregiver: '—',
    conditions: '—',
    lastCheckin: '—',
    initials: '?',
  }

  return (
    <>
      <PageMeta
        title="Patient Details – CareConnect"
        description="View vitals, medications, and activity history for your patient."
        path={`/patient/${id}`}
      />
      <header role="banner" className="patient-details-header">
        <nav aria-label="Back navigation">
          <Link to="/" className="back-link" aria-label="Back to dashboard">
            <BackArrowIcon size={20} />
            Patient Details
          </Link>
        </nav>
      </header>

      <div className="patient-info-card">
        <div className="patient-info-card__avatar" aria-hidden="true">
          {patient.initials}
        </div>
        <div className="patient-info-card__main">
          <h1 className="patient-info-card__name">
            {patient.name}, {patient.age}
          </h1>
          <span
            className={`patient-info-card__status patient-info-card__status--${patient.status === 'Stable' ? 'stable' : 'attention'}`}
            role="status"
          >
            {patient.status}
          </span>
          <div className="patient-info-card__details">
            <div>
              <span>Patient ID: {patient.patientId}</span>
              <span>Primary Caregiver: {patient.primaryCaregiver}</span>
            </div>
            <div>
              <span>Conditions: {patient.conditions}</span>
              <span>Last Check-in: {patient.lastCheckin}</span>
            </div>
          </div>
          <div className="patient-info-card__actions">
            <button type="button" className="btn btn--primary" aria-label="Start video call">
              <VideoIcon size={18} />
              Video Call
            </button>
            <button type="button" className="btn btn--secondary" aria-label="Send message">
              <MessageIcon size={18} />
              Message
            </button>
            <button type="button" className="btn btn--secondary" aria-label="Call patient">
              <PhoneIcon size={18} />
              Call
            </button>
          </div>
        </div>
      </div>

      <div role="tablist" aria-label="Patient details tabs" className="tab-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={0}
            className={`tab-nav__item ${activeTab === tab.id ? 'tab-nav__item--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={handleTabKeyDown}
            ref={(el) => { tabRefs.current[tab.id] = el }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main role="main">
        {activeTab === 'vitals' && (
          <div role="tabpanel" id="tabpanel-vitals" aria-labelledby="tab-vitals" tabIndex={0} ref={panelRef}>
            <section aria-label="Current vital signs" className="section">
              <h2 className="section-title">Current Vitals</h2>
              <div className="vitals-grid">
                {vitals.map((vital) => {
                  const VitalIcon = vitalIcons[vital.label]
                  return (
                    <div key={vital.label} className="vital-card">
                      <div className="vital-card__header">
                        {VitalIcon && (
                          <span className={`vital-card__icon vital-card__icon--${vital.label.toLowerCase().replace(/\s/g, '-')}`} aria-hidden="true">
                            <VitalIcon size={24} />
                          </span>
                        )}
                        <span className="vital-card__status">{vital.status}</span>
                      </div>
                      <span className="vital-card__label">{vital.label}</span>
                      <span className="vital-card__value">
                        {vital.value} <span className="vital-card__unit">{vital.unit}</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </section>

            <section aria-label="Health trends" className="section">
              <h2 className="section-title">Health Trends (Last 30 Days)</h2>
              <div className="trends-list">
                {trends.map((trend) => (
                  <div key={trend.label} className="trend-item">
                    <div className="trend-item__header">
                      <span className="trend-item__label">{trend.label}</span>
                      <span className="trend-item__value">{trend.value}%</span>
                    </div>
                    <div className="trend-item__bar">
                      <div
                        className="trend-item__fill"
                        style={{ width: `${trend.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section aria-label="Achievements" className="section">
              <h2 className="section-title">Achievements</h2>
              <div className="achievements-grid">
                {achievements.map((achievement) => (
                  <div key={achievement.title} className="achievement-card">
                    <h3 className="achievement-card__title">{achievement.title}</h3>
                    <p className="achievement-card__subtitle">{achievement.subtitle}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'medications' && (
          <div role="tabpanel" id="tabpanel-medications" aria-labelledby="tab-medications" tabIndex={0} ref={panelRef}>
            <section aria-label="Medication schedule" className="section">
              <p className="placeholder">Medication schedule coming soon.</p>
            </section>
          </div>
        )}

        {activeTab === 'activity' && (
          <div role="tabpanel" id="tabpanel-activity" aria-labelledby="tab-activity" tabIndex={0} ref={panelRef}>
            <section aria-label="Recent activity" className="section">
              <p className="placeholder">Activity timeline coming soon.</p>
            </section>
          </div>
        )}
      </main>
    </>
  )
}
