"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function PropertySearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [includeSurrounding, setIncludeSurrounding] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would navigate to search results
    console.log("Searching for:", searchQuery, "Include surrounding:", includeSurrounding);
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
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <Button
              type="submit"
              size="sm"
              className="h-9 bg-primary hover:bg-primary-dark rounded-full px-4"
            >
              <Search className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only sm:text-sm">Search</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center ml-3">
          <input
            type="checkbox"
            id="includeSurrounding"
            checked={includeSurrounding}
            onChange={() => setIncludeSurrounding(!includeSurrounding)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label
            htmlFor="includeSurrounding"
            className="ml-2 text-xs font-medium text-white"
          >
            Include surrounding suburbs
          </label>
        </div>
      </form>
    </div>
  );
}
