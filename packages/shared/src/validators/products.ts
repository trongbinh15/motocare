import { array, boolean, literal, number, object, optional, string, union } from 'valibot';

export const createProductSchema = object({
  name: string(),
  description: optional(string()),
  category: string(),
  price: number(),
  brand: optional(string()),
  compatibility: optional(array(string())),
  isAvailable: optional(boolean(), true),
});

export const updateProductSchema = object({
  id: number(),
  name: optional(string()),
  description: optional(string()),
  category: optional(string()),
  price: optional(number()),
  brand: optional(string()),
  compatibility: optional(array(string())),
  isAvailable: optional(boolean()),
});

export const getProductsSchema = object({
  limit: optional(number(), 50),
  offset: optional(number(), 0),
  sortBy: optional(union([literal('name'), literal('price'), literal('createdAt')]), 'createdAt'),
  sortOrder: optional(union([literal('asc'), literal('desc')]), 'desc'),
});

export const getProductsByCategorySchema = object({
  category: string(),
  limit: optional(number(), 50),
  offset: optional(number(), 0),
});

export const searchProductsSchema = object({
  query: string(),
  category: optional(string()),
  limit: optional(number(), 20),
});

export const productValidators = {
  create: createProductSchema,
  update: updateProductSchema,
  getAll: getProductsSchema,
  getByCategory: getProductsByCategorySchema,
  search: searchProductsSchema,
} as const;
