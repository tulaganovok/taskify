'use server'

import { Action, Card, EntityType } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createAuditLog } from './audit-log.action'

export async function createCard(title: string, boardId: string, listId: string) {
  const lastCard = await prisma.card.findFirst({
    where: { listId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })

  const newOrder = lastCard ? lastCard.order + 1 : 1
  const newCard = await prisma.card.create({ data: { title, listId, order: newOrder } })

  await createAuditLog({
    entityId: newCard.id,
    entityTitle: newCard.title,
    entityType: EntityType.Card,
    action: Action.Create,
  })

  revalidatePath(`/board/${boardId}`, 'page')
}

export async function updateCardOrder(cards: Card[], boardId: string) {
  const transaction = cards.map(card =>
    prisma.card.update({
      where: { id: card.id },
      data: { order: card.order, listId: card.listId },
    }),
  )

  await prisma.$transaction(transaction)
  revalidatePath(`/board/${boardId}`, 'page')
}

export async function updateCardById(id: string, boardId: string, data: Partial<Card>) {
  const updatedCard = await prisma.card.update({ where: { id }, data })

  await createAuditLog({
    entityId: updatedCard.id,
    entityTitle: updatedCard.title,
    entityType: EntityType.Card,
    action: Action.Update,
  })

  revalidatePath(`/board/${boardId}`, 'page')
}

export async function copyCardById(id: string, boardId: string) {
  const cardToCopy = await prisma.card.findUnique({ where: { id } })
  if (!cardToCopy) return

  const lastCard = await prisma.card.findFirst({
    where: { listId: cardToCopy.listId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })

  const newOrder = lastCard?.order ? lastCard.order + 1 : 1

  const copiedCard = await prisma.card.create({
    data: {
      title: `${cardToCopy.title} - Copy`,
      order: newOrder,
      listId: cardToCopy.listId,
      description: cardToCopy.description,
    },
  })

  await createAuditLog({
    entityTitle: copiedCard.title,
    entityId: copiedCard.id,
    entityType: EntityType.Card,
    action: Action.Create,
  })

  revalidatePath(`/board/${boardId}`, 'page')
}

export async function deleteCardById(id: string, boardId: string) {
  const deletedCard = await prisma.card.delete({ where: { id } })

  await createAuditLog({
    entityId: deletedCard.id,
    entityTitle: deletedCard.title,
    entityType: EntityType.Card,
    action: Action.Delete,
  })

  revalidatePath(`/board/${boardId}`, 'page')
}
