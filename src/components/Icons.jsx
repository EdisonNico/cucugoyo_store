export function InstagramIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#fdb700" />
          <stop offset="0.4" stopColor="#f5266c" />
          <stop offset="1" stopColor="#8a2be2" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#ig)" />
      <rect x="12" y="12" width="24" height="24" rx="7" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="24" cy="24" r="5.5" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="31.5" cy="16.5" r="1.8" fill="#fff" />
    </svg>
  )
}

export function WhatsAppIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="#25d366" />
      <circle cx="24" cy="24" r="14" fill="none" stroke="#fff" strokeWidth="2.6" />
      <path d="M10.6 37.4l2.4-8.2 5.8 5.8z" fill="#fff" />
      <g transform="translate(14 14) scale(0.83)">
        <path
          d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
          fill="#fff"
        />
      </g>
    </svg>
  )
}

export function ArrowIcon({ dir = 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ transform: dir === 'left' ? 'scaleX(-1)' : 'none' }}>
      <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
