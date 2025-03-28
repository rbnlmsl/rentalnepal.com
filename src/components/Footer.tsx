"use client";

import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-secondary-dark pt-12 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <Link href="/" className="block mb-6">
              <Image
                src="/images/logo.svg"
                alt="RentalNepal.com Logo"
                width={140}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-base font-medium text-foreground mb-2">Made for Renters</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
            <div>
              <h3 className="text-base font-medium text-foreground mb-4">Renters</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/resume"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Renter Resume
                  </Link>
                </li>
                <li>
                  <Link
                    href="/renters"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Renter tools
                  </Link>
                </li>
                <li>
                  <Link
                    href="/rentcheck"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    RentCheck
                  </Link>
                </li>
                <li>
                  <Link
                    href="/rentbond"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    RentBond
                  </Link>
                </li>
                <li>
                  <Link
                    href="/rentconnect"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    RentConnect
                  </Link>
                </li>
                <li>
                  <Link
                    href="/rentpay"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    RentPay
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mobile"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Mobile App
                  </Link>
                </li>
                <li>
                  <Link
                    href="/searchtools"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Search smartly
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Advice & news
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-up"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-in"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Renter log in
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-medium text-foreground mb-4">Landlords</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/landlords"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    List a rental
                  </Link>
                </li>
                <li>
                  <Link
                    href="/rent_quotes/agencies"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Find a property manager
                  </Link>
                </li>
                <li>
                  <Link
                    href="/landlords"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Landlord solutions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/insights/landlord-advice"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Advice & news
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-in"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Landlord Log in
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-medium text-foreground mb-4">Agents</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/agents"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    View plans
                  </Link>
                </li>
                <li>
                  <Link
                    href="/agents"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Agent solutions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/agents/blog"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Agent blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-in?framework_current_user=agents"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Agent log in
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-medium text-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about-us"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://rentalnepal.com/investors/irm/content/rent-com-au-in-the-media.aspx?RID=406"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Media centre
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://rentalnepal.com/investors/"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Investor centre
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://rentalnepal.com/media/pdfs/rent_media_kit.pdf"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Advertise with us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Help or contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-xs text-foreground mb-2">Find Rental Properties by City or State</p>
          <p className="text-xs text-foreground mb-6">Copyright 2025. All rights reserved.</p>
          <p className="text-xs text-foreground mb-6">
            RentalNepal.com is the leading online rental marketplace in Nepal.
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <Link
              href="/privacy"
              className="text-xs text-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms_and_conditions"
              className="text-xs text-foreground hover:text-primary transition-colors"
            >
              Terms and conditions
            </Link>
            <Link
              href="/disclaimer"
              className="text-xs text-foreground hover:text-primary transition-colors"
            >
              Disclaimer
            </Link>
          </div>

          <div className="flex gap-4">
            <Link
              href="https://www.facebook.com/rentalnepal"
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              Facebook
            </Link>
            <Link
              href="https://www.instagram.com/rentalnepal"
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              Instagram
            </Link>
            <Link
              href="https://www.youtube.com/@rentcomau"
              className="text-foreground hover:text-primary transition-colors"
              aria-label="YouTube"
            >
              YouTube
            </Link>
            <Link
              href="https://www.linkedin.com/company/rent-com-au"
              className="text-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
