import { Skeleton } from '@/components/ui/skeleton'

export default function SidebarSkeleton() {
  return (
    <>
      <div className='flex items-center justify-between mb-2'>
        <Skeleton className='h-3 w-1/2' />
        <Skeleton className='size-3' />
      </div>

      <div className='space-y-2'>
        {Array.from({ length: 8 }).map((_, index) => <div key={index} className='flex items-center gap-x-4'>
          <div className='flex items-center gap-x-2 flex-1'>
            <Skeleton className='size-9' />
            <Skeleton className='h-3 w-2/3' />
          </div>

          <Skeleton className='size-3 mr-px' />
        </div>)}
      </div>
    </>
  )
}
