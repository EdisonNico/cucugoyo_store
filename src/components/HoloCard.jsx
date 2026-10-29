import { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { formatPrice } from '../lib/format'

// Carta de la página del producto: se inclina con el mouse o el dedo, brilla como una carta
// holográfica y se voltea al tocarla para mostrar los datos del producto en el reverso.
export default function HoloCard({ product, details = [] }) {
  const reduce = useReducedMotion()
  const [flipped, setFlipped] = useState(false)
  const [active, setActive] = useState(false)

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), { stiffness: 220, damping: 18 })
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [14, -14]), { stiffness: 220, damping: 18 })
  const shine = useTransform([px, py], ([x, y]) => `${(x + 0.5) * 100}% ${(y + 0.5) * 100}%`)
  const glare = useTransform(
    [px, py],
    ([x, y]) => `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,.45), transparent 55%)`,
  )

  const track = (e) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
    setActive(true)
  }
  const release = () => {
    px.set(0)
    py.set(0)
    setActive(false)
  }
  const toggle = () => setFlipped((f) => !f)

  return (
    <div className="holo-wrap">
      <motion.div
        className={active ? 'holo-tilt is-active' : 'holo-tilt'}
        style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
        onPointerEnter={track}
        onPointerMove={track}
        onPointerDown={track}
        onPointerLeave={release}
        onPointerUp={(e) => e.pointerType === 'touch' && release()}
        onPointerCancel={release}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggle()
          }
        }}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={flipped ? 'Volver a ver la carta' : 'Voltear la carta para ver más datos'}
      >
        <motion.div
          className="holo-flip"
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 140, damping: 18 }}
        >
          <div className="holo-face holo-front">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} draggable={false} />
            ) : (
              <span className="card-noimg">Sin imagen</span>
            )}
            {!reduce && (
              <>
                <motion.span className="holo" style={{ backgroundPosition: shine }} aria-hidden="true" />
                <motion.span className="holo-glare" style={{ backgroundImage: glare }} aria-hidden="true" />
              </>
            )}
            <span className="holo-hint">Toca para voltear</span>
          </div>

          <div className="holo-face holo-back">
            <h3 className="holo-back-title">{product.name}</h3>
            <p className="holo-back-price">{formatPrice(product.price)}</p>
            {details.length > 0 && (
              <dl className="holo-specs">
                {details.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            <span className="holo-hint holo-hint-back">Toca para volver</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
