export {
  vehicleValidators,
  createVehicleSchema,
  updateVehicleSchema,
  getByLicensePlateSchema,
} from './vehicles.js';
export {
  odoValidators,
  createOdoLogSchema,
  updateOdoLogSchema,
  getOdoByVehicleSchema,
  getOdoByDateRangeSchema,
  getOdoByVehicleIdSchema,
} from './odo.js';
export {
  serviceValidators,
  createServiceRecordSchema,
  updateServiceRecordSchema,
  getServiceByVehicleSchema,
  getServiceByTypeSchema,
  getUpcomingServicesSchema,
} from './service.js';
export {
  recommendationValidators,
  createRecommendationSchema,
  updateRecommendationSchema,
  getRecommendationsByMakeSchema,
  getRecommendationsByTypeSchema,
  searchRecommendationsSchema,
} from './recommendations.js';
export {
  productValidators,
  createProductSchema,
  updateProductSchema,
  getProductsSchema,
  getProductsByCategorySchema,
  searchProductsSchema,
} from './products.js';
export { commonValidators, paginationSchema, byIdSchema } from './common.js';
