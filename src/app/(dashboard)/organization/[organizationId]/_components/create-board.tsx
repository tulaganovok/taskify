'use client'

import CreateBoardForm from '@/components/forms/create-board.form'
import ProModal from '@/components/modals/pro.modal'
import Hint from '@/components/shared/hint'
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
import { MAX_FREE_BOARDS } from '@/lib/constants'
import { HelpCircle, X } from 'lucide-react'

interface CreateBoardProps {
  availableCount: number
  isPro: boolean
}

export default function CreateBoard({ availableCount, isPro }: CreateBoardProps) {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <div
            role='button'
            className='aspect-video relative size-full bg-muted rounded-md flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition cursor-pointer'
          >
            <p className='text-sm'>Create new board</p>

            <span className='text-xs text-muted-foreground'>
              {isPro ? 'Unlimited' : MAX_FREE_BOARDS - availableCount + ' remaining'}
            </span>

            <Hint description='Free workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace.'>
              <HelpCircle className='absolute bottom-2 right-2 size-3.5' />
            </Hint>
          </div>
        </PopoverTrigger>

        <PopoverContent side='right' className='p-3'>
          <PopoverHeader>
            <PopoverTitle className='text-center text-base font-semibold'>
              Create board
            </PopoverTitle>
            <PopoverDescription />
          </PopoverHeader>

          <PopoverClose asChild>
            <Button
              size={'icon-xs'}
              variant={'ghost'}
              className='absolute top-3 right-3 text-accent-foreground size-4 rounded-xs focus-visible:ring-0'
            >
              <X className='size-4' />
            </Button>
          </PopoverClose>

          <CreateBoardForm />
        </PopoverContent>
      </Popover>

      <ProModal />
    </>
  )
}
