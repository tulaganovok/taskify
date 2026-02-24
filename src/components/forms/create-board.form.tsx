'use client'

import { CreateBoardFormSchema } from '@/lib/types'
import { createBoardFormSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FieldGroup } from '../ui/field'
import InputField from '../fields/input.field'
import { Button } from '../ui/button'
import WallpaperField from '../fields/wallpaper.field'
import { useAuth } from '@clerk/nextjs'
import { createBoard } from '@/actions/board.action'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useProModal } from '@/hooks/use-pro-modal'

export default function CreateBoardForm() {
  const createBoardForm = useForm<CreateBoardFormSchema>({
    resolver: zodResolver(createBoardFormSchema),
    defaultValues: { title: '', image: '' },
  })
  const { onOpen } = useProModal()
  const { orgId } = useAuth()
  const router = useRouter()

  const isCreateFormSubmitting = createBoardForm.formState.isSubmitting

  const onCreateBoardFormSubmit = async ({ title, image }: CreateBoardFormSchema) => {
    if (!orgId) return

    const [imageId, imageThumbUrl, imageFullUrl, imageLinkHtml, imageUserName] = image.split('|')

    try {
      const newBoard = await createBoard({
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHtml,
        imageUserName,
      })

      if (!newBoard) {
        toast.warning('You have reached your limit of free boards. Please upgrade to create more.')
        onOpen()
        return
      }

      toast.success('Board created successfully')
      router.push(`/board/${newBoard.id}`)
    } catch {
      toast.error('Failed to create a board')
    }
  }

  return (
    <form id='create-board-form' onSubmit={createBoardForm.handleSubmit(onCreateBoardFormSubmit)}>
      <FieldGroup className='space-y-3 mt-0.5'>
        <WallpaperField
          name='image'
          control={createBoardForm.control}
          label='Select a wallpaper'
          disabled={isCreateFormSubmitting}
        />

        <InputField
          name='title'
          control={createBoardForm.control}
          label='Board title'
          placeholder='Enter board title'
          disabled={isCreateFormSubmitting}
        />

        <Button size={'sm'} disabled={isCreateFormSubmitting}>
          Create
        </Button>
      </FieldGroup>
    </form>
  )
}
