import { getListsByBoardId } from '@/actions/list.action'
import ListContainer from './_components/list-container'

interface BoardIdPageProps {
  params: Promise<{ boardId: string }>
}

export default async function BoardIdPage({ params }: BoardIdPageProps) {
  const { boardId } = await params
  const lists = await getListsByBoardId(boardId)

  return (
    <div className='p-4 h-full overflow-x-auto'>
      <ListContainer boardId={boardId} lists={lists} />
    </div>
  )
}
