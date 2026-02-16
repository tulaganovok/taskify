import { PropsWithChildren } from 'react'

export default function CreateOrgLayout({ children }: PropsWithChildren) {
  return <div className='size-full flex items-center justify-center'>{children}</div>
}
