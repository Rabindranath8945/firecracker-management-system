"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProductFormHeader() {
  const router = useRouter();

  return (
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
        <h1 className="text-2xl font-bold tracking-tight">Add Product</h1>

        <p className="text-sm text-muted-foreground">
          Create a new inventory item
        </p>
      </div>
    </div>
  );
}
