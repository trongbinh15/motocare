import type { Hono } from 'hono'

export type HonoContext = {
  Variables: Record<string, never>
  Bindings: Record<string, never>
}