import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import '../components/Button.css'
import './PatientDetails.css'

const tabs = [
  { id: 'vitals', label: 'Vitals & Health' },
  { id: 'medications', label: 'Medications' },
  { id: 'activity', label: 'Activity' },
]

const vitals = [
  { label: 'Heart Rate', value: '72 bpm', status: 'Normal' },
  { label: 'Blood Pressure', value: '120/80 mmHg', status: 'Normal' },
  { label: 'Blood Glucose', value: '105 mg/dL', status: 'Normal' },
  { label: 'Weight', value: '152 lbs', status: 'Normal' },
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

// Mock patient data - in real app would come from API
const patientData = {
  '1': { name: 'Margaret Johnson', age: 78 },
  '2': { name: 'Robert Chen', age: 65 },
  '3': { name: 'Sarah Williams', age: 82 },
}

export default function PatientDetails() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('vitals')
  const patient = patientData[id] || { name: 'Patient', age: '' }

  return (
    <>
      <header role="banner" className="page-header">
        <nav aria-label="Back navigation">
          <Link to="/" className="back-link" aria-label="Back to dashboard">
            ← Back
          </Link>
        </nav>
        <h2 className="page-title">
          Patient Details
        </h2>
        <p className="page-subtitle">
          Comprehensive patient profile with vitals tracking, medication management, and activity history.
        </p>
      </header>

      <nav role="navigation" aria-label="Patient details tabs" className="tab-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-nav__item ${activeTab === tab.id ? 'tab-nav__item--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main role="main">
        {activeTab === 'vitals' && (
          <>
            <section aria-label="Current vital signs" className="section">
              <h3 className="section-title">Current Vitals</h3>
              <div className="vitals-grid">
                {vitals.map((vital) => (
                  <div key={vital.label} className="vital-card">
                    <span className="vital-card__status">{vital.status}</span>
                    <span className="vital-card__label">{vital.label}</span>
                    <span className="vital-card__value">{vital.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section aria-label="Health trends" className="section">
              <h3 className="section-title">Health Trends (Last 30 Days)</h3>
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
              <h3 className="section-title">Achievements</h3>
              <div className="achievements-grid">
                {achievements.map((achievement) => (
                  <div key={achievement.title} className="achievement-card">
                    <h4 className="achievement-card__title">{achievement.title}</h4>
                    <p className="achievement-card__subtitle">{achievement.subtitle}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'medications' && (
          <section aria-label="Medication schedule" className="section">
            <p className="placeholder">Medication schedule coming soon.</p>
          </section>
        )}

        {activeTab === 'activity' && (
          <section aria-label="Recent activity" className="section">
            <p className="placeholder">Activity timeline coming soon.</p>
          </section>
        )}
      </main>
    </>
  )
}
