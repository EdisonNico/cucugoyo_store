import { supabase } from './supabase'

// Un ÚNICO canal compartido por toda la app (evita suscripciones duplicadas).
// Se abre con el primer suscriptor y se cierra cuando ya no queda ninguno.
const listeners = new Set()
let channel = null
let wasDown = false
let closeTimer = null

function notify(kind) {
  listeners.forEach((fn) => fn(kind))
}

const onOnline = () => notify('recovered')
const onVisible = () => {
  if (document.visibilityState === 'visible') notify('recovered')
}

function open() {
  channel = supabase
    .channel('products-feed')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => notify('change'))
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        // Si hubo una caída, al volver recargamos para no perder cambios.
        if (wasDown) {
          wasDown = false
          notify('recovered')
        }
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        wasDown = true
      }
    })
  window.addEventListener('online', onOnline)
  document.addEventListener('visibilitychange', onVisible)
}

function close() {
  window.removeEventListener('online', onOnline)
  document.removeEventListener('visibilitychange', onVisible)
  if (channel) {
    supabase.removeChannel(channel)
    channel = null
  }
  wasDown = false
}

export function subscribeProducts(fn) {
  listeners.add(fn)
  clearTimeout(closeTimer)
  if (!channel) open()
  return () => {
    listeners.delete(fn)
    if (listeners.size === 0) {
      // Pequeña espera: evita cerrar/abrir seguido al cambiar de página o con StrictMode.
      closeTimer = setTimeout(() => {
        if (listeners.size === 0) close()
      }, 1000)
    }
  }
}
