import { STORE } from '../config/store'

const money = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })

export function formatPrice(value) {
  return money.format(Number(value) || 0)
}

export function whatsappLink(message = '') {
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${STORE.whatsappNumber}${text}`
}

export function productWhatsappLink(product) {
  const url = `${window.location.origin}/producto/${product.slug}`
  return whatsappLink(
    `Hola ${STORE.name}, quiero consultar por: ${product.name} (${formatPrice(product.price)}).\n${url}`,
  )
}

export const LANGUAGE_LABELS = {
  es: 'Español',
  en: 'Inglés',
  ja: 'Japonés',
  ko: 'Coreano',
  zh: 'Chino',
  fr: 'Francés',
  de: 'Alemán',
  it: 'Italiano',
  pt: 'Portugués',
}

export const CONDITION_LABELS = {
  NM: 'NM (Casi nueva)',
  LP: 'LP (Poco usada)',
  MP: 'MP (Usada)',
  HP: 'HP (Muy usada)',
  DMG: 'DMG (Dañada)',
}

export const CATEGORY_LABELS = { carta: 'Carta', sellado: 'Paquete sellado' }
