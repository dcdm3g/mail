import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = new Elysia().post(
  '/emails',
  async ({ set, body }) => {
    set.status = 201

    const email = await prisma.email.findUnique({
      where: { email: body.email }
    })

    if (email) {
      return
    }

    await prisma.email.create({
      data: { email: body.email }
    })
  },
  {
    body: t.Object({
      email: t.String({ format: 'email' }),
    }),
  },
)
