import { Link } from 'react-router-dom'
import { formatPrice } from '../lib/format'

export default function ProductCard({ product }) {
  const soldOut = product.stock <= 0
  return (
    <Link to={`/producto/${product.slug}`} className="card">
      <div className="card-img">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <span className="card-noimg">Sin imagen</span>
        )}
        {soldOut && <span className="badge badge-out">Agotado</span>}
        {!soldOut && product.featured && <span className="badge">Destacado</span>}
      </div>
      <div className="card-body">
        <h3 className="card-title">{product.name}</h3>
        {product.description && <p className="card-desc">{product.description}</p>}
        <div className="card-foot">
          <strong className="card-price">{formatPrice(product.price)}</strong>
          <span className={soldOut ? 'stock stock-out' : 'stock'}>
            {soldOut ? 'Sin stock' : product.stock <= 3 ? `¡Quedan ${product.stock}!` : 'Disponible'}
          </span>
        </div>
      </div>
    </Link>
  )
}
