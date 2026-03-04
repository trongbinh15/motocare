import { number, object, optional } from 'valibot';

/** Reusable pagination input */
export const paginationSchema = object({
  limit: optional(number(), 50),
  offset: optional(number(), 0),
});

/** Reusable single ID input */
export const byIdSchema = object({
  id: number(),
});

export const commonValidators = {
  pagination: paginationSchema,
  byId: byIdSchema,
} as const;
