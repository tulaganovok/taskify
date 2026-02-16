'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { useMobileSidebar } from '@/hooks/use-mobile-sidebar'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from './sidebar'

export default function MobileSidebar() {
  const { isOpen, onOpen, onClose } = useMobileSidebar()
  const pathname = usePathname()

  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  return (
    <>
      <Button
        size={'icon'}
        variant={'ghost'}
        className='md:hidden size-6 hover:bg-background'
        asChild
        onClick={onOpen}
      >
        <Menu />
      </Button>

      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side='left' className='p-2 pt-10'>
          <Sidebar storageKey='t-sidebar-mobile-state' />
          <SheetTitle />
          <SheetDescription />
        </SheetContent>
      </Sheet>
    </>
  )
}
