import { ListTitleFormSchema, ListWithCards } from '@/lib/types'
import { listTitleFormSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { RefObject, useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'
import { Button } from '../ui/button'
import { FieldGroup } from '../ui/field'
import InputField from '../fields/input.field'
import { toast } from 'sonner'
import { updateListById } from '@/actions/list.action'
import { useParams } from 'next/navigation'
import ListOptions from '@/app/(dashboard)/board/[boardId]/_components/list-opttions'

interface ListTitleFormProps {
  list: ListWithCards
  onAddCard: () => void
}

export default function ListTitleForm({ list, onAddCard }: ListTitleFormProps) {
  const listTitleForm = useForm<ListTitleFormSchema>({
    resolver: zodResolver(listTitleFormSchema),
    defaultValues: { title: list.title },
  })

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const title = useWatch({ name: 'title', control: listTitleForm.control })
  const params = useParams()

  const isListTitleFormSubmitting = listTitleForm.formState.isSubmitting

  const onListTitleFormSubmit = async (data: ListTitleFormSchema) => {
    const value = data.title.trim()

    if (value === list.title) {
      setIsEditing(false)
      return
    }

    try {
      await updateListById(list.id, params.boardId as string, data)
      setIsEditing(false)
      toast.success('List title updated successfully')
      listTitleForm.reset({ title: value })
    } catch {
      toast.error('Failed to update the list title')
    }
  }

  const onKeyDown = (event: globalThis.KeyboardEvent) => {
    if (isListTitleFormSubmitting) return

    if (event.key === 'Escape') {
      setIsEditing(false)
      listTitleForm.reset()
    }
  }

  const onListTitleFormBlur = () => {
    if (isListTitleFormSubmitting) return

    const value = (title ?? '').trim()

    if (!value) {
      listTitleForm.reset()
      setIsEditing(false)
      return
    }

    listTitleForm.handleSubmit(onListTitleFormSubmit)()
  }

  const onCloseListTitleForm = () => {
    setIsEditing(false)
    listTitleForm.reset()
  }

  useEventListener('keydown', onKeyDown)
  useOnClickOutside(inputRef as RefObject<HTMLElement>, onListTitleFormBlur)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  return (
    <div className='pt-2 px-2 font-semibold flex justify-between items-start gap-x-2 w-full'>
      {isEditing ? (
        <form
          id='list-title-form'
          className='w-full'
          onSubmit={
            title.trim().length > 0
              ? listTitleForm.handleSubmit(onListTitleFormSubmit)
              : onCloseListTitleForm
          }
        >
          <FieldGroup className='w-full'>
            <InputField
              ref={inputRef}
              type='text'
              name='title'
              control={listTitleForm.control}
              disabled={isListTitleFormSubmitting}
              hiddenErrorMessage
              className='text-sm md:text-sm font-bold h-7 focus:focus-visible:outline-0 focus-visible:ring-transparent rounded-xs  p-1 shadow-none w-full'
            />
          </FieldGroup>
        </form>
      ) : (
        <Button
          size={'sm'}
          variant={'ghost'}
          disabled={isListTitleFormSubmitting}
          onClick={() => setIsEditing(true)}
          className='flex-1 px-2.5 py-1 h-7 font-semibold border-transparent text-sm cursor-pointer justify-start hover:bg-background whitespace-normal wrap-break-word text-left'
        >
          {list.title}
        </Button>
      )}

      <ListOptions list={list} onAddCard={onAddCard} />
    </div>
  )
}
