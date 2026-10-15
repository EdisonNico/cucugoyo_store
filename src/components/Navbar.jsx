import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { STORE } from '../config/store'
import { whatsappLink } from '../lib/format'
import Logo from './Logo'
import { InstagramIcon, WhatsAppIcon } from './Icons'

export default function Navbar() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  function onSearch(e) {
    e.preventDefault()
    const term = q.trim()
    navigate(term ? `/catalogo?q=${encodeURIComponent(term)}` : '/catalogo')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" aria-label={`${STORE.name} - inicio`}>
          <Logo size={76} />
        </Link>

        <nav className="navbar-links" aria-label="Principal">
          <NavLink to="/cartas">Cartas</NavLink>
          <NavLink to="/paquetes">Paquetes sellados</NavLink>
        </nav>

        <form className="navbar-search" onSubmit={onSearch} role="search">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar productos…"
            aria-label="Buscar productos"
            maxLength={100}
          />
        </form>

        <div className="navbar-social">
          <a href={STORE.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <WhatsAppIcon />
          </a>
        </div>
      </div>
    </header>
  )
}
