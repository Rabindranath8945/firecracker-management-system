"use client";

import { Camera, ScanBarcode, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onCameraClick?: () => void;
  onBarcodeClick?: () => void;
}

export default function NewPurchaseSearch({
  value,
  onChange,
  onCameraClick,
  onBarcodeClick,
}: Props) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Purchase Items</h2>

        <p className="text-sm text-muted-foreground">
          Search or scan products to add into this purchase
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search product, SKU or barcode..."
          className="h-14 rounded-2xl pl-12 text-base"
        />
      </div>

      {/* Actions */}
      {/* <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-14 justify-start rounded-2xl"
          onClick={onCameraClick}
        >
          <Camera className="mr-3 size-5" />
          Scan Invoice
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-14 justify-start rounded-2xl"
          onClick={onBarcodeClick}
        >
          <ScanBarcode className="mr-3 size-5" />
          Scan Barcode
        </Button>
      </div> */}
    </section>
  );
}
