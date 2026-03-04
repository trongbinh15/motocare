import { desc, eq } from 'drizzle-orm';
import { minLength, number, object, optional, pipe, string } from 'valibot';
import { vehicles } from '../db/schema';
import { publicProcedure, router } from '../trpc/trpc';

// Input validation schemas using Valibot
const createVehicleSchema = object({
  licensePlate: pipe(string(), minLength(1)),
  make: pipe(string(), minLength(1)),
  model: pipe(string(), minLength(1)),
  year: number(),
  currentMileage: optional(number(), 0),
});

const updateVehicleSchema = object({
  id: number(),
  licensePlate: optional(pipe(string(), minLength(1))),
  make: optional(pipe(string(), minLength(1))),
  model: optional(pipe(string(), minLength(1))),
  year: optional(number()),
  currentMileage: optional(number()),
});

export const vehiclesRouter = router({
  // Get all vehicles
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
  }),

  // Get vehicle by ID
  getById: publicProcedure.input(object({ id: number() })).query(async ({ ctx, input }) => {
    const result = await ctx.db.select().from(vehicles).where(eq(vehicles.id, input.id)).limit(1);

    return result[0] || null;
  }),

  // Get vehicle by license plate
  getByLicensePlate: publicProcedure
    .input(object({ licensePlate: string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(vehicles)
        .where(eq(vehicles.licensePlate, input.licensePlate))
        .limit(1);

      return result[0] || null;
    }),

  // Create new vehicle
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

  // Update vehicle
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

  // Delete vehicle
  delete: publicProcedure.input(object({ id: number() })).mutation(async ({ ctx, input }) => {
    const result = await ctx.db.delete(vehicles).where(eq(vehicles.id, input.id)).returning();

    return result[0] || null;
  }),
});
