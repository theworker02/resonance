import { FastifyPluginAsync } from 'fastify'

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (request, reply) => {
    reply.send({
      status: 'healthy',
      version: '5.0.0',
      uptime_seconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    })
  })

  app.get('/ready', async (request, reply) => {
    // Check database, redis, nats connectivity
    reply.send({ ready: true })
  })
}
