'use client'

import { useProModal } from '@/hooks/use-pro-modal'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog'
import Image from 'next/image'
import { Button } from '../ui/button'
import { useState } from 'react'
import { checkoutSubscription } from '@/actions/subscription.action'
import { toast } from 'sonner'

export default function ProModal() {
  const { isOpen, onClose } = useProModal()
  const [isUpgrading, setIsUpgrading] = useState(false)

  const onUpgrade = async () => {
    setIsUpgrading(true)

    try {
      const data = await checkoutSubscription()
      if (!data) return
      window.location.href = data.url
    } catch {
      toast.error('Failed to upgrade organization')
    } finally {
      setIsUpgrading(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md p-0 overflow-hidden'>
        <DialogTitle className='hidden' />
        <DialogDescription className='hidden' />

        <div className='aspect-video relative flex items-center justify-center'>
          <Image src={'/billing.png'} alt='Billing' fill className='object-cover' />
        </div>

        <div className='text-accent-foreground mx-auto space-y-1 p-6'>
          <h2 className='font-bold text-xl'>Upgrade to Taskify Pro Today!</h2>

          <p className='text-sm font-semibold text-muted-foreground'>Explore the best of Taskify</p>

          <div className='pl-3 my-6'>
            <ul className='text-base list-disc font-medium'>
              <li>Unlimited boards</li>
              <li>Advanced checklist</li>
              <li>Admin and security features</li>
              <li>And more!</li>
            </ul>
          </div>

          <Button className='w-full' disabled={isUpgrading} onClick={onUpgrade}>
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
