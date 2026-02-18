import { getBoardById } from '@/actions/board.action'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

interface BoardIdLayoutProps extends PropsWithChildren {
  params: Promise<{ boardId: string }>
}

export async function generateMetadata({ params }: BoardIdLayoutProps): Promise<Metadata> {
  const { boardId } = await params
  const board = await getBoardById(boardId)
  return { title: `Taskify | ${board?.title}` }
}

export default async function BoardIdLayout({ children, params }: BoardIdLayoutProps) {
  const { boardId } = await params
  const board = await getBoardById(boardId)

  return (
    <div
      className='relative h-screen bg-no-repeat bg-cover bg-center bg-accent'
      style={{ backgroundImage: `url(${board?.imageFullUrl})` }}
    >
      <main className='h-full relative pt-28'>{children}</main>
    </div>
  )
}
