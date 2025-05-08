
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createGifting(data: {
  userId: number
  performerId: number
  eventId: number
  amount: number
  comment: string
}) {
  return prisma.gifting.create({
    data: {
      ...data,
      createdAt: new Date(),
    },
    include: {
      user: true,
      performer: true,
      event: true,
    },
  })
}

export async function getUserGiftings(userId: number) {
  return prisma.gifting.findMany({
    where: { userId },
    include: {
      performer: true,
      event: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getPerformerGiftings(performerId: number) {
  return prisma.gifting.findMany({
    where: { performerId },
    include: {
      user: true,
      event: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}
