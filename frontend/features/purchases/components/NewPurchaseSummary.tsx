"use client";

import { Boxes, Hash, IndianRupee } from "lucide-react";

interface PurchaseSummaryProps {
  products: number;
  quantity: number;
  total: number;
}

export default function PurchaseSummary({
  products,
  quantity,
  total,
}: PurchaseSummaryProps) {
  return (
    <section className="grid grid-cols-3 gap-2">
      <SummaryCard
        icon={<Boxes className="h-4 w-4" />}
        title="Products"
        value={products.toString()}
      />

      <SummaryCard
        icon={<Hash className="h-4 w-4" />}
        title="Quantity"
        value={quantity.toString()}
      />

      <SummaryCard
        icon={<IndianRupee className="h-4 w-4" />}
        title="Total"
        value={`₹${total.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
      />
    </section>
  );
}

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function SummaryCard({ icon, title, value }: SummaryCardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        bg-card
        px-3
        py-3
        shadow-sm
      "
    >
      <div
        className="
          mb-2
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-xl
          bg-emerald-100
          text-emerald-600
          dark:bg-emerald-500/10
          dark:text-emerald-400
        "
      >
        {icon}
      </div>

      <p className="text-[10px] font-medium text-muted-foreground">{title}</p>

      <p className="mt-0.5 truncate text-sm font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}
