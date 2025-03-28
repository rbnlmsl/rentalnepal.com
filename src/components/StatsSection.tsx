"use client";

import Image from "next/image";

export function StatsSection() {
  return (
    <section className="py-12 bg-secondary-dark relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-primary">
          Helping Nepalese renters for 18 years
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          <div className="text-center">
            <p className="text-xl md:text-2xl font-bold text-foreground">50,000+</p>
            <p className="text-sm text-foreground">Rentals available</p>
          </div>

          <div className="text-center">
            <p className="text-xl md:text-2xl font-bold text-foreground">72 million+</p>
            <p className="text-sm text-foreground">Renter visits since 2007</p>
          </div>

          <div className="text-center">
            <p className="text-xl md:text-2xl font-bold text-foreground">2,059,087</p>
            <p className="text-sm text-foreground">Renter Resumes since 2016</p>
          </div>

          <div className="text-center">
            <p className="text-xl md:text-2xl font-bold text-foreground">6,000+</p>
            <p className="text-sm text-foreground">Agents and private landlords</p>
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 md:right-10 md:top-1/2 md:-translate-y-1/2 max-w-[120px] md:max-w-[180px]">
        <Image
          src="/images/purple-flowers.svg"
          alt="Decorative flowers"
          width={180}
          height={180}
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}
