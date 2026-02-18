import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link href={'/'}>
      <div className='hover:opacity-75 transition items-center gap-x-2 flex'>
        <Image src={'/logo.svg'} alt='Logo' width={50} height={50} />
        <p className={cn('text-xl text-accent-foreground font-bold')}>Taskify</p>
      </div>
    </Link>
  )
}
