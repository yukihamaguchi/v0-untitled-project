
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.gifting.deleteMany({});
  await prisma.performer.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.event.deleteMany({});

  // Create performers
  await prisma.performer.createMany({
    data: [
      {
        id: 1,
        name: "天野しずく",
        agency: "ドリームボイス",
      },
      {
        id: 2,
        name: "早乙女みなと",
        agency: "ステラボイス",
      },
      {
        id: 3,
        name: "有栖川りお",
        agency: "ムーンライト",
      },
      {
        id: 4,
        name: "白石ほのか",
        agency: "サンシャイン",
      }
    ]
  });

  // Create artist users
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: "天野しずく",
        email: "artist1@example.com",
      },
      {
        id: 2,
        name: "早乙女みなと",
        email: "artist2@example.com",
      },
      {
        id: 3,
        name: "有栖川りお",
        email: "artist3@example.com",
      },
      {
        id: 4,
        name: "白石ほのか",
        email: "artist4@example.com",
      }
    ]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
