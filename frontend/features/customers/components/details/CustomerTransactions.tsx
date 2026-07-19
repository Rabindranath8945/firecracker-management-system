"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CustomerTransactions() {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Recent Transactions</h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest invoices and payments
          </p>
        </div>

        <Button variant="outline" className="rounded-xl">
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="flex h-52 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
        <div className="text-center">
          <div className="mb-4 text-5xl">📄</div>

          <h3 className="font-semibold">No Transactions Yet</h3>

          <p className="mt-2 text-sm text-slate-500">
            Sales and payments will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
