export const CATEGORIES = ['carta', 'sellado']
export const LANGUAGES = ['es', 'en', 'ja', 'ko', 'zh', 'fr', 'de', 'it', 'pt']
export const CONDITIONS = ['NM', 'LP', 'MP', 'HP', 'DMG']

// Devuelve un objeto { campo: 'mensaje' }. Vacío = todo correcto.
// (La base de datos vuelve a validar todo con sus restricciones CHECK.)
export function validateProduct(v) {
  const errors = {}
  const name = (v.name || '').trim()
  if (name.length < 2 || name.length > 150) errors.name = 'El nombre debe tener entre 2 y 150 caracteres.'

  if (!CATEGORIES.includes(v.category)) errors.category = 'Elige una categoría.'

  const price = Number(v.price)
  if (v.price === '' || Number.isNaN(price) || price < 0 || price >= 1000000) {
    errors.price = 'Ingresa un precio válido (0 a 999,999.99).'
  }

  const stock = Number(v.stock)
  if (v.stock === '' || !Number.isInteger(stock) || stock < 0) {
    errors.stock = 'El stock debe ser un número entero mayor o igual a 0.'
  }

  if ((v.description || '').length > 5000) errors.description = 'La descripción no puede superar 5000 caracteres.'
  if (v.language && !LANGUAGES.includes(v.language)) errors.language = 'Idioma no válido.'
  if (v.category === 'carta' && v.condition && !CONDITIONS.includes(v.condition)) {
    errors.condition = 'Estado no válido.'
  }
  return errors
}
