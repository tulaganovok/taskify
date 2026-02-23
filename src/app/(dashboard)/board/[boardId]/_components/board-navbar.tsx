import BoardTitleForm from '@/components/forms/board-title.form'
import { Board } from '@/generated/prisma/client'
import BoardOptions from './board-options'

interface BoardNavbarProps {
  board: Board
}

export default function BoardNavbar({ board }: BoardNavbarProps) {
  return (
    <div className='w-full h-14 z-40 bg-black/30 fixed top-14 flex items-center px-6 gap-x-4 text-white justify-between'>
      <BoardTitleForm board={board} />
      <BoardOptions boardId={board.id} />
    </div>
  )
}
