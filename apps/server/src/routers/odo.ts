import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { date, number, object, optional, string } from 'valibot';
import { odoLogs } from '../db/schema';
import { publicProcedure, router } from '../trpc/trpc';

const createOdoLogSchema = object({
  vehicleId: number(),
  mileage: number(),
  date: optional(date(), () => new Date()),
  notes: optional(string()),
});

const updateOdoLogSchema = object({
  id: number(),
  mileage: optional(number()),
  date: optional(date()),
  notes: optional(string()),
});

export const odoRouter = router({
  // Get all odo logs for a vehicle
  getByVehicleId: publicProcedure
    .input(
      object({
        vehicleId: number(),
        limit: optional(number(), 50),
        offset: optional(number(), 0),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(odoLogs)
        .where(eq(odoLogs.vehicleId, input.vehicleId))
        .orderBy(desc(odoLogs.date))
        .limit(input.limit)
        .offset(input.offset);
    }),

  // Get latest odo log for a vehicle
  getLatestByVehicleId: publicProcedure
    .input(object({ vehicleId: number() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(odoLogs)
        .where(eq(odoLogs.vehicleId, input.vehicleId))
        .orderBy(desc(odoLogs.date))
        .limit(1);

      return result[0] || null;
    }),

  // Get odo logs within date range
  getByDateRange: publicProcedure
    .input(
      object({
        vehicleId: number(),
        startDate: date(),
        endDate: date(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(odoLogs)
        .where(
          and(
            eq(odoLogs.vehicleId, input.vehicleId),
            gte(odoLogs.date, input.startDate),
            lte(odoLogs.date, input.endDate)
          )
        )
        .orderBy(desc(odoLogs.date));
    }),

  // Create new odo log
  create: publicProcedure.input(createOdoLogSchema).mutation(async ({ ctx, input }) => {
    const result = await ctx.db.insert(odoLogs).values(input).returning();

    return result[0];
  }),

  // Update odo log
  update: publicProcedure.input(updateOdoLogSchema).mutation(async ({ ctx, input }) => {
    const { id, ...updates } = input;

    const result = await ctx.db.update(odoLogs).set(updates).where(eq(odoLogs.id, id)).returning();

    return result[0] || null;
  }),

  // Delete odo log
  delete: publicProcedure.input(object({ id: number() })).mutation(async ({ ctx, input }) => {
    const result = await ctx.db.delete(odoLogs).where(eq(odoLogs.id, input.id)).returning();

    return result[0] || null;
  }),
});
