"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import ProductService from "../services/product.service";

import ProductForm from "../components/form/ProductForm";

import PageHeader from "../../../components/common/shared/header/PageHeader";
import ProductHeroSkeleton from "../components/details/ProductHeroSkeleton";

export default function EditProductPage() {
  const router = useRouter();

  const { id } = useParams<{ id: string }>();

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

  if (isError || !product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">Unable to load product.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 px-4 pt-4 pb-24">
      <PageHeader
        title="Edit Product"
        description="Update product information"
        backHref={`/products/${id}`}
      />

      <ProductForm
        mode="edit"
        product={product}
        onSuccess={() => router.push(`/products/${id}`)}
      />
    </div>
  );
}
