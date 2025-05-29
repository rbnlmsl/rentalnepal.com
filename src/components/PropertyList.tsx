"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";

// Define the property interface to match our API response
interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  priceFrequency: "PW" | "PM";
  imageUrl: string;
  propertyType: string;
  beds: number;
  baths: number;
  parking: number;
  available: string;
  timeAgo: string;
}

// Define the search parameters interface
export interface PropertySearchParams {
  q?: string;
  city?: string;
  postcode?: string;
  province?: string;
  propertyType?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  minBedrooms?: string | number;
  maxBedrooms?: string | number;
  minBathrooms?: string | number;
  maxBathrooms?: string | number;
  minArea?: string | number;
  maxArea?: string | number;
  amenities?: string;
  availabilityDate?: string;
  latitude?: string | number;
  longitude?: string | number;
  radius?: string | number;
  radiusUnit?: string;
  polygon?: string;
  includeSurrounding?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface PropertyListProps {
  title?: string;
  showViewAll?: boolean;
  searchParams?: PropertySearchParams;
  initialData?: {
    properties: Property[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isHomePage?: boolean;
}

// Sample property data (used as fallback or for initial SSR)
const sampleProperties = [
  {
    id: "prop1",
    title: "Cozy Room in Kathmandu",
    location: "Ward 10, Kathmandu Metropolician City, Kathmandu, Bagmati Province",
    price: 4500,
    priceFrequency: "PM",
    imageUrl: "/images/property-1.jpg",
    propertyType: "Room",
    beds: 1,
    baths: 1,
    parking: 0,
    available: "Available now",
    timeAgo: "5 mins ago",
  },
  {
    id: "prop2",
    title: "Quiet Apartment in Lalitpur",
    location: "Ward 5, Lalitpur Metropolician City, Lalitpur, Bagmati Province",
    price: 4800,
    priceFrequency: "PM",
    imageUrl: "/images/property-1.jpg",
    propertyType: "Apartment",
    beds: 2,
    baths: 1,
    parking: 1,
    available: "Available now",
    timeAgo: "10 mins ago",
  },
  {
    id: "prop3",
    title: "Room with View in Pokhara",
    location: "Ward 6, Pokhara Metropolician City, Kaski, Gandaki Province",
    price: 3500,
    priceFrequency: "PM",
    imageUrl: "/images/property-1.jpg",
    propertyType: "Room",
    beds: 1,
    baths: 1,
    parking: 0,
    available: "Available 15 Apr",
    timeAgo: "1 hour ago",
  },
  {
    id: "prop4",
    title: "Small House in Chitwan",
    location: "Ward 4, Bharatpur Metropolician City, Chitwan, Bagmati Province",
    price: 4950,
    priceFrequency: "PM",
    imageUrl: "/images/property-1.jpg",
    propertyType: "House",
    beds: 2,
    baths: 1,
    parking: 1,
    available: "Available now",
    timeAgo: "2 hours ago",
  },
];

export function PropertyList({ 
  title = "Latest rental properties in Nepal", 
  showViewAll = true,
  searchParams,
  initialData,
  isHomePage = false
}: PropertyListProps) {
  // State for properties data
  const [properties, setProperties] = useState<Property[]>(
    initialData?.properties || sampleProperties
  );
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(
    initialData?.page || searchParams?.page || 1
  );
  const [totalPages, setTotalPages] = useState<number>(
    initialData?.totalPages || 1
  );
  const [totalResults, setTotalResults] = useState<number>(
    initialData?.total || properties.length
  );
  const [limit, setLimit] = useState<number>(
    initialData?.limit || searchParams?.limit || 8
  );
  
  // State for loading and error
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch properties from the API
  const fetchProperties = async (page: number = 1) => {
    // If on homepage and no search params, use sample data
    if (isHomePage && !searchParams) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Build the search URL with parameters
      const params = new URLSearchParams();
      
      // Add the current page and limit
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      // Add all search parameters if provided
      if (searchParams) {
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && key !== 'page' && key !== 'limit') {
            params.append(key, value.toString());
          }
        });
      }
      
      // Fetch data from the API
      const response = await fetch(`/api/properties/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching properties: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update state with the fetched data
      setProperties(data.properties.map((prop: any) => ({
        id: prop.id,
        title: prop.title,
        location: `${prop.addressLine1}, ${prop.city}, ${prop.province}`,
        price: prop.rentAmount,
        priceFrequency: prop.priceFrequency,
        imageUrl: prop.images && prop.images.length > 0 ? prop.images[0] : '/images/property-1.jpg',
        propertyType: prop.propertyType,
        beds: prop.bedrooms,
        baths: prop.bathrooms,
        parking: prop.amenities?.includes('parking') ? 1 : 0,
        available: prop.status === 'AVAILABLE' 
          ? `Available ${new Date(prop.availabilityDate) <= new Date() ? 'now' : new Date(prop.availabilityDate).toLocaleDateString()}`
          : prop.status,
        timeAgo: getTimeAgo(new Date(prop.createdAt)),
      })));
      
      setTotalPages(data.totalPages);
      setTotalResults(data.total);
      setCurrentPage(data.page);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching properties');
      
      // If there's an error and no data, use sample data as fallback
      if (properties.length === 0) {
        setProperties(sampleProperties);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format time ago
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  // Fetch properties when component mounts or when search parameters change
  useEffect(() => {
    // Reset to page 1 when search params change
    if (searchParams) {
      setCurrentPage(1);
      fetchProperties(1);
    }
  }, [searchParams]);

  // Fetch properties when page changes
  useEffect(() => {
    if (!isHomePage || searchParams) {
      fetchProperties(currentPage);
    }
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {title}
            {!isLoading && totalResults > 0 && !isHomePage && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({totalResults} {totalResults === 1 ? 'property' : 'properties'})
              </span>
            )}
          </h2>
          {showViewAll && isHomePage && (
            <a href="/properties" className="text-sm font-medium text-primary hover:text-primary-dark">
              View all &rarr;
            </a>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading properties...</span>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
            <button 
              onClick={() => fetchProperties(currentPage)}
              className="text-sm underline mt-2"
            >
              Try again
            </button>
          </div>
        )}

        {/* No results state */}
        {!isLoading && !error && properties.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria to find more properties.
            </p>
          </div>
        )}

        {/* Property grid */}
        {!isLoading && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                location={property.location}
                price={property.price}
                priceFrequency={property.priceFrequency === "PW" ? "pw" : "pm"}
                imageUrl={property.imageUrl}
                propertyType={property.propertyType as any}
                beds={property.beds}
                baths={property.baths}
                parking={property.parking}
                available={property.available}
                timeAgo={property.timeAgo}
              />
            ))}
          </div>
        )}

        {/* Pagination controls */}
        {!isHomePage && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </Button>
              
              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show 5 pages max, centered around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                      className="w-9"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="text-muted-foreground mx-1">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={isLoading}
                      className="w-9"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        
        {/* Results summary */}
        {!isHomePage && !isLoading && totalResults > 0 && (
          <div className="text-center text-sm text-muted-foreground mt-4">
            Showing {properties.length} of {totalResults} properties
            {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
          </div>
        )}
      </div>
    </section>
  );
}
