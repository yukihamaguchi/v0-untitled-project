import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, performerId, eventId, amount, comment } = body

    const gifting = await prisma.gifting.create({
      data: {
        userId: userId,
        performerId: performerId,
        eventId: eventId,
        amount: amount,
        comment: comment,
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