import { FastifyPluginAsync } from 'fastify'
import { signupSchema, loginSchema, hashPassword, verifyPassword, buildTokenPayload, generateRefreshToken } from '../auth/auth'
import { nanoid } from 'nanoid'

export const authRoutes: FastifyPluginAsync = async (app) => {
  // POST /v1/auth/signup
  app.post('/signup', async (request, reply) => {
    const body = signupSchema.parse(request.body)

    const userId = crypto.randomUUID()
    const orgId = crypto.randomUUID()
    const workspaceId = crypto.randomUUID()

    const passwordHash = await hashPassword(body.password)

    // In production: insert into database within a transaction
    // For now, return the created structure
    const result = {
      user: { id: userId, email: body.email, name: body.name },
      organization: { id: orgId, name: body.organization_name, slug: body.organization_name.toLowerCase().replace(/\s+/g, '-'), plan: 'community' },
      workspace: { id: workspaceId, name: 'Default', organization_id: orgId },
      membership: { user_id: userId, organization_id: orgId, workspace_id: workspaceId, role: 'owner' },
    }

    const payload = buildTokenPayload(userId, orgId, 'owner', workspaceId)
    const token = app.jwt.sign(payload)
    const refresh = generateRefreshToken()

    reply.code(201).send({
      token,
      refresh_token: refresh,
      user: result.user,
      organization: result.organization,
      workspace: result.workspace,
    })
  })

  // POST /v1/auth/login
  app.post('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body)

    // In production: look up user by email, verify password
    // Placeholder response for the architecture
    reply.code(200).send({
      message: 'Login endpoint — connect to database for real auth',
      email: body.email,
    })
  })

  // POST /v1/auth/refresh
  app.post('/refresh', async (request, reply) => {
    // Validate refresh token, issue new access token
    reply.code(200).send({ message: 'Token refresh endpoint' })
  })

  // POST /v1/auth/logout
  app.post('/logout', async (request, reply) => {
    // Invalidate session/refresh token
    reply.code(204).send()
  })
}
