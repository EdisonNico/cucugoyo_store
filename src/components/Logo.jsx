import { useState } from 'react'
import { STORE } from '../config/store'

// Muestra /public/logo.png; si no existe, muestra un círculo con las iniciales.
export default function Logo({ size = 72 }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span className="logo-fallback" style={{ width: size, height: size }} aria-label={STORE.name}>
        {STORE.name.slice(0, 2).toUpperCase()}
      </span>
    )
  }
  return (
    <img
      src={STORE.logo}
      alt={STORE.name}
      width={size}
      height={size}
      className="logo-img"
      onError={() => setFailed(true)}
    />
  )
}
