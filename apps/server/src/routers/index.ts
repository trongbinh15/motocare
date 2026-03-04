import { router, publicProcedure } from '../trpc/trpc'

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: 'ok', message: 'MotoCare API is running' }
  })
})

export type AppRouter = typeof appRouter