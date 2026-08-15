"use client";

import { FileText } from "lucide-react";
import { useFormContext } from "react-hook-form";

import type { PurchaseForm } from "../schemas/purchase.schema";

export default function NotesCard() {
  const { register } = useFormContext<PurchaseForm>();

  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-card shadow-sm dark:border-emerald-500/20">
      {/* Header */}

      <div className="flex items-center gap-3 border-b border-emerald-100 bg-emerald-50/50 px-5 py-4 dark:border-emerald-500/10 dark:bg-emerald-500/5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/15">
          <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>

        <div>
          <h2 className="text-base font-bold">Notes</h2>

          <p className="text-[11px] text-muted-foreground">
            Optional remarks for this purchase
          </p>
        </div>
      </div>

      {/* Notes */}

      <div className="p-5">
        <textarea
          rows={4}
          placeholder="Add purchase notes, supplier remarks, payment details..."
          {...register("notes")}
          className="
            w-full
            resize-none
            rounded-2xl
            border
            bg-background
            px-4
            py-3
            text-sm
            outline-none
            transition
            placeholder:text-muted-foreground
            focus:border-emerald-500
            focus:ring-2
            focus:ring-emerald-500/20
            dark:border-border
          "
        />

        <p className="mt-2 text-[10px] text-muted-foreground">
          Keep this optional. You can add invoice or supplier-specific remarks
          here.
        </p>
      </div>
    </section>
  );
}
