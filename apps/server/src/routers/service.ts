import { router, publicProcedure } from '../trpc/trpc'
import { serviceRecords } from '../db/schema'
import { eq, desc, and, gte, lte } from 'drizzle-orm'
import { z } from 'zod'

const createServiceRecordSchema = z.object({
  vehicleId: z.number().int(),
  serviceType: z.string().min(1),
  description: z.string().min(1),
  mileageAtService: z.number().int().min(0),
  cost: z.number().min(0).optional(),
  date: z.date().optional().default(() => new Date()),
  nextServiceMileage: z.number().int().min(0).optional(),
  nextServiceDate: z.date().optional(),
  notes: z.string().optional(),
})

const updateServiceRecordSchema = z.object({
  id: z.number().int(),
  serviceType: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  mileageAtService: z.number().int().min(0).optional(),
  cost: z.number().min(0).optional(),
  date: z.date().optional(),
  nextServiceMileage: z.number().int().min(0).optional(),
  nextServiceDate: z.date().optional(),
  notes: z.string().optional(),
})

export const serviceRouter = router({
  // Get all service records for a vehicle
  getByVehicleId: publicProcedure
    .input(z.object({
      vehicleId: z.number().int(),
      limit: z.number().int().min(1).max(100).optional().default(50),
      offset: z.number().int().min(0).optional().default(0)
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(serviceRecords)
        .where(eq(serviceRecords.vehicleId, input.vehicleId))
        .orderBy(desc(serviceRecords.date))
        .limit(input.limit)
        .offset(input.offset)
    }),

  // Get service records by type
  getByType: publicProcedure
    .input(z.object({
      serviceType: z.string(),
      limit: z.number().int().min(1).max(100).optional().default(50),
      offset: z.number().int().min(0).optional().default(0)
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(serviceRecords)
        .where(eq(serviceRecords.serviceType, input.serviceType))
        .orderBy(desc(serviceRecords.date))
        .limit(input.limit)
        .offset(input.offset)
    }),

  // Get upcoming services (based on next service dates/mileage)
  getUpcomingServices: publicProcedure
    .input(z.object({
      daysAhead: z.number().int().min(1).max(365).optional().default(30),
      currentMileage: z.number().int().min(0).optional()
    }))
    .query(async ({ ctx, input }) => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + input.daysAhead)

      let whereCondition = and(
        gte(serviceRecords.nextServiceDate, new Date()),
        lte(serviceRecords.nextServiceDate, futureDate)
      )

      if (input.currentMileage) {
        whereCondition = and(
          whereCondition,
          gte(serviceRecords.nextServiceMileage, input.currentMileage)
        )
      }

      return await ctx.db
        .select()
        .from(serviceRecords)
        .where(whereCondition)
        .orderBy(serviceRecords.nextServiceDate)
    }),

  // Create new service record
  create: publicProcedure
    .input(createServiceRecordSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(serviceRecords)
        .values(input)
        .returning()

      return result[0]
    }),

  // Update service record
  update: publicProcedure
    .input(updateServiceRecordSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input

      const result = await ctx.db
        .update(serviceRecords)
        .set(updates)
        .where(eq(serviceRecords.id, id))
        .returning()

      return result[0] || null
    }),

  // Delete service record
  delete: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .delete(serviceRecords)
        .where(eq(serviceRecords.id, input.id))
        .returning()

      return result[0] || null
    }),
})