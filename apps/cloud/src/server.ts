import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { env } from './config/env'
import { authRoutes } from './routes/auth'
import { orgRoutes } from './routes/organizations'
import { workspaceRoutes } from './routes/workspaces'
import { nodeRoutes } from './routes/nodes'
import { incidentRoutes } from './routes/incidents'
import { apiKeyRoutes } from './routes/api-keys'
import { webhookRoutes } from './routes/webhooks'
import { healthRoutes } from './routes/health'

const app = Fastify({ logger: { level: env.LOG_LEVEL } })

async function start() {
  await app.register(cors, { origin: env.CORS_ORIGINS })
  await app.register(jwt, { secret: env.JWT_SECRET })

  // Routes
  await app.register(healthRoutes, { prefix: '/health' })
  await app.register(authRoutes, { prefix: '/v1/auth' })
  await app.register(orgRoutes, { prefix: '/v1/organizations' })
  await app.register(workspaceRoutes, { prefix: '/v1/workspaces' })
  await app.register(nodeRoutes, { prefix: '/v1/nodes' })
  await app.register(incidentRoutes, { prefix: '/v1/incidents' })
  await app.register(apiKeyRoutes, { prefix: '/v1/api-keys' })
  await app.register(webhookRoutes, { prefix: '/v1/webhooks' })

  await app.listen({ port: env.PORT, host: '0.0.0.0' })
  app.log.info(`Resonance Cloud listening on port ${env.PORT}`)
}

start()
