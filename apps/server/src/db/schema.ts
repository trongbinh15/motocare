import { sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Vehicles table - basic vehicle information
export const vehicles = sqliteTable('vehicles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  licensePlate: text('license_plate').notNull().unique(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  currentMileage: integer('current_mileage').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Odometer logs - mileage tracking history
export const odoLogs = sqliteTable('odo_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleId: integer('vehicle_id')
    .notNull()
    .references(() => vehicles.id, { onDelete: 'cascade' }),
  mileage: integer('mileage').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Service records - maintenance/service history
export const serviceRecords = sqliteTable('service_records', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleId: integer('vehicle_id')
    .notNull()
    .references(() => vehicles.id, { onDelete: 'cascade' }),
  serviceType: text('service_type').notNull(),
  description: text('description').notNull(),
  mileageAtService: integer('mileage_at_service').notNull(),
  cost: real('cost'),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  nextServiceMileage: integer('next_service_mileage'),
  nextServiceDate: integer('next_service_date', { mode: 'timestamp' }),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Service recommendations - manufacturer recommendations
export const serviceRecommendations = sqliteTable('service_recommendations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  make: text('make').notNull(),
  model: text('model'), // Optional for model-specific recommendations
  serviceType: text('service_type').notNull(),
  intervalMileage: integer('interval_mileage'), // Recommended service interval in km
  intervalMonths: integer('interval_months'), // Recommended service interval in months
  description: text('description').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});

// Products catalog - related products for sale
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(), // oils, filters, tires, etc.
  price: real('price').notNull(),
  brand: text('brand'),
  compatibility: text('compatibility', { mode: 'json' }), // JSON array of compatible vehicles
  isAvailable: integer('is_available', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Export database type for use in tRPC context
export type Database = {
  vehicles: typeof vehicles;
  odoLogs: typeof odoLogs;
  serviceRecords: typeof serviceRecords;
  serviceRecommendations: typeof serviceRecommendations;
  products: typeof products;
};
