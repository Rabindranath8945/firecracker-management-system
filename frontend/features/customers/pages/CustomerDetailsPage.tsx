"use client";

import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

import type { Customer } from "../types/customer";

import { Button } from "@/components/ui/button";

import CustomerHero from "../components/cards/CustomerHero";
import CustomerFinancialOverview from "../components/details/CustomerFinancialOverview";
import CustomerQuickActions from "../components/details/CustomerQuickActions";
import CustomerBusinessSummary from "../components/details/CustomerBusinessSummary";
import CustomerTimeline from "../components/details/CustomerTimeline";
import CustomerTransactions from "../components/details/CustomerTransactions";
import CustomerContactCard from "../components/details/CustomerContactCard";

interface CustomerDetailsPageProps {
  customer: Customer;
}

export default function CustomerDetailsPage({
  customer,
}: CustomerDetailsPageProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 lg:px-0">
      {/* Top Bar */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/customers">
          <Button variant="outline" className="rounded-2xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Button>
        </Link>
      </div>

      {/* Hero */}

      <CustomerHero customer={customer} />

      {/* Financial Overview */}

      <CustomerFinancialOverview outstanding={customer.balance} />

      {/* Quick Actions */}

      <CustomerQuickActions mobile={customer.mobile} customerId={customer.id} />

      {/* Main Content */}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left Sidebar */}

        <div className="space-y-6">
          <CustomerContactCard customer={customer} />
        </div>

        {/* Right Content */}

        <div className="space-y-6 xl:col-span-2">
          <CustomerBusinessSummary
            openingBalance={customer.openingBalance}
            outstanding={customer.balance}
          />

          <CustomerTimeline />

          <CustomerTransactions />
        </div>
      </div>
    </div>
  );
}
