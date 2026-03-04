import type { InferOutput } from 'valibot';
import type {
  createOdoLogSchema,
  createProductSchema,
  createRecommendationSchema,
  createServiceRecordSchema,
  createVehicleSchema,
  updateOdoLogSchema,
  updateProductSchema,
  updateRecommendationSchema,
  updateServiceRecordSchema,
  updateVehicleSchema,
} from '../validators/index.js';

// Vehicle types
export type CreateVehicleInput = InferOutput<typeof createVehicleSchema>;
export type UpdateVehicleInput = InferOutput<typeof updateVehicleSchema>;
export interface Vehicle {
  id: number;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  currentMileage: number;
  createdAt: Date;
  updatedAt: Date;
}

// Odo log types
export type CreateOdoLogInput = InferOutput<typeof createOdoLogSchema>;
export type UpdateOdoLogInput = InferOutput<typeof updateOdoLogSchema>;
export interface OdoLog {
  id: number;
  vehicleId: number;
  mileage: number;
  date: Date;
  notes: string | null;
  createdAt: Date;
}

// Service record types
export type CreateServiceRecordInput = InferOutput<typeof createServiceRecordSchema>;
export type UpdateServiceRecordInput = InferOutput<typeof updateServiceRecordSchema>;
export interface ServiceRecord {
  id: number;
  vehicleId: number;
  serviceType: string;
  description: string;
  mileageAtService: number;
  cost: number | null;
  date: Date;
  nextServiceMileage: number | null;
  nextServiceDate: Date | null;
  notes: string | null;
  createdAt: Date;
}

// Service recommendation types
export type CreateRecommendationInput = InferOutput<typeof createRecommendationSchema>;
export type UpdateRecommendationInput = InferOutput<typeof updateRecommendationSchema>;
export interface ServiceRecommendation {
  id: number;
  make: string;
  model: string | null;
  serviceType: string;
  intervalMileage: number | null;
  intervalMonths: number | null;
  description: string;
  isActive: boolean;
}

// Product types
export type CreateProductInput = InferOutput<typeof createProductSchema>;
export type UpdateProductInput = InferOutput<typeof updateProductSchema>;
export interface Product {
  id: number;
  name: string;
  description: string | null;
  category: string;
  price: number;
  brand: string | null;
  compatibility: unknown;
  isAvailable: boolean;
  createdAt: Date;
}
