import { Link } from 'react-router-dom'
import { STORE } from '../config/store'
import { whatsappLink } from '../lib/format'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Logo size={96} />
        <div className="footer-body">
          <p className="footer-slogan">
            {STORE.name}: {STORE.slogan}
          </p>
          <div className="footer-links">
            <Link to="/paquetes">Productos sellados</Link>
            <Link to="/terminos">Términos y condiciones</Link>
            <Link to="/cartas">Cartas</Link>
          </div>
          <div className="footer-phones">
            <span>Teléfonos:</span>
            {STORE.phones.map((p) => (
              <a
                key={p.number}
                href={whatsappLink(STORE.welcomeMessage, p.number)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Escribir por WhatsApp al ${p.display}`}
              >
                {p.display}
              </a>
            ))}
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} {STORE.name}. Pokémon y sus marcas pertenecen a sus respectivos dueños.
          </p>
        </div>
      </div>
    </footer>
  )
}
