"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Header() {
  return (
    <header className="w-full bg-secondary-dark py-4 border-b border-secondary">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.svg"
              alt="RentalNepal.com Logo"
              width={140}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Find a rental
            </Link>
            <Link
              href="/renters"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              For renters
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Advice
            </Link>
            <Link
              href="/about-us"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              About us
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center space-x-3">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors px-2 py-1"
          >
            Log in
          </Link>
          <Button
            variant="default"
            className="bg-primary hover:bg-primary-dark text-white rounded-full"
            asChild
          >
            <Link href="/sign-up">Sign up</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="rounded-full border-primary text-primary ml-2">
                More
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                  href="/shortlist"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Shortlist
                </Link>
                <Link
                  href="/rentbond"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  RentBond
                </Link>
                <Link
                  href="/tools"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Tools
                </Link>
                <Link
                  href="/resume"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Resume
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                  href="/"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Find a rental
                </Link>
                <Link
                  href="/renters"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  For renters
                </Link>
                <Link
                  href="/blog"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Advice
                </Link>
                <Link
                  href="/about-us"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  About us
                </Link>
                <div className="border-t border-gray-200 pt-4 flex flex-col space-y-4">
                  <Link
                    href="/sign-in"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="text-sm font-medium text-white bg-primary hover:bg-primary-dark py-2 px-4 rounded-full text-center transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
