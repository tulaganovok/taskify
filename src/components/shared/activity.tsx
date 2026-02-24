import { AuditLog } from '@/generated/prisma/client'
import { Skeleton } from '../ui/skeleton'
import { ActivityIcon } from 'lucide-react'
import ActivityItem from './activity-item'

interface ActivityProps {
  auditLogs: AuditLog[]
}

export default function Activity({ auditLogs }: ActivityProps) {
  return (
    <div className='flex items-start gap-x-3 w-full'>
      <ActivityIcon className='size-5 mt-0.5 text-accent-foreground' />

      <div className='w-full'>
        <p className='font-semibold text-accent-foreground mb-2'>Activity</p>

        <ol className='mt-2 space-y-4'>
          {auditLogs.map(auditLog => (
            <ActivityItem key={auditLog.id} auditLog={auditLog} />
          ))}
        </ol>
      </div>
    </div>
  )
}

Activity.Skeleton = function ActivitySkeleton() {
  return (
    <div className='flex items-start gap-x-3 w-full'>
      <Skeleton className='size-6' />

      <div className='w-full'>
        <Skeleton className='w-24 h-6 mb-2' />
        <Skeleton className='w-full h-10' />
      </div>
    </div>
  )
}
