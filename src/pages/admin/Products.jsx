import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import { useDebounce } from '../../hooks/useDebounce'
import { deleteProduct, setPublished } from '../../services/productService'
import { CATEGORY_LABELS, formatPrice } from '../../lib/format'
import { EmptyState, ErrorMessage, Loader } from '../../components/States'

export default function AdminProducts() {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState(location.state?.message ? { type: 'ok', text: location.state.message } : null)
  const [busyId, setBusyId] = useState(null)
  const debounced = useDebounce(search)

  const { products, loading, error, reload } = useProducts({
    admin: true,
    search: debounced || undefined,
    category: category || undefined,
  })

  async function togglePublish(p) {
    setBusyId(p.id)
    setMessage(null)
    try {
      await setPublished(p.id, !p.published)
      setMessage({ type: 'ok', text: p.published ? 'Producto despublicado.' : 'Producto publicado.' })
      reload()
    } catch (e) {
      console.error(e)
      setMessage({ type: 'error', text: 'No se pudo cambiar el estado.' })
    }
    setBusyId(null)
  }

  async function remove(p) {
    if (!window.confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return
    setBusyId(p.id)
    setMessage(null)
    try {
      await deleteProduct(p)
      setMessage({ type: 'ok', text: 'Producto eliminado.' })
      reload()
    } catch (e) {
      console.error(e)
      setMessage({ type: 'error', text: 'No se pudo eliminar el producto.' })
    }
    setBusyId(null)
  }

  return (
    <>
      <div className="admin-head">
        <h1>Productos</h1>
        <Link className="btn" to="/admin/productos/nuevo">
          + Nuevo producto
        </Link>
      </div>

      {message && (
        <div className={`alert ${message.type === 'ok' ? 'alert-ok' : 'alert-error'}`} role="status">
          {message.text}
        </div>
      )}

      <div className="filters">
        <label>
          Buscar por nombre
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} maxLength={100} />
        </label>
        <label>
          Categoría
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Todas</option>
            <option value="carta">Cartas</option>
            <option value="sellado">Paquetes sellados</option>
          </select>
        </label>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={reload} />
      ) : products.length === 0 ? (
        <EmptyState message="No hay productos. Crea el primero con «Nuevo producto»." />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.imageUrl ? <img className="thumb" src={p.imageUrl} alt="" /> : <span className="thumb thumb-empty" />}</td>
                  <td>
                    <strong>{p.name}</strong>
                    {p.collection && <div className="muted">{p.collection}</div>}
                  </td>
                  <td>{CATEGORY_LABELS[p.category]}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={p.published ? 'pill pill-ok' : 'pill'}>{p.published ? 'Publicado' : 'Borrador'}</span>
                  </td>
                  <td className="actions">
                    <Link className="btn btn-small btn-ghost" to={`/admin/productos/${p.id}`}>
                      Editar
                    </Link>
                    <button className="btn btn-small btn-ghost" disabled={busyId === p.id} onClick={() => togglePublish(p)}>
                      {p.published ? 'Despublicar' : 'Publicar'}
                    </button>
                    <button className="btn btn-small btn-danger" disabled={busyId === p.id} onClick={() => remove(p)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
