'use server'

import { Action, EntityType, List } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { createAuditLog } from './audit-log.action'

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
  const newList = await prisma.list.create({ data: { title, boardId, order: newOrder } })

  await createAuditLog({
    entityTitle: newList.title,
    entityId: newList.id,
    entityType: EntityType.List,
    action: Action.Create,
  })

  revalidatePath(`/board/${boardId}`, 'page')
}

export async function updateListById(id: string, boardId: string, data: Pick<List, 'title'>) {
  const updatedList = await prisma.list.update({ where: { id }, data })

  await createAuditLog({
    entityTitle: updatedList.title,
    entityId: updatedList.id,
    entityType: EntityType.List,
    action: Action.Update,
  })

  revalidatePath(`/board/${boardId}`, 'page')
}

export async function deleteListById(id: string, boardId: string) {
  const deletedList = await prisma.list.delete({ where: { id } })

  await createAuditLog({
    entityTitle: deletedList.title,
    entityId: deletedList.id,
    entityType: EntityType.List,
    action: Action.Delete,
  })

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

  const copiedList = await prisma.list.create({
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

  await createAuditLog({
    entityTitle: copiedList.title,
    entityId: copiedList.id,
    entityType: EntityType.List,
    action: Action.Create,
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
