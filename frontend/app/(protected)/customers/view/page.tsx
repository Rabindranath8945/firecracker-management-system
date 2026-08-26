"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import CustomerDetailsPage from "@/features/customers/pages/CustomerDetailsPage";
import CustomerService from "@/features/customers/services/customer.service";

import type { Customer } from "@/features/customers/types/customer";

export default function CustomerDetailsRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id") ?? "";

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setCustomer(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadCustomer() {
      try {
        setLoading(true);

        const data = await CustomerService.getCustomer(id);

        if (!cancelled) {
          setCustomer(data);
        }
      } catch (error) {
        console.error("Failed to load customer:", error);

        if (!cancelled) {
          setCustomer(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCustomer();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        Loading customer...
      </main>
    );
  }

  if (!customer) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Customer not found.</p>

          <button
            type="button"
            onClick={() => router.push("/customers")}
            className="mt-4 rounded-xl border px-4 py-2"
          >
            Back to Customers
          </button>
        </div>
      </main>
    );
  }

  return <CustomerDetailsPage customer={customer} />;
}
