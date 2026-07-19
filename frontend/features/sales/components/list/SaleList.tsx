"use client";

import { useRouter } from "next/navigation";

import { SaleCard } from "./SaleCard";
import { EmptyState } from "../shared/EmptyState";

const SALES = [
  {
    id: "1",
    invoiceNo: "SAL-00001",
    customer: "Rahul Shaw",
    total: 2450,
    payment: "CASH",
    status: "PAID",
    createdAt: "Today • 11:42 AM",
    items: 12,
  },
  {
    id: "2",
    invoiceNo: "SAL-00002",
    customer: "Walk-in Customer",
    total: 540,
    payment: "UPI",
    status: "PAID",
    createdAt: "Today • 12:15 PM",
    items: 4,
  },
  {
    id: "3",
    invoiceNo: "SAL-00003",
    customer: "Amit Das",
    total: 1820,
    payment: "MIXED",
    status: "PARTIAL",
    createdAt: "Today • 2:05 PM",
    items: 8,
  },
] as const;

export function SaleList() {
  const router = useRouter();

  // if (SALES.length === 0) {
  //   return (
  //     <EmptyState
  //       title="No Sales Found"
  //       description="Start by creating your first sale."
  //     />
  //   );
  // }

  return (
    <section className="space-y-4">
      {SALES.map((sale) => (
        <div
          key={sale.id}
          className="cursor-pointer"
          onClick={() => router.push(`/sales/${sale.id}`)}
        >
          <SaleCard
            invoiceNo={sale.invoiceNo}
            customer={sale.customer}
            total={sale.total}
            payment={sale.payment}
            status={sale.status}
            createdAt={sale.createdAt}
            items={sale.items}
          />
        </div>
      ))}
    </section>
  );
}
