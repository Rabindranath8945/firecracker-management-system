"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import PurchaseForm from "../components/PurchaseForm";

export default function NewPurchasePage() {
  const router = useRouter();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-4 md:p-6">
      <header className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-5" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold">New Purchase</h1>

          <p className="text-muted-foreground">
            Add inventory to your business
          </p>
        </div>
      </header>

      <PurchaseForm />
    </main>
  );
}
