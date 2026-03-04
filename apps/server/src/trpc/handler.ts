import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { Hono } from 'hono';
import { appRouter } from '../routers';
import { createContext } from './context';

export function createTRPCHandler() {
  const trpcApp = new Hono();

  trpcApp.all('/*', async (c) => {
    return fetchRequestHandler({
      endpoint: '/trpc',
      req: c.req.raw,
      router: appRouter,
      createContext,
    });
  });

  return trpcApp;
}
