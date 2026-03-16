import { Link } from 'react-router-dom'
import './PatientCard.css'

export default function PatientCard({ patient }) {
  const { id, name, age, status, alerts, condition, heartRate, bloodPressure, adherence, lastUpdate } = patient

  return (
    <article
      className="patient-card"
      role="article"
      aria-label={`Patient: ${name}`}
    >
      <div className="patient-card__header">
        <h3 className="patient-card__name">
          {name}, {age}
        </h3>
        <span
          className={`patient-card__status patient-card__status--${status === 'Stable' ? 'stable' : 'attention'}`}
          role="status"
        >
          {status}
          {alerts > 0 && (
            <span className="patient-card__alerts" aria-label={`${alerts} alerts`}>
              {alerts} Alerts
            </span>
          )}
        </span>
      </div>
      <p className="patient-card__condition">{condition}</p>
      <div className="patient-card__vitals">
        <div>
          <span className="patient-card__vital-label">Heart Rate</span>
          <span className="patient-card__vital-value">{heartRate} bpm</span>
        </div>
        <div>
          <span className="patient-card__vital-label">Blood Pressure</span>
          <span className="patient-card__vital-value">{bloodPressure}</span>
        </div>
      </div>
      <div className="patient-card__meta">
        <span>Adherence {adherence}%</span>
        <span>Last Update {lastUpdate}</span>
      </div>
      <div className="patient-card__actions">
        <Link
          to={`/patients/${id}`}
          className="btn btn--primary btn--sm"
          aria-label={`View details for ${name}`}
        >
          View Details
        </Link>
        <Link
          to={`/messages?patient=${id}`}
          className="btn btn--secondary btn--sm"
          aria-label={`Message ${name}`}
        >
          Message
        </Link>
      </div>
    </article>
  )
}
