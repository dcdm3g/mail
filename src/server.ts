import { swagger } from '@elysiajs/swagger'
import { PrismaClient } from '@prisma/client'
import { Elysia, t } from 'elysia'

const prisma = new PrismaClient()

const app = new Elysia()
  .use(
    swagger({
      documentation: { info: { title: 'Mail API', version: '1.0.0' } },
      path: '/reference',
    }),
  )
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
      detail: {
        summary: 'Register Email',
        description: 'Register an email to the database.',
      },
      body: t.Object({
        email: t.String({ format: 'email' }),
      }),
      response: {
        201: t.Void(),
      },
    },
  )
  .listen(3000)

console.log(`Server running at ${app.server?.url}`)
