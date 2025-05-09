
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const performerId = searchParams.get("performerId")

    const totalStats = await prisma.gifting.aggregate({
      where: performerId ? { performerId: Number(performerId) } : {},
      _sum: {
        amount: true,
      },
      _count: true,
    })

    const upcomingEvents = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      include: {
        giftings: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    const pastEvents = await prisma.event.findMany({
      where: {
        date: {
          lt: new Date(),
        },
      },
      include: {
        giftings: true,
      },
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json({
      totalGifting: totalStats._sum.amount || 0,
      totalMessages: totalStats._count,
      upcomingEvents: upcomingEvents.map(event => ({
        ...event,
        totalGifting: event.giftings.reduce((sum, g) => sum + g.amount, 0),
        messageCount: event.giftings.length,
      })),
      pastEvents: pastEvents.map(event => ({
        ...event,
        totalGifting: event.giftings.reduce((sum, g) => sum + g.amount, 0),
        messageCount: event.giftings.length,
      })),
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
