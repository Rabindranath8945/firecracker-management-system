import { SalesHero } from "@/features/sales/components/hero/SalesHero";
import { SalesSummary } from "@/features/sales/components/summary/SalesSummary";
import { SalesSearch } from "@/features/sales/components/search/SalesSearch";
import { SaleFilters } from "@/features/sales/components/list/SaleFilters";
import { SaleList } from "@/features/sales/components/list/SaleList";

export default function SalesPage() {
  return (
    <main className="space-y-5 px-4 py-5 pb-24">
      <SalesHero title="Sales" description="Manage invoices and daily sales" />

      <SalesSummary />

      <SalesSearch />

      <SaleFilters />

      <SaleList />
    </main>
  );
}
