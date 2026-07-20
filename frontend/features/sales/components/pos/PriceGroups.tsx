"use client";

import { useMemo, useState } from "react";
import { BadgeDollarSign } from "lucide-react";

import { getPriceGroups } from "@/features/sales/utils/priceGroups";

export function PriceGroups() {
  /* -------------------------------------------------------------------------- */
  /* Temporary Product Prices
     Replace this with:
     const productPrices = products.map((p) => p.salePrice);
  /* -------------------------------------------------------------------------- */

  const productPrices = [5, 10, 20, 20, 50, 50, 100, 200, 500];

  const [selected, setSelected] = useState<string | number>("All");

  const priceGroups = useMemo(
    () => getPriceGroups(productPrices),
    [productPrices],
  );

  return (
    <section className="space-y-3">
      {/* Header */}

      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
          <BadgeDollarSign className="h-5 w-5 text-blue-600" />
        </div>

        <div>
          <h2 className="text-base font-bold">Quick Price</h2>

          <p className="text-xs text-muted-foreground">
            Tap to filter products
          </p>
        </div>
      </div>

      {/* Price Chips */}

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {priceGroups.map((price) => {
          const active = selected === price;

          return (
            <button
              key={price.toString()}
              onClick={() => setSelected(price)}
              className={`
                h-9
                shrink-0
                rounded-full
                px-4
                text-sm
                font-semibold
                transition-all
                duration-200

                ${
                  active
                    ? "scale-105 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "border bg-white hover:border-blue-200 hover:bg-blue-50"
                }
              `}
            >
              {typeof price === "number" ? `₹${price}` : price}
            </button>
          );
        })}
      </div>
    </section>
  );
}
