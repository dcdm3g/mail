import { PrismaClient } from '@prisma/client'
import { Elysia, t } from 'elysia'

const prisma = new PrismaClient()

const app = new Elysia()
  .post(
    '/emails',
    async ({ set, body }) => {
      set.status = 201

      const email = await prisma.email.findUnique({
        where: { email: body.email },
      })

      if (email) {
        return
      }

      await prisma.email.create({
        data: { email: body.email },
      })
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
      }),
    },
  )
  .listen(3000)

console.log(`Server running at ${app.server?.url}`)
