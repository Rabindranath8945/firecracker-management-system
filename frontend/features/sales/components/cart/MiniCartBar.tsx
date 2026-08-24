"use client";

import { ArrowRight, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

interface MiniCartBarProps {
  totalItems: number;
  totalAmount: number;

  onCheckout: () => void;
}

export default function MiniCartBar({
  totalItems,
  totalAmount,
  onCheckout,
}: MiniCartBarProps) {
  if (totalItems === 0) {
    return null;
  }

  return (
    <div
      className="
        fixed
        bottom-20
        left-4
        right-4
        z-50
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          rounded-3xl
          bg-gradient-to-r
          from-violet-600
          to-fuchsia-600
          p-4
          text-white
          shadow-2xl
        "
      >
        {/* Left */}

        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-white/15
            "
          >
            <ShoppingCart className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm text-violet-100">{totalItems} Items</p>

            <h2 className="text-2xl font-bold">
              ₹{totalAmount.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Right */}

        <Button
          onClick={onCheckout}
          className="
            h-12
            rounded-2xl
            bg-white
            px-6
            font-semibold
            text-violet-700
            hover:bg-violet-50
          "
        >
          Next
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
