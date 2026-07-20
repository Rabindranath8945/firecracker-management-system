import { ArrowUpRight, CalendarDays, ReceiptIndianRupee } from "lucide-react";

interface PurchaseHeroProps {
  totalPurchase: number;
  monthlyGrowth?: number;
  totalPurchases?: number;
  totalProducts?: number;
}

export function PurchaseHero({
  totalPurchase,
  monthlyGrowth = 0,
  totalPurchases = 0,
  totalProducts = 0,
}: PurchaseHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-6 text-white shadow-2xl">
      {/* Background Glow */}
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm text-white/70">Total Purchases</p>

          <h1 className="mt-2 text-5xl font-black tracking-tight">
            ₹{totalPurchase.toLocaleString()}
          </h1>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
          <ReceiptIndianRupee className="size-7" />
        </div>
      </div>

      {/* Growth */}
      <div className="relative z-10 mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-sm font-medium backdrop-blur">
        <ArrowUpRight className="size-4" />

        <span>
          {monthlyGrowth >= 0 ? "+" : ""}
          {monthlyGrowth}% this month
        </span>
      </div>

      {/* Bottom Stats */}
      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/15 pt-5">
        <div>
          <p className="text-xs text-white/70">Purchases</p>

          <p className="mt-1 text-lg font-bold">{totalPurchases}</p>
        </div>

        <div>
          <p className="text-xs text-white/70">Products</p>

          <p className="mt-1 text-lg font-bold">{totalProducts}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-white/80">
          <CalendarDays className="size-4" />
          July 2026
        </div>
      </div>
    </section>
  );
}
