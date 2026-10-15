import { STORE } from '../config/store'

// Texto de ejemplo: reemplázalo por tus términos reales (envíos, cambios, pagos, etc.).
export default function Terms() {
  return (
    <div className="page prose">
      <h1>Términos y condiciones</h1>
      <p>
        Los precios están expresados en soles peruanos (PEN) y la disponibilidad puede variar sin previo aviso.
        Las compras se coordinan directamente con {STORE.name} por WhatsApp.
      </p>
      <h2>Estado de las cartas</h2>
      <p>
        Cada carta indica su estado de conservación (NM, LP, MP, HP o DMG). Si tienes dudas, consúltanos antes de
        comprar.
      </p>
      <h2>Envíos y cambios</h2>
      <p>Edita esta sección con tus condiciones de envío, plazos y política de cambios.</p>
    </div>
  )
}
