import { db } from '../db/connection'

export type HonoContext = {
  Variables: Record<string, never>
  Bindings: Record<string, never>
}

export function createContext() {
  return {
    db,
  }
}

export type Context = ReturnType<typeof createContext>