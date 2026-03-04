import {
  byIdSchema,
  createRecommendationSchema,
  getRecommendationsByMakeSchema,
  getRecommendationsByTypeSchema,
  paginationSchema,
  searchRecommendationsSchema,
  updateRecommendationSchema,
} from '@motocare/shared';
import { and, desc, eq } from 'drizzle-orm';
import { serviceRecommendations } from '../db/schema';
import { publicProcedure, router } from '../trpc/trpc';

export const recommendationsRouter = router({
  getAll: publicProcedure.input(paginationSchema).query(async ({ ctx, input }) => {
    return await ctx.db
      .select()
      .from(serviceRecommendations)
      .where(eq(serviceRecommendations.isActive, true))
      .orderBy(desc(serviceRecommendations.make))
      .limit(input.limit)
      .offset(input.offset);
  }),

  getByMake: publicProcedure.input(getRecommendationsByMakeSchema).query(async ({ ctx, input }) => {
    let whereCondition = and(
      eq(serviceRecommendations.make, input.make),
      eq(serviceRecommendations.isActive, true)
    );

    if (input.model) {
      whereCondition = and(whereCondition, eq(serviceRecommendations.model, input.model));
    }

    return await ctx.db
      .select()
      .from(serviceRecommendations)
      .where(whereCondition)
      .orderBy(serviceRecommendations.serviceType)
      .limit(input.limit);
  }),

  getByServiceType: publicProcedure
    .input(getRecommendationsByTypeSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(serviceRecommendations)
        .where(
          and(
            eq(serviceRecommendations.serviceType, input.serviceType),
            eq(serviceRecommendations.isActive, true)
          )
        )
        .orderBy(serviceRecommendations.make)
        .limit(input.limit);
    }),

  search: publicProcedure.input(searchRecommendationsSchema).query(async ({ ctx, input }) => {
    return await ctx.db
      .select()
      .from(serviceRecommendations)
      .where(
        and(
          eq(serviceRecommendations.isActive, true),
          eq(serviceRecommendations.serviceType, input.query)
        )
      )
      .limit(input.limit);
  }),

  create: publicProcedure.input(createRecommendationSchema).mutation(async ({ ctx, input }) => {
    const result = await ctx.db.insert(serviceRecommendations).values(input).returning();
    return result[0];
  }),

  update: publicProcedure.input(updateRecommendationSchema).mutation(async ({ ctx, input }) => {
    const { id, ...updates } = input;
    const result = await ctx.db
      .update(serviceRecommendations)
      .set(updates)
      .where(eq(serviceRecommendations.id, id))
      .returning();
    return result[0] || null;
  }),

  delete: publicProcedure.input(byIdSchema).mutation(async ({ ctx, input }) => {
    const result = await ctx.db
      .update(serviceRecommendations)
      .set({ isActive: false })
      .where(eq(serviceRecommendations.id, input.id))
      .returning();
    return result[0] || null;
  }),
});
