"use client";

import { useEffect, useState } from "react";

import { Percent, IndianRupee, Receipt } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface DiscountDialogProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  subtotal: number;

  taxAmount?: number;

  value: number;

  onApply: (discount: number) => void;
}

export default function DiscountDialog({
  open,
  onOpenChange,
  subtotal,
  taxAmount = 0,
  value,
  onApply,
}: DiscountDialogProps) {
  const [discount, setDiscount] = useState(value);

  useEffect(() => {
    setDiscount(value);
  }, [value]);

  const grandTotal = Math.max(0, subtotal - discount + taxAmount);

  function applyDiscount() {
    onApply(discount);
    onOpenChange(false);
  }

  const quickAmount = [50, 100, 200, 500];

  const quickPercent = [5, 10, 15, 20];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply Discount</DialogTitle>

          <DialogDescription>Apply invoice level discount.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount */}

          <div>
            <p className="mb-3 text-sm font-semibold">Discount Amount</p>

            <div className="flex items-center rounded-2xl border bg-muted px-4">
              <IndianRupee className="mr-2 h-5 w-5 text-muted-foreground" />

              <Input
                type="number"
                value={discount}
                min={0}
                max={subtotal}
                onChange={(e) =>
                  setDiscount(Math.min(subtotal, Number(e.target.value) || 0))
                }
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Quick Amount */}

          <div>
            <p className="mb-3 text-sm font-semibold">Quick Amount</p>

            <div className="grid grid-cols-4 gap-2">
              {quickAmount.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  className="rounded-2xl"
                  onClick={() => setDiscount(amount)}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Percentage */}

          <div>
            <p className="mb-3 text-sm font-semibold">Quick Percentage</p>

            <div className="grid grid-cols-4 gap-2">
              {quickPercent.map((percent) => (
                <Button
                  key={percent}
                  variant="outline"
                  className="rounded-2xl"
                  onClick={() =>
                    setDiscount(Math.round(subtotal * (percent / 100)))
                  }
                >
                  <Percent className="mr-1 h-4 w-4" />

                  {percent}
                </Button>
              ))}
            </div>
          </div>

          {/* Summary */}

          <Card className="rounded-3xl bg-muted/40 p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>

              <span className="font-semibold">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-muted-foreground">Discount</span>

              <span className="font-semibold text-red-600">
                -₹
                {discount.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-muted-foreground">GST</span>

              <span className="font-semibold">
                ₹{taxAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="my-4 border-t" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-violet-600" />

                <span className="font-bold">Grand Total</span>
              </div>

              <span className="text-2xl font-black text-violet-700">
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </Card>

          <Button
            onClick={applyDiscount}
            className="
              h-12
              w-full
              rounded-2xl
              bg-gradient-to-r
              from-violet-600
              to-fuchsia-600
              font-semibold
            "
          >
            Apply Discount
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
