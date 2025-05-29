import { Prisma } from '../generated/prisma';
import { prisma } from './prisma';
import { extractGeoParams, convertRadiusToMeters, parsePolygonString, polygonToWKT } from './geoUtils';

/**
 * Property search parameters interface
 * Defines all possible filter parameters that can be used in property search
 */
export interface PropertySearchParams {
  // Text search
  q?: string;                   // General keyword search
  
  // Location filters
  city?: string;
  postcode?: string;
  province?: string;
  
  // Property type filter
  propertyType?: string;        // Comma-separated list of property types
  
  // Price range filters
  minPrice?: string | number;
  maxPrice?: string | number;
  
  // Room filters
  minBedrooms?: string | number;
  maxBedrooms?: string | number;
  minBathrooms?: string | number;
  maxBathrooms?: string | number;
  
  // Area filter
  minArea?: string | number;
  maxArea?: string | number;
  
  // Amenities filter
  amenities?: string;           // Comma-separated list of amenities
  
  // Availability filter
  availabilityDate?: string;    // ISO date string (YYYY-MM-DD)
  
  // Geospatial filters
  latitude?: string | number;   // Center point latitude for radius search
  longitude?: string | number;  // Center point longitude for radius search
  radius?: string | number;     // Radius for proximity search
  radiusUnit?: string;          // 'km' or 'm' (default to 'm')
  polygon?: string;             // Polygon coordinates for area search
  
  // Sorting
  sortBy?: string;              // Field to sort by
  sortOrder?: 'asc' | 'desc';   // Sort direction
  
  // Pagination
  page?: string | number;       // Page number (1-based)
  limit?: string | number;      // Items per page
}

/**
 * Property search result interface
 */
export interface PropertySearchResult {
  properties: any[];            // Array of property objects
  total: number;                // Total number of matching properties
  page: number;                 // Current page number
  limit: number;                // Items per page
  totalPages: number;           // Total number of pages
}

/**
 * Valid sort fields whitelist for security
 */
const VALID_SORT_FIELDS = [
  'rentAmount', 
  'createdAt', 
  'updatedAt', 
  'bedrooms', 
  'bathrooms', 
  'areaSqft',
  'availabilityDate'
];

/**
 * Search for properties with advanced filtering
 * @param params Search parameters
 * @returns Promise with search results
 */
export async function searchProperties(params: PropertySearchParams): Promise<PropertySearchResult> {
  try {
    // Parse pagination parameters
    const page = Math.max(1, parseInt(params.page as string) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(params.limit as string) || 20));
    const skip = (page - 1) * limit;

    // Initialize the where clause for the query
    let where: Prisma.PropertyWhereInput = {
      status: 'AVAILABLE', // Default to only available properties
    };

    // Build the where clause based on provided parameters
    where = buildWhereClause(params, where);

    // Determine if we need geospatial filtering
    const geoParams = extractGeoParams(params);
    let useRawQuery = false;
    let rawQueryParams: any = {};
    let rawWhereClause = '';

    if (geoParams) {
      useRawQuery = true;
      const geoWhereClause = buildGeoWhereClause(geoParams);
      if (geoWhereClause) {
        rawWhereClause = geoWhereClause.clause;
        rawQueryParams = { ...rawQueryParams, ...geoWhereClause.params };
      }
    }

    // Build the orderBy clause
    const orderBy = buildOrderByClause(params);

    // Execute the query based on whether we need geospatial filtering
    let properties: any[] = [];
    let total = 0;

    if (useRawQuery) {
      // Convert the Prisma where clause to a SQL where clause
      const prismaWhereClauseToSql = Prisma.raw(
        Prisma.sql`WHERE ${Prisma.raw(convertPrismaWhereToSql(where))} ${rawWhereClause ? Prisma.raw(`AND ${rawWhereClause}`) : Prisma.raw('')}`
      );

      // Build the complete raw query
      const rawQuery = Prisma.sql`
        SELECT p.*, ${geoParams?.center ? Prisma.raw(`ST_Distance(location, ST_SetSRID(ST_MakePoint(${params.longitude}, ${params.latitude}), 4326)::geography) as distance`) : Prisma.raw('NULL as distance')}
        FROM "Property" p
        ${prismaWhereClauseToSql}
        ${params.sortBy === 'distance' && geoParams?.center ? Prisma.raw('ORDER BY distance') : buildRawOrderByClause(params)}
        LIMIT ${limit} OFFSET ${skip}
      `;

      // Count query for total results
      const countQuery = Prisma.sql`
        SELECT COUNT(*) FROM "Property" p
        ${prismaWhereClauseToSql}
      `;

      // Execute the queries
      const [results, countResult] = await Promise.all([
        prisma.$queryRaw(rawQuery),
        prisma.$queryRaw(countQuery)
      ]);

      properties = results as any[];
      total = parseInt((countResult as any[])[0].count);
    } else {
      // Use Prisma's standard query builder for non-geospatial queries
      const [results, count] = await Promise.all([
        prisma.property.findMany({
          where,
          orderBy,
          skip,
          take: limit,
        }),
        prisma.property.count({ where })
      ]);

      properties = results;
      total = count;
    }

    return {
      properties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Error in property search:', error);
    throw new Error(`Failed to search properties: ${(error as Error).message}`);
  }
}

/**
 * Build the where clause for property filtering
 * @param params Search parameters
 * @param where Initial where clause
 * @returns Updated where clause
 */
function buildWhereClause(params: PropertySearchParams, where: Prisma.PropertyWhereInput): Prisma.PropertyWhereInput {
  // Text search (keyword search)
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } },
      { addressLine1: { contains: params.q, mode: 'insensitive' } },
      { city: { contains: params.q, mode: 'insensitive' } },
      { postcode: { contains: params.q, mode: 'insensitive' } }
    ];
  }

  // Location filters
  if (params.city) {
    where.city = { equals: params.city, mode: 'insensitive' };
  }

  if (params.postcode) {
    where.postcode = { equals: params.postcode, mode: 'insensitive' };
  }

  if (params.province) {
    where.province = { equals: params.province, mode: 'insensitive' };
  }

  // Property type filter
  if (params.propertyType) {
    const types = params.propertyType.split(',').map(t => t.trim().toUpperCase());
    if (types.length > 0) {
      where.propertyType = { in: types as any[] };
    }
  }

  // Price range filters
  if (params.minPrice) {
    const minPrice = parseFloat(params.minPrice as string);
    if (!isNaN(minPrice) && minPrice >= 0) {
      where.rentAmount = { ...where.rentAmount, gte: minPrice };
    }
  }

  if (params.maxPrice) {
    const maxPrice = parseFloat(params.maxPrice as string);
    if (!isNaN(maxPrice) && maxPrice > 0) {
      where.rentAmount = { ...where.rentAmount, lte: maxPrice };
    }
  }

  // Room filters
  if (params.minBedrooms) {
    const minBedrooms = parseInt(params.minBedrooms as string);
    if (!isNaN(minBedrooms) && minBedrooms >= 0) {
      where.bedrooms = { ...where.bedrooms, gte: minBedrooms };
    }
  }

  if (params.maxBedrooms) {
    const maxBedrooms = parseInt(params.maxBedrooms as string);
    if (!isNaN(maxBedrooms) && maxBedrooms > 0) {
      where.bedrooms = { ...where.bedrooms, lte: maxBedrooms };
    }
  }

  if (params.minBathrooms) {
    const minBathrooms = parseInt(params.minBathrooms as string);
    if (!isNaN(minBathrooms) && minBathrooms >= 0) {
      where.bathrooms = { ...where.bathrooms, gte: minBathrooms };
    }
  }

  if (params.maxBathrooms) {
    const maxBathrooms = parseInt(params.maxBathrooms as string);
    if (!isNaN(maxBathrooms) && maxBathrooms > 0) {
      where.bathrooms = { ...where.bathrooms, lte: maxBathrooms };
    }
  }

  // Area filter
  if (params.minArea) {
    const minArea = parseInt(params.minArea as string);
    if (!isNaN(minArea) && minArea >= 0) {
      where.areaSqft = { ...where.areaSqft, gte: minArea };
    }
  }

  if (params.maxArea) {
    const maxArea = parseInt(params.maxArea as string);
    if (!isNaN(maxArea) && maxArea > 0) {
      where.areaSqft = { ...where.areaSqft, lte: maxArea };
    }
  }

  // Amenities filter
  if (params.amenities) {
    const amenitiesList = params.amenities.split(',').map(a => a.trim());
    if (amenitiesList.length > 0) {
      where.amenities = { hasEvery: amenitiesList };
    }
  }

  // Availability date filter
  if (params.availabilityDate) {
    try {
      const date = new Date(params.availabilityDate);
      if (!isNaN(date.getTime())) {
        where.availabilityDate = { lte: date };
      }
    } catch (error) {
      console.warn(`Invalid availability date format: ${params.availabilityDate}`);
    }
  }

  return where;
}

/**
 * Build the orderBy clause for property sorting
 * @param params Search parameters
 * @returns OrderBy clause for Prisma query
 */
function buildOrderByClause(params: PropertySearchParams): Prisma.PropertyOrderByWithRelationInput | Prisma.PropertyOrderByWithRelationInput[] {
  // Default sort is by creation date, newest first
  if (!params.sortBy || !VALID_SORT_FIELDS.includes(params.sortBy)) {
    return { createdAt: 'desc' };
  }

  const direction = params.sortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc';
  
  // Handle special case for rentAmount which is a Decimal in the database
  if (params.sortBy === 'rentAmount') {
    return { rentAmount: direction };
  }
  
  // Handle other valid sort fields
  return { [params.sortBy]: direction } as Prisma.PropertyOrderByWithRelationInput;
}

/**
 * Build a raw SQL ORDER BY clause for use in raw queries
 * @param params Search parameters
 * @returns Raw SQL ORDER BY clause
 */
function buildRawOrderByClause(params: PropertySearchParams): Prisma.Sql {
  if (!params.sortBy || !VALID_SORT_FIELDS.includes(params.sortBy)) {
    return Prisma.sql`ORDER BY p."createdAt" DESC`;
  }

  const direction = params.sortOrder?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  return Prisma.sql`ORDER BY p."${Prisma.raw(params.sortBy)}" ${Prisma.raw(direction)}`;
}

/**
 * Build a geospatial where clause for PostGIS queries
 * @param geoParams Geospatial parameters
 * @returns SQL where clause and parameters
 */
function buildGeoWhereClause(geoParams: any): { clause: string; params: any } | null {
  if (!geoParams) return null;

  // For radius search
  if (geoParams.center && geoParams.radius) {
    return {
      clause: `ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3
      )`,
      params: [geoParams.center.lon, geoParams.center.lat, geoParams.radius]
    };
  }

  // For polygon search
  if (geoParams.polygon && geoParams.polygon.length > 2) {
    const wktPolygon = polygonToWKT(geoParams.polygon);
    return {
      clause: `ST_Within(
        location::geometry,
        ST_SetSRID(ST_GeomFromText($1), 4326)
      )`,
      params: [wktPolygon]
    };
  }

  return null;
}

/**
 * Helper function to convert a Prisma where clause to SQL
 * This is a simplified version and may need to be expanded for complex queries
 * @param where Prisma where clause
 * @returns SQL where clause string
 */
function convertPrismaWhereToSql(where: Prisma.PropertyWhereInput): string {
  // This is a simplified implementation
  // In a production environment, you would need a more robust solution
  const conditions: string[] = [];

  // Process simple equality conditions
  Object.entries(where).forEach(([key, value]) => {
    if (typeof value === 'string') {
      conditions.push(`"${key}" = '${value}'`);
    } else if (typeof value === 'number') {
      conditions.push(`"${key}" = ${value}`);
    } else if (value && typeof value === 'object') {
      // Handle operators like gte, lte, etc.
      if ('gte' in value) {
        conditions.push(`"${key}" >= ${value.gte}`);
      }
      if ('lte' in value) {
        conditions.push(`"${key}" <= ${value.lte}`);
      }
      if ('equals' in value) {
        if (typeof value.equals === 'string') {
          conditions.push(`"${key}" = '${value.equals}'`);
        } else {
          conditions.push(`"${key}" = ${value.equals}`);
        }
      }
      if ('in' in value && Array.isArray(value.in)) {
        const values = value.in.map(v => typeof v === 'string' ? `'${v}'` : v).join(', ');
        conditions.push(`"${key}" IN (${values})`);
      }
      if ('contains' in value) {
        conditions.push(`"${key}" ILIKE '%${value.contains}%'`);
      }
      if ('hasEvery' in value && Array.isArray(value.hasEvery)) {
        // For array containment in PostgreSQL
        const arrayValues = value.hasEvery.map(v => `'${v}'`).join(', ');
        conditions.push(`"${key}" @> ARRAY[${arrayValues}]::varchar[]`);
      }
    }
  });

  // Handle OR conditions
  if (where.OR && Array.isArray(where.OR)) {
    const orConditions = where.OR.map(condition => {
      const subConditions = Object.entries(condition).map(([key, value]) => {
        if (typeof value === 'object' && value !== null && 'contains' in value) {
          return `"${key}" ILIKE '%${value.contains}%'`;
        }
        return `"${key}" = '${value}'`;
      });
      return `(${subConditions.join(' OR ')})`;
    });
    conditions.push(`(${orConditions.join(' OR ')})`);
  }

  return conditions.length > 0 ? conditions.join(' AND ') : '1=1';
}

/**
 * Get property by ID
 * @param id Property ID
 * @returns Property object or null if not found
 */
export async function getPropertyById(id: string) {
  try {
    return await prisma.property.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    throw new Error(`Failed to fetch property: ${(error as Error).message}`);
  }
}

/**
 * Create a new property listing
 * @param data Property data
 * @returns Created property
 */
export async function createProperty(data: Prisma.PropertyCreateInput) {
  try {
    const property = await prisma.property.create({
      data
    });

    // Update the PostGIS location column
    if (property.latitude && property.longitude) {
      await prisma.$executeRaw`
        UPDATE "Property" 
        SET location = ST_SetSRID(ST_MakePoint(${property.longitude}, ${property.latitude}), 4326)::geography
        WHERE id = ${property.id}
      `;
    }

    return property;
  } catch (error) {
    console.error('Error creating property:', error);
    throw new Error(`Failed to create property: ${(error as Error).message}`);
  }
}

/**
 * Update an existing property
 * @param id Property ID
 * @param data Updated property data
 * @returns Updated property
 */
export async function updateProperty(id: string, data: Prisma.PropertyUpdateInput) {
  try {
    const property = await prisma.property.update({
      where: { id },
      data
    });

    // Update the PostGIS location column if coordinates were updated
    if (
      (data.latitude !== undefined && data.latitude !== null) ||
      (data.longitude !== undefined && data.longitude !== null)
    ) {
      // Get the current property to ensure we have both coordinates
      const currentProperty = await prisma.property.findUnique({
        where: { id },
        select: { latitude: true, longitude: true }
      });

      if (currentProperty) {
        const lat = data.latitude !== undefined ? Number(data.latitude) : currentProperty.latitude;
        const lon = data.longitude !== undefined ? Number(data.longitude) : currentProperty.longitude;

        await prisma.$executeRaw`
          UPDATE "Property" 
          SET location = ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)::geography
          WHERE id = ${id}
        `;
      }
    }

    return property;
  } catch (error) {
    console.error(`Error updating property ${id}:`, error);
    throw new Error(`Failed to update property: ${(error as Error).message}`);
  }
}

/**
 * Delete a property
 * @param id Property ID
 * @returns Deleted property
 */
export async function deleteProperty(id: string) {
  try {
    return await prisma.property.delete({
      where: { id }
    });
  } catch (error) {
    console.error(`Error deleting property ${id}:`, error);
    throw new Error(`Failed to delete property: ${(error as Error).message}`);
  }
}
