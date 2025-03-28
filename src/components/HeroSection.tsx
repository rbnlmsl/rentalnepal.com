"use client";

import Image from "next/image";
import { PropertySearch } from "@/components/PropertySearch";

export function HeroSection() {
  return (
    <section className="relative h-[500px] md:h-[550px] lg:h-[600px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Modern living room in a rental property"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-condensed font-bold text-white mb-6 uppercase text-center tracking-wider">
          Made for renters
        </h1>

        <PropertySearch />

        <p className="text-white text-sm md:text-base mt-6 text-center max-w-3xl">
          Search thousands of rental properties from Nepal's leading site dedicated to renters.
        </p>

        <div className="mt-4 flex items-center justify-center">
          <p className="text-white text-xs mr-2">Rated 4.9 Stars</p>
          <Image
            src="/images/star-rating.svg"
            alt="5 star rating"
            width={100}
            height={20}
            className="h-4 w-auto"
          />
        </div>
      </div>
    </section>
  );
}
