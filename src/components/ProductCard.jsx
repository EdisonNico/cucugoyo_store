import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { formatPrice } from '../lib/format'

// Tarjeta con entrada "volteada", inclinación 3D al pasar el mouse y brillo holográfico.
export default function ProductCard({ product, index = 0 }) {
  const soldOut = product.stock <= 0
  const reduce = useReducedMotion()

  // Posición del puntero dentro de la tarjeta (de -0.5 a 0.5).
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), { stiffness: 220, damping: 18 })
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), { stiffness: 220, damping: 18 })
  const shine = useTransform([px, py], ([x, y]) => `${(x + 0.5) * 100}% ${(y + 0.5) * 100}%`)

  const onMove = (e) => {
    if (reduce || e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    px.set(0)
    py.set(0)
  }

  const entrance = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 28, rotateY: -70 },
        whileInView: { opacity: 1, y: 0, rotateY: 0 },
        viewport: { once: true, margin: '0px 0px -40px 0px' },
        transition: { duration: 0.55, delay: Math.min(index, 8) * 0.06, ease: [0.22, 1, 0.36, 1] },
      }

  return (
    <motion.div
      className="card-tilt"
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...entrance}
    >
      <Link to={`/producto/${product.slug}`} className="card">
        <div className="card-img">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} loading="lazy" />
          ) : (
            <span className="card-noimg">Sin imagen</span>
          )}
          {!reduce && <motion.span className="holo" style={{ backgroundPosition: shine }} aria-hidden="true" />}
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
    </motion.div>
  )
}
