import Logo from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Navbar() {
  return (
    <header className='fixed top-0 w-full px-4 h-14 border-b-2 flex items-center'>
      <div className='md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto flex items-center w-full justify-between'>
        <Logo />

        <Button size={'sm'} asChild>
          <Link href={'/sign-in'}>Login</Link>
        </Button>
      </div>
    </header>
  )
}
