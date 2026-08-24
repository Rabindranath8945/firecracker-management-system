"use client";

import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import PurchaseForm from "../components/PurchaseForm";

export default function NewPurchasePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-5 pb-10 md:px-6 md:py-6">
        {/* Header */}
        <header className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="
              h-11
              w-11
              shrink-0
              rounded-2xl
              border-emerald-200
              bg-background
              shadow-sm
              transition-all
              hover:border-emerald-300
              hover:bg-emerald-50
              dark:border-emerald-800
              dark:hover:bg-emerald-500/10
            "
          >
            <ArrowLeft className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </Button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/15">
                <ShoppingBag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>

              <h1 className="truncate text-xl font-bold tracking-tight md:text-2xl">
                New Purchase
              </h1>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Add inventory to your business
            </p>
          </div>
        </header>

        {/* Purchase Form */}
        <section className="rounded-3xl border bg-background p-4 shadow-sm md:p-6">
          <PurchaseForm />
        </section>
      </div>
    </main>
  );
}
