"use client";

import { Boxes, Hash, IndianRupee } from "lucide-react";

interface Props {
  products: number;
  quantity: number;
  total: number;
}

export default function PurchaseSummary({ products, quantity, total }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Card
        icon={<Boxes className="size-5" />}
        title="Products"
        value={products.toString()}
      />

      <Card
        icon={<Hash className="size-5" />}
        title="Quantity"
        value={quantity.toString()}
      />

      <Card
        icon={<IndianRupee className="size-5" />}
        title="Total"
        value={`₹${total.toFixed(2)}`}
      />
    </div>
  );
}

interface CardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function Card({ icon, title, value }: CardProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <p className="text-xs text-muted-foreground">{title}</p>

      <h3 className="mt-1 text-xl font-bold">{value}</h3>
    </div>
  );
}
