"use client";

import { FileSearch } from "lucide-react";
import { motion } from "framer-motion";

import PurchaseListItem from "./PurchaseListItem";
import PurchaseSkeleton from "./PurchaseSkeleton";

import type { Purchase } from "../types/purchase.types";

interface PurchaseListProps {
  loading: boolean;
  purchases: Purchase[];
  onDelete: (purchase: Purchase) => void;
}

export default function PurchaseList({
  loading,
  purchases,
  onDelete,
}: PurchaseListProps) {
  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <section aria-label="Loading purchases" className="space-y-4 pb-24">
        {Array.from({ length: 6 }).map((_, index) => (
          <PurchaseSkeleton key={index} />
        ))}
      </section>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Empty                                                                  */
  /* ---------------------------------------------------------------------- */

  if (purchases.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          flex
          min-h-[260px]
          flex-col
          items-center
          justify-center
          rounded-3xl
          border
          border-dashed
          border-slate-300
          bg-white
          px-6
          py-16
          text-center
          shadow-sm
          dark:border-border
          dark:bg-card
        "
      >
        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-3xl
            bg-violet-100
            dark:bg-violet-500/15
          "
        >
          <FileSearch className="h-7 w-7 text-violet-600 dark:text-violet-400" />
        </div>

        <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-foreground">
          No Purchases Found
        </h3>

        <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-muted-foreground">
          No purchase records match your current search or filters.
        </p>
      </motion.section>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Purchase List                                                          */
  /* ---------------------------------------------------------------------- */

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 pb-24"
    >
      {[...purchases]
        .sort((a, b) => {
          const dateA = new Date(a.createdAt ?? a.purchaseDate).getTime();
          const dateB = new Date(b.createdAt ?? b.purchaseDate).getTime();

          return dateB - dateA;
        })
        .map((purchase, index) => (
          <motion.div
            key={purchase._id}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: Math.min(index * 0.04, 0.2),
            }}
          >
            <PurchaseListItem purchase={purchase} onDelete={onDelete} />
          </motion.div>
        ))}
    </motion.section>
  );
}
