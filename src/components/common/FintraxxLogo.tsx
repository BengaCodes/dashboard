type FintraxxLogoProps = {
  className?: string
}

const FintraxxLogo = ({ className = '' }: FintraxxLogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        role="img"
        aria-label="Fintraxx logo"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="logo-bg" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#4DFFC3" />
            <stop offset="1" stopColor="#1EC8FF" />
          </linearGradient>
        </defs>
        <rect width="34" height="34" rx="8" fill="url(#logo-bg)" />
        {/* bar chart bars */}
        <rect x="7"  y="20" width="4" height="8"  rx="1.5" fill="rgba(11,15,26,0.55)" />
        <rect x="13" y="15" width="4" height="13" rx="1.5" fill="rgba(11,15,26,0.7)"  />
        <rect x="19" y="10" width="4" height="18" rx="1.5" fill="rgba(11,15,26,0.85)" />
        {/* trend line */}
        <path
          d="M8 22.5 L15 18 L21 20.5 L27 11"
          stroke="#0B0F1A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.9"
        />
        <circle cx="27" cy="11" r="2" fill="#0B0F1A" opacity="0.9" />
      </svg>

      <div style={{ lineHeight: 1 }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            fontSize: '18px',
            letterSpacing: '-0.01em',
            color: 'var(--color-text-primary)',
          }}
        >
          FinTraxx
        </span>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontWeight: 400,
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginTop: '3px',
          }}
        >
          Finance Tracker
        </span>
      </div>
    </div>
  )
}

export default FintraxxLogo
