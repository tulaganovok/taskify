import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'Taskify | Auth',
  description: 'This is auth layout of Taskify'
}

export default function ClerkLayout({ children }: PropsWithChildren) {
  return <div className='flex items-center justify-center w-full h-screen'>{children}</div>
}
