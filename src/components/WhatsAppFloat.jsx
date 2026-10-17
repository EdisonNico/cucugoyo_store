import { STORE } from '../config/store'
import { whatsappLink } from '../lib/format'
import { WhatsAppIcon } from './Icons'

export default function WhatsAppFloat() {
  return (
    <a
      className="whatsapp-float"
      href={whatsappLink(STORE.welcomeMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <WhatsAppIcon size={64} />
    </a>
  )
}