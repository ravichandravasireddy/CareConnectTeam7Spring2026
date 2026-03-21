import PageMeta from '../components/PageMeta'
import './SimplePlaceholder.css'

export default function Schedule() {
  return (
    <>
      <PageMeta
        title="Schedule – CareConnect"
        description="View upcoming care tasks and appointments."
        path="/schedule"
      />

      <header className="simple-page-header">
        <div>
          <h1 className="simple-page-title">Schedule</h1>
          <p className="simple-page-subtitle">Upcoming tasks and appointments</p>
        </div>
      </header>

      <section aria-label="Schedule content" className="simple-placeholder">
        <div className="simple-placeholder__card">
          <p className="simple-placeholder__text">Schedule is coming soon.</p>
        </div>
      </section>
    </>
  )
}

