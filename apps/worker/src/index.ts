import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

type Bindings = {
  AI: any;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());
app.use('*', logger());

app.get('/', (c) => c.text('MotoCare AI Worker'));

app.post('/detect-plate', async (c) => {
  // AI plate detection logic will be implemented here
  return c.json({ message: 'Plate detection endpoint ready' });
});

export default app;
