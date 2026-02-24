import { EntityType } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

interface Params {
  params: Promise<{ cardId: string }>
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { cardId } = await params
    const { userId, orgId } = await auth()
    if (!userId || !orgId) return new NextResponse('Unauthorized', { status: 401 })

    const auditLogs = await prisma.auditLog.findMany({
      where: { orgId, entityId: cardId, entityType: EntityType.Card },
      orderBy: { createdAt: 'desc' },
      take: 3,
    })

    return NextResponse.json(auditLogs)
  } catch {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
