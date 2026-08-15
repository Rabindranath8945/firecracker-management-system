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

interface PurchaseProductTableProps {
  items: PurchaseLineItem[];

  onEdit: (index: number) => void;

  onDelete: (index: number) => void;
}

export default function PurchaseProductTable({
  items,
  onEdit,
  onDelete,
}: PurchaseProductTableProps) {
  /* ---------------------------------------------------------------------- */
  /* EMPTY STATE                                                            */
  /* ---------------------------------------------------------------------- */

  if (items.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed bg-muted/20 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-500/10">
          <Package className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>

        <h3 className="mt-4 text-base font-bold">No Products Added</h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Search a product above to add it to this purchase.
        </p>
      </section>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* PRODUCT LIST                                                           */
  /* ---------------------------------------------------------------------- */

  return (
    <section className="space-y-3">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold">Products</h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {items.length} item
            {items.length !== 1 ? "s" : ""} added
          </p>
        </div>

        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          {items.length}
        </span>
      </div>

      {/* Items */}

      <div className="space-y-2">
        {items.map((item, index) => {
          const subtotal = Number(item.quantity) * Number(item.purchasePrice);

          const discountAmount = subtotal * (Number(item.discount) / 100);

          const taxable = subtotal - discountAmount;

          const gstAmount = taxable * (Number(item.gstRate) / 100);

          const total = taxable + gstAmount;

          return (
            <article
              key={`${item.productId}-${index}`}
              className="
                group
                rounded-2xl
                border
                bg-card
                px-3
                py-3
                shadow-sm
                transition-all
                hover:border-emerald-300
                hover:shadow-md
                dark:hover:border-emerald-500/40
              "
            >
              <div className="flex items-center gap-3">
                {/* ------------------------------------------------------ */}
                {/* Product Image                                            */}
                {/* ------------------------------------------------------ */}

                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>

                {/* ------------------------------------------------------ */}
                {/* Product Information                                      */}
                {/* ------------------------------------------------------ */}

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold">
                    {item.productName}
                  </h3>

                  <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                    {item.sku}
                  </p>

                  <div className="mt-1.5 flex items-center gap-2">
                    {/* Quantity */}

                    <span className="text-[10px] text-muted-foreground">
                      Qty{" "}
                      <span className="font-semibold text-foreground">
                        {item.quantity}
                      </span>
                    </span>

                    <span className="text-muted-foreground">×</span>

                    {/* Purchase price */}

                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹{Number(item.purchasePrice).toLocaleString("en-IN")}
                    </span>

                    {/* GST */}

                    {item.gstRate > 0 && (
                      <span className="text-[10px] text-muted-foreground">
                        GST {item.gstRate}%
                      </span>
                    )}
                  </div>
                </div>

                {/* ------------------------------------------------------ */}
                {/* Total                                                     */}
                {/* ------------------------------------------------------ */}

                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    ₹
                    {total.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>

                  {item.discount > 0 && (
                    <p className="mt-0.5 text-[9px] text-muted-foreground">
                      -{item.discount}% discount
                    </p>
                  )}
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* Actions                                                    */}
              {/* -------------------------------------------------------- */}

              <div className="mt-2 flex justify-end gap-2 border-t pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(index)}
                  className="h-8 rounded-xl px-3 text-xs hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10"
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Edit
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(index)}
                  className="h-8 rounded-xl px-3 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
