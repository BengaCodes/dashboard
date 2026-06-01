const BAR_HEIGHTS = [45, 68, 54, 82, 60, 76, 50, 72]

const Loading = () => (
  <div className='fixed inset-0 bg-slate-950 flex flex-col items-center justify-center gap-10 z-50'>
    <div className='flex items-center gap-3'>
      <svg width='44' height='44' viewBox='0 0 44 44' aria-hidden='true'>
        <defs>
          <linearGradient id='l-bg' x1='5' y1='5' x2='39' y2='39' gradientUnits='userSpaceOnUse'>
            <stop offset='0' stopColor='#0f172a' />
            <stop offset='1' stopColor='#1e3a8a' />
          </linearGradient>
          <linearGradient id='l-line' x1='10' y1='30' x2='34' y2='12' gradientUnits='userSpaceOnUse'>
            <stop offset='0' stopColor='#22d3ee' />
            <stop offset='1' stopColor='#34d399' />
          </linearGradient>
        </defs>
        <rect x='2' y='2' width='40' height='40' rx='12' fill='url(#l-bg)' />
        <rect x='10' y='24' width='4' height='10' rx='2' fill='#cbd5e1' opacity='0.9' />
        <rect x='17' y='19' width='4' height='15' rx='2' fill='#cbd5e1' opacity='0.95' />
        <rect x='24' y='14' width='4' height='20' rx='2' fill='#e2e8f0' />
        <path
          d='M10 28.5 L19 22.5 L25.5 25.5 L33.5 14.5'
          stroke='url(#l-line)'
          strokeWidth='2.7'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
        />
        <circle cx='33.5' cy='14.5' r='2.2' fill='#34d399' />
      </svg>
      <div className='leading-none'>
        <span className='block text-[26px] font-extrabold tracking-tight text-white'>
          FinTraxx
        </span>
        <span className='block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 mt-0.5'>
          Finance Tracker
        </span>
      </div>
    </div>

    <div className='flex items-end gap-[5px] h-14'>
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className='w-[7px] rounded-t bg-blue-500'
          style={{
            height: `${h}%`,
            transformOrigin: 'bottom',
            animation: `bar-breathe 1.4s ease-in-out ${i * 0.11}s infinite alternate`
          }}
        />
      ))}
    </div>

    <p className='text-slate-500 text-[11px] font-medium uppercase tracking-[0.22em]'>
      Loading your dashboard
    </p>
  </div>
)

export default Loading

export const Spinner = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className='animate-spin text-current'
    aria-hidden='true'
  >
    <circle
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      strokeWidth='3'
      strokeOpacity='0.25'
    />
    <path
      d='M12 2a10 10 0 0 1 10 10'
      stroke='currentColor'
      strokeWidth='3'
      strokeLinecap='round'
    />
  </svg>
)
