import { useState, useEffect } from 'react'

/**
 * OfflineBanner - Visual indicator when network is unavailable
 * Per document: "A visible Offline indicator banner appears when the network is unavailable"
 */
export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [lastSync, setLastSync] = useState(null)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const stored = localStorage.getItem('careconnect-last-sync')
    if (stored) setLastSync(new Date(stored))

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (isOnline) {
      const now = new Date().toISOString()
      localStorage.setItem('careconnect-last-sync', now)
      setLastSync(new Date(now))
    }
  }, [isOnline])

  if (isOnline) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="You are offline. Limited functionality available."
      className="offline-banner"
    >
      <span className="offline-banner__icon" aria-hidden="true">
        ⚠
      </span>
      <span className="offline-banner__text">
        You are offline. Limited functionality available.
        {lastSync && (
          <span className="offline-banner__sync">
            Last synced: {lastSync.toLocaleTimeString()}
          </span>
        )}
      </span>
    </div>
  )
}
