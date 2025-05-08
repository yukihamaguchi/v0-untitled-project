import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 初期ユーザーを作成する関数
async function ensureInitialData() {
  // ユーザーの作成
  const existingUser = await prisma.user.findUnique({
    where: { id: 1 }
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: 1,
        name: "テストユーザー",
        email: "test@example.com"
      }
    });
  }

  // パフォーマーの作成
  const existingPerformer = await prisma.performer.findUnique({
    where: { id: 1 }
  });

  if (!existingPerformer) {
    await prisma.performer.create({
      data: {
        id: 1,
        name: "テストパフォーマー",
        agency: "テスト事務所"
      }
    });
  }

  // イベントの作成
  const existingEvent = await prisma.event.findUnique({
    where: { id: 1 }
  });

  if (!existingEvent) {
    await prisma.event.create({
      data: {
        id: 1,
        title: "テストイベント",
        date: new Date()
      }
    });
  }
}

export async function POST(request: Request) {
  // APIリクエスト時に初期データの存在を確認
  await ensureInitialData();
  try {
    const body = await request.json()
    const { userId, performerId, eventId, amount, comment } = body

    console.log('Received request body:', body)

    // Verify that the referenced records exist
    const [user, performer, event] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.performer.findUnique({ where: { id: performerId } }),
      prisma.event.findUnique({ where: { id: eventId } })
    ])

    console.log('Found records:', { user, performer, event })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', details: `User ID ${userId} does not exist` },
        { status: 404 }
      )
    }

    if (!performer) {
      return NextResponse.json(
        { error: 'Performer not found', details: `Performer ID ${performerId} does not exist` },
        { status: 404 }
      )
    }

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found', details: `Event ID ${eventId} does not exist` },
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