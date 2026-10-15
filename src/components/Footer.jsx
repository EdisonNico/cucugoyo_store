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
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              Teléfono: {STORE.phoneDisplay}
            </a>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} {STORE.name}. Pokémon y sus marcas pertenecen a sus respectivos dueños.
          </p>
        </div>
      </div>
    </footer>
  )
}
