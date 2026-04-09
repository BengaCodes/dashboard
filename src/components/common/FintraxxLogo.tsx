type FintraxxLogoProps = {
  className?: string
}

const FintraxxLogo = ({ className = '' }: FintraxxLogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <svg
        width='44'
        height='44'
        viewBox='0 0 44 44'
        role='img'
        aria-label='Fintraxx logo icon'
      >
        <defs>
          <linearGradient
            id='fintraxx-bg'
            x1='5'
            y1='5'
            x2='39'
            y2='39'
            gradientUnits='userSpaceOnUse'
          >
            <stop offset='0' stopColor='#0f172a' />
            <stop offset='1' stopColor='#1e3a8a' />
          </linearGradient>
          <linearGradient
            id='fintraxx-line'
            x1='10'
            y1='30'
            x2='34'
            y2='12'
            gradientUnits='userSpaceOnUse'
          >
            <stop offset='0' stopColor='#22d3ee' />
            <stop offset='1' stopColor='#34d399' />
          </linearGradient>
        </defs>

        <rect
          x='2'
          y='2'
          width='40'
          height='40'
          rx='12'
          fill='url(#fintraxx-bg)'
        />

        <rect
          x='10'
          y='24'
          width='4'
          height='10'
          rx='2'
          fill='#cbd5e1'
          opacity='0.9'
        />
        <rect
          x='17'
          y='19'
          width='4'
          height='15'
          rx='2'
          fill='#cbd5e1'
          opacity='0.95'
        />
        <rect x='24' y='14' width='4' height='20' rx='2' fill='#e2e8f0' />

        <path
          d='M10 28.5 L19 22.5 L25.5 25.5 L33.5 14.5'
          stroke='url(#fintraxx-line)'
          strokeWidth='2.7'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
        />

        <circle cx='33.5' cy='14.5' r='2.2' fill='#34d399' />
      </svg>

      <div className='leading-none'>
        <span className='block text-[30px] font-extrabold tracking-tight text-gray-900'>
          FinTraxx
        </span>
        <span className='block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500'>
          Finance Tracker
        </span>
      </div>
    </div>
  )
}

export default FintraxxLogo
