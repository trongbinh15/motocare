import { initTRPC } from '@trpc/server'
import type { HonoContext } from './context'

export function createContext() {
  return {
    db: {} as any // Will be initialized later
  }
}

export type Context = ReturnType<typeof createContext>

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure