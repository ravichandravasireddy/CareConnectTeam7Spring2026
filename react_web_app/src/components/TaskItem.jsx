import './TaskItem.css'

export default function TaskItem({ task }) {
  const { title, patientName, time, onStart } = task

  return (
    <div
      className="task-item"
      role="listitem"
    >
      <div className="task-item__content">
        <span className="task-item__title">{title}</span>
        <span className="task-item__patient">{patientName}</span>
      </div>
      <div className="task-item__meta">
        <time className="task-item__time" dateTime={time}>
          {time}
        </time>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={onStart}
          aria-label={`Start ${title} for ${patientName}`}
        >
          Start
        </button>
      </div>
    </div>
  )
}
