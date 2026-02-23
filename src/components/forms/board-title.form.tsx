'use client'

import { Board } from '@/generated/prisma/client'
import { Button } from '../ui/button'
import { useEffect, useRef, useState } from 'react'
import InputField from '../fields/input.field'
import { useForm, useWatch } from 'react-hook-form'
import { BoardTitleFormSchema } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { boardTitleFormSchema } from '@/lib/validations'
import { FieldGroup } from '../ui/field'
import { toast } from 'sonner'
import { updateBoardById } from '@/actions/board.action'

interface BoardTitleFormProps {
  board: Board
}

export default function BoardTitleForm({ board }: BoardTitleFormProps) {
  const boardTitleForm = useForm<BoardTitleFormSchema>({
    resolver: zodResolver(boardTitleFormSchema),
    defaultValues: { title: board.title },
  })

  const title = useWatch({ name: 'title', control: boardTitleForm.control })
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const isBoardTitleFormSubmitting = boardTitleForm.formState.isSubmitting

  const onBoardTitleFormSubmit = async (data: BoardTitleFormSchema) => {
    const value = data.title.trim()

    if (!value || value === board.title) {
      setIsEditing(false)
      return
    }

    try {
      await updateBoardById(board.id, { title: value })
      setIsEditing(false)
      toast.success('Board title updated successfully')
      boardTitleForm.reset({ title: value })
    } catch {
      toast.error('Failed to update the board title')
    }
  }

  const onBoardTitleFormBlur = () => {
    if (isBoardTitleFormSubmitting) return

    const value = (title ?? '').trim()

    if (!value) {
      boardTitleForm.reset()
      setIsEditing(false)
      return
    }

    boardTitleForm.handleSubmit(onBoardTitleFormSubmit)()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()

      boardTitleForm.reset()
      setIsEditing(false)
    }
  }

  const onCloseBoardTitleForm = () => {
    setIsEditing(false)
    boardTitleForm.reset()
  }

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  useEffect(() => {
    boardTitleForm.reset({ title: board.title })
  }, [board.title, boardTitleForm])

  if (isEditing)
    return (
      <form
        id='board-title-form'
        onSubmit={
          title.trim().length>0 ? boardTitleForm.handleSubmit(onBoardTitleFormSubmit) : onCloseBoardTitleForm
        }
      >
        <FieldGroup className='w-64'>
          <InputField
            ref={inputRef}
            type='text'
            name='title'
            control={boardTitleForm.control}
            disabled={isBoardTitleFormSubmitting}
            hiddenErrorMessage
            onBlur={onBoardTitleFormBlur}
            onKeyDown={onKeyDown}
            className='text-lg font-bold h-7 focus:focus-visible:outline-0 focus-visible:ring-transparent border-none text-white rounded-xs md:text-lg p-1 shadow-none'
          />
        </FieldGroup>
      </form>
    )

  return (
    <Button
      size={'sm'}
      variant={'ghost'}
      disabled={isBoardTitleFormSubmitting}
      onClick={() => setIsEditing(true)}
      className='font-bold text-lg size-auto hover:bg-white/20 hover:text-white rounded-xs'
    >
      {board.title}
    </Button>
  )
}
