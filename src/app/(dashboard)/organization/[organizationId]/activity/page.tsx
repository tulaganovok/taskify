import { Separator } from '@/components/ui/separator'
import OrgInfo from '../_components/org-info'
import { Suspense } from 'react'
import ActivityList from './_components/activity-list'
import { checkSubscription } from '@/actions/subscription.action'

export default async function ActivityPage() {
  const isPro = await checkSubscription()

  return (
    <div className='w-full'>
      <OrgInfo isPro={isPro} />
      <Separator className='my-2' />

      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  )
}
