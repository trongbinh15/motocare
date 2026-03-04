import {
  byIdSchema,
  createProductSchema,
  getProductsByCategorySchema,
  getProductsSchema,
  searchProductsSchema,
  updateProductSchema,
} from '@motocare/shared';
import { and, asc, desc, eq } from 'drizzle-orm';
import { products } from '../db/schema';
import { publicProcedure, router } from '../trpc/trpc';

export const productsRouter = router({
  getAll: publicProcedure.input(getProductsSchema).query(async ({ ctx, input }) => {
    let orderBy = asc(products.createdAt);

    switch (input.sortBy) {
      case 'name':
        orderBy = input.sortOrder === 'asc' ? asc(products.name) : desc(products.name);
        break;
      case 'price':
        orderBy = input.sortOrder === 'asc' ? asc(products.price) : desc(products.price);
        break;
      default:
        orderBy = input.sortOrder === 'asc' ? asc(products.createdAt) : desc(products.createdAt);
        break;
    }

    return await ctx.db
      .select()
      .from(products)
      .where(eq(products.isAvailable, true))
      .orderBy(orderBy)
      .limit(input.limit)
      .offset(input.offset);
  }),

  getByCategory: publicProcedure
    .input(getProductsByCategorySchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(products)
        .where(and(eq(products.category, input.category), eq(products.isAvailable, true)))
        .orderBy(desc(products.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  getById: publicProcedure.input(byIdSchema).query(async ({ ctx, input }) => {
    const result = await ctx.db.select().from(products).where(eq(products.id, input.id)).limit(1);
    return result[0] || null;
  }),

  search: publicProcedure.input(searchProductsSchema).query(async ({ ctx, input }) => {
    let whereCondition = and(eq(products.isAvailable, true), eq(products.name, input.query));

    if (input.category) {
      whereCondition = and(whereCondition, eq(products.category, input.category));
    }

    return await ctx.db
      .select()
      .from(products)
      .where(whereCondition)
      .orderBy(desc(products.createdAt))
      .limit(input.limit);
  }),

  getCategories: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .selectDistinct({ category: products.category })
      .from(products)
      .where(eq(products.isAvailable, true))
      .orderBy(products.category);
    return result.map((row) => row.category);
  }),

  create: publicProcedure.input(createProductSchema).mutation(async ({ ctx, input }) => {
    const result = await ctx.db
      .insert(products)
      .values({
        ...input,
        compatibility: input.compatibility ? JSON.stringify(input.compatibility) : null,
      })
      .returning();
    return result[0];
  }),

  update: publicProcedure.input(updateProductSchema).mutation(async ({ ctx, input }) => {
    const { id, compatibility, ...updates } = input;

    const updateData: Omit<typeof updates, 'compatibility'> & { compatibility?: string | null } = {
      ...updates,
    };
    if (compatibility !== undefined) {
      updateData.compatibility = JSON.stringify(compatibility);
    }

    const result = await ctx.db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return result[0] || null;
  }),

  delete: publicProcedure.input(byIdSchema).mutation(async ({ ctx, input }) => {
    const result = await ctx.db
      .update(products)
      .set({ isAvailable: false })
      .where(eq(products.id, input.id))
      .returning();
    return result[0] || null;
  }),
});
