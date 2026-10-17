const PHONES = [
  { display: '+51 981 035 761', number: '51981035761' }, 
  { display: '+51 977 467 689', number: '51977467689' },  
]

// Datos de la tienda. Cambia aquí el nombre, contacto y redes: se actualiza en todo el sitio.
export const STORE = {
  name: 'Cucugoyo Store',
  tagline: 'TCG & Collectibles',
  slogan: '¡Atrapa tus cartas favoritas y lleva tu colección al siguiente nivel!',

  // Coloca tus imágenes en la carpeta /public con estos nombres (o cambia la ruta aquí).
  logo: '/logo.png',
  hero: '/hero.jpg',

  // Teléfonos / WhatsApp en formato internacional, solo números (Perú = 51 + número).
  // El primero se usa también en la cabecera y en el botón flotante.
  phones: PHONES,
  whatsappNumber: PHONES[0].number,

  // Mensaje que se escribe al abrir WhatsApp desde los números del pie de página.
  welcomeMessage: `¡Hola! 👋 Bienvenido a Cucugoyo Store, tu tienda de confianza para los amantes de Pokémon TCG. ⚡🔥

🎴 Ofrecemos cartas Pokémon y paquetes para que puedas ampliar tu colección, descubrir nuevas cartas y disfrutar al máximo del mundo Pokémon.

📦 Contamos con productos para coleccionistas, jugadores y fans de todas las edades.

💬 ¡Cuéntanos qué carta o paquete Pokémon te interesa y con gusto te ayudaremos! 🎴✨

✨ Cucugoyo Store: ¡Atrapa tus cartas favoritas y lleva tu colección al siguiente nivel! ⚡`,

  instagramUrl: 'https://instagram.com/tu_usuario',
  email: '',
}
