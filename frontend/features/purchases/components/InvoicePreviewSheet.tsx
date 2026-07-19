"use client";

import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  Package,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Product {
  name: string;
  quantity: number;
  price: number;
  confidence: number;
  matched: boolean;
}

interface Props {
  open: boolean;
  products: Product[];
  onImport: () => void;
  onClose: () => void;
}

export default function InvoicePreviewSheet({
  open,
  products,
  onImport,
  onClose,
}: Props) {
  if (!open) return null;

  const matched = products.filter((p) => p.matched).length;
  const review = products.length - matched;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-0 z-50 flex h-[85vh] flex-col rounded-t-[32px] bg-background shadow-2xl">
        {/* Handle */}

        <div className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-muted" />

        {/* Header */}

        <div className="border-b p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-primary/10 p-3">
              <FileText className="size-7 text-primary" />
            </div>

            <div>
              <h2 className="text-xl font-bold">AI Invoice Preview</h2>

              <p className="text-sm text-muted-foreground">
                Review detected products before importing
              </p>
            </div>
          </div>

          {/* Summary */}

          <div className="mt-5 grid grid-cols-3 gap-3">
            <Summary title="Detected" value={products.length.toString()} />

            <Summary
              title="Matched"
              value={matched.toString()}
              color="text-green-600"
            />

            <Summary
              title="Review"
              value={review.toString()}
              color="text-red-600"
            />
          </div>
        </div>

        {/* Products */}

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {products.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/10 p-3">
                  <Package className="size-6 text-primary" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>

                      <div className="mt-2 flex items-center gap-2">
                        {item.matched ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            <CheckCircle2 className="size-3" />
                            Matched
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            <AlertTriangle className="size-3" />
                            Review
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs">
                          <Sparkles className="size-3" />
                          {item.confidence}% AI
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-2 block text-xs text-muted-foreground">
                        Quantity
                      </label>

                      <Input type="number" defaultValue={item.quantity} />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-muted-foreground">
                        Purchase Price
                      </label>

                      <Input type="number" defaultValue={item.price} />
                    </div>
                  </div>

                  {!item.matched && (
                    <Button
                      variant="outline"
                      className="mt-4 w-full rounded-2xl border-dashed"
                    >
                      Select Existing Product
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}

        <div className="border-t bg-background p-6">
          <Button className="h-14 w-full rounded-2xl" onClick={onImport}>
            Import {products.length} Products
          </Button>
        </div>
      </div>
    </>
  );
}

interface SummaryProps {
  title: string;
  value: string;
  color?: string;
}

function Summary({ title, value, color }: SummaryProps) {
  return (
    <div className="rounded-2xl bg-muted/40 p-4 text-center">
      <p className="text-xs text-muted-foreground">{title}</p>

      <h3 className={`mt-1 text-2xl font-bold ${color ?? ""}`}>{value}</h3>
    </div>
  );
}
