"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  priceFrequency?: "pw" | "pm";
  imageUrl: string;
  propertyType: "House" | "Apartment" | "Unit" | "Townhouse";
  beds: number;
  baths: number;
  parking: number;
  available: string;
  timeAgo?: string;
}

export function PropertyCard({
  id,
  title,
  location,
  price,
  priceFrequency = "pm", // Changed default to per month
  imageUrl,
  propertyType,
  beds,
  baths,
  parking,
  available,
  timeAgo,
}: PropertyCardProps) {
  const formatPrice = (price: number) => {
    // Using 'en-NP' locale for broader compatibility if 'ne-NP' isn't universally supported,
    // but specifying NPR currency. Adjust locale if specific Nepali formatting is needed and supported.
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0, // Keep as 0 for whole rupees, adjust if paisa needed
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden border-gray-200 group h-full flex flex-col">
      <Link href={`/property/${id}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {timeAgo && (
            <Badge className="absolute top-2 left-2 bg-primary text-white text-xs">
              {timeAgo}
            </Badge>
          )}
          <Badge className="absolute bottom-2 right-2 bg-white text-foreground text-xs">
            {propertyType}
          </Badge>
        </div>
      </Link>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <div className="flex justify-between items-start">
            <div className="font-bold text-lg text-primary">
              {formatPrice(price)} <span className="text-sm font-medium">{priceFrequency}</span>
            </div>
          </div>
          <p className="text-sm text-foreground truncate">{location}</p>
        </div>

        <div className="flex items-center gap-4 mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-center text-sm text-foreground">
            <Image
              src="/images/beds-icon.svg"
              alt="Beds"
              width={16}
              height={16}
              className="mr-1"
            />
            <span>{beds}</span>
          </div>
          <div className="flex items-center text-sm text-foreground">
            <Image
              src="/images/bath-icon.svg"
              alt="Baths"
              width={16}
              height={16}
              className="mr-1"
            />
            <span>{baths}</span>
          </div>
          <div className="flex items-center text-sm text-foreground">
            <Image
              src="/images/car-icon.svg"
              alt="Parking"
              width={16}
              height={16}
              className="mr-1"
            />
            <span>{parking}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
