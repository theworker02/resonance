import { FastifyPluginAsync } from 'fastify'

export const incidentRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (request, reply) => {
    reply.send({ items: [], total: 0 })
  })

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    reply.send({ id, status: 'pending_review', confidence: 0.89 })
  })

  app.post('/:id/review', async (request, reply) => {
    reply.code(201).send({ message: 'Review submitted' })
  })

  app.get('/:id/replay', async (request, reply) => {
    reply.send({ incident_id: (request.params as any).id, steps: [], deterministic: true })
  })

  app.get('/:id/export', async (request, reply) => {
    reply.send({ message: 'Evidence bundle generated' })
  })
}
