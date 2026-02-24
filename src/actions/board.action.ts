'use server'

import { Action, Board, EntityType } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { createAuditLog } from './audit-log.action'
import {
  decrementAvailableCount,
  hasAvailableCount,
  incrementAvailableCount,
} from './org-limit.action'
import { checkSubscription } from './subscription.action'

export async function createBoard(data: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>) {
  const isAvailableCount = await hasAvailableCount()
  const isPro = await checkSubscription()

  if (!isAvailableCount && !isPro) return null

  const newBoard = await prisma.board.create({ data })

  if (!isPro) {
    await incrementAvailableCount()
  }

  await createAuditLog({
    entityTitle: newBoard.title,
    entityId: newBoard.id,
    entityType: EntityType.Board,
    action: Action.Create,
  })

  return newBoard
}

export async function getOrgBoards() {
  const { orgId } = await auth()
  if (!orgId) return []
  return await prisma.board.findMany({ where: { orgId }, orderBy: { createdAt: 'desc' } })
}

export async function getBoardById(id: string) {
  return await prisma.board.findUnique({ where: { id } })
}

export async function updateBoardById(id: string, data: Partial<Board>) {
  const updatedBoard = await prisma.board.update({ where: { id }, data: data })

  await createAuditLog({
    entityTitle: updatedBoard.title,
    entityId: updatedBoard.id,
    entityType: EntityType.Board,
    action: Action.Update,
  })

  revalidatePath(`/board/${id}`, 'layout')
}

export async function deleteBoardById(id: string) {
  const deletedBoard = await prisma.board.delete({ where: { id } })
  const isPro = await checkSubscription()

  if (!isPro) {
    await decrementAvailableCount()
  }

  await createAuditLog({
    entityTitle: deletedBoard.title,
    entityId: deletedBoard.id,
    entityType: EntityType.Board,
    action: Action.Delete,
  })
}
