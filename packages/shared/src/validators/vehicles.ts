import { minLength, number, object, optional, pipe, string } from 'valibot';

export const createVehicleSchema = object({
  licensePlate: pipe(string(), minLength(1)),
  make: pipe(string(), minLength(1)),
  model: pipe(string(), minLength(1)),
  year: number(),
  currentMileage: optional(number(), 0),
});

export const updateVehicleSchema = object({
  id: number(),
  licensePlate: optional(pipe(string(), minLength(1))),
  make: optional(pipe(string(), minLength(1))),
  model: optional(pipe(string(), minLength(1))),
  year: optional(number()),
  currentMileage: optional(number()),
});

export const getByLicensePlateSchema = object({
  licensePlate: string(),
});

export const vehicleValidators = {
  create: createVehicleSchema,
  update: updateVehicleSchema,
  getByLicensePlate: getByLicensePlateSchema,
} as const;
