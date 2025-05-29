import { NextRequest, NextResponse } from 'next/server';
import { createProperty } from '@/lib/propertyService';
import { Prisma } from '@/generated/prisma';

/**
 * POST handler for creating a new property listing
 * 
 * @route POST /api/properties
 */
export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'landlordId', 'title', 'addressLine1', 'city', 'province', 'postcode',
      'latitude', 'longitude', 'propertyType', 'rentAmount', 'bedrooms',
      'bathrooms', 'availabilityDate'
    ];

    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          missingFields 
        },
        { status: 400 }
      );
    }

    // Validate numeric fields
    const numericFields = [
      'latitude', 'longitude', 'rentAmount', 'depositAmount',
      'bedrooms', 'bathrooms', 'areaSqft'
    ];

    for (const field of numericFields) {
      if (body[field] !== undefined && isNaN(Number(body[field]))) {
        return NextResponse.json(
          { 
            error: `Field '${field}' must be a number` 
          },
          { status: 400 }
        );
      }
    }

    // Validate latitude and longitude
    if (
      body.latitude < -90 || body.latitude > 90 ||
      body.longitude < -180 || body.longitude > 180
    ) {
      return NextResponse.json(
        { 
          error: 'Invalid coordinates: latitude must be between -90 and 90, longitude between -180 and 180' 
        },
        { status: 400 }
      );
    }

    // Validate availability date
    try {
      if (body.availabilityDate) {
        body.availabilityDate = new Date(body.availabilityDate);
      }
    } catch (error) {
      return NextResponse.json(
        { 
          error: 'Invalid availability date format' 
        },
        { status: 400 }
      );
    }

    // Create the property
    const property = await createProperty(body as Prisma.PropertyCreateInput);

    // Return the created property
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    
    // Handle Prisma validation errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A property with these details already exists' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: `Failed to create property: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

/**
 * GET handler for retrieving all properties with optional filtering
 * For advanced search, use the dedicated search endpoint
 * 
 * @route GET /api/properties
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      message: 'For advanced property search and filtering, please use the /api/properties/search endpoint' 
    },
    { status: 200 }
  );
}

/**
 * OPTIONS handler to support CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
