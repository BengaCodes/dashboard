const ResultCard = ({
  label, value, sub, accent, bg, border, highlighted = false,
}: {
  label: string; value: string; sub: string
  accent: string; bg: string; border: string; highlighted?: boolean
}) => (
  <div style={{
    padding: highlighted ? '18px 16px' : '16px',
    borderRadius: '12px',
    background: bg,
    border: `0.5px solid ${border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    boxShadow: highlighted ? `0 0 24px ${accent}18` : 'none',
  }}>
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '9px',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: 'var(--color-text-muted)',
    }}>
      {label}
    </span>
    <span style={{
      fontFamily: 'var(--font-ui)',
      fontWeight: 800,
      fontSize: highlighted ? '28px' : '22px',
      letterSpacing: highlighted ? '-1px' : '-0.5px',
      color: accent,
      lineHeight: 1.1,
    }}>
      {value}
    </span>
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      color: 'rgba(255,255,255,0.25)',
      marginTop: '1px',
    }}>
      {sub}
    </span>
  </div>
)

export default ResultCard
