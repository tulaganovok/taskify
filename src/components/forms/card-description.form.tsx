import { CardDescriptionFormSchema, CardWithList } from '@/lib/types'
import { cardDescriptionFormSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlignLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FieldGroup } from '../ui/field'
import TextareaField from '../fields/textarea.field'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { updateCardById } from '@/actions/card.action'
import { toast } from 'sonner'

interface CardDescriptionProps {
  card: CardWithList
}

export default function CardDescriptionForm({ card }: CardDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const queryClient = useQueryClient()
  const params = useParams()

  const cardDescriptionForm = useForm<CardDescriptionFormSchema>({
    resolver: zodResolver(cardDescriptionFormSchema),
    defaultValues: { description: card.description ?? '' },
  })

  const isCardFormSubmitting = cardDescriptionForm.formState.isSubmitting

  const onCardDescriptionFormSubmit = async (data: CardDescriptionFormSchema) => {
    try {
      await updateCardById(card.id, params.boardId as string, data)

      await queryClient.invalidateQueries({ queryKey: ['card', card.id] })
      await queryClient.invalidateQueries({ queryKey: ['card-logs', card.id] })

      toast.success('Card description updated successfully')
      disableEditing()
    } catch {
      toast.error('Failed to update card description')
    }
  }

  const disableEditing = () => {
    setIsEditing(false)
    cardDescriptionForm.reset()
  }

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus()
      textareaRef.current?.select()
    }
  }, [isEditing])

  return (
    <div className='flex items-start gap-x-3 w-full'>
      <AlignLeft className='size-5 mt-0.5 text-accent-foreground' />

      <div className='w-full'>
        <p className='font-semibold text-accent-foreground mb-2'>Description</p>

        {isEditing ? (
          <form
            id='card-description-form'
            onSubmit={cardDescriptionForm.handleSubmit(onCardDescriptionFormSubmit)}
          >
            <FieldGroup className='space-y-2'>
              <TextareaField
                name='description'
                control={cardDescriptionForm.control}
                ref={textareaRef}
                disabled={isCardFormSubmitting}
                placeholder='Add a more detailed description...'
                className='bg-secondary min-h-20 max-md:text-sm'
              />

              <div className='flex items-center gap-x-2'>
                <Button type='submit' size={'sm'} disabled={isCardFormSubmitting}>
                  Save
                </Button>

                <Button
                  type='button'
                  size='sm'
                  variant={'outline'}
                  disabled={isCardFormSubmitting}
                  onClick={disableEditing}
                >
                  Cancel
                </Button>
              </div>
            </FieldGroup>
          </form>
        ) : (
          <div
            role='button'
            className={cn(
              'min-h-20 text-sm font-medium py-3 px-3.5 rounded-md bg-secondary',
              !card.description && 'text-muted-foreground',
            )}
            onClick={() => setIsEditing(true)}
          >
            {card.description ?? 'Add a more detailed description...'}
          </div>
        )}
      </div>
    </div>
  )
}
