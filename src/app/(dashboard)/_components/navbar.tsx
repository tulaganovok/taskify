'use client'

import Logo from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import { OrganizationSwitcher, useOrganization, UserButton, useUser } from '@clerk/nextjs'
import { Plus } from 'lucide-react'
import MobileSidebar from './mobile-sidebar'
import { Skeleton } from '@/components/ui/skeleton'

export default function Navbar() {
  const { isLoaded: isUserLoaded } = useUser()
  const { isLoaded: isOrganizationLoaded } = useOrganization()



  return (
    <header className='fixed z-50 top-0 w-full h-14 border-b-2 flex items-center px-4 md:px-8 lg:px-16'>
      <div className='flex items-center gap-x-3'>
        <MobileSidebar />
        <Logo />
      </div>

      <div className='ml-auto flex items-center gap-x-2'>
        <Button size={'sm'}>
          <Plus className='md:hidden' />
          <span className='max-md:hidden'>Create</span>
        </Button>

        {isOrganizationLoaded ?
          <OrganizationSwitcher
            afterCreateOrganizationUrl={`/organization/:id`}
            afterSelectOrganizationUrl={'/organization/:id'}
            afterLeaveOrganizationUrl='/sign-in'
            appearance={{
              elements: {
                rootBox: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
                avatarBox: { width: 35, height: 35 },

                organizationSwitcherTriggerIcon: { display: 'none' },
                organizationPreview__organizationSwitcherTrigger: { gap: 0 },
                organizationPreviewMainIdentifier__organizationSwitcherTrigger: { display: 'none' },
              },
            }}
          />
          : <Skeleton className='size-9 mx-2' />}

        {isUserLoaded ?
          <UserButton appearance={{ elements: { avatarBox: { width: 35, height: 35 } } }} />
          : <Skeleton className='size-9 rounded-full' />}
      </div>
    </header>
  )
}
