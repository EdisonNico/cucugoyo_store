import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { STORE } from '../../config/store'

export default function AdminLayout() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()

  async function logout() {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="admin">
      <header className="admin-bar">
        <strong>{STORE.name} · Panel</strong>
        <nav>
          <Link to="/admin/productos">Productos</Link>
          <Link to="/" target="_blank">
            Ver tienda
          </Link>
        </nav>
        <span className="admin-user">{session?.user?.email}</span>
        <button className="btn btn-small" onClick={logout}>
          Cerrar sesión
        </button>
      </header>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}
