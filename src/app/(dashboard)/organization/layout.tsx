import { PropsWithChildren } from 'react'
import Sidebar from '../_components/sidebar'

export default function OrganizationLayout({ children }: PropsWithChildren) {
  return (
    <main className='pt-20 md:pt-24 px-4 md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto'>
      <div className='flex gap-x-7'>
        <div className='w-64 shrink-0 hidden md:block'>
          <Sidebar />
        </div>

        {children}
      </div>
    </main>
  )
}
