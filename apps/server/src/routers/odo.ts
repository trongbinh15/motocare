import {
  byIdSchema,
  createOdoLogSchema,
  getOdoByDateRangeSchema,
  getOdoByVehicleIdSchema,
  getOdoByVehicleSchema,
  updateOdoLogSchema,
} from '@motocare/shared';
import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { odoLogs } from '../db/schema';
import { publicProcedure, router } from '../trpc/trpc';

export const odoRouter = router({
  getByVehicleId: publicProcedure.input(getOdoByVehicleSchema).query(async ({ ctx, input }) => {
    return await ctx.db
      .select()
      .from(odoLogs)
      .where(eq(odoLogs.vehicleId, input.vehicleId))
      .orderBy(desc(odoLogs.date))
      .limit(input.limit)
      .offset(input.offset);
  }),

  getLatestByVehicleId: publicProcedure
    .input(getOdoByVehicleIdSchema)
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(odoLogs)
        .where(eq(odoLogs.vehicleId, input.vehicleId))
        .orderBy(desc(odoLogs.date))
        .limit(1);
      return result[0] || null;
    }),

  getByDateRange: publicProcedure.input(getOdoByDateRangeSchema).query(async ({ ctx, input }) => {
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

  create: publicProcedure.input(createOdoLogSchema).mutation(async ({ ctx, input }) => {
    const result = await ctx.db.insert(odoLogs).values(input).returning();
    return result[0];
  }),

  update: publicProcedure.input(updateOdoLogSchema).mutation(async ({ ctx, input }) => {
    const { id, ...updates } = input;
    const result = await ctx.db.update(odoLogs).set(updates).where(eq(odoLogs.id, id)).returning();
    return result[0] || null;
  }),

  delete: publicProcedure.input(byIdSchema).mutation(async ({ ctx, input }) => {
    const result = await ctx.db.delete(odoLogs).where(eq(odoLogs.id, input.id)).returning();
    return result[0] || null;
  }),
});
