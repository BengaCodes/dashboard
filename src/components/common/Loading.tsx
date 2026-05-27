const Loading = () => (
  <div className='loader flex justify-center items-center min-h-64'>
    <div className='box'>
      <div className='top-side' />
      <div className='bottom-side' />
      <div className='screen'>
        <div className='lightray-limit'>
          <div className='lightray' />
        </div>
        <div className='loader-box'>
          <div className='progress' />
        </div>
      </div>
    </div>
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
