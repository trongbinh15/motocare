import { router, publicProcedure } from '../trpc/trpc'
import { odoLogs } from '../db/schema'
import { eq, desc, and, gte, lte } from 'drizzle-orm'
import { z } from 'zod'

const createOdoLogSchema = z.object({
  vehicleId: z.number().int(),
  mileage: z.number().int().min(0),
  date: z.date().optional().default(() => new Date()),
  notes: z.string().optional(),
})

const updateOdoLogSchema = z.object({
  id: z.number().int(),
  mileage: z.number().int().min(0).optional(),
  date: z.date().optional(),
  notes: z.string().optional(),
})

export const odoRouter = router({
  // Get all odo logs for a vehicle
  getByVehicleId: publicProcedure
    .input(z.object({
      vehicleId: z.number().int(),
      limit: z.number().int().min(1).max(100).optional().default(50),
      offset: z.number().int().min(0).optional().default(0)
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(odoLogs)
        .where(eq(odoLogs.vehicleId, input.vehicleId))
        .orderBy(desc(odoLogs.date))
        .limit(input.limit)
        .offset(input.offset)
    }),

  // Get latest odo log for a vehicle
  getLatestByVehicleId: publicProcedure
    .input(z.object({ vehicleId: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(odoLogs)
        .where(eq(odoLogs.vehicleId, input.vehicleId))
        .orderBy(desc(odoLogs.date))
        .limit(1)

      return result[0] || null
    }),

  // Get odo logs within date range
  getByDateRange: publicProcedure
    .input(z.object({
      vehicleId: z.number().int(),
      startDate: z.date(),
      endDate: z.date(),
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(odoLogs)
        .where(and(
          eq(odoLogs.vehicleId, input.vehicleId),
          gte(odoLogs.date, input.startDate),
          lte(odoLogs.date, input.endDate)
        ))
        .orderBy(desc(odoLogs.date))
    }),

  // Create new odo log
  create: publicProcedure
    .input(createOdoLogSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(odoLogs)
        .values(input)
        .returning()

      return result[0]
    }),

  // Update odo log
  update: publicProcedure
    .input(updateOdoLogSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input

      const result = await ctx.db
        .update(odoLogs)
        .set(updates)
        .where(eq(odoLogs.id, id))
        .returning()

      return result[0] || null
    }),

  // Delete odo log
  delete: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .delete(odoLogs)
        .where(eq(odoLogs.id, input.id))
        .returning()

      return result[0] || null
    }),
})