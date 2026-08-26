import { FastifyPluginAsync } from 'fastify'
import { generateApiKey } from '../auth/auth'

export const apiKeyRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (request, reply) => {
    reply.send({ items: [] })
  })

  app.post('/', async (request, reply) => {
    const { name, scopes } = request.body as { name: string; scopes: string[] }
    const { key, prefix } = generateApiKey()
    reply.code(201).send({
      id: crypto.randomUUID(),
      name,
      prefix,
      key, // Only shown once at creation
      scopes,
      message: 'Save this key — it will not be shown again.',
    })
  })

  app.delete('/:id', async (request, reply) => {
    reply.code(204).send()
  })
}
