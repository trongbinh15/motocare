import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { createTRPCHandler } from './trpc/handler';

const app = new Hono();

app.use('*', cors());
app.use('*', logger());

app.get('/', (c) => c.text('MotoCare API Server'));

const trpcHandler = createTRPCHandler();
app.route('/trpc', trpcHandler);

// Development server
if (process.env.NODE_ENV !== 'production') {
  serve({
    fetch: app.fetch,
    port: 8002,
  });
  console.log('🚀 MotoCare API Server running on http://localhost:8002');
}

// Export for production deployment
export default app;

// Export types
export type { AppRouter } from './routers';
