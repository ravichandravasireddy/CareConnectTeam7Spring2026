/* CareConnect PWA Service Worker */
/* Dual caching: Cache-First for static, Network-First for dynamic per doc */

const CACHE_STATIC = 'careconnect-static-v1'
const CACHE_DYNAMIC = 'careconnect-dynamic-v1'

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/favicon.ico',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_STATIC && k !== CACHE_DYNAMIC).map((k) => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

function isStaticRequest(request) {
  const url = new URL(request.url)
  if (url.origin !== location.origin) return false
  const dest = request.destination
  return (
    dest === 'script' ||
    dest === 'style' ||
    dest === 'font' ||
    dest === 'image' ||
    url.pathname.match(/\.(js|css|woff2?|png|jpg|jpeg|gif|ico|svg)$/)
  )
}

function isDocumentRequest(request) {
  return request.mode === 'navigate' || (request.method === 'GET' && request.destination === 'document')
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (url.origin !== location.origin) return

  /* Document requests: Network-First with offline fallback */
  if (isDocumentRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((res) => res)
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/offline.html')))
    )
    return
  }

  /* Static assets: Cache-First */
  if (isStaticRequest(request)) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached ||
        fetch(request).then((res) => {
          const clone = res.clone()
          caches.open(CACHE_STATIC).then((cache) => cache.put(request, clone))
          return res
        })
      )
    )
    return
  }

  /* API/dynamic: Network-First with cache fallback */
  event.respondWith(
    fetch(request)
      .then((res) => {
        const clone = res.clone()
        caches.open(CACHE_DYNAMIC).then((cache) => cache.put(request, clone))
        return res
      })
      .catch(() => caches.match(request))
  )
})
