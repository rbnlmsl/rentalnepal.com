import { NextRequest, NextResponse } from 'next/server';
import { getPropertyById, updateProperty, deleteProperty } from '@/lib/propertyService';

/**
 * GET handler for retrieving a single property by ID
 * 
 * @route GET /api/properties/:id
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const property = await getPropertyById(id);
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error(`Error retrieving property:`, error);
    return NextResponse.json(
      { error: `Failed to retrieve property: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for updating a property by ID
 * 
 * @route PUT /api/properties/:id
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Get the request body
    const body = await request.json();

    // Check if property exists
    const existingProperty = await getPropertyById(id);
    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Update the property
    const updatedProperty = await updateProperty(id, body);

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error(`Error updating property:`, error);
    return NextResponse.json(
      { error: `Failed to update property: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler for partial updates to a property
 * 
 * @route PATCH /api/properties/:id
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // PATCH uses the same logic as PUT in this implementation
  return PUT(request, { params });
}

/**
 * DELETE handler for removing a property by ID
 * 
 * @route DELETE /api/properties/:id
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Check if property exists
    const existingProperty = await getPropertyById(id);
    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Delete the property
    await deleteProperty(id);

    return NextResponse.json(
      { message: 'Property deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting property:`, error);
    return NextResponse.json(
      { error: `Failed to delete property: ${(error as Error).message}` },
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
      'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
