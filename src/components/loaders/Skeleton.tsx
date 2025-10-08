import { memo } from 'react'

type SkeletonProps = {
  className?: string
}

const Skeleton = memo<SkeletonProps>(({ className = '' }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className={`animate-pulse rounded-lg bg-slate-800/60 ${className}`}
    />
  )
})

Skeleton.displayName = 'Skeleton'

export default Skeleton
