'use client'

import { deleteBoardById } from '@/actions/board.action'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuth } from '@clerk/nextjs'
import { MoreHorizontal, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface BoardOptions {
  boardId: string
}

export default function BoardOptions({ boardId }: BoardOptions) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { orgId } = useAuth()
  const router = useRouter()

  const onDeleteBoard = async () => {
    setIsDeleting(true)

    try {
      await deleteBoardById(boardId)
      toast.success('Board deleted successfully')
      router.replace(`/organization/${orgId}`)
    } catch {
      toast.error('Failed to delete this board')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size={'icon-sm'}
          variant={'ghost'}
          className='hover:bg-white/20 hover:text-white'
        >
          <MoreHorizontal className='size-8' />
        </Button>
      </PopoverTrigger>

      <PopoverContent className='px-0 py-2 w-64'>
        <PopoverHeader>
          <PopoverTitle className='text-center font-semibold text-accent-foreground'>
            Board Actions
          </PopoverTitle>
          <PopoverDescription className='hidden' />
        </PopoverHeader>

        <PopoverClose asChild>
          <Button
            variant={'ghost'}
            className='absolute top-2 right-2 size-4'
            size={'icon-xs'}
            asChild
          >
            <X className='size-3 text-muted-foreground' />
          </Button>
        </PopoverClose>

        <Button
          variant={'ghost'}
          size={'sm'}
          className='rounded-none w-full justify-start font-normal text-sm border-none mt-2  hover:bg-black/5'
          disabled={isDeleting}
          onClick={() => router.push(`/organization/${orgId}`)}
        >
          Leave this board
        </Button>

        <Button
          variant={'ghost'}
          size={'sm'}
          className='rounded-none w-full justify-start font-normal text-sm border-none text-destructive hover:text-destructive hover:bg-black/5'
          disabled={isDeleting}
          onClick={onDeleteBoard}
        >
          Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  )
}
