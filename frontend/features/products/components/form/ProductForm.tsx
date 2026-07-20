"use client";
import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { useProductForm } from "../../hooks/useProductForm";
import { toast } from "sonner";
import ProductInformationCard from "./ProductInformationCard";
import ProductPricingCard from "./ProductPricingCard";
import ProductInventoryCard from "./ProductInventoryCard";
import ProductAdditionalCard from "./ProductAdditionalCard";
import ProductSaveBar from "./ProductSaveBar";
import { useCreateProduct } from "../../hooks/useCreateProduct";
import ProductSuccessSheet from "../success/ProductSuccessSheet";
import type { ProductFormData } from "../../schemas/product.schema";
import { getProductDefaultValues } from "../../constants/productDefaults";

export default function ProductForm() {
  const [successOpen, setSuccessOpen] = useState(false);
  const [savedProduct, setSavedProduct] = useState<{
    name: string;
    sku: string;
  } | null>(null);
  const methods = useProductForm();
  const { createProduct } = useCreateProduct({
    onSuccess: (product) => {
      setSavedProduct(product);
      setSuccessOpen(true);
    },
  });

  const onSubmit = methods.handleSubmit(createProduct, (errors) => {
    const requiredFields: Record<keyof ProductFormData, string> = {
      name: "Product Name",
      sku: "SKU",
      barcode: "Barcode",
      category: "Category",
      purchasePrice: "Purchase Price",
      sellingPrice: "Selling Price",
      // mrp: "MRP",
      openingStock: "Opening Stock",
      minimumStock: "Minimum Stock",
      unit: "Unit",
      hsn: "HSN",
      gst: "GST",
      brand: "Brand",
      description: "Description",
      active: "Active",
    };

    const requiredOnly: (keyof ProductFormData)[] = [
      "name",
      "category",
      "purchasePrice",
      "sellingPrice",
      "openingStock",
      "minimumStock",
      "unit",
    ];

    const missingFields = requiredOnly.filter((field) => errors[field]);

    if (!missingFields.length) return;

    toast.error(
      <>
        <div className="font-semibold">Please complete the required fields</div>

        <div className="mt-2 text-sm">
          {missingFields.map((field) => (
            <div key={field}>• {requiredFields[field]}</div>
          ))}
        </div>
      </>,
    );

    if (missingFields.length === 0) return;

    const firstField = missingFields[0]!;

    methods.setFocus(firstField);

    document.querySelector(`[name="${firstField}"]`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="space-y-5 pb-24">
        <ProductInformationCard />
        <ProductPricingCard />
        <ProductInventoryCard />
        <ProductAdditionalCard />
        <ProductSaveBar />
        <ProductSuccessSheet
          open={successOpen}
          productName={savedProduct?.name ?? ""}
          sku={savedProduct?.sku ?? ""}
          onOpenChange={(open) => {
            setSuccessOpen(open);

            if (!open) {
              methods.reset(getProductDefaultValues());

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });

              requestAnimationFrame(() => {
                methods.setFocus("name");
              });
            }
          }}
          onAddAnother={() => {
            methods.reset(getProductDefaultValues());

            setSuccessOpen(false);

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });

            requestAnimationFrame(() => {
              methods.setFocus("name");
            });
          }}
        />
      </form>
    </FormProvider>
  );
}
