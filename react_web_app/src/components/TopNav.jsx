import { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { HeartIcon, MessageIcon, CalendarIcon, ChartIcon } from './Icons'
import './Button.css'
import './TopNav.css'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/patients', label: 'Patients' },
  { to: '/schedule', label: 'Schedule', icon: CalendarIcon },
  { to: '/reports', label: 'Reports', icon: ChartIcon },
  { to: '/messages', label: 'Messages', icon: MessageIcon },
]

function getIsInstalled() {
  // iOS Safari uses navigator.standalone; other browsers use display-mode media query
  return (
    (typeof window !== 'undefined' &&
      window.matchMedia?.('(display-mode: standalone)')?.matches) ||
    (typeof navigator !== 'undefined' && navigator.standalone === true)
  )
}

export default function TopNav() {
  const location = useLocation()
  const isLogin = location.pathname === '/login'
  if (isLogin) return null

  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(getIsInstalled())

  useEffect(() => {
    const onBeforeInstallPrompt = (e) => {
      // Allow us to show our own in-app install button
      e.preventDefault()
      setDeferredPrompt(e)
    }

    const onAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)

    // Keep in sync if display-mode changes (e.g. launched from home screen)
    const mql = window.matchMedia?.('(display-mode: standalone)')
    const onDisplayModeChange = () => setIsInstalled(getIsInstalled())
    mql?.addEventListener?.('change', onDisplayModeChange)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onAppInstalled)
      mql?.removeEventListener?.('change', onDisplayModeChange)
    }
  }, [])

  const canInstall = useMemo(() => Boolean(deferredPrompt) && !isInstalled, [deferredPrompt, isInstalled])

  async function handleInstallClick() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    // userChoice is supported in Chromium; ignore if not present
    try {
      await deferredPrompt.userChoice
    } catch {
      // no-op
    }
    setDeferredPrompt(null)
  }

  return (
    <header className="top-nav-bar" role="banner">
      <div className="top-nav-bar__inner">
        <NavLink to="/" className="top-nav-bar__brand" aria-label="CareConnect home">
          <span className="top-nav-bar__brand-icon" aria-hidden="true">
            <HeartIcon size={18} />
          </span>
          <span className="top-nav-bar__brand-text">CareConnect</span>
        </NavLink>

        <div className="top-nav-bar__right">
          <nav className="top-nav-bar__nav" aria-label="Primary navigation">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `top-nav-bar__item ${isActive ? 'top-nav-bar__item--active' : ''}`
                  }
                  end={item.to === '/'}
                >
                  {Icon && (
                    <span className="top-nav-bar__item-icon" aria-hidden="true">
                      <Icon size={16} />
                    </span>
                  )}
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          {canInstall && (
            <button
              type="button"
              className="btn btn--secondary btn--sm top-nav-bar__install"
              onClick={handleInstallClick}
              aria-label="Install CareConnect"
            >
              Install
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

