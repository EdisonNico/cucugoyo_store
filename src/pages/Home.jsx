import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductCarousel from '../components/ProductCarousel'
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
          <div className="hero-fallback">
            <h1>{STORE.name}</h1>
            <p>{STORE.slogan}</p>
          </div>
        )}
      </div>

      {featured.products.length > 0 && (
        <ProductCarousel title="Destacados" to="/catalogo" {...featured} onRetry={featured.reload} />
      )}
      <ProductCarousel title="Cartas" to="/cartas" {...cards} onRetry={cards.reload} />
      <ProductCarousel title="Paquetes sellados" to="/paquetes" {...sealed} onRetry={sealed.reload} />
    </>
  )
}
