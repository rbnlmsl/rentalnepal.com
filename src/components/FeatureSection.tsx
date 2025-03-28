"use client";

import Image from "next/image";
import Link from "next/link";

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

function Feature({ icon, title, description, linkText, linkUrl }: FeatureProps) {
  return (
    <div className="text-center px-4 md:px-6 flex flex-col items-center">
      <div className="mb-4">
        <Image
          src={icon}
          alt={title}
          width={56}
          height={56}
          className="mx-auto"
        />
      </div>
      <h3 className="uppercase text-sm font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-foreground mb-4 max-w-xs mx-auto">{description}</p>
      <Link
        href={linkUrl}
        className="text-sm font-medium text-primary hover:text-primary-dark uppercase"
      >
        {linkText} &rarr;
      </Link>
    </div>
  );
}

export function FeatureSection() {
  return (
    <section className="py-12 bg-secondary">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10 text-foreground">
          See how we're making renting better
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature
            icon="/images/house-icon.svg"
            title="Search rentals"
            description="Find your perfect rental property, using our unique lifestyle and walkability filters, then apply using Renter Resume."
            linkText="Create your Renter Resume"
            linkUrl="/resume"
          />
          <Feature
            icon="/images/renter-icon.svg"
            title="Rent with confidence"
            description="Verify yourself as a great tenant, cover your bond, and get better deals on electricity, gas and internet with our pro-renter tools."
            linkText="Explore renter tools"
            linkUrl="/renters"
          />
          <Feature
            icon="/images/trophy-icon.svg"
            title="Get more for your rent money"
            description="Make your rent money work harder with RentPay, the app which lets you pay your way, earn rewards, build a good credit score and more."
            linkText="Make my rent money work, honey"
            linkUrl="/rentpay"
          />
        </div>
      </div>
    </section>
  );
}
