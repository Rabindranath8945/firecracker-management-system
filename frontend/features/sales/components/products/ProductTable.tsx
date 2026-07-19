"use client";

import { Trash2, Plus, Minus, Package2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSaleStore } from "@/features/sales/store/useSaleStore";
import { AnimatePresence, motion } from "framer-motion";

export function ProductTable() {
  const items = useSaleStore((s) => s.items);

  const removeItem = useSaleStore((s) => s.removeItem);

  const updateQuantity = useSaleStore((s) => s.updateQuantity);

  if (items.length === 0) {
    return (
      <Card className="rounded-3xl border-dashed p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <Package2 className="h-8 w-8 text-primary" />
          </div>

          <h3 className="text-lg font-semibold">Cart is Empty</h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Select a product to start billing.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <AnimatePresence>
        {items.map((item) => (
          <Card key={item.productId} className="rounded-3xl p-3">
            <div className="flex items-center gap-3">
              {/* Product Icon */}

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Package2 className="h-6 w-6 text-primary" />
              </div>

              {/* Product Details */}

              <div className="flex-1">
                <h3 className="line-clamp-1 text-sm font-semibold">
                  {item.productName}
                </h3>

                <p className="text-xs text-muted-foreground">
                  ₹{item.price} each
                </p>
              </div>

              {/* Line Total */}

              <div className="text-right">
                <p className="font-bold">₹{item.total}</p>
              </div>
            </div>

            {/* Bottom Row */}

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full"
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity - 1)
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <span className="min-w-8 text-center font-bold">
                  {item.quantity}
                </span>

                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full"
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1)
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeItem(item.productId)}
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          </Card>
        ))}
      </AnimatePresence>
    </section>
  );
}
