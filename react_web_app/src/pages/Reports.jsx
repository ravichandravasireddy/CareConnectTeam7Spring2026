import PageMeta from '../components/PageMeta'
import './SimplePlaceholder.css'

export default function Reports() {
  return (
    <>
      <PageMeta
        title="Reports – CareConnect"
        description="View summaries and reports for your patient panel."
        path="/reports"
      />

      <header className="simple-page-header">
        <div>
          <h1 className="simple-page-title">Reports</h1>
          <p className="simple-page-subtitle">Summaries and trends for patient care</p>
        </div>
      </header>

      <section aria-label="Reports content" className="simple-placeholder">
        <div className="simple-placeholder__card">
          <p className="simple-placeholder__text">Reports are coming soon.</p>
        </div>
      </section>
    </>
  )
}

