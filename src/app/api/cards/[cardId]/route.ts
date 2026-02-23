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

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: { list: { select: { title: true } } },
    })

    return NextResponse.json(card)
  } catch {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
