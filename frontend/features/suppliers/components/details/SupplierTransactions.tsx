"use client";

import { ArrowRight, Receipt } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface SupplierTransaction {
  _id: string;
  billNo: string;
  date: string;
  amount: number;
  status: "PAID" | "PARTIAL" | "DUE";
}

interface SupplierTransactionsProps {
  supplierId: string;
  transactions?: SupplierTransaction[];
}

export default function SupplierTransactions({
  supplierId,
  transactions = [],
}: SupplierTransactionsProps) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Recent Transactions</h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest purchase bills and payments
          </p>
        </div>

        <Link href={`/purchases?supplier=${supplierId}`}>
          <Button variant="outline" className="rounded-xl">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="flex h-52 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
          <div className="text-center">
            <Receipt className="mx-auto mb-4 h-12 w-12 text-slate-300" />

            <h3 className="font-semibold text-slate-900">
              No Transactions Yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Purchase bills and supplier payments will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
            >
              <div>
                <h3 className="font-semibold text-slate-900">
                  {transaction.billNo}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {new Intl.DateTimeFormat("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(transaction.date))}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-slate-900">
                  ₹{transaction.amount.toLocaleString("en-IN")}
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    transaction.status === "PAID"
                      ? "bg-emerald-100 text-emerald-700"
                      : transaction.status === "PARTIAL"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
