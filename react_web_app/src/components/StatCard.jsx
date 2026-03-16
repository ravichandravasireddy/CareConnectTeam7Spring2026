import './StatCard.css'

export default function StatCard({ label, value, ariaLabel }) {
  return (
    <div
      className="stat-card"
      role="group"
      aria-label={ariaLabel || `${label}: ${value}`}
    >
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__value">{value}</span>
    </div>
  )
}
