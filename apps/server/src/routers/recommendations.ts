import { router, publicProcedure } from '../trpc/trpc'
import { serviceRecommendations } from '../db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { z } from 'zod'

const createRecommendationSchema = z.object({
  make: z.string().min(1),
  model: z.string().optional(),
  serviceType: z.string().min(1),
  intervalMileage: z.number().int().min(0).optional(),
  intervalMonths: z.number().int().min(0).optional(),
  description: z.string().min(1),
  isActive: z.boolean().optional().default(true),
})

const updateRecommendationSchema = z.object({
  id: z.number().int(),
  make: z.string().min(1).optional(),
  model: z.string().optional(),
  serviceType: z.string().min(1).optional(),
  intervalMileage: z.number().int().min(0).optional(),
  intervalMonths: z.number().int().min(0).optional(),
  description: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
})

export const recommendationsRouter = router({
  // Get all active recommendations
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(100).optional().default(50),
      offset: z.number().int().min(0).optional().default(0)
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
    .input(z.object({
      make: z.string(),
      model: z.string().optional(),
      limit: z.number().int().min(1).max(100).optional().default(50)
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
    .input(z.object({
      serviceType: z.string(),
      limit: z.number().int().min(1).max(100).optional().default(50)
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
    .input(z.object({
      query: z.string().min(1),
      limit: z.number().int().min(1).max(100).optional().default(20)
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
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(serviceRecommendations)
        .set({ isActive: false })
        .where(eq(serviceRecommendations.id, input.id))
        .returning()

      return result[0] || null
    }),
})