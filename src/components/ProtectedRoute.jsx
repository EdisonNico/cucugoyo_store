import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loader } from './States'

// Protege /admin/*. La verdadera seguridad está en RLS; esto solo evita mostrar pantallas inútiles.
export default function ProtectedRoute() {
  const { session, isAdmin, loading, signOut } = useAuth()
  const location = useLocation()

  if (loading) return <Loader label="Verificando acceso…" />
  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  if (!isAdmin) {
    return (
      <div className="page center">
        <h1>Sin autorización</h1>
        <p>Tu cuenta no tiene permisos de administrador.</p>
        <button className="btn" onClick={signOut}>
          Cerrar sesión
        </button>
      </div>
    )
  }
  return <Outlet />
}
