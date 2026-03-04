import {
  byIdSchema,
  createVehicleSchema,
  getByLicensePlateSchema,
  updateVehicleSchema,
} from '@motocare/shared';
import { desc, eq } from 'drizzle-orm';
import { vehicles } from '../db/schema';
import { publicProcedure, router } from '../trpc/trpc';

export const vehiclesRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
  }),

  getById: publicProcedure.input(byIdSchema).query(async ({ ctx, input }) => {
    const result = await ctx.db.select().from(vehicles).where(eq(vehicles.id, input.id)).limit(1);
    return result[0] || null;
  }),

  getByLicensePlate: publicProcedure
    .input(getByLicensePlateSchema)
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(vehicles)
        .where(eq(vehicles.licensePlate, input.licensePlate))
        .limit(1);
      return result[0] || null;
    }),

  create: publicProcedure.input(createVehicleSchema).mutation(async ({ ctx, input }) => {
    const result = await ctx.db
      .insert(vehicles)
      .values({
        ...input,
        updatedAt: new Date(),
      })
      .returning();
    return result[0];
  }),

  update: publicProcedure.input(updateVehicleSchema).mutation(async ({ ctx, input }) => {
    const { id, ...updates } = input;
    const result = await ctx.db
      .update(vehicles)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(vehicles.id, id))
      .returning();
    return result[0] || null;
  }),

  delete: publicProcedure.input(byIdSchema).mutation(async ({ ctx, input }) => {
    const result = await ctx.db.delete(vehicles).where(eq(vehicles.id, input.id)).returning();
    return result[0] || null;
  }),
});
