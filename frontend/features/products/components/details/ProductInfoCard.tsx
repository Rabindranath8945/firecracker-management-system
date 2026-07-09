"use client";

import { Card, CardContent } from "@/components/ui/card";

const info = [
  ["Category", "Rocket"],
  ["Brand", "Standard"],
  ["SKU", "PRD-000001"],
  ["Barcode", "890123456789"],
  ["Unit", "Piece"],
  ["GST", "18%"],
  ["HSN", "36041000"],
];

export default function ProductInfoCard() {
  return (
    <Card className="rounded-2xl">
      <CardContent className="space-y-4 p-5">
        <h2 className="text-lg font-semibold">Product Information</h2>

        {info.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between border-b pb-3 last:border-0"
          >
            <span className="text-muted-foreground">{label}</span>

            <span className="font-medium">{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
