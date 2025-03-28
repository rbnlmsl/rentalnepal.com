import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";

export const metadata: Metadata = {
  title: "Rental Properties, Real Estate & Houses for Rent in Nepal | RentalNepal.com",
  description: "Search thousands of houses, apartments, units and rooms for rent on Nepal's leading rental property website. Find your perfect real estate in Nepal today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-secondary">
        <ClientBody>
          {children}
        </ClientBody>
      </body>
    </html>
  );
}
