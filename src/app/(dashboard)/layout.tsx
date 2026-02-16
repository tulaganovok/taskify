import { PropsWithChildren } from 'react'
import Navbar from './_components/navbar'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const { orgId } = await auth()

  if (!orgId) return redirect('/sign-in')

  return (
    <div className='h-screen'>
      <Navbar />

      {children}
    </div>
  )
}
