interface SkeletonProps {
  className?: string
}

const Skeleton = ({ className = '' }: SkeletonProps) => (
  <div
    className={`animate-pulse rounded bg-slate-200 ${className}`}
    aria-hidden='true'
  />
)

export const SkeletonCard = () => (
  <div className='bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-3'>
    <Skeleton className='h-4 w-1/3' />
    <Skeleton className='h-8 w-1/2' />
    <Skeleton className='h-3 w-1/4' />
  </div>
)

export const SkeletonRow = () => (
  <div className='flex items-center gap-4 p-4'>
    <Skeleton className='h-10 w-10 rounded-lg' />
    <div className='flex-1 space-y-2'>
      <Skeleton className='h-4 w-1/3' />
      <Skeleton className='h-3 w-1/4' />
    </div>
    <Skeleton className='h-5 w-20' />
  </div>
)

export default Skeleton
