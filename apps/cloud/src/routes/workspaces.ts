import { FastifyPluginAsync } from 'fastify'

export const workspaceRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (request, reply) => {
    reply.send({ items: [], total: 0 })
  })

  app.post('/', async (request, reply) => {
    reply.code(201).send({ id: crypto.randomUUID(), message: 'Workspace created' })
  })

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    reply.send({ id, name: 'Default Workspace' })
  })
}
