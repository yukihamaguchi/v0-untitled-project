
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const performerId = searchParams.get("performerId")
    const eventId = searchParams.get("eventId")

    const giftings = await prisma.gifting.findMany({
      where: {
        ...(performerId && { performerId: Number(performerId) }),
        ...(eventId && { eventId: Number(eventId) }),
      },
      include: {
        user: true,
        performer: true,
        event: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    })

    return NextResponse.json(giftings)
  } catch (error) {
    console.error('Failed to fetch giftings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch giftings' },
      { status: 500 }
    )
  }
}
