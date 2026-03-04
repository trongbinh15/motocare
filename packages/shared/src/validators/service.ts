import { date, number, object, optional, string } from 'valibot';

export const createServiceRecordSchema = object({
  vehicleId: number(),
  serviceType: string(),
  description: string(),
  mileageAtService: number(),
  cost: optional(number()),
  date: optional(date(), () => new Date()),
  nextServiceMileage: optional(number()),
  nextServiceDate: optional(date()),
  notes: optional(string()),
});

export const updateServiceRecordSchema = object({
  id: number(),
  serviceType: optional(string()),
  description: optional(string()),
  mileageAtService: optional(number()),
  cost: optional(number()),
  date: optional(date()),
  nextServiceMileage: optional(number()),
  nextServiceDate: optional(date()),
  notes: optional(string()),
});

export const getServiceByVehicleSchema = object({
  vehicleId: number(),
  limit: optional(number(), 50),
  offset: optional(number(), 0),
});

export const getServiceByTypeSchema = object({
  serviceType: string(),
  limit: optional(number(), 50),
  offset: optional(number(), 0),
});

export const getUpcomingServicesSchema = object({
  daysAhead: optional(number(), 30),
  currentMileage: optional(number()),
});

export const serviceValidators = {
  create: createServiceRecordSchema,
  update: updateServiceRecordSchema,
  getByVehicle: getServiceByVehicleSchema,
  getByType: getServiceByTypeSchema,
  getUpcoming: getUpcomingServicesSchema,
} as const;
