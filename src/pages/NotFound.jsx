import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page center">
      <h1>Página no encontrada</h1>
      <p>La dirección que buscas no existe.</p>
      <Link className="btn" to="/">
        Ir al inicio
      </Link>
    </div>
  )
}
