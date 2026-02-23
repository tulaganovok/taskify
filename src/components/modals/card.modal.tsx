import { useCardModal } from '@/hooks/use-card-modal'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog'
import { useQuery } from '@tanstack/react-query'
import { CardWithList } from '@/lib/types'
import { fetcher } from '@/lib/utils'
import CardTitleForm from '../forms/card-title.form'
import { Skeleton } from '../ui/skeleton'
import CardDescriptionForm from '../forms/card-description.form'

export default function CardModal() {
  const { id, isOpen, onClose } = useCardModal()

  const { data: card, isLoading } = useQuery<CardWithList>({
    queryKey: ['card', id],
    queryFn: () => fetcher(`/api/cards/${id}`),
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle className='hidden' />
        <DialogDescription className='hidden' />

        {isLoading ? (
          <Skeleton className='w-3/4 h-7' />
        ) : card ? (
          <>
            <CardTitleForm card={card} />

            <div className='grid grid-cols-1 md:grid-cols-4 md:gap-4'>
              <div className='col-span-3'>
                <div className='w-full'>
                  <CardDescriptionForm card={card} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className='text-sm text-muted-foreground'>Card not found</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
