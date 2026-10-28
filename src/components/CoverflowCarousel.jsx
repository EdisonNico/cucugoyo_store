import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { formatPrice } from '../lib/format'
import { EmptyState, ErrorMessage, Loader } from './States'
import { ArrowIcon } from './Icons'

// Carrusel 3D tipo "coverflow": la carta del centro se ve grande y las vecinas se inclinan.
// Se maneja arrastrando, con las flechas, con el teclado, o tocando una carta lateral.
export default function CoverflowCarousel({
  title,
  subtitle = 'Desliza y toca un producto',
  to,
  products,
  loading,
  error,
  onRetry,
}) {
  const [active, setActive] = useState(0)
  const [cw, setCw] = useState(190) // ancho de cada carta, según el ancho disponible
  const stage = useRef(null)
  const dragged = useRef(false)
  const reduce = useReducedMotion()
  const n = products.length
  const hasItems = !loading && !error && n > 0

  useEffect(() => {
    if (active > n - 1) setActive(Math.max(0, n - 1))
  }, [n, active])

  useLayoutEffect(() => {
    const el = stage.current
    if (!el) return undefined
    const measure = () => setCw(Math.max(150, Math.min(230, el.clientWidth * 0.4)))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [hasItems])

  const go = (d) => setActive((a) => Math.min(n - 1, Math.max(0, a + d)))

  const onPan = (_e, info) => {
    if (Math.abs(info.offset.x) > 6) dragged.current = true
  }
  const onPanEnd = (_e, info) => {
    const dx = info.offset.x
    const vx = info.velocity.x
    if (dx < -50 || vx < -400) go(1)
    else if (dx > 50 || vx > 400) go(-1)
    setTimeout(() => {
      dragged.current = false
    }, 0)
  }
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }

  const current = hasItems ? products[Math.min(active, n - 1)] : null

  return (
    <section className="section cf-section">
      <div className="cf-panel">
        <div className="cf-head">
          <h2>{title}</h2>
          <p>{subtitle}</p>
          {to && (
            <Link to={to} className="cf-all">
              Ver todas
            </Link>
          )}
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} onRetry={onRetry} />
        ) : n === 0 ? (
          <EmptyState message="Pronto añadiremos productos aquí." />
        ) : (
          <>
            <div className="cf-wrap">
              <button className="arrow cf-arrow cf-prev" onClick={() => go(-1)} disabled={active === 0} aria-label="Anterior">
                <ArrowIcon dir="left" />
              </button>

              <motion.div
                className="cf-stage"
                ref={stage}
                style={{ height: Math.round(cw * 1.4) + 24 }}
                onPan={onPan}
                onPanEnd={onPanEnd}
                onKeyDown={onKeyDown}
                tabIndex={0}
                role="group"
                aria-roledescription="carrusel"
                aria-label={title}
              >
                {products.map((p, i) => {
                  const off = i - active
                  const abs = Math.abs(off)
                  const visible = abs <= 3
                  const inner = (
                    <>
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} draggable={false} loading="lazy" />
                      ) : (
                        <span className="card-noimg">Sin imagen</span>
                      )}
                      {p.stock <= 0 && <span className="badge badge-out">Agotado</span>}
                    </>
                  )
                  return (
                    <motion.div
                      key={p.id}
                      className={off === 0 ? 'cf-item is-active' : 'cf-item'}
                      style={{
                        width: cw,
                        marginLeft: -cw / 2,
                        zIndex: 100 - abs,
                        pointerEvents: visible ? 'auto' : 'none',
                        transformPerspective: 1100,
                      }}
                      initial={false}
                      animate={{
                        x: off * cw * 0.62,
                        scale: 1 - Math.min(abs, 3) * 0.1,
                        rotateY: -Math.sign(off) * 38,
                        opacity: visible ? 1 : 0,
                      }}
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 26 }}
                    >
                      {off === 0 ? (
                        <Link
                          to={`/producto/${p.slug}`}
                          className="cf-card"
                          onClick={(e) => {
                            if (dragged.current) e.preventDefault()
                          }}
                        >
                          {inner}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="cf-card"
                          aria-label={`Ver ${p.name}`}
                          tabIndex={visible ? 0 : -1}
                          onClick={() => {
                            if (!dragged.current) setActive(i)
                          }}
                        >
                          {inner}
                        </button>
                      )}
                    </motion.div>
                  )
                })}
              </motion.div>

              <button className="arrow cf-arrow cf-next" onClick={() => go(1)} disabled={active === n - 1} aria-label="Siguiente">
                <ArrowIcon />
              </button>
            </div>

            <div className="cf-caption" aria-live="polite">
              <strong className="cf-name">{current.name}</strong>
              <span className="cf-price">{formatPrice(current.price)}</span>
            </div>

            {n > 1 && (
              <div className="cf-dots">
                {products.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    className={i === active ? 'cf-dot is-on' : 'cf-dot'}
                    onClick={() => setActive(i)}
                    aria-label={`Ir al producto ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
