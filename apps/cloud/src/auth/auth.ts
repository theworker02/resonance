import { z } from 'zod'
import * as bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(8).max(128),
  organization_name: z.string().min(1).max(100),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const magicLinkSchema = z.object({
  email: z.string().email(),
})

// ─── Password Hashing ────────────────────────────────────────────────────────

const SALT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// ─── Session Token Generation ────────────────────────────────────────────────

export interface TokenPayload {
  sub: string        // user id
  org: string        // organization id
  ws?: string        // workspace id (optional)
  role: string       // role in org/workspace
  iat: number
  exp: number
}

export function buildTokenPayload(
  userId: string,
  orgId: string,
  role: string,
  workspaceId?: string,
  expiresInSeconds: number = 86400,
): TokenPayload {
  const now = Math.floor(Date.now() / 1000)
  return {
    sub: userId,
    org: orgId,
    ws: workspaceId,
    role,
    iat: now,
    exp: now + expiresInSeconds,
  }
}

// ─── Refresh Token ───────────────────────────────────────────────────────────

export function generateRefreshToken(): string {
  return nanoid(64)
}

// ─── API Key Generation ──────────────────────────────────────────────────────

export function generateApiKey(): { key: string; prefix: string; hash: string } {
  const prefix = nanoid(8)
  const secret = nanoid(40)
  const key = `rsn_${prefix}_${secret}`
  // In production, hash the full key for storage; only show it once
  const hash = key // In real impl: bcrypt or SHA-256 of the key
  return { key, prefix, hash }
}
