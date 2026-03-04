import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createContext } from './trpc'
import { appRouter } from '../routers'

export function createTRPCHandler() {
  return {
    all: async (c: any) => {
      return fetchRequestHandler({
        endpoint: '/trpc',
        req: c.req.raw,
        router: appRouter,
        createContext: () => createContext(),
      })
    }
  }
}