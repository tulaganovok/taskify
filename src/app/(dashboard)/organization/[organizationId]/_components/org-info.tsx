'use client'

import { useOrganization } from '@clerk/nextjs'
import { CreditCard } from 'lucide-react'
import Image from 'next/image'
import OrgInfoSkeleton from './org-info-skeleton'

interface OrgInfoProps {
  isPro: boolean
}

export default function OrgInfo({ isPro }: OrgInfoProps) {
  const { organization, isLoaded } = useOrganization()

  if (!isLoaded) return <OrgInfoSkeleton />

  return (
    <div className='flex items-center gap-x-4'>
      <div className='size-15 relative'>
        <Image
          src={organization?.imageUrl || ''}
          alt={organization?.name || 'Organization Image'}
          fill
          className='rounded-md object-cover'
        />
      </div>

      <div className='space-y-1'>
        <p className='font-semibold text-xl line-clamp-1'>{organization?.name}</p>

        <div className='flex items-center text-sm text-muted-foreground'>
          <CreditCard className='size-4 mr-1.5' />
          {isPro ? 'Pro' : 'Free'}
        </div>
      </div>
    </div>
  )
}
