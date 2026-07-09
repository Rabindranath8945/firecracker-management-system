"use client";

import { FormProvider } from "react-hook-form";
import { useProductForm } from "../../hooks/useProductForm";
import { toast } from "sonner";
import ProductInformationCard from "./ProductInformationCard";
import ProductPricingCard from "./ProductPricingCard";
import ProductInventoryCard from "./ProductInventoryCard";
import ProductAdditionalCard from "./ProductAdditionalCard";
import ProductSaveBar from "./ProductSaveBar";
import { useCreateProduct } from "../../hooks/useCreateProduct";

export default function ProductForm() {
  const methods = useProductForm();
  const { createProduct } = useCreateProduct();

  const onSubmit = methods.handleSubmit(createProduct);

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="space-y-5 pb-24">
        <ProductInformationCard />
        <ProductPricingCard />
        <ProductInventoryCard />
        <ProductAdditionalCard />
        <ProductSaveBar />
      </form>
    </FormProvider>
  );
}
