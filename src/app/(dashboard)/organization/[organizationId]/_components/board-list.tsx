import { LayoutDashboard } from 'lucide-react'
import CreateBoard from './create-board'
import { getOrgBoards } from '@/actions/board.action'
import Link from 'next/link'
import { getAvailableCount } from '@/actions/org-limit.action'
import { checkSubscription } from '@/actions/subscription.action'

export default async function BoardList() {
  const boards = await getOrgBoards()
  const availableCount = await getAvailableCount()
  const isPro = await checkSubscription()

  return (
    <div className='space-y-4'>
      <div className='flex items-center font-semibold text-lg text-accent-foreground'>
        <LayoutDashboard className='size-6 mr-2' />
        Your boards
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {boards.length > 0 &&
          boards.map(board => (
            <Link
              key={board.id}
              href={`/board/${board.id}`}
              className='group relative aspect-video bg-no-repeat bg-center bg-cover rounded-md bg-accent size-full p-2 overflow-hidden'
              style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
            >
              <div className='absolute inset-0 bg-black/30' />
              <p className='relative font-semibold text-white text-sm line-clamp-1'>
                {board.title}
              </p>
            </Link>
          ))}

        <CreateBoard availableCount={availableCount} isPro={isPro} />
      </div>
    </div>
  )
}
