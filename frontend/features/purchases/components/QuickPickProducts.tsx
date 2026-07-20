"use client";

import Image from "next/image";

import { QUICK_PICKS } from "../mock/quick-picks";

interface Props {
  onSelect?: (id: string) => void;
}

export default function QuickPickProducts({ onSelect }: Props) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Frequently Purchased</h2>

        <p className="text-sm text-muted-foreground">
          Based on supplier history
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {QUICK_PICKS.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => onSelect?.(product.id)}
            className="
              rounded-3xl
              border
              bg-card
              p-3
              transition-all
              hover:shadow-lg
              active:scale-95
            "
          >
            <div className="relative mx-auto h-16 w-16">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>

            <p className="mt-3 text-center text-sm font-medium">
              {product.name}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
