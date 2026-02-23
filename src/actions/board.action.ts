'use server'

import { Board } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function createBoard(data: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>) {
  return await prisma.board.create({ data })
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
  await prisma.board.update({ where: { id }, data: data })
  revalidatePath(`/board/${id}`, 'layout')
}

export async function deleteBoardById(id: string) {
  await prisma.board.delete({ where: { id } })
}
