'use server'

import { Board } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function createBoard(data: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>) {
  return await prisma.board.create({ data })
}

export async function getOrgBoards() {
  const { orgId } = await auth()
  if (!orgId) return []
  return await prisma.board.findMany({ where: { orgId }, orderBy: { createdAt: 'desc' } })
}

export async function getBoardById(id: string) {
  const { orgId } = await auth()
  if (!orgId) return null
  return await prisma.board.findUnique({ where: { id, orgId } })
}
