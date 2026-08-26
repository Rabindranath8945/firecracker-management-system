"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import EditSupplierPage from "@/features/suppliers/pages/EditSupplierPage";
import { getSupplier } from "@/features/suppliers/services/supplier.service";

import type { Supplier } from "@/features/suppliers/types/supplier.type";

interface SupplierEditClientProps {
  id: string;
}

export default function SupplierEditClient({ id }: SupplierEditClientProps) {
  const router = useRouter();

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------------------------------------------------------------- */
  /* LOAD SUPPLIER                                                          */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!id) {
      setError("Invalid supplier ID.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadSupplier() {
      try {
        setLoading(true);
        setError(null);

        const data = await getSupplier(id);

        if (!cancelled) {
          setSupplier(data);
        }
      } catch (error) {
        console.error("Failed to load supplier:", error);

        if (!cancelled) {
          setSupplier(null);
          setError("Unable to load supplier information.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSupplier();

    return () => {
      cancelled = true;
    };
  }, [id]);

  /* ---------------------------------------------------------------------- */
  /* LOADING                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          Loading supplier...
        </div>
      </main>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* ERROR                                                                  */
  /* ---------------------------------------------------------------------- */

  if (error || !supplier) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Unable to load supplier
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error ?? "Supplier information could not be found."}
          </p>

          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/suppliers")}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Back to Suppliers
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* EDIT                                                                    */
  /* ---------------------------------------------------------------------- */

  return (
    <EditSupplierPage
      supplierId={supplier._id}
      defaultValues={{
        name: supplier.name,
        mobile: supplier.mobile,
        email: supplier.email,
        address: supplier.address,
        city: supplier.city,
        state: supplier.state,
        pinCode: supplier.pinCode,
        gstNo: supplier.gstNo,
        openingBalance: supplier.openingBalance,
        type: supplier.type,
        isActive: supplier.isActive,
      }}
    />
  );
}
