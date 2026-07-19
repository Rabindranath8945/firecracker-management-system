"use client";

import { Package, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  sku: string;
  purchasePrice: number;
}

interface Props {
  products: Product[];
  onSelect: (product: Product) => void;
}

export default function FrequentProducts({ products, onSelect }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Frequently Purchased</h2>

        <p className="text-sm text-muted-foreground">
          Products usually purchased from this supplier
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {products.map((product) => (
          <div
            key={product.id}
            className="
              min-w-[220px]
              rounded-3xl
              border
              bg-card
              p-4
              shadow-sm
            "
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3">
                <Package className="size-6 text-primary" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">{product.name}</h3>

                <p className="text-xs text-muted-foreground">{product.sku}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Purchase</p>

                <h4 className="font-bold">₹{product.purchasePrice}</h4>
              </div>

              <Button
                size="icon"
                className="rounded-xl"
                onClick={() => onSelect(product)}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
