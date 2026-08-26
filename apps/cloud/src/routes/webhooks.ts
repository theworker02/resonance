import { FastifyPluginAsync } from 'fastify'

export const webhookRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (request, reply) => {
    reply.send({ items: [] })
  })

  app.post('/', async (request, reply) => {
    reply.code(201).send({ id: crypto.randomUUID(), message: 'Webhook registered' })
  })

  app.delete('/:id', async (request, reply) => {
    reply.code(204).send()
  })

  app.get('/:id/deliveries', async (request, reply) => {
    reply.send({ items: [] })
  })
}
