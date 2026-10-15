export function Loader({ label = 'Cargando…' }) {
  return (
    <div className="state" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state state-error" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button className="btn btn-small" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}

export function EmptyState({ message = 'No hay productos para mostrar.' }) {
  return <div className="state">{message}</div>
}
