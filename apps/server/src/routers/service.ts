import {
  byIdSchema,
  createServiceRecordSchema,
  getServiceByTypeSchema,
  getServiceByVehicleSchema,
  getUpcomingServicesSchema,
  updateServiceRecordSchema,
} from '@motocare/shared';
import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { serviceRecords } from '../db/schema';
import { publicProcedure, router } from '../trpc/trpc';

export const serviceRouter = router({
  getByVehicleId: publicProcedure.input(getServiceByVehicleSchema).query(async ({ ctx, input }) => {
    return await ctx.db
      .select()
      .from(serviceRecords)
      .where(eq(serviceRecords.vehicleId, input.vehicleId))
      .orderBy(desc(serviceRecords.date))
      .limit(input.limit)
      .offset(input.offset);
  }),

  getByType: publicProcedure.input(getServiceByTypeSchema).query(async ({ ctx, input }) => {
    return await ctx.db
      .select()
      .from(serviceRecords)
      .where(eq(serviceRecords.serviceType, input.serviceType))
      .orderBy(desc(serviceRecords.date))
      .limit(input.limit)
      .offset(input.offset);
  }),

  getUpcomingServices: publicProcedure
    .input(getUpcomingServicesSchema)
    .query(async ({ ctx, input }) => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + input.daysAhead);

      let whereCondition = and(
        gte(serviceRecords.nextServiceDate, new Date()),
        lte(serviceRecords.nextServiceDate, futureDate)
      );

      if (input.currentMileage) {
        whereCondition = and(
          whereCondition,
          gte(serviceRecords.nextServiceMileage, input.currentMileage)
        );
      }

      return await ctx.db
        .select()
        .from(serviceRecords)
        .where(whereCondition)
        .orderBy(serviceRecords.nextServiceDate);
    }),

  create: publicProcedure.input(createServiceRecordSchema).mutation(async ({ ctx, input }) => {
    const result = await ctx.db.insert(serviceRecords).values(input).returning();
    return result[0];
  }),

  update: publicProcedure.input(updateServiceRecordSchema).mutation(async ({ ctx, input }) => {
    const { id, ...updates } = input;
    const result = await ctx.db
      .update(serviceRecords)
      .set(updates)
      .where(eq(serviceRecords.id, id))
      .returning();
    return result[0] || null;
  }),

  delete: publicProcedure.input(byIdSchema).mutation(async ({ ctx, input }) => {
    const result = await ctx.db
      .delete(serviceRecords)
      .where(eq(serviceRecords.id, input.id))
      .returning();
    return result[0] || null;
  }),
});
