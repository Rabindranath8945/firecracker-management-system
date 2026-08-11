"use client";

import { useRouter } from "next/navigation";

import { SaleCard } from "./SaleCard";

import { useSales } from "../../hooks/useSales";
import type { Sale, SaleItem } from "../../types/Sales.types";
import EmptySales from "../shared/EmptySales";

interface SaleListProps {
  search?: string;

  paymentStatus?: string;

  fromDate?: string;

  toDate?: string;
}

export function SaleList({
  search,
  paymentStatus,
  fromDate,
  toDate,
}: SaleListProps) {
  const router = useRouter();

  const { data: sales = [], isLoading } = useSales({
    search,
    paymentStatus,
    fromDate,
    toDate,
  });

  if (isLoading) {
    return (
      <section className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-3xl bg-muted"
          />
        ))}
      </section>
    );
  }

  if (sales.length === 0) {
    return <EmptySales />;
  }

  return (
    <section className="space-y-4">
      {sales.map((sale: Sale) => (
        <div
          key={sale._id}
          className="cursor-pointer"
          onClick={() => router.push(`/sales/${sale._id}`)}
        >
          <SaleCard
            invoiceNo={sale.saleNo}
            customer={sale.customer?.name ?? "Walk-in Customer"}
            total={sale.grandTotal}
            payment={sale.payment.method}
            status={sale.paymentStatus}
            createdAt={new Date(sale.saleDate).toLocaleString()}
            items={sale.items.reduce((total, item) => total + item.quantity, 0)}
          />
        </div>
      ))}
    </section>
  );
}
