import { Plus, X } from 'lucide-react'
import { Button } from '../ui/button'
import { RefObject, useEffect, useRef, useState } from 'react'
import { FieldGroup } from '../ui/field'
import InputField from '../fields/input.field'
import { useForm } from 'react-hook-form'
import { ListFormSchema } from '@/lib/types'
import { listFormSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { createList } from '@/actions/list.action'
import { toast } from 'sonner'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'
import { useParams } from 'next/navigation'

export default function ListForm() {
  const listForm = useForm<ListFormSchema>({
    resolver: zodResolver(listFormSchema),
    defaultValues: { title: '' },
  })

  const [isAdding, setIsAdding] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const params = useParams()

  const isListFormSubmitting = listForm.formState.isSubmitting
  const isSubmitted = listForm.formState.isSubmitted

  const onKeyDown = (event: globalThis.KeyboardEvent) => {
    if (!isAdding) return

    if (event.key === 'Escape') {
      setIsAdding(false)
      listForm.reset()
    }
  }

  const onListFormSubmit = async (data: ListFormSchema) => {
    try {
      await createList(params.boardId as string, data.title)
      listForm.reset()
      toast.success('List created successfully')
    } catch {
      toast.error('Failed to create list')
    }
  }

  const onCloseListForm = () => {
    if (!isAdding) return
    setIsAdding(false)
    listForm.reset()
  }

  useEffect(() => {
    if (isAdding || isSubmitted) {
      inputRef.current?.focus()
    }
  }, [isAdding, isSubmitted])

  useEventListener('keydown', onKeyDown)
  useOnClickOutside(formRef as RefObject<HTMLElement>, onCloseListForm)

  if (isAdding) {
    return (
      <form
        id='list-form'
        ref={formRef}
        onSubmit={listForm.handleSubmit(onListFormSubmit)}
        className='w-full p-3 rounded-xl bg-background space-y-4 shadow-sm'
      >
        <FieldGroup className='space-y-2'>
          <InputField
            name='title'
            control={listForm.control}
            placeholder='Enter list name...'
            disabled={isListFormSubmitting}
            ref={inputRef}
          />

          <div className='flex items-center gap-2'>
            <Button type='submit' size='sm' disabled={isListFormSubmitting}>
              Add list
            </Button>

            <Button
              type='button'
              size={'icon-sm'}
              variant={'ghost'}
              disabled={isListFormSubmitting}
              onClick={onCloseListForm}
            >
              <X className='size-5' />
            </Button>
          </div>
        </FieldGroup>
      </form>
    )
  }

  return (
    <Button
      variant={'ghost'}
      onClick={() => setIsAdding(true)}
      className='bg-background/50 hover:bg-background/70 w-full transition p-5 flex items-center font-medium justify-start text-sm rounded-xl'
    >
      <Plus className='size-4' />
      Add a list
    </Button>
  )
}
