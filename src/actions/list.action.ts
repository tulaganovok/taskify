'use server'

import { List } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function getListsByBoardId(boardId: string) {
  const { orgId } = await auth()
  if (!orgId) return []

  return await prisma.list.findMany({
    where: { boardId, board: { orgId } },
    include: { cards: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  })
}

export async function createList(boardId: string, title: string) {
  const board = await prisma.board.findUnique({ where: { id: boardId } })
  if (!board) return

  const lastList = await prisma.list.findFirst({
    where: { boardId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })

  const newOrder = lastList ? lastList.order + 1 : 1
  await prisma.list.create({ data: { title, boardId, order: newOrder } })
  revalidatePath(`/board/${boardId}`, 'page')
}

export async function updateListById(id: string, boardId: string, data: Pick<List, 'title'>) {
  await prisma.list.update({ where: { id }, data })
  revalidatePath(`/board/${boardId}`, 'page')
}

export async function deleteListById(id: string, boardId: string) {
  await prisma.list.delete({ where: { id } })
  revalidatePath(`/board/${boardId}`, 'page')
}

export async function copyList(listId: string, boardId: string) {
  const listToCopy = await prisma.list.findUnique({
    where: { id: listId },
    include: { cards: true },
  })

  if (!listToCopy) return

  const lastList = await prisma.list.findFirst({
    where: { boardId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })

  const newOrder = lastList ? lastList.order + 1 : 1

  await prisma.list.create({
    data: {
      title: `${listToCopy.title} - Copy`,
      boardId: listToCopy.boardId,
      order: newOrder,
      cards: {
        createMany: {
          data: listToCopy.cards.map(card => ({
            title: card.title,
            description: card.description,
            order: card.order,
          })),
        },
      },
    },
    include: { cards: true },
  })

  revalidatePath(`/board/${boardId}`, 'page')
}

export async function updateListOrder(lists: List[], boardId: string) {
  const transaction = lists.map(list =>
    prisma.list.update({ where: { id: list.id }, data: { order: list.order } }),
  )

  await prisma.$transaction(transaction)
  revalidatePath(`/board/${boardId}`, 'page')
}
