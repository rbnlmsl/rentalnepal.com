"use client";

import { useEffect } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased font-sans bg-secondary";
  }, []);

  return (
    <body className="antialiased font-sans bg-secondary" suppressHydrationWarning>
      {children}
    </body>
  );
}
