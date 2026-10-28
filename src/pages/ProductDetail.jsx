import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductBySlug } from '../services/productService'
import { subscribeProducts } from '../lib/realtime'
import { CATEGORY_LABELS, CONDITION_LABELS, LANGUAGE_LABELS, formatPrice, productWhatsappLink } from '../lib/format'
import { ErrorMessage, Loader } from '../components/States'
import HoloCard from '../components/HoloCard'

export default function ProductDetail() {
  const { slug } = useParams()
  const [state, setState] = useState({ product: null, loading: true, error: null })

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setState((s) => ({ ...s, loading: true, error: null }))
      try {
        const product = await getProductBySlug(slug)
        setState({ product, loading: false, error: null })
      } catch (e) {
        console.error(e)
        setState((s) => ({ ...s, loading: false, error: 'No pudimos cargar el producto.' }))
      }
    },
    [slug],
  )

  useEffect(() => {
    load()
  }, [load])

  // Si el admin cambia precio/stock o despublica, la página se actualiza sola.
  useEffect(() => subscribeProducts(() => load(true)), [load])

  const { product, loading, error } = state
  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} onRetry={() => load()} />
  if (!product) {
    return (
      <div className="page center">
        <h1>Producto no disponible</h1>
        <p>Es posible que ya no esté a la venta.</p>
        <Link className="btn" to="/catalogo">
          Ver catálogo
        </Link>
      </div>
    )
  }

  const soldOut = product.stock <= 0
  const details = [
    ['Categoría', CATEGORY_LABELS[product.category]],
    ['Colección', product.collection],
    ['Idioma', LANGUAGE_LABELS[product.language]],
    ['Estado', CONDITION_LABELS[product.condition]],
    ['Rareza', product.rarity],
    ['Número de carta', product.card_number],
    ['Tipo', product.product_type],
  ].filter(([, v]) => v)

  return (
    <div className="page detail">
      <div className="detail-media">
        <HoloCard product={product} details={details} />
      </div>
      <div className="detail-info">
        <Link to={product.category === 'carta' ? '/cartas' : '/paquetes'} className="back">
          ← Volver
        </Link>
        <h1>{product.name}</h1>
        <p className="detail-price">{formatPrice(product.price)}</p>
        <p className={soldOut ? 'stock stock-out' : 'stock'}>
          {soldOut ? 'Agotado' : `Disponible (${product.stock} en stock)`}
        </p>

        {product.description && <p className="detail-desc">{product.description}</p>}

        {product.contents && (
          <>
            <h3>Contenido</h3>
            <p className="detail-desc">{product.contents}</p>
          </>
        )}

        {details.length > 0 && (
          <dl className="specs">
            {details.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}

        <a className="btn btn-wa" href={productWhatsappLink(product)} target="_blank" rel="noopener noreferrer">
          {soldOut ? 'Consultar disponibilidad por WhatsApp' : 'Consultar / comprar por WhatsApp'}
        </a>
      </div>
    </div>
  )
}
