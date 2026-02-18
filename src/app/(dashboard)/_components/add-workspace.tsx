import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useAddWorkspace } from '@/hooks/use-add-workspace'
import { CreateOrganization } from '@clerk/nextjs'
import { Plus } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function AddWorkspace() {
  const { isOpen, onOpen, onClose } = useAddWorkspace()
  const pathname = usePathname()

  useEffect(() => {
    onClose()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <>
      <Button type='button' size={'icon-xs'} variant={'ghost'} className='ml-auto' onClick={onOpen}>
        <Plus className='size-4 text-muted-foreground' />
      </Button>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent showCloseButton={false} className='p-0 gap-0 rounded-2xl'>
          <CreateOrganization
            afterCreateOrganizationUrl={'/organization/:id'}
            appearance={{ elements: { rootBox: { width: '100%' }, cardBox: { width: '100%' } } }}
          />
          <DialogTitle className='hidden' />
          <DialogDescription className='hidden' />
        </DialogContent>
      </Dialog>
    </>
  )
}
