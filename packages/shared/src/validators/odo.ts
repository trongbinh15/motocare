import { date, number, object, optional, string } from 'valibot';

export const createOdoLogSchema = object({
  vehicleId: number(),
  mileage: number(),
  date: optional(date(), () => new Date()),
  notes: optional(string()),
});

export const updateOdoLogSchema = object({
  id: number(),
  mileage: optional(number()),
  date: optional(date()),
  notes: optional(string()),
});

export const getOdoByVehicleSchema = object({
  vehicleId: number(),
  limit: optional(number(), 50),
  offset: optional(number(), 0),
});

export const getOdoByDateRangeSchema = object({
  vehicleId: number(),
  startDate: date(),
  endDate: date(),
});

export const getOdoByVehicleIdSchema = object({
  vehicleId: number(),
});

export const odoValidators = {
  create: createOdoLogSchema,
  update: updateOdoLogSchema,
  getByVehicle: getOdoByVehicleSchema,
  getByDateRange: getOdoByDateRangeSchema,
  getByVehicleId: getOdoByVehicleIdSchema,
} as const;
