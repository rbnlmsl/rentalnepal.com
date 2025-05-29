-- PostGIS setup migration script
-- This script sets up the PostGIS extension and adds geospatial functionality to the Property table
-- Run this after Prisma migrations have been applied

-- Start a transaction to ensure all operations succeed or fail together
BEGIN;

-- Check if PostGIS extension exists and create it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'postgis'
    ) THEN
        CREATE EXTENSION postgis;
        RAISE NOTICE 'PostGIS extension created successfully';
    ELSE
        RAISE NOTICE 'PostGIS extension already exists';
    END IF;
END
$$;

-- Check if the location column exists in the Property table and add it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'Property' AND column_name = 'location'
    ) THEN
        -- Add geography column for location data
        -- SRID 4326 corresponds to WGS 84, the standard for GPS coordinates
        ALTER TABLE "Property" ADD COLUMN location geography(Point, 4326);
        RAISE NOTICE 'Location column added to Property table';
    ELSE
        RAISE NOTICE 'Location column already exists in Property table';
    END IF;
END
$$;

-- Update existing properties to populate the location column based on latitude and longitude
UPDATE "Property"
SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
WHERE location IS NULL AND latitude IS NOT NULL AND longitude IS NOT NULL;

-- Create a spatial index on the location column for efficient geospatial queries
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE indexname = 'idx_property_location'
    ) THEN
        CREATE INDEX idx_property_location ON "Property" USING GIST (location);
        RAISE NOTICE 'Spatial index created on location column';
    ELSE
        RAISE NOTICE 'Spatial index already exists on location column';
    END IF;
END
$$;

-- Create a trigger to automatically update the location column when lat/lon change
CREATE OR REPLACE FUNCTION update_property_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists to avoid errors when re-running this script
DROP TRIGGER IF EXISTS trigger_update_property_location ON "Property";

-- Create the trigger
CREATE TRIGGER trigger_update_property_location
BEFORE INSERT OR UPDATE OF latitude, longitude ON "Property"
FOR EACH ROW
WHEN (NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL)
EXECUTE FUNCTION update_property_location();

-- Commit the transaction
COMMIT;
