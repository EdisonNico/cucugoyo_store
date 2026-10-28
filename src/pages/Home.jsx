import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import CoverflowCarousel from '../components/CoverflowCarousel'
import { STORE } from '../config/store'

export default function Home() {
  const [heroFailed, setHeroFailed] = useState(false)
  const featured = useProducts({ featured: true, limit: 12 })
  const cards = useProducts({ category: 'carta', limit: 12 })
  const sealed = useProducts({ category: 'sellado', limit: 12 })

  return (
    <>
      <div className="hero">
        {!heroFailed ? (
          <img src={STORE.hero} alt={STORE.name} onError={() => setHeroFailed(true)} />
        ) : (
          <div className="hero-fallback" aria-hidden="true" />
        )}
      </div>

      <div className="hero-text">
        <h1>{STORE.name}</h1>
        <p>{STORE.slogan}</p>
      </div>

      {featured.products.length > 0 && (
        <CoverflowCarousel title="Destacados" subtitle="Los favoritos de la tienda" to="/catalogo" {...featured} onRetry={featured.reload} />
      )}
      <CoverflowCarousel title="Cartas" subtitle="Desliza y toca una carta" to="/cartas" {...cards} onRetry={cards.reload} />
      <CoverflowCarousel title="Paquetes sellados" subtitle="Sobres, cajas y más" to="/paquetes" {...sealed} onRetry={sealed.reload} />
    </>
  )
}
