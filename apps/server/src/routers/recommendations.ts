import { router, publicProcedure } from '../trpc/trpc'
import { serviceRecommendations } from '../db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { object, string, number, optional, boolean } from 'valibot'

const createRecommendationSchema = object({
  make: string(),
  model: optional(string()),
  serviceType: string(),
  intervalMileage: optional(number()),
  intervalMonths: optional(number()),
  description: string(),
  isActive: optional(boolean(), true),
})

const updateRecommendationSchema = object({
  id: number(),
  make: optional(string()),
  model: optional(string()),
  serviceType: optional(string()),
  intervalMileage: optional(number()),
  intervalMonths: optional(number()),
  description: optional(string()),
  isActive: optional(boolean()),
})

export const recommendationsRouter = router({
  // Get all active recommendations
  getAll: publicProcedure
    .input(object({
      limit: optional(number(), 50),
      offset: optional(number(), 0)
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(serviceRecommendations)
        .where(eq(serviceRecommendations.isActive, true))
        .orderBy(desc(serviceRecommendations.make))
        .limit(input.limit)
        .offset(input.offset)
    }),

  // Get recommendations by vehicle make
  getByMake: publicProcedure
    .input(object({
      make: string(),
      model: optional(string()),
      limit: optional(number(), 50)
    }))
    .query(async ({ ctx, input }) => {
      let whereCondition = and(
        eq(serviceRecommendations.make, input.make),
        eq(serviceRecommendations.isActive, true)
      )

      if (input.model) {
        whereCondition = and(
          whereCondition,
          eq(serviceRecommendations.model, input.model)
        )
      }

      return await ctx.db
        .select()
        .from(serviceRecommendations)
        .where(whereCondition)
        .orderBy(serviceRecommendations.serviceType)
        .limit(input.limit)
    }),

  // Get recommendations by service type
  getByServiceType: publicProcedure
    .input(object({
      serviceType: string(),
      limit: optional(number(), 50)
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(serviceRecommendations)
        .where(and(
          eq(serviceRecommendations.serviceType, input.serviceType),
          eq(serviceRecommendations.isActive, true)
        ))
        .orderBy(serviceRecommendations.make)
        .limit(input.limit)
    }),

  // Search recommendations
  search: publicProcedure
    .input(object({
      query: string(),
      limit: optional(number(), 20)
    }))
    .query(async ({ ctx, input }) => {
      // Note: This is a simplified search - in production you might want full-text search
      // For now, we'll search by service type only
      return await ctx.db
        .select()
        .from(serviceRecommendations)
        .where(and(
          eq(serviceRecommendations.isActive, true),
          eq(serviceRecommendations.serviceType, input.query)
        ))
        .limit(input.limit)
    }),

  // Create new recommendation
  create: publicProcedure
    .input(createRecommendationSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(serviceRecommendations)
        .values(input)
        .returning()

      return result[0]
    }),

  // Update recommendation
  update: publicProcedure
    .input(updateRecommendationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input

      const result = await ctx.db
        .update(serviceRecommendations)
        .set(updates)
        .where(eq(serviceRecommendations.id, id))
        .returning()

      return result[0] || null
    }),

  // Delete recommendation (soft delete by setting isActive to false)
  delete: publicProcedure
    .input(object({ id: number() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(serviceRecommendations)
        .set({ isActive: false })
        .where(eq(serviceRecommendations.id, input.id))
        .returning()

      return result[0] || null
    }),
})