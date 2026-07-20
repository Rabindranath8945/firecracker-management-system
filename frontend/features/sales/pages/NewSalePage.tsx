"use client";

import { useState } from "react";
import { SalesHero } from "@/features/sales/components/hero/SalesHero";
import { ProductSearch } from "@/features/sales/components/products/ProductSearch";
import { ProductQuickGrid } from "@/features/sales/components/products/ProductQuickGrid";
import { ProductTable } from "@/features/sales/components/products/ProductTable";
import { PriceGroups } from "@/features/sales/components/pos/PriceGroups";
import { Calculator } from "@/features/sales/components/calculator/Calculator";
import { CustomerSelector } from "@/features/sales/components/customer/CustomerSelector";
import { CustomerProfileCard } from "@/features/sales/components/customer/CustomerProfileCard";
import { PaymentCard } from "@/features/sales/components/payments/PaymentCard";
import { SalesTotals } from "@/features/sales/components/totals/SalesTotals";
import { NotesCard } from "@/features/sales/components/notes/NotesCard";
import { StickySaveBar } from "@/features/sales/components/save/StickySaveBar";
import { SaleSuccessSheet } from "@/features/sales/components/success/SaleSuccessSheet";

export function NewSalePage() {
  const [successOpen, setSuccessOpen] = useState(false);

  return (
    <div className="pb-40">
      <SalesHero
        title="New Sale"
        description="Fast billing with quantity-first workflow"
        showActions
      />

      <div className="space-y-5 px-4 py-5">
        <CustomerSelector />

        {/* <CustomerProfileCard
          customer={{
            name: "Rahul Shaw",
            phone: "9876543210",
            due: 2450,
            lastPurchase: "3 days ago",
          }}
        /> */}

        <ProductSearch />

        <PriceGroups />

        <Calculator />

        <ProductQuickGrid />

        <ProductTable />

        <SalesTotals />

        <PaymentCard />

        <NotesCard />
      </div>

      <StickySaveBar onSave={() => setSuccessOpen(true)} />

      <SaleSuccessSheet
        open={successOpen}
        onOpenChange={setSuccessOpen}
        invoiceNo="SAL-00001"
        total={2450}
      />
    </div>
  );
}
