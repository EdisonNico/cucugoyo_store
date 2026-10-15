import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createProduct, getProductById, updateProduct } from '../../services/productService'
import { validateImage } from '../../services/imageService'
import { validateProduct } from '../../services/validation'
import { CONDITION_LABELS, LANGUAGE_LABELS } from '../../lib/format'
import { ErrorMessage, Loader } from '../../components/States'

const EMPTY = {
  name: '',
  category: 'carta',
  description: '',
  price: '',
  stock: '1',
  published: false,
  featured: false,
  collection: '',
  language: 'es',
  condition: 'NM',
  rarity: '',
  card_number: '',
  product_type: '',
  contents: '',
}

export default function ProductForm() {
  const { id } = useParams()
  const editing = Boolean(id)
  const navigate = useNavigate()

  const [values, setValues] = useState(EMPTY)
  const [original, setOriginal] = useState(null)
  const [loading, setLoading] = useState(editing)
  const [loadError, setLoadError] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!editing) return
    let active = true
    getProductById(id)
      .then((p) => {
        if (!active) return
        if (!p) return setLoadError('Producto no encontrado.')
        setOriginal(p)
        setValues({
          ...EMPTY,
          ...Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v ?? EMPTY[k] ?? ''])),
          price: String(p.price),
          stock: String(p.stock),
        })
      })
      .catch(() => active && setLoadError('No se pudo cargar el producto.'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id, editing])

  useEffect(() => {
    if (!file) return setPreview(null)
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const set = (name) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues((s) => ({ ...s, [name]: v }))
  }

  function onFile(e) {
    const f = e.target.files?.[0] || null
    const err = validateImage(f)
    if (err) {
      setErrors((s) => ({ ...s, image: err }))
      setFile(null)
      e.target.value = ''
      return
    }
    setErrors((s) => ({ ...s, image: undefined }))
    setFile(f)
  }

  async function onSubmit(e) {
    e.preventDefault()
    setFormError('')
    const found = validateProduct(values)
    if (Object.keys(found).length) {
      setErrors(found)
      setFormError('Revisa los campos marcados.')
      return
    }
    setErrors({})
    setSaving(true)
    try {
      if (editing) await updateProduct(id, values, file, original?.image_path)
      else await createProduct(values, file)
      navigate('/admin/productos', { state: { message: editing ? 'Producto actualizado.' : 'Producto creado.' } })
    } catch (err) {
      console.error(err)
      setFormError(err?.message ? `No se pudo guardar: ${err.message}` : 'No se pudo guardar el producto.')
      setSaving(false)
    }
  }

  if (loading) return <Loader />
  if (loadError) return <ErrorMessage message={loadError} />

  const isCard = values.category === 'carta'
  const shownImage = preview || original?.imageUrl
  const Err = ({ name }) => (errors[name] ? <small className="field-error">{errors[name]}</small> : null)

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="admin-head">
        <h1>{editing ? 'Editar producto' : 'Nuevo producto'}</h1>
        <Link className="btn btn-ghost" to="/admin/productos">
          Cancelar
        </Link>
      </div>

      {formError && (
        <div className="alert alert-error" role="alert">
          {formError}
        </div>
      )}

      <div className="form-grid">
        <label className="span-2">
          Nombre *
          <input value={values.name} onChange={set('name')} maxLength={150} />
          <Err name="name" />
        </label>

        <label>
          Categoría *
          <select value={values.category} onChange={set('category')}>
            <option value="carta">Carta individual</option>
            <option value="sellado">Paquete sellado</option>
          </select>
          <Err name="category" />
        </label>

        <label>
          Colección / expansión
          <input value={values.collection} onChange={set('collection')} maxLength={100} placeholder="Ej: Prismatic Evolutions" />
        </label>

        <label>
          Precio (S/) *
          <input type="number" min="0" step="0.01" value={values.price} onChange={set('price')} />
          <Err name="price" />
        </label>

        <label>
          Stock *
          <input type="number" min="0" step="1" value={values.stock} onChange={set('stock')} />
          <Err name="stock" />
        </label>

        <label>
          Idioma
          <select value={values.language} onChange={set('language')}>
            <option value="">—</option>
            {Object.entries(LANGUAGE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>

        {isCard ? (
          <>
            <label>
              Estado de la carta
              <select value={values.condition} onChange={set('condition')}>
                <option value="">—</option>
                {Object.entries(CONDITION_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Rareza
              <input value={values.rarity} onChange={set('rarity')} maxLength={60} placeholder="Ej: Double Rare" />
            </label>
            <label>
              Número de carta
              <input value={values.card_number} onChange={set('card_number')} maxLength={30} placeholder="Ej: 075/131" />
            </label>
          </>
        ) : (
          <>
            <label>
              Tipo de producto
              <input value={values.product_type} onChange={set('product_type')} maxLength={60} placeholder="Booster box, ETB, sobre…" />
            </label>
            <label className="span-2">
              Contenido del paquete
              <textarea rows={3} value={values.contents} onChange={set('contents')} maxLength={1000} />
            </label>
          </>
        )}

        <label className="span-2">
          Descripción
          <textarea rows={5} value={values.description} onChange={set('description')} maxLength={5000} />
          <Err name="description" />
        </label>

        <div className="span-2 image-field">
          <label>
            Imagen principal (JPG, PNG o WebP, máx. 3 MB)
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} />
            <Err name="image" />
          </label>
          {shownImage && <img className="preview" src={shownImage} alt="Vista previa" />}
          {editing && <small className="muted">Si no eliges un archivo nuevo, se conserva la imagen actual.</small>}
        </div>

        <label className="check">
          <input type="checkbox" checked={values.published} onChange={set('published')} />
          Publicado (visible en la tienda)
        </label>
        <label className="check">
          <input type="checkbox" checked={values.featured} onChange={set('featured')} />
          Destacado
        </label>
      </div>

      <button className="btn" disabled={saving}>
        {saving ? 'Guardando…' : 'Guardar producto'}
      </button>
    </form>
  )
}
