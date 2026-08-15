"use client";

import { useRouter } from "next/navigation";

import { SaleCard } from "./SaleCard";
import { useSales } from "../../hooks/useSales";

import type { Sale, SalesQueryParams } from "../../types/Sales.types";

import EmptySales from "../shared/EmptySales";

interface SaleListProps {
  search?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  fromDate?: string;
  toDate?: string;
}

export function SaleList({
  search,
  paymentStatus,
  paymentMethod,
  fromDate,
  toDate,
}: SaleListProps) {
  const router = useRouter();

  /*
   * Build query params safely.
   *
   * This avoids passing `undefined` values to SalesQueryParams,
   * which is required because exactOptionalPropertyTypes is enabled.
   */
  const params: SalesQueryParams = {};

  const trimmedSearch = search?.trim();

  if (trimmedSearch) {
    params.search = trimmedSearch;
  }

  if (paymentStatus) {
    params.paymentStatus = paymentStatus;
  }

  if (paymentMethod) {
    params.paymentMethod = paymentMethod;
  }

  if (fromDate) {
    params.fromDate = fromDate;
  }

  if (toDate) {
    params.toDate = toDate;
  }

  const { data: sales = [], isLoading } = useSales(params);

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

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

  /* ---------------------------------------------------------------------- */
  /* Empty                                                                  */
  /* ---------------------------------------------------------------------- */

  if (sales.length === 0) {
    return <EmptySales />;
  }

  /* ---------------------------------------------------------------------- */
  /* Sales List                                                             */
  /* ---------------------------------------------------------------------- */

  return (
    <section className="space-y-4">
      {sales.map((sale: Sale) => {
        const itemCount = sale.items.reduce(
          (total, item) => total + item.quantity,
          0,
        );

        return (
          <div
            key={sale._id}
            className="cursor-pointer"
            onClick={() => {
              router.push(`/sales/${sale._id}`);
            }}
          >
            <SaleCard
              invoiceNo={sale.saleNo}
              customer={sale.customer?.name ?? "Walk-in Customer"}
              total={sale.grandTotal}
              payment={sale.payment.method}
              status={sale.paymentStatus}
              createdAt={new Date(sale.saleDate).toLocaleString("en-IN")}
              items={itemCount}
            />
          </div>
        );
      })}
    </section>
  );
}
