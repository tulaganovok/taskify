import { PropsWithChildren } from 'react'
import Sidebar from '../_components/sidebar'
import { auth, } from '@clerk/nextjs/server'
import { Metadata } from 'next'
import { getTitleBySlug } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const { orgSlug } = await auth()
  return { title: `Taskify | ${getTitleBySlug(orgSlug!)}` }
}

export default async function OrganizationIdLayout({ children }: PropsWithChildren) {
  return (
    <main className='pt-20 md:pt-24 px-4 md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto'>
      <div className='flex gap-x-16'>
        <div className='w-64 shrink-0 hidden md:block'>
          <Sidebar />
        </div>

        {children}
      </div>
    </main>
  )
}
