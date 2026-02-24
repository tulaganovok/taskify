import { getAuditLogs } from '@/actions/audit-log.action'
import ActivityItem from '@/components/shared/activity-item'
import { Skeleton } from '@/components/ui/skeleton'

export default async function ActivityList() {
  const auditLogs = await getAuditLogs()

  return (
    <ol className='space-y-4 mt-4'>
      <p className='hidden last:block text-sm text-center text-muted-foreground'>
        No activity found inside this organization
      </p>

      {auditLogs.map(auditLog => (
        <ActivityItem key={auditLog.id} auditLog={auditLog} />
      ))}
    </ol>
  )
}

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <ol className='space-y-4 mt-4'>
      <Skeleton className='w-4/5 h-10' />
      <Skeleton className='w-1/2 h-10' />
      <Skeleton className='w-[70%] h-10' />
      <Skeleton className='w-4/5 h-10' />
      <Skeleton className='w-3/4 h-10' />
    </ol>
  )
}
