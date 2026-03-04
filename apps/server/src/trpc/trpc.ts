import { initTRPC } from '@trpc/server';
import type { Context } from './context';

const t = initTRPC.context<Context>().create({
  experimental: {
    standardSchema: true,
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
