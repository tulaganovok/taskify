'use server'

import { Action, EntityType } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'
import { auth, currentUser } from '@clerk/nextjs/server'

interface CreateAuditLogParams {
  entityId: string
  entityType: EntityType
  entityTitle: string
  action: Action
}

export async function createAuditLog(createAuditLogParams: CreateAuditLogParams) {
  const user = await currentUser()
  const { orgId } = await auth()

  if (!user || !orgId) return

  await prisma.auditLog.create({
    data: {
      ...createAuditLogParams,
      orgId,
      userId: user.id,
      userImage: user.imageUrl,
      userName: `${user.firstName} ${user.lastName}`,
    },
  })
}

export async function getAuditLogs() {
  const { orgId } = await auth()
  if (!orgId) return []
  
  return await prisma.auditLog.findMany({
    where: { orgId },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })
}
