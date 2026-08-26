import { FastifyPluginAsync } from 'fastify'

export const nodeRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (request, reply) => {
    reply.send({ items: [], total: 0 })
  })

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    reply.send({ id, status: 'online', health: 97 })
  })

  app.post('/:id/enroll', async (request, reply) => {
    reply.code(201).send({ message: 'Node enrolled' })
  })

  app.post('/:id/diagnostics', async (request, reply) => {
    reply.send({ message: 'Diagnostics initiated' })
  })
}
