import { useCardModal } from '@/hooks/use-card-modal'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog'
import { useQuery } from '@tanstack/react-query'
import { CardWithList } from '@/lib/types'
import { fetcher } from '@/lib/utils'
import CardTitleForm from '../forms/card-title.form'
import { Skeleton } from '../ui/skeleton'
import CardDescriptionForm from '../forms/card-description.form'
import { Button } from '../ui/button'
import { useState } from 'react'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'
import { copyCardById, deleteCardById } from '@/actions/card.action'
import { AuditLog } from '@/generated/prisma/client'
import Activity from '../shared/activity'
import { Copy, Trash } from 'lucide-react'

export default function CardModal() {
  const { id, isOpen, onClose } = useCardModal()
  const [isPending, setIsPending] = useState(false)
  const params = useParams()

  const { data: card, isLoading } = useQuery<CardWithList>({
    queryKey: ['card', id],
    queryFn: () => fetcher(`/api/cards/${id}`),
  })

  const { data: auditLogs } = useQuery<AuditLog[]>({
    queryKey: ['card-logs', id],
    queryFn: () => fetcher(`/api/cards/${id}/logs`),
  })

  const onCopyCard = async () => {
    setIsPending(true)

    try {
      await copyCardById(card?.id as string, params.boardId as string)
      toast.success('Card copied successfully')
      onClose()
    } catch {
      toast.error('Failed to copy card')
    } finally {
      setIsPending(true)
    }
  }

  const onDeleteCard = async () => {
    setIsPending(true)

    try {
      await deleteCardById(card?.id as string, params.boardId as string)
      toast.success('Card deleted successfully')
      onClose()
    } catch {
      toast.error('Failed to delete card')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='md:min-w-3xl top-[40%]' onOpenAutoFocus={e => e.preventDefault()}>
        <DialogTitle className='hidden' />
        <DialogDescription className='hidden' />

        {isLoading ? (
          <div className='space-y-6'>
            <div className='space-y-2'>
              <Skeleton className='w-2/3 h-6' />
              <Skeleton className='w-1/3 h-4' />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 md:gap-4'>
              <div className='col-span-3 space-y-3'>
                <div className='flex items-center gap-x-2 w-full'>
                  <Skeleton className='size-5' />
                  <Skeleton className='h-5 w-1/2' />
                </div>

                <div className='pl-6'>
                  <Skeleton className='h-20 w-full' />
                </div>
              </div>

              <div className='space-y-4 max-md:mt-6'>
                <Skeleton className='h-4 w-32 md:w-full' />

                <div className='grid grid-cols-2 md:grid-cols-1 gap-2'>
                  <Skeleton className='h-7 w-full' />
                  <Skeleton className='h-7 w-full' />
                </div>
              </div>
            </div>
          </div>
        ) : card ? (
          <>
            <CardTitleForm card={card} />

            <div className='grid grid-cols-1 md:grid-cols-4 md:gap-4'>
              <div className='col-span-3'>
                <div className='w-full'>
                  <CardDescriptionForm card={card} />
                </div>
              </div>

              <div className='space-y-2 max-md:mt-6'>
                <p className='text-base font-semibold text-accent-foreground'>Actions</p>

                <div className='flex flex-row md:flex-col gap-2'>
                  <Button
                    size={'sm'}
                    variant={'secondary'}
                    disabled={isPending}
                    onClick={onCopyCard}
                    className='justify-start'
                  >
                    <Copy/>
                    Copy
                  </Button>

                  <Button
                    size={'sm'}
                    variant={'secondary'}
                    disabled={isPending}
                    onClick={onDeleteCard}
                    className='border-destructive hover:border-destructive text-destructive hover:text-destructive justify-start'
                  >
                    <Trash />
                    Delete
                  </Button>
                </div>
              </div>
            </div>

            {auditLogs ? <Activity auditLogs={auditLogs} /> : <Activity.Skeleton />}
          </>
        ) : (
          <div className='text-sm text-muted-foreground'>Card not found</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
