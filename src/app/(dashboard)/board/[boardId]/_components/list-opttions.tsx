import { copyList, deleteListById } from '@/actions/list.action'
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
import { Separator } from '@/components/ui/separator'
import { List } from '@/generated/prisma/client'
import { MoreHorizontal, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

interface ListOptionsProps {
  list: List
  onAddCard: () => void
}

export default function ListOptions({ list, onAddCard }: ListOptionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  const onCopyList = async () => {
    setIsLoading(true)

    try {
      await copyList(list.id, list.boardId)
      toast.success('List copied successfully')
    } catch {
      toast.error('Failed to copy list')
    } finally {
      setIsLoading(false)
      closeBtnRef.current?.click()
    }
  }

  const onDeleteList = async () => {
    setIsLoading(true)

    try {
      await deleteListById(list.id, list.boardId)
      toast.success('List deleted successfully')
    } catch {
      toast.error('Failed to delete list')
    } finally {
      setIsLoading(false)
      closeBtnRef.current?.click()
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={'icon-sm'} variant={'ghost'}>
          <MoreHorizontal className='size-4' />
        </Button>
      </PopoverTrigger>

      <PopoverContent side='bottom' align='start' className='px-0 py-3'>
        <PopoverHeader>
          <PopoverTitle className='text-accent-foreground text-center font-semibold'>
            List Actions
          </PopoverTitle>
          <PopoverDescription className='hidden' />
        </PopoverHeader>

        <PopoverClose asChild ref={closeBtnRef}>
          <Button size={'icon-xs'} variant={'ghost'} className='absolute top-3 right-3'>
            <X className='size-4 text-muted-foreground' />
          </Button>
        </PopoverClose>

        <Button
          size={'sm'}
          variant={'ghost'}
          className='justify-start w-full rounded-none font-normal mt-3 hover:bg-black/5 '
          disabled={isLoading}
          onClick={onAddCard}
        >
          Add card
        </Button>

        <Button
          size={'sm'}
          variant={'ghost'}
          className='justify-start w-full rounded-none font-normal hover:bg-black/5 '
          disabled={isLoading}
          onClick={onCopyList}
        >
          Copy list
        </Button>

        <Separator />

        <Button
          size={'sm'}
          variant={'ghost'}
          className='justify-start w-full rounded-none text-destructive hover:text-destructive font-normal hover:bg-black/5 '
          disabled={isLoading}
          onClick={onDeleteList}
        >
          Delete this list
        </Button>
      </PopoverContent>
    </Popover>
  )
}
