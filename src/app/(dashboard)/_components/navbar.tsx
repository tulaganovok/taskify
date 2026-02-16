import Logo from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import { Plus } from 'lucide-react'
import MobileSidebar from './mobile-sidebar'

export default function Navbar() {
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

        <UserButton appearance={{ elements: { avatarBox: { width: 35, height: 35 } } }} />
      </div>
    </header>
  )
}
