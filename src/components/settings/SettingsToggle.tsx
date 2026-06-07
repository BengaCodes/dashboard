const SettingsToggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    role='switch'
    aria-checked={checked}
    onClick={onChange}
    style={{
      position: 'relative',
      display: 'inline-flex',
      width: '36px',
      height: '20px',
      borderRadius: '99px',
      border: 'none',
      background: checked ? '#4DFFC3' : 'rgba(255,255,255,0.12)',
      cursor: 'pointer',
      transition: 'background 200ms ease',
      flexShrink: 0,
    }}
  >
    <span
      style={{
        position: 'absolute',
        top: '2px',
        left: checked ? '18px' : '2px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: checked ? '#0B0F1A' : 'rgba(255,255,255,0.5)',
        transition: 'left 200ms ease, background 200ms ease',
      }}
    />
  </button>
)

export default SettingsToggle
