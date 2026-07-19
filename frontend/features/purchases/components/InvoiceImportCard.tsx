"use client";

import {
  Camera,
  ImagePlus,
  ScanText,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  onCamera?: () => void;
  onGallery?: () => void;
}

export default function InvoiceImportCard({ onCamera, onGallery }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-5 text-white">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
            <ScanText className="size-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold">AI Invoice Scanner</h2>

            <p className="text-sm text-white/80">
              Scan supplier invoices with AI OCR
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-5 p-5">
        <div className="rounded-2xl bg-muted/40 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />

            <h3 className="font-semibold">AI will automatically detect</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Feature text="Supplier Name" />
            <Feature text="Invoice Number" />
            <Feature text="Products" />
            <Feature text="Quantity" />
            <Feature text="Purchase Price" />
            <Feature text="GST & Tax" />
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button type="button" className="h-14 rounded-2xl" onClick={onCamera}>
            <Camera className="mr-2 size-5" />
            Scan Invoice
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-14 rounded-2xl"
            onClick={onGallery}
          >
            <ImagePlus className="mr-2 size-5" />
            Gallery
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          JPG, PNG & PDF supported
        </p>
      </div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="size-4 text-green-600" />

      <span>{text}</span>
    </div>
  );
}
