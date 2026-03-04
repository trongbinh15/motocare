import { Hono } from 'hono'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createContext } from './context'
import { appRouter } from '../routers'

export function createTRPCHandler() {
  const trpcApp = new Hono()

  trpcApp.all('/', async (c) => {
    return fetchRequestHandler({
      endpoint: '/trpc',
      req: c.req.raw,
      router: appRouter,
      createContext,
    })
  })

  return trpcApp
}