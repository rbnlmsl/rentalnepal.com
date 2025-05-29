/**
 * Geospatial utility functions for the rental marketplace
 * These utilities support advanced filtering operations including radius search and polygon search
 */

/**
 * Coordinate interface representing a point with latitude and longitude
 */
export interface Coordinate {
  lat: number;
  lon: number;
}

/**
 * Earth's radius in meters (approximate)
 */
const EARTH_RADIUS_METERS = 6371000;

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Convert a radius value to meters based on the provided unit
 * @param radius The radius value
 * @param unit The unit of measurement ('m' for meters, 'km' for kilometers)
 * @returns The radius in meters
 */
export function convertRadiusToMeters(radius: number, unit: string = 'm'): number {
  if (!radius || isNaN(radius) || radius <= 0) {
    throw new Error('Radius must be a positive number');
  }
  
  if (unit?.toLowerCase() === 'km') {
    return radius * 1000;
  }
  
  return radius; // Default to meters
}

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in meters
 */
export function calculateDistance(coord1: Coordinate, coord2: Coordinate): number {
  const lat1Rad = degreesToRadians(coord1.lat);
  const lat2Rad = degreesToRadians(coord2.lat);
  const deltaLat = degreesToRadians(coord2.lat - coord1.lat);
  const deltaLon = degreesToRadians(coord2.lon - coord1.lon);

  const a = 
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return EARTH_RADIUS_METERS * c;
}

/**
 * Parse a comma-separated coordinate string into a Coordinate object
 * @param coordStr String in format "lat,lon" or "lon,lat" (based on lonFirst parameter)
 * @param lonFirst Whether longitude comes first in the string (default: false)
 * @returns Coordinate object
 */
export function parseCoordinateString(coordStr: string, lonFirst: boolean = false): Coordinate {
  if (!coordStr || typeof coordStr !== 'string') {
    throw new Error('Invalid coordinate string');
  }

  const parts = coordStr.split(',').map(part => parseFloat(part.trim()));
  
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
    throw new Error('Coordinate string must contain two numeric values separated by a comma');
  }

  return lonFirst 
    ? { lat: parts[1], lon: parts[0] } 
    : { lat: parts[0], lon: parts[1] };
}

/**
 * Parse a polygon string into an array of coordinates
 * Supports both GeoJSON format and simple comma-separated list
 * @param polygonStr The polygon string
 * @returns Array of Coordinate objects
 */
export function parsePolygonString(polygonStr: string): Coordinate[] {
  if (!polygonStr || typeof polygonStr !== 'string') {
    throw new Error('Invalid polygon string');
  }

  // Try parsing as GeoJSON
  try {
    // Check if it's a GeoJSON string
    if (polygonStr.includes('"type"') && polygonStr.includes('"coordinates"')) {
      const geoJson = JSON.parse(polygonStr);
      
      if (geoJson.type !== 'Polygon' || !Array.isArray(geoJson.coordinates) || !geoJson.coordinates[0]) {
        throw new Error('Invalid GeoJSON polygon format');
      }
      
      // Extract coordinates from GeoJSON
      return geoJson.coordinates[0].map((coord: number[]) => ({
        lon: coord[0],
        lat: coord[1]
      }));
    }
  } catch (e) {
    // Not a valid GeoJSON, continue to try comma-separated format
  }

  // Parse as comma-separated list
  const coords = polygonStr.split(',').map(c => parseFloat(c.trim()));
  
  // Validate the coordinates
  if (coords.length < 6 || coords.length % 2 !== 0) {
    throw new Error('Invalid polygon coordinate string: must have at least 3 points (6 values) and an even number of values');
  }
  
  // Convert flat array to array of coordinates
  const points: Coordinate[] = [];
  for (let i = 0; i < coords.length; i += 2) {
    points.push({ lon: coords[i], lat: coords[i+1] });
  }
  
  // Ensure the polygon is closed (first and last points are the same)
  if (points.length > 1 && (points[0].lon !== points[points.length-1].lon || points[0].lat !== points[points.length-1].lat)) {
    points.push({ ...points[0] }); // Close the polygon by duplicating the first point
  }
  
  return points;
}

/**
 * Convert a polygon array to a GeoJSON string
 * @param polygon Array of Coordinate objects
 * @returns GeoJSON string representation
 */
export function polygonToGeoJSON(polygon: Coordinate[]): string {
  if (!Array.isArray(polygon) || polygon.length < 3) {
    throw new Error('Invalid polygon: must have at least 3 points');
  }
  
  // Ensure the polygon is closed
  const closedPolygon = [...polygon];
  if (closedPolygon[0].lon !== closedPolygon[closedPolygon.length-1].lon || 
      closedPolygon[0].lat !== closedPolygon[closedPolygon.length-1].lat) {
    closedPolygon.push({ ...closedPolygon[0] });
  }
  
  const geoJson = {
    type: 'Polygon',
    coordinates: [
      closedPolygon.map(coord => [coord.lon, coord.lat])
    ]
  };
  
  return JSON.stringify(geoJson);
}

/**
 * Convert a polygon array to a WKT (Well-Known Text) string for PostGIS
 * @param polygon Array of Coordinate objects
 * @returns WKT string representation
 */
export function polygonToWKT(polygon: Coordinate[]): string {
  if (!Array.isArray(polygon) || polygon.length < 3) {
    throw new Error('Invalid polygon: must have at least 3 points');
  }
  
  // Ensure the polygon is closed
  const closedPolygon = [...polygon];
  if (closedPolygon[0].lon !== closedPolygon[closedPolygon.length-1].lon || 
      closedPolygon[0].lat !== closedPolygon[closedPolygon.length-1].lat) {
    closedPolygon.push({ ...closedPolygon[0] });
  }
  
  const pointsStr = closedPolygon.map(p => `${p.lon} ${p.lat}`).join(',');
  return `POLYGON((${pointsStr}))`;
}

/**
 * Validate latitude and longitude values
 * @param lat Latitude value
 * @param lon Longitude value
 * @returns True if the coordinates are valid
 */
export function isValidCoordinate(lat: number, lon: number): boolean {
  return !isNaN(lat) && !isNaN(lon) && 
         lat >= -90 && lat <= 90 && 
         lon >= -180 && lon <= 180;
}

/**
 * Extract and validate geospatial parameters from query parameters
 * @param query The query parameters object
 * @returns Validated geospatial parameters or null if not present
 */
export function extractGeoParams(query: any): { 
  center?: Coordinate, 
  radius?: number, 
  polygon?: Coordinate[] 
} | null {
  const result: { 
    center?: Coordinate, 
    radius?: number, 
    polygon?: Coordinate[] 
  } = {};
  
  // Extract radius search parameters
  if (query.latitude && query.longitude && query.radius) {
    const lat = parseFloat(query.latitude);
    const lon = parseFloat(query.longitude);
    
    if (!isValidCoordinate(lat, lon)) {
      throw new Error('Invalid coordinates: latitude must be between -90 and 90, longitude between -180 and 180');
    }
    
    const radius = parseFloat(query.radius);
    if (isNaN(radius) || radius <= 0) {
      throw new Error('Radius must be a positive number');
    }
    
    result.center = { lat, lon };
    result.radius = convertRadiusToMeters(radius, query.radiusUnit);
  }
  
  // Extract polygon search parameters
  if (query.polygon) {
    try {
      result.polygon = parsePolygonString(query.polygon);
    } catch (error) {
      throw new Error(`Invalid polygon format: ${(error as Error).message}`);
    }
  }
  
  // Return null if no geospatial parameters were found
  return Object.keys(result).length > 0 ? result : null;
}
