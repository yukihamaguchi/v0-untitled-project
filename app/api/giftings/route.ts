import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, performerId, eventId, amount, comment } = body

    // Verify that the referenced records exist
    const [user, performer, event] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.performer.findUnique({ where: { id: performerId } }),
      prisma.event.findUnique({ where: { id: eventId } })
    ])

    if (!user || !performer || !event) {
      return NextResponse.json(
        { error: 'Referenced records not found' },
        { status: 404 }
      )
    }

    const gifting = await prisma.gifting.create({
      data: {
        userId,
        performerId,
        eventId,
        amount,
        comment,
        createdAt: new Date()
      }
    })

    return NextResponse.json(gifting)
  } catch (error) {
    console.error('Failed to save gifting:', error)
    return NextResponse.json(
      { 
        error: 'Failed to save gifting',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}