"use client";

import { CalendarDays, CreditCard, FileText, IndianRupee } from "lucide-react";

interface Props {
  supplierName: string;
  lastPurchase: string;
  totalPurchase: number;
  pendingDue: number;
  totalBills: number;
}

export default function SupplierInsights({
  supplierName,
  lastPurchase,
  totalPurchase,
  pendingDue,
  totalBills,
}: Props) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Supplier Insights</h2>

        <p className="text-sm text-muted-foreground">{supplierName}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <InsightCard
          icon={<CalendarDays className="size-5" />}
          title="Last Purchase"
          value={lastPurchase}
          color="text-blue-600"
        />

        <InsightCard
          icon={<IndianRupee className="size-5" />}
          title="Total Purchase"
          value={`₹${totalPurchase.toLocaleString()}`}
          color="text-green-600"
        />

        <InsightCard
          icon={<CreditCard className="size-5" />}
          title="Pending Due"
          value={`₹${pendingDue.toLocaleString()}`}
          color="text-red-600"
        />

        <InsightCard
          icon={<FileText className="size-5" />}
          title="Bills"
          value={totalBills.toString()}
          color="text-violet-600"
        />
      </div>
    </div>
  );
}

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}

function InsightCard({ icon, title, value, color }: InsightCardProps) {
  return (
    <div className="rounded-2xl bg-muted/40 p-4">
      <div className={`${color} mb-3`}>{icon}</div>

      <p className="text-xs text-muted-foreground">{title}</p>

      <h3 className={`mt-1 font-bold ${color}`}>{value}</h3>
    </div>
  );
}
