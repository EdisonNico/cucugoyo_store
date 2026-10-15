import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { STORE } from '../../config/store'

export default function Login() {
  const { session, isAdmin, loading, signIn, signOut } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (loading || !session) return
    if (isAdmin) navigate('/admin/productos', { replace: true })
    else {
      setError('Esta cuenta no tiene permisos de administrador.')
      signOut()
    }
  }, [loading, session, isAdmin, navigate, signOut])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error: err } = await signIn(email.trim(), password)
    setBusy(false)
    // Mensaje genérico: no revelar si el correo existe.
    if (err) setError('Correo o contraseña incorrectos.')
  }

  return (
    <div className="login-wrap">
      <form className="login" onSubmit={onSubmit}>
        <h1>{STORE.name}</h1>
        <p>Acceso administrador</p>
        <label>
          Correo
          <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}
        <button className="btn" disabled={busy}>
          {busy ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
