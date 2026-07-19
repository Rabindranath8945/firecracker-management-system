"use client";

import { Loader2, ScanText } from "lucide-react";

interface Props {
  open: boolean;
}

export default function InvoiceProcessingDialog({ open }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[340px] rounded-3xl bg-card p-8 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <ScanText className="size-10 text-primary" />
        </div>

        <Loader2 className="mx-auto mb-5 size-8 animate-spin text-primary" />

        <h2 className="text-xl font-bold">AI Processing Invoice</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Reading supplier invoice...
        </p>

        <div className="mt-6 space-y-3">
          <Status text="Detecting Supplier" />
          <Status text="Reading Products" />
          <Status text="Calculating GST" />
          <Status text="Matching Database" />
        </div>
      </div>
    </div>
  );
}

function Status({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
      <Loader2 className="size-4 animate-spin text-primary" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
