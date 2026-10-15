import { useCallback, useEffect, useRef, useState } from 'react'
import { listProducts } from '../services/productService'
import { subscribeProducts } from '../lib/realtime'

// Carga inicial + actualización automática (Realtime) + recuperación tras desconexión.
export function useProducts(params = {}) {
  const key = JSON.stringify(params)
  const [state, setState] = useState({ products: [], loading: true, error: null })
  const requestId = useRef(0)

  const load = useCallback(
    async (silent = false) => {
      const id = ++requestId.current
      if (!silent) setState((s) => ({ ...s, loading: true, error: null }))
      try {
        const products = await listProducts(JSON.parse(key))
        if (id !== requestId.current) return // respuesta antigua: se ignora
        setState({ products, loading: false, error: null })
      } catch (e) {
        if (id !== requestId.current) return
        setState((s) => ({ ...s, loading: false, error: 'No pudimos cargar los productos. Intenta nuevamente.' }))
        console.error(e)
      }
    },
    [key],
  )

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    let timer
    const unsubscribe = subscribeProducts(() => {
      clearTimeout(timer)
      timer = setTimeout(() => load(true), 300) // agrupa varios eventos seguidos
    })
    return () => {
      clearTimeout(timer)
      unsubscribe()
    }
  }, [load])

  return { ...state, reload: () => load() }
}
