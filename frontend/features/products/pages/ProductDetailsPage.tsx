"use client";

import { Pencil } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import ProductService from "../services/product.service";

import PageHeader from "../../../components/common/shared/header/PageHeader";
import ProductHeroCard from "../components/details/ProductHeroCard";
import ProductInfoCard from "../components/details/ProductInfoCard";
import ProductStockCard from "../components/details/ProductStockCard";
import ProductSummaryCard from "../components/details/ProductSummaryCard";
import ProductTimeline from "../components/details/ProductTimeline";
import ProductHeroSkeleton from "../components/details/ProductHeroSkeleton";

export default function ProductDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id") ?? "";

  function handleEdit() {
    if (!id) return;

    router.push(`/products/edit?id=${id}`);
  }

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => ProductService.getProduct(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-5 px-4 pt-4 pb-24">
        <ProductHeroSkeleton />
      </div>
    );
  }

  if (!id || isError || !product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">Unable to load product details.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-5 bg-slate-50 px-4 pt-4 pb-24">
      <PageHeader
        title="Product Details"
        description="View and manage product"
        backHref="/products"
        rightAction={
          <Button
            type="button"
            size="icon"
            onClick={handleEdit}
            className="h-10 w-10 rounded-xl"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        }
      />

      <ProductHeroCard product={product} />

      <ProductSummaryCard product={product} />

      <ProductInfoCard product={product} />

      <ProductStockCard product={product} />

      <ProductTimeline product={product} />
    </div>
  );
}
