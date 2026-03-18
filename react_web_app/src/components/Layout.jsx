import { Outlet } from 'react-router-dom'
import OfflineBanner from './OfflineBanner'
import TopNav from './TopNav'
import './Layout.css'

export default function Layout() {
  return (
    <div className="layout">
      <OfflineBanner />
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <TopNav />
      <main id="main" role="main" className="main">
        <Outlet />
      </main>
    </div>
  )
}
