import { Suspense } from 'react';
import { PropertyList, PropertySearchParams } from '@/components/PropertyList';
import { PropertySearch } from '@/components/PropertySearch';
import { Button } from '@/components/ui/button';
import { Loader2, Filter, X } from 'lucide-react';
import Link from 'next/link';

// Define the search params interface
interface SearchPageProps {
  searchParams: {
    q?: string;
    city?: string;
    postcode?: string;
    province?: string;
    propertyType?: string;
    minPrice?: string;
    maxPrice?: string;
    minBedrooms?: string;
    maxBedrooms?: string;
    minBathrooms?: string;
    maxBathrooms?: string;
    minArea?: string;
    maxArea?: string;
    amenities?: string;
    availabilityDate?: string;
    latitude?: string;
    longitude?: string;
    radius?: string;
    radiusUnit?: string;
    polygon?: string;
    includeSurrounding?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
    [key: string]: string | undefined;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  // Convert URL search params to the format expected by PropertyList
  const propertySearchParams: PropertySearchParams = {
    q: searchParams.q,
    city: searchParams.city,
    postcode: searchParams.postcode,
    province: searchParams.province,
    propertyType: searchParams.propertyType,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    minBedrooms: searchParams.minBedrooms,
    maxBedrooms: searchParams.maxBedrooms,
    minBathrooms: searchParams.minBathrooms,
    maxBathrooms: searchParams.maxBathrooms,
    minArea: searchParams.minArea,
    maxArea: searchParams.maxArea,
    amenities: searchParams.amenities,
    availabilityDate: searchParams.availabilityDate,
    latitude: searchParams.latitude,
    longitude: searchParams.longitude,
    radius: searchParams.radius,
    radiusUnit: searchParams.radiusUnit,
    polygon: searchParams.polygon,
    includeSurrounding: searchParams.includeSurrounding === 'true',
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder as 'asc' | 'desc',
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit) : 12,
  };

  // Count active filters for display
  const countActiveFilters = () => {
    let count = 0;
    
    // Location filters
    if (searchParams.q) count++;
    if (searchParams.city) count++;
    if (searchParams.postcode) count++;
    if (searchParams.province) count++;
    
    // Property type filter
    if (searchParams.propertyType) count++;
    
    // Price range filters
    if (searchParams.minPrice || searchParams.maxPrice) count++;
    
    // Room filters
    if (searchParams.minBedrooms || searchParams.maxBedrooms) count++;
    if (searchParams.minBathrooms || searchParams.maxBathrooms) count++;
    
    // Area filter
    if (searchParams.minArea || searchParams.maxArea) count++;
    
    // Amenities filter
    if (searchParams.amenities) count++;
    
    // Availability filter
    if (searchParams.availabilityDate) count++;
    
    // Geospatial filters
    if (searchParams.latitude && searchParams.longitude && searchParams.radius) count++;
    if (searchParams.polygon) count++;
    
    return count;
  };

  // Generate title based on search parameters
  const generateTitle = () => {
    let title = 'Properties';
    
    if (searchParams.city) {
      title = `Properties in ${searchParams.city}`;
    }
    
    if (searchParams.propertyType) {
      const propertyTypes = searchParams.propertyType.split(',').map(type => 
        type.charAt(0) + type.slice(1).toLowerCase()
      ).join(', ');
      title = `${propertyTypes} ${title}`;
    }
    
    if (searchParams.q) {
      title = `${title} matching "${searchParams.q}"`;
    }
    
    return title;
  };

  // Function to render active filters as tags
  const renderFilterTags = () => {
    const tags = [];
    
    // Location filters
    if (searchParams.q) {
      tags.push(
        <div key="q" className="bg-primary/10 text-primary text-xs rounded-full px-3 py-1 flex items-center">
          Search: {searchParams.q}
          <Link href={{ pathname: '/properties/search', query: { ...searchParams, q: undefined } }}>
            <X className="h-3 w-3 ml-1 cursor-pointer" />
          </Link>
        </div>
      );
    }
    
    if (searchParams.city) {
      tags.push(
        <div key="city" className="bg-primary/10 text-primary text-xs rounded-full px-3 py-1 flex items-center">
          City: {searchParams.city}
          <Link href={{ pathname: '/properties/search', query: { ...searchParams, city: undefined } }}>
            <X className="h-3 w-3 ml-1 cursor-pointer" />
          </Link>
        </div>
      );
    }
    
    // Property type filter
    if (searchParams.propertyType) {
      const propertyTypes = searchParams.propertyType.split(',');
      tags.push(
        <div key="propertyType" className="bg-primary/10 text-primary text-xs rounded-full px-3 py-1 flex items-center">
          Type: {propertyTypes.map(t => t.charAt(0) + t.slice(1).toLowerCase()).join(', ')}
          <Link href={{ pathname: '/properties/search', query: { ...searchParams, propertyType: undefined } }}>
            <X className="h-3 w-3 ml-1 cursor-pointer" />
          </Link>
        </div>
      );
    }
    
    // Price range filters
    if (searchParams.minPrice || searchParams.maxPrice) {
      let priceText = '';
      if (searchParams.minPrice && searchParams.maxPrice) {
        priceText = `₹${searchParams.minPrice} - ₹${searchParams.maxPrice}`;
      } else if (searchParams.minPrice) {
        priceText = `Min ₹${searchParams.minPrice}`;
      } else if (searchParams.maxPrice) {
        priceText = `Max ₹${searchParams.maxPrice}`;
      }
      
      tags.push(
        <div key="price" className="bg-primary/10 text-primary text-xs rounded-full px-3 py-1 flex items-center">
          Price: {priceText}
          <Link href={{ 
            pathname: '/properties/search', 
            query: { ...searchParams, minPrice: undefined, maxPrice: undefined } 
          }}>
            <X className="h-3 w-3 ml-1 cursor-pointer" />
          </Link>
        </div>
      );
    }
    
    // Room filters
    if (searchParams.minBedrooms || searchParams.maxBedrooms) {
      let bedroomsText = '';
      if (searchParams.minBedrooms && searchParams.maxBedrooms) {
        bedroomsText = `${searchParams.minBedrooms} - ${searchParams.maxBedrooms}`;
      } else if (searchParams.minBedrooms) {
        bedroomsText = `${searchParams.minBedrooms}+`;
      } else if (searchParams.maxBedrooms) {
        bedroomsText = `Up to ${searchParams.maxBedrooms}`;
      }
      
      tags.push(
        <div key="bedrooms" className="bg-primary/10 text-primary text-xs rounded-full px-3 py-1 flex items-center">
          Bedrooms: {bedroomsText}
          <Link href={{ 
            pathname: '/properties/search', 
            query: { ...searchParams, minBedrooms: undefined, maxBedrooms: undefined } 
          }}>
            <X className="h-3 w-3 ml-1 cursor-pointer" />
          </Link>
        </div>
      );
    }
    
    // Geospatial filters
    if (searchParams.latitude && searchParams.longitude && searchParams.radius) {
      tags.push(
        <div key="radius" className="bg-primary/10 text-primary text-xs rounded-full px-3 py-1 flex items-center">
          Within {searchParams.radius} {searchParams.radiusUnit || 'm'}
          <Link href={{ 
            pathname: '/properties/search', 
            query: { 
              ...searchParams, 
              latitude: undefined, 
              longitude: undefined, 
              radius: undefined,
              radiusUnit: undefined
            } 
          }}>
            <X className="h-3 w-3 ml-1 cursor-pointer" />
          </Link>
        </div>
      );
    }
    
    // Clear all filters button
    if (tags.length > 0) {
      tags.push(
        <Link key="clear" href="/properties/search" className="text-xs text-primary underline ml-2">
          Clear all filters
        </Link>
      );
    }
    
    return tags;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search header section */}
      <div className="bg-primary py-6 md:py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Find Your Perfect Rental
          </h1>
          
          {/* Search box */}
          <PropertySearch />
        </div>
      </div>
      
      {/* Filters and results */}
      <div className="container mx-auto px-4 py-6">
        {/* Active filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <h2 className="text-xl font-bold mr-2">
            {generateTitle()}
          </h2>
          
          {/* Filter tags */}
          {renderFilterTags()}
        </div>
        
        {/* Filter button (for mobile filter drawer) */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground">
            {countActiveFilters()} active filters
          </div>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>
        
        {/* Results */}
        <Suspense fallback={
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading properties...</span>
          </div>
        }>
          <PropertyList 
            title={generateTitle()}
            showViewAll={false}
            searchParams={propertySearchParams}
            isHomePage={false}
          />
        </Suspense>
      </div>
    </div>
  );
}
