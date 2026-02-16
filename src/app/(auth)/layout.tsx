import { PropsWithChildren } from 'react'

export default function ClerkLayout({ children }: PropsWithChildren) {
  return <div className='flex items-center justify-center w-full h-screen'>{children}</div>
}
