import { useRef } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { EmptyState, ErrorMessage, Loader } from './States'
import { ArrowIcon } from './Icons'

export default function ProductCarousel({ title, to, products, loading, error, onRetry }) {
  const track = useRef(null)
  const scroll = (dir) => {
    const el = track.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  return (
    <section className="section">
      <div className="section-head">
        <h2>{title}</h2>
        <div className="section-actions">
          {to && (
            <Link to={to} className="see-all">
              Ver todas
            </Link>
          )}
          <button className="arrow" onClick={() => scroll(-1)} aria-label="Anterior">
            <ArrowIcon dir="left" />
          </button>
          <button className="arrow" onClick={() => scroll(1)} aria-label="Siguiente">
            <ArrowIcon />
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={onRetry} />
      ) : products.length === 0 ? (
        <EmptyState message="Pronto añadiremos productos aquí." />
      ) : (
        <div className="carousel" ref={track}>
          {products.map((p, i) => (
            <div className="carousel-item" key={p.id}>
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
