import { PropsWithChildren } from 'react'

export default function ListWrapper({ children }: PropsWithChildren) {
  return <li className='shrink-0 h-full w-72 select-none'>{children}</li>
}
