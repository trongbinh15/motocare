import { router, publicProcedure } from '../trpc/trpc'
import { vehicles } from '../db/schema'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod' // We'll replace this with valibot later

// Input validation schemas (temporary - will be moved to shared package)
const createVehicleSchema = z.object({
  licensePlate: z.string().min(1),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  currentMileage: z.number().int().min(0).default(0),
})

const updateVehicleSchema = z.object({
  id: z.number().int(),
  licensePlate: z.string().min(1).optional(),
  make: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  currentMileage: z.number().int().min(0).optional(),
})

export const vehiclesRouter = router({
  // Get all vehicles
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(vehicles).orderBy(desc(vehicles.createdAt))
  }),

  // Get vehicle by ID
  getById: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(vehicles)
        .where(eq(vehicles.id, input.id))
        .limit(1)

      return result[0] || null
    }),

  // Get vehicle by license plate
  getByLicensePlate: publicProcedure
    .input(z.object({ licensePlate: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(vehicles)
        .where(eq(vehicles.licensePlate, input.licensePlate))
        .limit(1)

      return result[0] || null
    }),

  // Create new vehicle
  create: publicProcedure
    .input(createVehicleSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(vehicles)
        .values({
          ...input,
          updatedAt: new Date(),
        })
        .returning()

      return result[0]
    }),

  // Update vehicle
  update: publicProcedure
    .input(updateVehicleSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input

      const result = await ctx.db
        .update(vehicles)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(vehicles.id, id))
        .returning()

      return result[0] || null
    }),

  // Delete vehicle
  delete: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .delete(vehicles)
        .where(eq(vehicles.id, input.id))
        .returning()

      return result[0] || null
    }),
})