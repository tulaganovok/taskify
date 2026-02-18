import { OrganizationProfile } from '@clerk/nextjs'

export default function SettingsPage() {
  return (
    <div className='w-full'>
      <OrganizationProfile
        afterLeaveOrganizationUrl='/'
        routing='hash'
        appearance={{
          elements: {
            rootBox: { width: '100%', boxShadow: 'none' },
            cardBox: { border: '1px solid #e5e5e5', boxShadow: 'none', height: '80vh' },
          },
        }}
      />
    </div>
  )
}
