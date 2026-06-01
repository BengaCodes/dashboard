interface SkeletonProps {
  className?: string
}

const Skeleton = ({ className = '' }: SkeletonProps) => (
  <div className={`shimmer rounded-md ${className}`} aria-hidden='true' />
)

export const SkeletonCard = () => (
  <div className='bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4'>
    <div className='flex items-center justify-between'>
      <Skeleton className='h-3.5 w-28' />
      <Skeleton className='h-8 w-8 rounded-lg' />
    </div>
    <Skeleton className='h-8 w-36' />
    <div className='space-y-1.5'>
      <Skeleton className='h-2 w-full rounded-full' />
      <div className='flex justify-between'>
        <Skeleton className='h-2.5 w-16' />
        <Skeleton className='h-2.5 w-10' />
      </div>
    </div>
  </div>
)

export const SkeletonRow = () => (
  <div className='flex items-center gap-4 px-5 py-4'>
    <Skeleton className='h-10 w-10 rounded-xl shrink-0' />
    <div className='flex-1 space-y-2 min-w-0'>
      <Skeleton className='h-4 w-2/5' />
      <Skeleton className='h-3 w-1/4' />
    </div>
    <div className='flex flex-col items-end gap-1.5'>
      <Skeleton className='h-4 w-16' />
      <Skeleton className='h-2.5 w-12' />
    </div>
  </div>
)

export default Skeleton
