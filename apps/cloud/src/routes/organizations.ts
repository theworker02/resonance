import { FastifyPluginAsync } from 'fastify'

export const orgRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (request, reply) => {
    reply.send({ items: [], total: 0 })
  })

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    reply.send({ id, name: 'Example Org', plan: 'community' })
  })

  app.patch('/:id', async (request, reply) => {
    reply.send({ message: 'Organization updated' })
  })
}
