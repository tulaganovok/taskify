import { KeyboardEvent, RefObject, useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { Plus, X } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { CardFormSchema } from '@/lib/types'
import { cardFormSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldGroup } from '../ui/field'
import TextareaField from '../fields/textarea.field'
import { toast } from 'sonner'
import { createCard } from '@/actions/card.action'
import { useParams } from 'next/navigation'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'

interface CardFormProps {
  listId: string
  isEditing: boolean
  enableEditing: () => void
  disableEditing: () => void
}

export default function CardForm({
  listId,
  isEditing,
  enableEditing,
  disableEditing,
}: CardFormProps) {
  const cardForm = useForm<CardFormSchema>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: { title: '' },
  })

  const title = useWatch({ name: 'title', control: cardForm.control })
  const formRef = useRef<HTMLFormElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const params = useParams()

  const isCardFormSubmitting = cardForm.formState.isSubmitting
  const isCardFormSubmitted = cardForm.formState.isSubmitted

  const onCardFormSubmit = async (data: CardFormSchema) => {
    const value = data.title.trim()

    if (!value) {
      disableEditing()
      cardForm.reset()
      return
    }

    try {
      await createCard(value, params.boardId as string, listId)
      cardForm.reset()
      toast.success('Card created successfully')
    } catch {
      toast.error('Failed to create card')
    }
  }

  const onEnterListener = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      cardForm.handleSubmit(onCardFormSubmit)()
    }
  }

  const onEscapeListener = (event: globalThis.KeyboardEvent) => {
    if (!isEditing || isCardFormSubmitting) return

    if (event.key === 'Escape') {
      disableEditing()
      cardForm.reset()
    }
  }

  const onCardFormBlur = () => {
    if (isCardFormSubmitting) return

    const value = (title ?? '').trim()

    if (!value) {
      cardForm.reset()
      disableEditing()
      return
    }

    cardForm.handleSubmit(onCardFormSubmit)()
  }

  const onCloseCardForm = () => {
    disableEditing()
    cardForm.reset()
  }

  useEffect(() => {
    if (isEditing || isCardFormSubmitted) {
      textareaRef.current?.focus()
    }
  }, [isEditing, isCardFormSubmitted])

  useEventListener('keydown', onEscapeListener)
  useOnClickOutside(formRef as RefObject<HTMLElement>, onCardFormBlur)

  if (isEditing)
    return (
      <form id='card-form' ref={formRef} onSubmit={cardForm.handleSubmit(onCardFormSubmit)}>
        <FieldGroup className='space-y-2'>
          <TextareaField
            name='title'
            control={cardForm.control}
            className='resize-none text-sm px-2 py-1 h-14'
            placeholder='Enter a title'
            ref={textareaRef}
            disabled={isCardFormSubmitting}
            onKeyDown={onEnterListener}
          />

          <div className='flex items-center gap-x-2'>
            <Button type='submit' size='sm' className='rounded-sm' disabled={isCardFormSubmitting}>
              Add card
            </Button>

            <Button
              type='button'
              size={'icon-sm'}
              variant={'ghost'}
              className='rounded-sm'
              disabled={isCardFormSubmitting}
              onClick={onCloseCardForm}
            >
              <X className='size-5' />
            </Button>
          </div>
        </FieldGroup>
      </form>
    )

  return (
    <Button
      size={'sm'}
      variant={'ghost'}
      className='w-full justify-start text-muted-foreground text-sm hover:bg-black/10'
      disabled={isCardFormSubmitting}
      onClick={enableEditing}
    >
      <Plus className='size-4' />
      Add a card
    </Button>
  )
}
