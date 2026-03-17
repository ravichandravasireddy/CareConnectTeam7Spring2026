import { HeartIcon, AlertIcon, ChartIcon, CalendarIcon } from './Icons'
import './StatCard.css'

const iconMap = {
  'Total Patients': HeartIcon,
  'Active Alerts': AlertIcon,
  'Avg Adherence': ChartIcon,
  "Today's Tasks": CalendarIcon,
}

export default function StatCard({ label, value, ariaLabel }) {
  const Icon = iconMap[label]
  return (
    <div
      className="stat-card"
      role="group"
      aria-label={ariaLabel || `${label}: ${value}`}
    >
      <div className="stat-card__content">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
      </div>
      {Icon && (
        <span className={`stat-card__icon stat-card__icon--${label.replace(/\s+/g, '-').replace("'", '').toLowerCase()}`} aria-hidden="true">
          <Icon size={28} />
        </span>
      )}
    </div>
  )
}
