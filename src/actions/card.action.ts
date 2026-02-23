'use server'

import { Card } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createCard(title: string, boardId: string, listId: string) {
  const lastCard = await prisma.card.findFirst({
    where: { listId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })

  const newOrder = lastCard ? lastCard.order + 1 : 1
  await prisma.card.create({ data: { title, listId, order: newOrder } })
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
  await prisma.card.update({ where: { id }, data })
  revalidatePath(`/board/${boardId}`, 'page')
}
