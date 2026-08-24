"use client";

import { PackageSearch } from "lucide-react";

export default function EmptyProducts() {
  return (
    <div className="py-20 text-center">
      <PackageSearch className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

      <h3 className="text-lg font-semibold">No Products Found</h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Try another category or search keyword.
      </p>
    </div>
  );
}
