import { and, asc, desc, eq } from 'drizzle-orm';
import { array, boolean, literal, number, object, optional, string, union } from 'valibot';
import { products } from '../db/schema';
import { publicProcedure, router } from '../trpc/trpc';

const createProductSchema = object({
  name: string(),
  description: optional(string()),
  category: string(),
  price: number(),
  brand: optional(string()),
  compatibility: optional(array(string())),
  isAvailable: optional(boolean(), true),
});

const updateProductSchema = object({
  id: number(),
  name: optional(string()),
  description: optional(string()),
  category: optional(string()),
  price: optional(number()),
  brand: optional(string()),
  compatibility: optional(array(string())),
  isAvailable: optional(boolean()),
});

export const productsRouter = router({
  // Get all available products
  getAll: publicProcedure
    .input(
      object({
        limit: optional(number(), 50),
        offset: optional(number(), 0),
        sortBy: optional(
          union([literal('name'), literal('price'), literal('createdAt')]),
          'createdAt'
        ),
        sortOrder: optional(union([literal('asc'), literal('desc')]), 'desc'),
      })
    )
    .query(async ({ ctx, input }) => {
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

  // Get products by category
  getByCategory: publicProcedure
    .input(
      object({
        category: string(),
        limit: optional(number(), 50),
        offset: optional(number(), 0),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(products)
        .where(and(eq(products.category, input.category), eq(products.isAvailable, true)))
        .orderBy(desc(products.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  // Get product by ID
  getById: publicProcedure.input(object({ id: number() })).query(async ({ ctx, input }) => {
    const result = await ctx.db.select().from(products).where(eq(products.id, input.id)).limit(1);

    return result[0] || null;
  }),

  // Search products
  search: publicProcedure
    .input(
      object({
        query: string(),
        category: optional(string()),
        limit: optional(number(), 20),
      })
    )
    .query(async ({ ctx, input }) => {
      // Note: This is a simplified search - in production you might want full-text search
      // For now, we'll search by name only
      let whereCondition = and(
        eq(products.isAvailable, true),
        eq(products.name, input.query) // This should be a LIKE search in production
      );

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

  // Get product categories
  getCategories: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .selectDistinct({ category: products.category })
      .from(products)
      .where(eq(products.isAvailable, true))
      .orderBy(products.category);

    return result.map((row) => row.category);
  }),

  // Create new product
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

  // Update product
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

  // Delete product (soft delete by setting isAvailable to false)
  delete: publicProcedure.input(object({ id: number() })).mutation(async ({ ctx, input }) => {
    const result = await ctx.db
      .update(products)
      .set({ isAvailable: false })
      .where(eq(products.id, input.id))
      .returning();

    return result[0] || null;
  }),
});
