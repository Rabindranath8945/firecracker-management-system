"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const FILTERS = [
  "Today",
  "Yesterday",
  "This Week",
  "Paid",
  "Partial",
  "Due",
  "Cash",
  "UPI",
  "Wholesale",
];

export function SaleFilters() {
  const [selected, setSelected] = useState("Today");

  return (
    <section>
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {FILTERS.map((filter) => (
          <motion.button
            key={filter}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSelected(filter)}
            className={cn(
              "shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition-all",
              selected === filter
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card hover:bg-accent",
            )}
          >
            {filter}
          </motion.button>
        ))}
      </div>
    </section>
  );
}
