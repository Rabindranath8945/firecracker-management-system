"use client";

import { FileText } from "lucide-react";
import { useFormContext } from "react-hook-form";

import type { PurchaseForm } from "../schemas/purchase.schema";

export default function NotesCard() {
  const { register } = useFormContext<PurchaseForm>();

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-primary/10 p-3">
          <FileText className="size-6 text-primary" />
        </div>

        <div>
          <h2 className="text-lg font-semibold">Notes</h2>

          <p className="text-sm text-muted-foreground">
            Optional remarks for this purchase
          </p>
        </div>
      </div>

      <textarea
        rows={5}
        placeholder="Write notes..."
        {...register("notes")}
        className="w-full rounded-2xl border bg-background p-4 outline-none transition focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
