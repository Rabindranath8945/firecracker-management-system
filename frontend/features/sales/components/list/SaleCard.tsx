"use client";

import { ChevronRight, CreditCard, Wallet, Smartphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface SaleCardProps {
  invoiceNo: string;
  customer: string;
  total: number;
  payment: "CASH" | "UPI" | "MIXED";
  status: "PAID" | "PARTIAL" | "DUE";
  createdAt: string;
  items: number;
}

export function SaleCard({
  invoiceNo,
  customer,
  total,
  payment,
  status,
  createdAt,
  items,
}: SaleCardProps) {
  const PaymentIcon =
    payment === "CASH" ? Wallet : payment === "UPI" ? Smartphone : CreditCard;

  return (
    <Card className="rounded-3xl p-5 transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{invoiceNo}</h3>

          <p className="text-sm text-muted-foreground">{customer}</p>
        </div>

        <Badge>{status}</Badge>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{createdAt}</p>

          <p className="text-xs text-muted-foreground">{items} Items</p>
        </div>

        <div className="text-right">
          <h2 className="text-xl font-bold">₹{total.toLocaleString()}</h2>

          <div className="mt-1 flex items-center justify-end gap-1 text-muted-foreground">
            <PaymentIcon className="h-4 w-4" />

            <span className="text-xs">{payment}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Card>
  );
}
