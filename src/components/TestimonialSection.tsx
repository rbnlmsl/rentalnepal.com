"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialSection() {
  return (
    <section className="py-12 bg-primary-light bg-opacity-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary">
          Trusted by millions of renters
        </h2>
        <p className="text-center text-sm text-foreground mb-10">
          Don't just take our word for it.
        </p>

        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Awesome places.
              </h3>
              <p className="text-foreground mb-6">
                Finally! You guys made renting so much easier. Really awesome places up for grabs.
                Definitely recommend for anyone looking to rent a house.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground">UDragon1988</span>
                  <span className="text-xs text-foreground">App Store Nepal</span>
                </div>
                <div className="flex">
                  <Image
                    src="/images/star-rating.svg"
                    alt="5 star rating"
                    width={100}
                    height={20}
                    className="h-5 w-auto"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
