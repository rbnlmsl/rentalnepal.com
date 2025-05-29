import { NextRequest, NextResponse } from 'next/server';
import { searchProperties, PropertySearchParams } from '@/lib/propertyService';

/**
 * GET handler for property search API
 * Handles all advanced filtering parameters and returns paginated search results
 * 
 * @route GET /api/properties/search
 */
export async function GET(request: NextRequest) {
  try {
    // Extract all query parameters from the URL
    const searchParams = request.nextUrl.searchParams;
    
    // Build the search parameters object from query parameters
    const params: PropertySearchParams = {
      // Text search
      q: searchParams.get('q') || undefined,
      
      // Location filters
      city: searchParams.get('city') || undefined,
      postcode: searchParams.get('postcode') || undefined,
      province: searchParams.get('province') || undefined,
      
      // Property type filter
      propertyType: searchParams.get('propertyType') || undefined,
      
      // Price range filters
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      
      // Room filters
      minBedrooms: searchParams.get('minBedrooms') || undefined,
      maxBedrooms: searchParams.get('maxBedrooms') || undefined,
      minBathrooms: searchParams.get('minBathrooms') || undefined,
      maxBathrooms: searchParams.get('maxBathrooms') || undefined,
      
      // Area filter
      minArea: searchParams.get('minArea') || undefined,
      maxArea: searchParams.get('maxArea') || undefined,
      
      // Amenities filter
      amenities: searchParams.get('amenities') || undefined,
      
      // Availability filter
      availabilityDate: searchParams.get('availabilityDate') || undefined,
      
      // Geospatial filters
      latitude: searchParams.get('latitude') || undefined,
      longitude: searchParams.get('longitude') || undefined,
      radius: searchParams.get('radius') || undefined,
      radiusUnit: searchParams.get('radiusUnit') || undefined,
      polygon: searchParams.get('polygon') || undefined,
      
      // Sorting
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
      
      // Pagination
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
    };

    // Validate geospatial parameters
    if (
      (params.latitude && !params.longitude) || 
      (!params.latitude && params.longitude) ||
      (params.latitude && params.longitude && !params.radius)
    ) {
      return NextResponse.json(
        { 
          error: 'Invalid geospatial parameters. For radius search, latitude, longitude, and radius are all required.' 
        }, 
        { status: 400 }
      );
    }

    // Validate polygon parameter if provided
    if (params.polygon) {
      try {
        // The validation will happen inside the searchProperties function
        // through the extractGeoParams utility
      } catch (error) {
        return NextResponse.json(
          { error: `Invalid polygon format: ${(error as Error).message}` }, 
          { status: 400 }
        );
      }
    }

    // Perform the search with all parameters
    const results = await searchProperties(params);

    // Return the search results
    return NextResponse.json(results);
  } catch (error) {
    console.error('Property search API error:', error);
    
    // Return appropriate error response
    return NextResponse.json(
      { error: `Failed to search properties: ${(error as Error).message}` }, 
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler to support CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
