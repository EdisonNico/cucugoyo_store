import { supabase } from '../lib/supabase'
import { getImageUrl, removeImage, removeImageIfUnused, uploadImage } from './imageService'

const COLUMNS =
  'id,name,slug,description,category,price,stock,image_path,collection,language,condition,rarity,card_number,product_type,contents,featured,published,created_at,updated_at'

const SORTS = {
  recent: ['created_at', false],
  price_asc: ['price', true],
  price_desc: ['price', false],
  name: ['name', true],
}

const isNum = (n) => n !== undefined && n !== null && n !== '' && !Number.isNaN(Number(n))
const escapeLike = (s) => s.replace(/[\\%_]/g, (m) => `\\${m}`)
const withImage = (p) => ({ ...p, imageUrl: getImageUrl(p.image_path) })

// Lista de productos. Para la tienda pública se filtra SIEMPRE por published = true.
// (Además, RLS impide que un visitante vea borradores aunque cambie el código del navegador.)
export async function listProducts(opts = {}) {
  const { admin = false, category, search, minPrice, maxPrice, collection, featured, sort = 'recent', limit } = opts
  let q = supabase.from('products').select(COLUMNS)
  if (!admin) q = q.eq('published', true)
  if (category) q = q.eq('category', category)
  if (featured) q = q.eq('featured', true)
  if (collection) q = q.eq('collection', collection)
  if (search && search.trim()) q = q.ilike('name', `%${escapeLike(search.trim())}%`)
  if (isNum(minPrice)) q = q.gte('price', Number(minPrice))
  if (isNum(maxPrice)) q = q.lte('price', Number(maxPrice))
  const [col, asc] = SORTS[sort] || SORTS.recent
  q = q.order(col, { ascending: asc }).limit(limit || 500)
  const { data, error } = await q
  if (error) throw error
  return data.map(withImage)
}

export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select(COLUMNS)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()
  if (error) throw error
  return data ? withImage(data) : null
}

export async function getProductById(id) {
  const { data, error } = await supabase.from('products').select(COLUMNS).eq('id', id).maybeSingle()
  if (error) throw error
  return data ? withImage(data) : null
}

export async function listCollections(category) {
  let q = supabase.from('products').select('collection').eq('published', true).not('collection', 'is', null)
  if (category) q = q.eq('category', category)
  const { data, error } = await q.limit(1000)
  if (error) throw error
  return [...new Set(data.map((r) => r.collection))].sort((a, b) => a.localeCompare(b))
}

// ---------- Administración (RLS exige que el usuario sea admin) ----------

function slugify(text) {
  const base = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '')
  return base || 'producto'
}

function toRow(v) {
  const isCard = v.category === 'carta'
  const nz = (s) => ((s ?? '').toString().trim() || null)
  return {
    name: v.name.trim(),
    category: v.category,
    description: (v.description || '').trim(),
    price: Number(Number(v.price).toFixed(2)),
    stock: parseInt(v.stock, 10),
    published: !!v.published,
    featured: !!v.featured,
    collection: nz(v.collection),
    language: nz(v.language),
    // Los campos de carta/sellado que no corresponden se guardan vacíos (lo exige la base de datos).
    condition: isCard ? nz(v.condition) : null,
    rarity: isCard ? nz(v.rarity) : null,
    card_number: isCard ? nz(v.card_number) : null,
    product_type: isCard ? null : nz(v.product_type),
    contents: isCard ? null : nz(v.contents),
  }
}

export async function createProduct(values, imageFile) {
  const imagePath = imageFile ? await uploadImage(imageFile) : null
  const slug = `${slugify(values.name)}-${Math.random().toString(36).slice(2, 7)}`
  const { data, error } = await supabase
    .from('products')
    .insert({ ...toRow(values), slug, image_path: imagePath })
    .select(COLUMNS)
    .single()
  if (error) {
    await removeImage(imagePath) // no dejar imágenes huérfanas
    throw error
  }
  return withImage(data)
}

export async function updateProduct(id, values, imageFile, previousImagePath) {
  const newPath = imageFile ? await uploadImage(imageFile) : null
  const patch = toRow(values)
  if (newPath) patch.image_path = newPath
  const { data, error } = await supabase.from('products').update(patch).eq('id', id).select(COLUMNS).single()
  if (error) {
    await removeImage(newPath)
    throw error
  }
  if (newPath && previousImagePath && previousImagePath !== newPath) {
    await removeImageIfUnused(previousImagePath)
  }
  return withImage(data)
}

export async function setPublished(id, published) {
  const { error } = await supabase.from('products').update({ published }).eq('id', id)
  if (error) throw error
}

export async function deleteProduct(product) {
  const { error } = await supabase.from('products').delete().eq('id', product.id)
  if (error) throw error
  await removeImageIfUnused(product.image_path)
}
