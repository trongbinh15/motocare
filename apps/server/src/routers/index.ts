import { publicProcedure, router } from '../trpc/trpc';
import { odoRouter } from './odo';
import { productsRouter } from './products';
import { recommendationsRouter } from './recommendations';
import { serviceRouter } from './service';
import { vehiclesRouter } from './vehicles';

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: 'ok', message: 'MotoCare API is running' };
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
});

export type AppRouter = typeof appRouter;
