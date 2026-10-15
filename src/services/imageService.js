import { supabase } from '../lib/supabase'

export const BUCKET = 'product-images'
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024 // 3 MB (el bucket también lo impone)
const EXT_BY_TYPE = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

// Devuelve un mensaje de error o null si la imagen es válida.
export function validateImage(file) {
  if (!file) return null
  if (!EXT_BY_TYPE[file.type]) return 'La imagen debe ser JPG, PNG o WebP.'
  if (file.size > MAX_IMAGE_BYTES) return 'La imagen no puede superar 3 MB.'
  return null
}

export function getImageUrl(path) {
  if (!path) return null
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

// Sube la imagen con un nombre aleatorio y devuelve la ruta guardada en la base de datos.
export async function uploadImage(file) {
  const error = validateImage(file)
  if (error) throw new Error(error)
  const path = `${crypto.randomUUID()}.${EXT_BY_TYPE[file.type]}`
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: false })
  if (uploadError) throw uploadError
  return path
}

export async function removeImage(path) {
  if (!path) return
  await supabase.storage.from(BUCKET).remove([path])
}

// Borra la imagen solo si ningún producto la sigue usando.
export async function removeImageIfUnused(path) {
  if (!path) return
  const { count, error } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('image_path', path)
  if (error || count > 0) return // ante la duda, NO borrar
  await removeImage(path)
}
