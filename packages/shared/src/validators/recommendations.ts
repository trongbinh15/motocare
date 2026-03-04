import { boolean, number, object, optional, string } from 'valibot';

export const createRecommendationSchema = object({
  make: string(),
  model: optional(string()),
  serviceType: string(),
  intervalMileage: optional(number()),
  intervalMonths: optional(number()),
  description: string(),
  isActive: optional(boolean(), true),
});

export const updateRecommendationSchema = object({
  id: number(),
  make: optional(string()),
  model: optional(string()),
  serviceType: optional(string()),
  intervalMileage: optional(number()),
  intervalMonths: optional(number()),
  description: optional(string()),
  isActive: optional(boolean()),
});

export const getRecommendationsByMakeSchema = object({
  make: string(),
  model: optional(string()),
  limit: optional(number(), 50),
});

export const getRecommendationsByTypeSchema = object({
  serviceType: string(),
  limit: optional(number(), 50),
});

export const searchRecommendationsSchema = object({
  query: string(),
  limit: optional(number(), 20),
});

export const recommendationValidators = {
  create: createRecommendationSchema,
  update: updateRecommendationSchema,
  getByMake: getRecommendationsByMakeSchema,
  getByType: getRecommendationsByTypeSchema,
  search: searchRecommendationsSchema,
} as const;
