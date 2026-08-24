"use client";

import Image from "next/image";

interface QuickPickProduct {
  _id: string;
  name: string;
  image?: string | null;
}

interface Props {
  products: QuickPickProduct[];
  onSelect?: (id: string) => void;
}

export default function QuickPickProducts({ products, onSelect }: Props) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Frequently Purchased
        </h2>

        <p className="text-sm text-slate-500">
          Based on supplier purchase history
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {products.map((product) => (
          <button
            key={product._id}
            type="button"
            onClick={() => onSelect?.(product._id)}
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-3
              transition-all
              duration-200
              hover:-translate-y-1
              hover:shadow-lg
              active:scale-95
            "
          >
            <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
              <Image
                src={product.image || "/images/product-placeholder.png"}
                alt={product.name}
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>

            <p className="mt-3 line-clamp-2 text-center text-sm font-medium text-slate-900">
              {product.name}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
