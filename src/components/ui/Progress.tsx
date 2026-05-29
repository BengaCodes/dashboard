interface ProgressProps {
  value: number
  color?: string
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md'
}

const Progress = ({
  value,
  color = '#2563eb',
  className = '',
  showLabel = false,
  size = 'sm'
}: ProgressProps) => {
  const clamped = Math.min(Math.max(value, 0), 100)
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5'

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className='mb-1 flex justify-end'>
          <span className='text-xs text-slate-500'>{clamped.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full ${height} rounded-full bg-slate-100 overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default Progress
