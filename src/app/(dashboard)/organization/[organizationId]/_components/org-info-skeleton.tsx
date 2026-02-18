import { Skeleton } from '@/components/ui/skeleton'

export default function OrgInfoSkeleton() {
  return (
    <div className='flex items-center gap-x-4'>
      <div className='size-15 relative'>
        <Skeleton className='size-full' />
      </div>

      <div className='space-y-3'>
        <Skeleton className='h-5 w-64' />

        <div className='flex items-center text-sm text-muted-foreground'>
          <Skeleton className='size-4 mr-2 rounded-sm' />
          <Skeleton className='h-4 w-16 rounded-sm' />
        </div>
      </div>
    </div>
  )
}
