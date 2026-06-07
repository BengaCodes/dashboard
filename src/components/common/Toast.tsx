const Toast = ({
  message,
  type,
  onDismiss,
}: {
  message: string
  type: 'success' | 'error'
  onDismiss: () => void
}) => {
  const ok = type === 'success'
  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        padding: '11px 16px',
        borderRadius: '10px',
        background: ok ? '#071510' : '#150710',
        border: `0.5px solid ${ok ? 'rgba(77,255,195,0.28)' : 'rgba(255,78,122,0.28)'}`,
        color: ok ? '#4DFFC3' : '#FF4E7A',
        fontFamily: 'var(--font-ui)',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        backdropFilter: 'blur(12px)',
        animation: 'slideInFromRight 200ms ease both',
        userSelect: 'none',
        maxWidth: '340px',
      }}
    >
      <span style={{ fontSize: '15px', lineHeight: 1 }}>{ok ? '✓' : '✕'}</span>
      {message}
    </div>
  )
}

export default Toast
