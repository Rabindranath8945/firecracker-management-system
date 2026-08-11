"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { Customer } from "../types/customer";

import CustomerHero from "../components/cards/CustomerHero";
import CustomerFinancialOverview from "../components/details/CustomerFinancialOverview";
import CustomerQuickActions from "../components/details/CustomerQuickActions";
import CustomerContactCard from "../components/details/CustomerContactCard";
import CustomerBusinessSummary from "../components/details/CustomerBusinessSummary";

import { Button } from "@/components/ui/button";
import CustomerDetailsHero from "../components/details/CustomerDetailsHero";

interface CustomerDetailsPageProps {
  customer: Customer;
}

export default function CustomerDetailsPage({
  customer,
}: CustomerDetailsPageProps) {
  return (
    <main className="space-y-5 px-4 py-5 pb-24">
      <Link href="/customers">
        <Button variant="ghost" className="-ml-2 h-10 rounded-xl px-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Customers
        </Button>
      </Link>

      <CustomerDetailsHero customer={customer} />

      <CustomerFinancialOverview
        openingBalance={customer.openingBalance}
        creditLimit={customer.creditLimit}
      />

      <CustomerQuickActions
        customerId={customer._id}
        mobile={customer.mobile}
      />

      <div className="space-y-5">
        <CustomerContactCard customer={customer} />

        <CustomerBusinessSummary
          openingBalance={customer.openingBalance}
          creditLimit={customer.creditLimit}
          notes={customer.notes}
          isActive={customer.isActive}
        />
      </div>
    </main>
  );
}
