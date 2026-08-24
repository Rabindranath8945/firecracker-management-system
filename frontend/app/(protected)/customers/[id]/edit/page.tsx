"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import EditCustomerPage from "@/features/customers/pages/EditCustomerPage";
import CustomerService from "@/features/customers/services/customer.service";

import type { Customer } from "@/features/customers/types/customer";

/* -------------------------------------------------------------------------- */
/* Route                                                                      */
/* -------------------------------------------------------------------------- */

export default function CustomerEditRoute() {
  const params = useParams();
  const router = useRouter();

  const id = typeof params.id === "string" ? params.id : "";

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Load Customer                                                            */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!id) {
      setError("Invalid customer ID.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadCustomer() {
      try {
        setLoading(true);
        setError(null);

        const data = await CustomerService.getCustomer(id);

        if (!cancelled) {
          setCustomer(data);
        }
      } catch (error) {
        console.error("Failed to load customer:", error);

        if (!cancelled) {
          setError("Unable to load customer information.");
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

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          Loading customer...
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Error                                                                    */
  /* ------------------------------------------------------------------------ */

  if (error || !customer) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div
          className="
            w-full
            max-w-md
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            text-center
            shadow-sm
          "
        >
          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-red-50
              text-red-600
            "
          >
            !
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Unable to load customer
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error ?? "Customer information could not be found."}
          </p>

          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/customers")}
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-slate-50
              "
            >
              Back to Customers
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="
                rounded-xl
                bg-indigo-600
                px-4
                py-2
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-indigo-700
              "
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Edit Customer                                                            */
  /* ------------------------------------------------------------------------ */

  return (
    <EditCustomerPage
      customerId={customer._id}
      defaultValues={{
        name: customer.name,
        mobile: customer.mobile,
        email: customer.email,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pinCode: customer.pinCode,
        gstNo: customer.gstNo,
        openingBalance: customer.openingBalance,
        type: customer.type,
        isActive: customer.isActive,
      }}
    />
  );
}
