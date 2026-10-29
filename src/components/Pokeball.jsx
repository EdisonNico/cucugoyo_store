// Pokébola animada para las pantallas de carga (solo SVG + CSS).
export default function Pokeball() {
  return (
    <span className="pokeball" aria-hidden="true">
      <svg viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="22" fill="#fff" stroke="#3a2a20" strokeWidth="3" />
        <path d="M2 24a22 22 0 0 1 44 0z" fill="#d93a3a" stroke="#3a2a20" strokeWidth="3" strokeLinejoin="round" />
        <path d="M2 24h44" stroke="#3a2a20" strokeWidth="3" />
        <circle cx="24" cy="24" r="7" fill="#fff" stroke="#3a2a20" strokeWidth="3" />
        <circle cx="24" cy="24" r="2.6" fill="#3a2a20" />
      </svg>
    </span>
  )
}
