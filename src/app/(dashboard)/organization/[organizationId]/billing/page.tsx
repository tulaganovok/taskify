import { checkSubscription } from '@/actions/subscription.action'
import OrgInfo from '../_components/org-info'
import { Separator } from '@/components/ui/separator'
import SubscriptionBtn from './_components/subscription-btn'

export default async function BillingPage() {
  const isPro = await checkSubscription()

  return (
    <div className='w-full'>
      <OrgInfo isPro={isPro} />
      <Separator className='my-2' />
      <SubscriptionBtn isPro={isPro} />
    </div>
  )
}
