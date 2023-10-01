import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Test',
    email: 'test@test.com.br',
    password: '$argon2id$v=19$m=65536,t=3,p=4$Q+li1KuUrLScs70uptIFTQ$yrPxBOzIyBkNyre7tVE4GtF5JXwwHIRbNSFsQAy5vvU',
    projects: {
      create: [
        {
          title: 'Housekeeping',
          tasks: {
            create: [
                {
                    description: 'Wash, dry, disinfect, and put away all the dishes.',
                    endedAt: new Date()
                },
                {
                    description: 'Sweep and mop the floors.',
                    endedAt: new Date()
                },
                {
                    description: 'Wipe down and sanitize all surfaces.'
                },
                {
                    description: 'Clean the refrigerator, microwave, and oven.'
                },
                {
                    description: 'Dust kitchen lighting fixtures.'
                }
            ]
          }
        },
      ],
    },
  }
]

async function clearDatabase() {
  await prisma.session.deleteMany()
  await prisma.task.deleteMany()
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()
}

async function main() {
  console.log(`Start seeding ...`)
  await clearDatabase()
  
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })