"use client";

import { ArrowLeft, Pencil } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface ProductDetailsHeaderProps {
  showEditButton?: boolean;
}
export default function ProductDetailsHeader({
  showEditButton = true,
}: ProductDetailsHeaderProps) {
  const router = useRouter();

  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-10 w-10 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-xl font-bold text-slate-900">Product Details</h1>

          <p className="text-sm text-slate-500">View and manage product</p>
        </div>
      </div>

      {showEditButton && (
        <Button
          size="icon"
          onClick={() => router.push(`/products/edit?id=${id}`)}
          className="h-12 w-12 rounded-2xl"
        >
          <Pencil className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
