import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { useDebounce } from '../hooks/useDebounce'
import { listCollections } from '../services/productService'
import ProductCard from '../components/ProductCard'
import { EmptyState, ErrorMessage, Loader } from '../components/States'

const TITLES = { carta: 'Cartas', sellado: 'Paquetes sellados' }

// Una sola página para /cartas, /paquetes y /catalogo. Los filtros viven en la URL.
export default function Catalog({ category = null }) {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('q') || '')
  const [collections, setCollections] = useState([])
  const debouncedSearch = useDebounce(search)
  const [open, setOpen] = useState(false) // panel de filtros cerrado al entrar

  // Si llega una búsqueda desde la barra superior, se refleja en el campo.
  const urlQ = params.get('q') || ''
  useEffect(() => setSearch(urlQ), [urlQ])

  const minPrice = params.get('min') || ''
  const maxPrice = params.get('max') || ''
  const collection = params.get('col') || ''
  const sort = params.get('sort') || 'recent'
  const cat = category || params.get('cat') || ''
  const activeFilters = [urlQ, minPrice, maxPrice, collection, sort !== 'recent' && sort, !category && cat].filter(Boolean).length

  useEffect(() => {
    listCollections(cat || undefined).then(setCollections).catch(() => setCollections([]))
  }, [cat])

  const query = useMemo(
    () => ({
      category: cat || undefined,
      search: debouncedSearch || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      collection: collection || undefined,
      sort,
    }),
    [cat, debouncedSearch, minPrice, maxPrice, collection, sort],
  )
  const { products, loading, error, reload } = useProducts(query)

  function setParam(name, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(name, value)
    else next.delete(name)
    setParams(next, { replace: true })
  }

  function clearFilters() {
    setSearch('')
    setParams({}, { replace: true })
  }

  return (
    <div className="page">
      <h1 className="page-title">{TITLES[cat] || 'Todos los productos'}</h1>

      <button
        type="button"
        className={`filters-toggle ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="filters-panel"
      >
        <span>Filtrar</span>
        {activeFilters > 0 && <span className="filters-count">{activeFilters}</span>}
        <span className="filters-chevron" aria-hidden="true">▾</span>
      </button>

      <div id="filters-panel" className={`filters-wrap ${open ? 'open' : ''}`}>
        <div className="filters-wrap-inner">
      <div className="filters">
        <label>
          Buscar
          <input
            type="search"
            value={search}
            maxLength={100}
            placeholder="Nombre del producto"
            onChange={(e) => {
              setSearch(e.target.value)
              setParam('q', e.target.value.trim())
            }}
          />
        </label>

        {!category && (
          <label>
            Categoría
            <select value={cat} onChange={(e) => setParam('cat', e.target.value)}>
              <option value="">Todas</option>
              <option value="carta">Cartas</option>
              <option value="sellado">Paquetes sellados</option>
            </select>
          </label>
        )}

        <label>
          Colección
          <select value={collection} onChange={(e) => setParam('col', e.target.value)}>
            <option value="">Todas</option>
            {collections.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          Precio mín. (S/)
          <input type="number" min="0" step="1" value={minPrice} onChange={(e) => setParam('min', e.target.value)} />
        </label>
        <label>
          Precio máx. (S/)
          <input type="number" min="0" step="1" value={maxPrice} onChange={(e) => setParam('max', e.target.value)} />
        </label>

        <label>
          Ordenar por
          <select value={sort} onChange={(e) => setParam('sort', e.target.value === 'recent' ? '' : e.target.value)}>
            <option value="recent">Más recientes</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
            <option value="name">Nombre (A-Z)</option>
          </select>
        </label>

        <button className="btn btn-ghost" onClick={clearFilters}>
          Limpiar filtros
        </button>
      </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={reload} />
      ) : products.length === 0 ? (
        <EmptyState message="No encontramos productos con esos filtros." />
      ) : (
        <>
          <p className="result-count">
            {products.length} producto{products.length === 1 ? '' : 's'}
          </p>
          <div className="grid">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
