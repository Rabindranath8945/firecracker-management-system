"use client";

import { useState } from "react";
import { Search, User, Plus, Phone, ChevronRight } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCustomers } from "@/features/customers/hooks/useCustomers";
import type { Customer } from "@/features/customers/types/customer";

import { useSaleStore } from "@/features/sales/store/useSaleStore";
import CustomerListItem from "./CustomerListItem";
import CustomerSearch from "./CustomerSearch";
import WalkInCustomerCard from "./WalkInCustomerCard";

interface CustomerSelectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CustomerSelectionSheet({
  open,
  onOpenChange,
}: CustomerSelectionSheetProps) {
  const [search, setSearch] = useState("");

  const { customers, loading } = useCustomers({
    search,
    page: 1,
    limit: 100,
  });

  const {
    selectedCustomer,
    setSelectedCustomer,
    setPreviousDue,
    setCollectPreviousDue,
  } = useSaleStore();

  function selectCustomer(customer: Customer) {
    const due = customer.openingBalance ?? 0;

    setSelectedCustomer({
      _id: customer._id,
      name: customer.name,
      mobile: customer.mobile ?? "",
      dueAmount: due,
      lastVisit: "",
      walkIn: false,
    });

    setPreviousDue(due);

    // Every newly selected customer starts
    // with previous-due collection enabled.
    setCollectPreviousDue(true);

    onOpenChange(false);
  }

  function selectWalkIn() {
    setSelectedCustomer(null);

    setPreviousDue(0);

    setCollectPreviousDue(false);

    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-[32px] p-0">
        <SheetHeader className="border-b p-6">
          <SheetTitle className="text-xl">Select Customer</SheetTitle>

          <CustomerSearch value={search} onChange={setSearch} />
        </SheetHeader>

        <WalkInCustomerCard onClick={selectWalkIn} />

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Loading customers...
              </p>
            </div>
          ) : customers.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center">
              <User className="mb-3 h-10 w-10 text-slate-300" />

              <p className="font-medium">No Customers Found</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Create your first customer
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {customers.map((customer: Customer) => (
                <CustomerListItem
                  key={customer._id}
                  customer={customer}
                  selected={selectedCustomer?._id === customer._id}
                  onSelect={selectCustomer}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t bg-background p-4">
          <Button
            variant="outline"
            className="h-12 w-full rounded-2xl"
            onClick={() => {
              onOpenChange(false);
              // router.push("/customers/new");
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Customer
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
