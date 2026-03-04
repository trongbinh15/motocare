import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { createTRPCHandler } from './trpc/handler'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())

app.get('/', (c) => c.text('MotoCare API Server'))

const trpcHandler = createTRPCHandler()
app.route('/trpc', trpcHandler)

export default {
  port: 3001,
  fetch: app.fetch
}