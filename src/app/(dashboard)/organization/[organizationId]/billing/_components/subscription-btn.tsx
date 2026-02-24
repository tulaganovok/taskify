'use client'

import { checkoutSubscription } from '@/actions/subscription.action'
import ProModal from '@/components/modals/pro.modal'
import { Button } from '@/components/ui/button'
import { useProModal } from '@/hooks/use-pro-modal'
import { useState } from 'react'

interface SubscriptionBtnProps {
  isPro: boolean
}

export default function SubscriptionBtn({ isPro }: SubscriptionBtnProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { onOpen } = useProModal()

  const onClickSubscriptionBtn = async () => {
    setIsLoading(true)

    try {
      if (isPro) {
        const data = await checkoutSubscription()
        if (!data) return
        window.location.href = data.url
      } else {
        onOpen()
      }
    } catch {
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button disabled={isLoading} onClick={onClickSubscriptionBtn}>
        {isPro ? 'Manage subscription' : 'Upgrade to Pro'}
      </Button>

      <ProModal />
    </>
  )
}
