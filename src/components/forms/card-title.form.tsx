import { CardTitleFormSchema, CardWithList } from '@/lib/types'
import { cardTitleFormSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FieldGroup } from '../ui/field'
import InputField from '../fields/input.field'
import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { updateCardById } from '@/actions/card.action'

interface CardTitleFormProps {
  card: CardWithList
}

export default function CardTitleForm({ card }: CardTitleFormProps) {
  const cardTitleForm = useForm<CardTitleFormSchema>({
    resolver: zodResolver(cardTitleFormSchema),
    defaultValues: { title: card.title },
  })
  const inputRef = useRef<HTMLInputElement | null>(null)
  const queryClient = useQueryClient()
  const params = useParams()

  const isCardTitleFormSubmitting = cardTitleForm.formState.isSubmitting

  const onCardTitleFormSubmit = async (data: CardTitleFormSchema) => {
    const newTitle = data.title.trim()
    if (!newTitle || newTitle === card.title) return

    try {
      await updateCardById(card.id, params.boardId as string, data)
      queryClient.invalidateQueries({ queryKey: ['card', card.id] })
      toast.success('Card title updated successfully')
    } catch {
      toast.error('Failed to update card title')
    }
  }

  return (
    <div className='flex items-center gap-x-3 mb-3 w-full'>
      <div className='w-full mr-4'>
        <form id='card-title-form' onSubmit={cardTitleForm.handleSubmit(onCardTitleFormSubmit)}>
          <FieldGroup>
            <InputField
              name='title'
              control={cardTitleForm.control}
              ref={inputRef}
              disabled={isCardTitleFormSubmitting}
              onBlur={cardTitleForm.handleSubmit(onCardTitleFormSubmit)}
              className='font-semibold text-xl md:text-xl p-0 text-accent-foreground bg-transparent not-focus-visible:border-none shadow-none relative -left-0.5 focus-visible:bg-white focus-visible:border-2 focus-visible:border-primary truncate aria-invalid:border-destructive aria-invalid:border-2'
            />
          </FieldGroup>
        </form>

        <p className='text-sm text-muted-foreground'>
          in list <span className='font-medium underline'>{card.list.title}</span>
        </p>
      </div>
    </div>
  )
}
