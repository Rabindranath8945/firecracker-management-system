"use client";

import {
  Camera,
  CheckCircle2,
  FileImage,
  ImagePlus,
  ScanText,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface InvoiceImportCardProps {
  onCamera: () => void;
  onGallery: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const FEATURES = [
  "Supplier Name",
  "Invoice Number",
  "Products",
  "Quantity",
  "Purchase Price",
  "GST & Tax",
];

export default function InvoiceImportCard({
  onCamera,
  onGallery,
  disabled = false,
  loading = false,
}: InvoiceImportCardProps) {
  const isDisabled = disabled || loading;

  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-card shadow-sm dark:border-emerald-500/20">
      {/* Header */}

      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-5 text-white">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

        <div className="pointer-events-none absolute -bottom-16 left-1/2 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-inner backdrop-blur-md">
            <ScanText className="h-7 w-7" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">AI Invoice Scanner</h2>

              <Sparkles className="h-4 w-4 text-emerald-100" />
            </div>

            <p className="mt-1 text-xs text-white/80">
              Import supplier invoices using OCR
            </p>
          </div>
        </div>
      </div>

      {/* Body */}

      <div className="space-y-5 p-5">
        {/* Detection information */}

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-500/10 dark:bg-emerald-500/5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/15">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div>
              <h3 className="text-sm font-semibold">Automatically detect</h3>

              <p className="text-[11px] text-muted-foreground">
                Review detected information before saving.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {FEATURES.map((feature) => (
              <div key={feature} className="flex min-w-0 items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />

                <span className="truncate text-xs font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            disabled={isDisabled}
            onClick={onCamera}
            className="h-14 rounded-2xl bg-emerald-600 font-semibold shadow-sm hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            <Camera className="mr-2 h-5 w-5" />

            {loading ? "Scanning..." : "Scan Invoice"}
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={isDisabled}
            onClick={onGallery}
            className="h-14 rounded-2xl border-emerald-200 bg-background font-semibold hover:border-emerald-400 hover:bg-emerald-50 dark:border-emerald-500/20 dark:hover:bg-emerald-500/10"
          >
            <ImagePlus className="mr-2 h-5 w-5 text-emerald-600" />
            Gallery
          </Button>
        </div>

        {/* Supported formats */}

        <div className="flex items-center justify-center gap-2">
          <FileImage className="h-3.5 w-3.5 text-muted-foreground" />

          <p className="text-[11px] text-muted-foreground">
            JPG, PNG and WEBP supported
          </p>
        </div>

        {/* Safety note */}

        <div className="rounded-2xl bg-muted/40 px-4 py-3 text-center">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            AI will help fill the purchase form. Always verify prices,
            quantities and GST before saving.
          </p>
        </div>
      </div>
    </section>
  );
}
