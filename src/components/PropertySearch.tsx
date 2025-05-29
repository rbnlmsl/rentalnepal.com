"use client";

import { useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function PropertySearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [includeSurrounding, setIncludeSurrounding] = useState(true);
  
  // New state for geolocation and radius search
  const [useLocation, setUseLocation] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [radius, setRadius] = useState<number>(5);
  const [radiusUnit, setRadiusUnit] = useState<"km" | "m">("km");
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to get user's current location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setUseLocation(true);
        setLocationLoading(false);
      },
      (error) => {
        setError(`Unable to retrieve your location: ${error.message}`);
        setUseLocation(false);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // Function to clear location data
  const clearLocation = () => {
    setLatitude(null);
    setLongitude(null);
    setUseLocation(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Build search parameters
      const searchParams = new URLSearchParams();
      
      // Add location search
      if (searchQuery) {
        searchParams.append("q", searchQuery);
      }
      
      // Add geolocation parameters if using location
      if (useLocation && latitude !== null && longitude !== null) {
        searchParams.append("latitude", latitude.toString());
        searchParams.append("longitude", longitude.toString());
        searchParams.append("radius", radius.toString());
        searchParams.append("radiusUnit", radiusUnit);
      }
      
      // Add surrounding areas parameter
      if (includeSurrounding) {
        // This could be implemented in different ways depending on the backend
        // For now, we'll just pass it as a flag
        searchParams.append("includeSurrounding", "true");
      }

      // In a real implementation, we would fetch from the API
      // const response = await fetch(`/api/properties/search?${searchParams.toString()}`);
      // if (!response.ok) throw new Error('Failed to search properties');
      // const data = await response.json();
      
      // For now, we'll just navigate to a search results page with the parameters
      router.push(`/properties/search?${searchParams.toString()}`);
      
      console.log("Searching with params:", searchParams.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="flex flex-col gap-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Image
              src="/images/map-icon.svg"
              alt="Location"
              width={18}
              height={18}
              className="text-muted-foreground"
            />
          </div>
          <Input
            type="text"
            placeholder="WHERE DO YOU WANT TO LIVE?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 pr-4 bg-white rounded-md border-none text-foreground placeholder:text-gray-400 text-base"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <Button
              type="submit"
              size="sm"
              className="h-9 bg-primary hover:bg-primary-dark rounded-full px-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-1" />
                  <span className="sr-only sm:not-sr-only sm:text-sm">Search</span>
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Location detection and radius controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 ml-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeSurrounding"
              checked={includeSurrounding}
              onChange={() => setIncludeSurrounding(!includeSurrounding)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              disabled={isLoading}
            />
            <label
              htmlFor="includeSurrounding"
              className="ml-2 text-xs font-medium text-white"
            >
              Include surrounding suburbs
            </label>
          </div>
          
          <div className="flex items-center ml-0 sm:ml-4">
            {!useLocation ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={detectLocation}
                disabled={locationLoading || isLoading}
                className="h-8 text-xs bg-white text-primary hover:bg-gray-100"
              >
                {locationLoading ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <MapPin className="h-3 w-3 mr-1" />
                )}
                Use my location
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-white">
                  Within
                </span>
                <Input
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.1"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value))}
                  className="w-16 h-8 text-xs bg-white"
                  disabled={isLoading}
                />
                <select
                  value={radiusUnit}
                  onChange={(e) => setRadiusUnit(e.target.value as "km" | "m")}
                  className="h-8 text-xs bg-white border rounded px-2"
                  disabled={isLoading}
                >
                  <option value="km">km</option>
                  <option value="m">m</option>
                </select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearLocation}
                  className="h-8 text-xs bg-white text-red-500 hover:bg-gray-100 hover:text-red-600"
                  disabled={isLoading}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="ml-3 mt-1 text-red-500 text-xs">
            {error}
          </div>
        )}
        
        {/* Location status */}
        {useLocation && latitude && longitude && (
          <div className="ml-3 mt-1 text-white text-xs">
            Using location: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </div>
        )}
      </form>
    </div>
  );
}
