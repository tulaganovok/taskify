import { PropsWithChildren } from 'react'
import Navbar from './_components/navbar'
import Footer from './_components/footer'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function MarketingLayout({ children }: PropsWithChildren) {
  const { isAuthenticated, orgId } = await auth()

  if (isAuthenticated && orgId) return redirect(`/organization/${orgId}`)

  return (
    <div className='h-screen'>
      <Navbar />

      <main className='pt-40 pb-20'>{children}</main>

      <Footer />
    </div>
  )
}
