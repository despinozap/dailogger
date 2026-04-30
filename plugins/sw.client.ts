export default defineNuxtPlugin(() => {
  if (import.meta.client && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('[SW] Registered:', reg.scope)
    }).catch((err) => {
      console.error('[SW] Registration failed:', err)
    })
  }
})
