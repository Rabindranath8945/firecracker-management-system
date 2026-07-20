"use client";

import { Package, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface PurchaseLineItem {
  productId: string;
  productName: string;
  sku: string;

  quantity: number;

  purchasePrice: number;
  sellingPrice: number;

  discount: number;
  gstRate: number;

  image?: string;
}

interface Props {
  items: PurchaseLineItem[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export default function PurchaseProductTable({
  items,
  onEdit,
  onDelete,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed bg-muted/20 p-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Package className="h-8 w-8 text-primary" />
        </div>

        <h3 className="text-lg font-semibold">No Products Added</h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Search a product above or import an invoice.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Products ({items.length})</h2>
      </div>

      {items.map((item, index) => {
        const subtotal = item.quantity * item.purchasePrice;

        const discount = subtotal * (item.discount / 100);

        const taxable = subtotal - discount;

        const gst = taxable * (item.gstRate / 100);

        const total = taxable + gst;

        return (
          <div
            key={`${item.productId}-${index}`}
            className="rounded-3xl border bg-card p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex gap-4">
              {/* Image */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                ) : (
                  <Package className="h-6 w-6 text-primary" />
                )}
              </div>

              {/* Product */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold">{item.productName}</h3>

                <p className="text-sm text-muted-foreground">{item.sku}</p>

                <p className="mt-2 text-sm">
                  Qty <span className="font-semibold">{item.quantity}</span>
                  {" × "}
                  <span className="font-semibold">₹{item.purchasePrice}</span>
                </p>
              </div>

              {/* Total */}
              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  ₹{total.toFixed(2)}
                </p>

                <div className="mt-3 flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    type="button"
                    onClick={() => onEdit(index)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    type="button"
                    onClick={() => onDelete(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
