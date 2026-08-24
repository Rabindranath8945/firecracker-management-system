"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";

interface StickySaveBarProps {
  total: number;
  products: number;
  disabled?: boolean;
}

export default function StickySaveBar({
  total,
  products,
  disabled = false,
}: StickySaveBarProps) {
  const formattedTotal = Number(total || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div
      className="
        fixed
        inset-x-0
        bottom-0
        z-50
        border-t
        bg-background/95
        px-3
        py-3
        shadow-[0_-8px_30px_rgba(0,0,0,0.08)]
        backdrop-blur-xl
        dark:bg-background/95
      "
    >
      <div className="mx-auto flex max-w-4xl items-center gap-3">
        {/* -------------------------------------------------------------- */}
        {/* Purchase Summary                                               */}
        {/* -------------------------------------------------------------- */}

        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-medium text-muted-foreground">
            {products} Product
            {products !== 1 ? "s" : ""}
          </p>

          <p className="truncate text-lg font-bold text-emerald-600 dark:text-emerald-400">
            ₹{formattedTotal}
          </p>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Save Button                                                     */}
        {/* -------------------------------------------------------------- */}

        <Button
          type="submit"
          disabled={disabled}
          className="
            h-12
            shrink-0
            rounded-2xl
            bg-emerald-600
            px-5
            font-semibold
            shadow-sm
            transition-all
            hover:bg-emerald-700
            active:scale-[0.98]
            disabled:pointer-events-none
            disabled:opacity-50
            dark:bg-emerald-600
            dark:hover:bg-emerald-700
          "
        >
          <Save className="mr-2 h-4 w-4" />
          Save Purchase
        </Button>
      </div>
    </div>
  );
}
