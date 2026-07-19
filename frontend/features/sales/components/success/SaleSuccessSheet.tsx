"use client";

import { CheckCircle2, Home, Printer, Share2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

interface SaleSuccessSheetProps {
  open: boolean;
  invoiceNo: string;
  total: number;
  onOpenChange: (open: boolean) => void;
}

export function SaleSuccessSheet({
  open,
  invoiceNo,
  total,
  onOpenChange,
}: SaleSuccessSheetProps) {
  const router = useRouter();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader>
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-5">
              <CheckCircle2 className="h-14 w-14 text-green-600" />
            </div>
          </div>

          <SheetTitle className="pt-4 text-center text-2xl">
            Sale Completed
          </SheetTitle>

          <p className="text-center text-muted-foreground">
            Invoice generated successfully
          </p>
        </SheetHeader>

        <div className="mt-8 rounded-3xl border p-5">
          <div className="flex justify-between">
            <span>Invoice</span>
            <strong>{invoiceNo}</strong>
          </div>

          <div className="mt-3 flex justify-between">
            <span>Total Amount</span>
            <strong>₹{total.toFixed(2)}</strong>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-14 rounded-2xl">
            <Printer className="mr-2 h-5 w-5" />
            Print
          </Button>

          <Button variant="outline" className="h-14 rounded-2xl">
            <Share2 className="mr-2 h-5 w-5" />
            WhatsApp
          </Button>

          <Button
            className="h-14 rounded-2xl"
            onClick={() => {
              onOpenChange(false);
              router.refresh();
            }}
          >
            <Plus className="mr-2 h-5 w-5" />
            New Sale
          </Button>

          <Button
            variant="secondary"
            className="h-14 rounded-2xl"
            onClick={() => router.push("/sales")}
          >
            <Home className="mr-2 h-5 w-5" />
            Sales List
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
