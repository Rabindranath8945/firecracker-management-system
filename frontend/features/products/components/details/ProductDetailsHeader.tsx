"use client";

import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProductDetailsHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold">Product</h1>

          <p className="text-sm text-muted-foreground">Product Details</p>
        </div>
      </div>

      <Button size="icon" className="rounded-xl">
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}
