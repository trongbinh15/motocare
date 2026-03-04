import { router, publicProcedure } from '../trpc/trpc'
import { vehiclesRouter } from './vehicles'
import { odoRouter } from './odo'
import { serviceRouter } from './service'
import { recommendationsRouter } from './recommendations'
import { productsRouter } from './products'

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: 'ok', message: 'MotoCare API is running' }
  }),

  // Vehicle management
  vehicles: vehiclesRouter,

  // Odometer logging
  odo: odoRouter,

  // Service records
  service: serviceRouter,

  // Service recommendations
  recommendations: recommendationsRouter,

  // Products catalog
  products: productsRouter,
})

export type AppRouter = typeof appRouter