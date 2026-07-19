"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  total: number;
  products: number;
  disabled?: boolean;
}

export default function StickySaveBar({ total, products, disabled }: Props) {
  return (
    <div
      className="
      fixed
      bottom-0
      left-0
      right-0
      z-50
      border-t
      bg-background/95
      backdrop-blur
      p-4
    "
    >
      <div className="mx-auto flex max-w-4xl items-center gap-4">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">
            {products} Product{products !== 1 && "s"}
          </p>

          <p className="text-xl font-bold">
            ₹
            {total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <Button
          type="submit"
          disabled={disabled}
          className="h-14 rounded-2xl px-8"
        >
          <Save className="mr-2 h-5 w-5" />
          Save Purchase
        </Button>
      </div>
    </div>
  );
}
