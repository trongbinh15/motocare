import { router, publicProcedure } from '../trpc/trpc'
import { products } from '../db/schema'
import { eq, and, desc, asc } from 'drizzle-orm'
import { z } from 'zod'

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  price: z.number().min(0),
  brand: z.string().optional(),
  compatibility: z.array(z.string()).optional(), // Array of compatible vehicle makes/models
  isAvailable: z.boolean().optional().default(true),
})

const updateProductSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  brand: z.string().optional(),
  compatibility: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional(),
})

export const productsRouter = router({
  // Get all available products
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(100).optional().default(50),
      offset: z.number().int().min(0).optional().default(0),
      sortBy: z.enum(['name', 'price', 'createdAt']).optional().default('createdAt'),
      sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
    }))
    .query(async ({ ctx, input }) => {
      let orderBy

      switch (input.sortBy) {
        case 'name':
          orderBy = input.sortOrder === 'asc' ? asc(products.name) : desc(products.name)
          break
        case 'price':
          orderBy = input.sortOrder === 'asc' ? asc(products.price) : desc(products.price)
          break
        case 'createdAt':
        default:
          orderBy = input.sortOrder === 'asc' ? asc(products.createdAt) : desc(products.createdAt)
          break
      }

      return await ctx.db
        .select()
        .from(products)
        .where(eq(products.isAvailable, true))
        .orderBy(orderBy)
        .limit(input.limit)
        .offset(input.offset)
    }),

  // Get products by category
  getByCategory: publicProcedure
    .input(z.object({
      category: z.string(),
      limit: z.number().int().min(1).max(100).optional().default(50),
      offset: z.number().int().min(0).optional().default(0)
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(products)
        .where(and(
          eq(products.category, input.category),
          eq(products.isAvailable, true)
        ))
        .orderBy(desc(products.createdAt))
        .limit(input.limit)
        .offset(input.offset)
    }),

  // Get product by ID
  getById: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(products)
        .where(eq(products.id, input.id))
        .limit(1)

      return result[0] || null
    }),

  // Search products
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      category: z.string().optional(),
      limit: z.number().int().min(1).max(100).optional().default(20)
    }))
    .query(async ({ ctx, input }) => {
      // Note: This is a simplified search - in production you might want full-text search
      // For now, we'll search by name only
      let whereCondition = and(
        eq(products.isAvailable, true),
        eq(products.name, input.query) // This should be a LIKE search in production
      )

      if (input.category) {
        whereCondition = and(whereCondition, eq(products.category, input.category))
      }

      return await ctx.db
        .select()
        .from(products)
        .where(whereCondition)
        .orderBy(desc(products.createdAt))
        .limit(input.limit)
    }),

  // Get product categories
  getCategories: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .selectDistinct({ category: products.category })
      .from(products)
      .where(eq(products.isAvailable, true))
      .orderBy(products.category)

    return result.map(row => row.category)
  }),

  // Create new product
  create: publicProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(products)
        .values({
          ...input,
          compatibility: input.compatibility ? JSON.stringify(input.compatibility) : null,
        })
        .returning()

      return result[0]
    }),

  // Update product
  update: publicProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, compatibility, ...updates } = input

      const updateData: any = { ...updates }
      if (compatibility !== undefined) {
        updateData.compatibility = JSON.stringify(compatibility)
      }

      const result = await ctx.db
        .update(products)
        .set(updateData)
        .where(eq(products.id, id))
        .returning()

      return result[0] || null
    }),

  // Delete product (soft delete by setting isAvailable to false)
  delete: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(products)
        .set({ isAvailable: false })
        .where(eq(products.id, input.id))
        .returning()

      return result[0] || null
    }),
})