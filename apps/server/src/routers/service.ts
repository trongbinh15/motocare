import { router, publicProcedure } from '../trpc/trpc'
import { serviceRecords } from '../db/schema'
import { eq, desc, and, gte, lte } from 'drizzle-orm'
import { object, number, string, date, optional } from 'valibot'

const createServiceRecordSchema = object({
  vehicleId: number(),
  serviceType: string(),
  description: string(),
  mileageAtService: number(),
  cost: optional(number()),
  date: optional(date(), () => new Date()),
  nextServiceMileage: optional(number()),
  nextServiceDate: optional(date()),
  notes: optional(string()),
})

const updateServiceRecordSchema = object({
  id: number(),
  serviceType: optional(string()),
  description: optional(string()),
  mileageAtService: optional(number()),
  cost: optional(number()),
  date: optional(date()),
  nextServiceMileage: optional(number()),
  nextServiceDate: optional(date()),
  notes: optional(string()),
})

export const serviceRouter = router({
  // Get all service records for a vehicle
  getByVehicleId: publicProcedure
    .input(object({
      vehicleId: number(),
      limit: optional(number(), 50),
      offset: optional(number(), 0)
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
    .input(object({
      serviceType: string(),
      limit: optional(number(), 50),
      offset: optional(number(), 0)
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
    .input(object({
      daysAhead: optional(number(), 30),
      currentMileage: optional(number())
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
    .input(object({ id: number() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .delete(serviceRecords)
        .where(eq(serviceRecords.id, input.id))
        .returning()

      return result[0] || null
    }),
})