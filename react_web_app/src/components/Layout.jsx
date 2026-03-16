import { Link, Outlet, useLocation } from 'react-router-dom'
import './Layout.css'

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/messages', label: 'Messages' },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="layout">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <header role="banner" className="header">
        <div className="header-inner">
          <h1 className="header-title">
            <Link to="/">CareConnect</Link>
          </h1>
          <nav role="navigation" aria-label="Main navigation" className="nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'nav-link--active' : ''}`}
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main id="main" role="main" className="main">
        <Outlet />
      </main>
    </div>
  )
}
