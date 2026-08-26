import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().default('postgres://resonance:resonance@localhost:5432/resonance'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_SECRET: z.string().default('dev-secret-change-in-production'),
  CORS_ORIGINS: z.string().default('http://localhost:3000').transform(s => s.split(',')),
  LOG_LEVEL: z.string().default('info'),
  NATS_URL: z.string().default('nats://localhost:4222'),
})

export const env = envSchema.parse(process.env)
export type Env = z.infer<typeof envSchema>
