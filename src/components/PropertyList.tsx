"use client";

import { PropertyCard } from "@/components/PropertyCard";

// Sample property data (in a real app, this would come from an API)
const sampleProperties = [
  {
    id: "prop1",
    title: "Cozy Room in Kathmandu",
    location: "Ward 10, Kathmandu Metropolician City, Kathmandu, Bagmati Province", // Updated format
    price: 4500, // Updated price (1000-5000 range)
    priceFrequency: "pm", // Updated frequency
    imageUrl: "/images/property-1.jpg",
    propertyType: "Room", // Changed type
    beds: 1,
    baths: 1, // Shared bath maybe?
    parking: 0, // Less likely parking
    available: "Available now",
    timeAgo: "5 mins ago",
  },
  {
    id: "prop2",
    title: "Quiet Apartment in Lalitpur",
    location: "Ward 5, Lalitpur Metropolician City, Lalitpur, Bagmati Province", // Updated format
    price: 4800, // Updated price
    priceFrequency: "pm", // Updated frequency
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
    location: "Ward 6, Pokhara Metropolician City, Kaski, Gandaki Province", // Updated format
    price: 3500, // Updated price
    priceFrequency: "pm", // Updated frequency
    imageUrl: "/images/property-1.jpg",
    propertyType: "Room", // Changed type
    beds: 1,
    baths: 1,
    parking: 0,
    available: "Available 15 Apr",
    timeAgo: "1 hour ago",
  },
  {
    id: "prop4",
    title: "Small House in Chitwan",
    location: "Ward 4, Bharatpur Metropolician City, Chitwan, Bagmati Province", // Updated format
    price: 4950, // Updated price
    priceFrequency: "pm", // Updated frequency
    imageUrl: "/images/property-1.jpg",
    propertyType: "House", // Changed type
    beds: 2,
    baths: 1,
    parking: 1,
    available: "Available now",
    timeAgo: "2 hours ago",
  },
];

interface PropertyListProps {
  title?: string;
  showViewAll?: boolean;
}

export function PropertyList({ title = "Latest rental properties in Nepal", showViewAll = true }: PropertyListProps) {
  return (
    <section className="py-10 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
          {showViewAll && (
            <a href="/properties" className="text-sm font-medium text-primary hover:text-primary-dark">
              View all &rarr;
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProperties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              location={property.location}
              price={property.price}
              priceFrequency={property.priceFrequency as "pw" | "pm"}
              imageUrl={property.imageUrl}
              propertyType={property.propertyType as "House" | "Apartment" | "Unit" | "Townhouse"}
              beds={property.beds}
              baths={property.baths}
              parking={property.parking}
              available={property.available}
              timeAgo={property.timeAgo}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
