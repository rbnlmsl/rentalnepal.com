import { z } from 'zod';

/**
 * Enum schemas that match the Prisma schema definitions
 */
export const PropertyTypeEnum = z.enum([
  'HOUSE',
  'APARTMENT',
  'STUDIO',
  'ROOM',
  'TOWNHOUSE',
  'VILLA',
  'LAND',
  'COMMERCIAL',
  'OTHER'
]);

export const PropertyStatusEnum = z.enum([
  'AVAILABLE',
  'RENTED',
  'PENDING',
  'MAINTENANCE',
  'INACTIVE'
]);

export const PriceFrequencyEnum = z.enum([
  'PW', // Per week
  'PM'  // Per month
]);

/**
 * Coordinate validation schema
 */
export const CoordinateSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180)
});

/**
 * Base property schema for validation
 */
export const PropertyBaseSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().max(5000).optional(),
  addressLine1: z.string().min(5).max(255),
  addressLine2: z.string().max(255).optional(),
  city: z.string().min(2).max(100),
  province: z.string().min(2).max(100),
  postcode: z.string().min(3).max(20),
  country: z.string().default('Nepal'),
  
  // Geospatial data
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  
  // Property details
  propertyType: PropertyTypeEnum,
  rentAmount: z.number().positive(),
  depositAmount: z.number().positive().optional(),
  priceFrequency: PriceFrequencyEnum.default('PM'),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  areaSqft: z.number().int().positive().optional(),
  
  // Amenities as an array
  amenities: z.array(z.string()).default([]),
  
  // Availability and status
  availabilityDate: z.string().or(z.date()),
  status: PropertyStatusEnum.default('AVAILABLE'),
  
  // Media
  images: z.array(z.string().url()).default([])
});

/**
 * Schema for creating a new property
 */
export const CreatePropertySchema = PropertyBaseSchema.extend({
  landlordId: z.string().uuid()
});

/**
 * Schema for updating an existing property
 * Makes all fields optional
 */
export const UpdatePropertySchema = PropertyBaseSchema.partial().extend({
  id: z.string().uuid()
});

/**
 * Schema for property search parameters
 */
export const PropertySearchSchema = z.object({
  // Text search
  q: z.string().optional(),
  
  // Location filters
  city: z.string().optional(),
  postcode: z.string().optional(),
  province: z.string().optional(),
  
  // Property type filter (comma-separated list)
  propertyType: z.string().optional(),
  
  // Price range filters
  minPrice: z.string().or(z.number()).optional(),
  maxPrice: z.string().or(z.number()).optional(),
  
  // Room filters
  minBedrooms: z.string().or(z.number()).optional(),
  maxBedrooms: z.string().or(z.number()).optional(),
  minBathrooms: z.string().or(z.number()).optional(),
  maxBathrooms: z.string().or(z.number()).optional(),
  
  // Area filter
  minArea: z.string().or(z.number()).optional(),
  maxArea: z.string().or(z.number()).optional(),
  
  // Amenities filter (comma-separated list)
  amenities: z.string().optional(),
  
  // Availability filter
  availabilityDate: z.string().optional(),
  
  // Geospatial filters
  latitude: z.string().or(z.number()).optional(),
  longitude: z.string().or(z.number()).optional(),
  radius: z.string().or(z.number()).optional(),
  radiusUnit: z.string().optional(),
  polygon: z.string().optional(),
  
  // Sorting
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  
  // Pagination
  page: z.string().or(z.number()).optional().default('1'),
  limit: z.string().or(z.number()).optional().default('20')
});

/**
 * Schema for radius search parameters
 */
export const RadiusSearchSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().positive(),
  radiusUnit: z.enum(['m', 'km']).optional().default('m')
});

/**
 * Schema for polygon search parameters
 */
export const PolygonSearchSchema = z.object({
  polygon: z.string()
});

/**
 * Validate property creation data
 * @param data The property data to validate
 * @returns Validated and typed property data
 */
export function validatePropertyCreation(data: unknown) {
  return CreatePropertySchema.parse(data);
}

/**
 * Validate property update data
 * @param data The property update data to validate
 * @returns Validated and typed property update data
 */
export function validatePropertyUpdate(data: unknown) {
  return UpdatePropertySchema.parse(data);
}

/**
 * Validate property search parameters
 * @param params The search parameters to validate
 * @returns Validated and typed search parameters
 */
export function validatePropertySearch(params: unknown) {
  return PropertySearchSchema.parse(params);
}

/**
 * Validate radius search parameters
 * @param params The radius search parameters to validate
 * @returns Validated and typed radius search parameters
 */
export function validateRadiusSearch(params: unknown) {
  return RadiusSearchSchema.parse(params);
}

/**
 * Validate polygon search parameters
 * @param params The polygon search parameters to validate
 * @returns Validated and typed polygon search parameters
 */
export function validatePolygonSearch(params: unknown) {
  return PolygonSearchSchema.parse(params);
}

/**
 * Parse and validate a string as a number within a range
 * @param value The string value to parse
 * @param min Minimum allowed value (optional)
 * @param max Maximum allowed value (optional)
 * @returns Parsed number or undefined if invalid
 */
export function parseNumberParam(value: string | null | undefined, min?: number, max?: number): number | undefined {
  if (!value) return undefined;
  
  const num = Number(value);
  if (isNaN(num)) return undefined;
  
  if (min !== undefined && num < min) return undefined;
  if (max !== undefined && num > max) return undefined;
  
  return num;
}

/**
 * Parse and validate a string as a date
 * @param value The string value to parse
 * @returns Parsed Date object or undefined if invalid
 */
export function parseDateParam(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return undefined;
    return date;
  } catch (e) {
    return undefined;
  }
}

/**
 * Parse and validate a comma-separated string as an array
 * @param value The comma-separated string
 * @returns Array of strings or undefined if empty
 */
export function parseArrayParam(value: string | null | undefined): string[] | undefined {
  if (!value) return undefined;
  
  const array = value.split(',').map(item => item.trim()).filter(Boolean);
  return array.length > 0 ? array : undefined;
}
