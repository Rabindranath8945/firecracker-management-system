"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getProductDefaultValues } from "../../constants/productDefaults";
import { useProductForm } from "../../hooks/useProductForm";
import { useProductMutation } from "../../hooks/useProductMutation";
import { toFormValues } from "../../mapper/product.mapper";
import { Home, Package, Plus, ShoppingCart } from "lucide-react";
import { useCreateCategoryMutation } from "@/features/categories/category/hooks/useCreateCategoryMutation";

import ProductService from "../../services/product.service";
import ProductInformationCard from "./ProductInformationCard";
import ProductPricingCard from "./ProductPricingCard";
import ProductInventoryCard from "./ProductInventoryCard";
import ProductAdditionalCard from "./ProductAdditionalCard";
import ProductSaveBar from "./ProductSaveBar";
import { SuccessSheet } from "@/components/common/shared/sheets";
import type { Product } from "../../types/product.types";
import type { ProductFormData } from "../../schemas/product.schema";
import { AddCategoryDialog } from "@/components/common/searchable-select";

interface ProductFormProps {
  mode?: "create" | "edit";
  product?: Product;
  onSuccess?: () => void;
}

const REQUIRED_FIELD_LABELS: Record<keyof ProductFormData, string> = {
  name: "Product Name",
  productCode: "Product Code",
  image: "",
  barcode: "Barcode",
  category: "Category",
  subCategory: "Sub Category",
  purchasePrice: "Purchase Price",
  sellingPrice: "Selling Price",
  stock: "Opening Stock",
  minimumStock: "Minimum Stock",
  unit: "Unit",
  hsnCode: "HSN",
  tax: "GST",
  brand: "Brand",
  description: "Description",
  isActive: "Status",
};

const REQUIRED_FIELDS: (keyof ProductFormData)[] = [
  "productCode",
  "name",
  "category",
  "purchasePrice",
  "sellingPrice",
  "stock",
  "minimumStock",
  "unit",
];

export default function ProductForm({
  mode = "create",
  product,
  onSuccess,
}: ProductFormProps) {
  const methods = useProductForm();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: nextProductCode } = useQuery({
    queryKey: ["next-product-code"],
    queryFn: ProductService.getNextProductCode,
    enabled: mode === "create",
  });

  const [successOpen, setSuccessOpen] = useState(false);

  const [savedProduct, setSavedProduct] = useState<{
    name: string;
    productCode: string;
  } | null>(null);

  const { saveProduct } = useProductMutation({
    mode,
    product,

    onSuccess: (savedProduct) => {
      setSavedProduct(savedProduct);

      setSuccessOpen(true);
    },

    onUpdated: () => {
      onSuccess?.();
    },
  });

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  const [subCategoryDialogOpen, setSubCategoryDialogOpen] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                                 Mutations                                  */
  /* -------------------------------------------------------------------------- */

  const createCategoryMutation = useCreateCategoryMutation();

  useEffect(() => {
    if (mode === "edit" && product) {
      methods.reset(toFormValues(product));
      return;
    }

    methods.reset({
      ...getProductDefaultValues(),
      productCode: nextProductCode ?? "",
    });
  }, [mode, product, nextProductCode, methods]);

  const onInvalid = (
    errors: Partial<Record<keyof ProductFormData, unknown>>,
  ) => {
    const missingFields = REQUIRED_FIELDS.filter((field) => errors[field]);

    if (missingFields.length === 0) {
      return;
    }

    toast.error(
      <>
        <div className="font-semibold">Please complete the required fields</div>

        <div className="mt-2 text-sm">
          {missingFields.map((field) => (
            <div key={field}>• {REQUIRED_FIELD_LABELS[field]}</div>
          ))}
        </div>
      </>,
    );

    const firstField = missingFields[0];

    if (!firstField) {
      return;
    }

    methods.setFocus(firstField);

    document.querySelector(`[name="${firstField}"]`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  useEffect(() => {
    const subscription = methods.watch((values) => {
      console.log(values);
    });

    return () => subscription.unsubscribe();
  }, [methods]);

  const onSubmit = methods.handleSubmit(saveProduct, onInvalid);

  async function resetForm() {
    const nextCode = await queryClient.fetchQuery({
      queryKey: ["next-product-code"],
      queryFn: ProductService.getNextProductCode,
    });

    methods.reset({
      ...getProductDefaultValues(),
      productCode: nextCode,
    });

    setSavedProduct(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    requestAnimationFrame(() => {
      methods.setFocus("name");
    });
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="space-y-5 pb-24">
        <ProductInformationCard
          onOpenCategoryDialog={() => setCategoryDialogOpen(true)}
          onOpenSubCategoryDialog={() => setSubCategoryDialogOpen(true)}
        />

        <ProductPricingCard />

        <ProductInventoryCard />

        <ProductAdditionalCard />

        <ProductSaveBar mode={mode} />

        {mode === "create" && (
          <SuccessSheet
            open={successOpen}
            onOpenChange={(open) => {
              setSuccessOpen(open);

              if (!open) {
                router.replace("/products");
              }
            }}
            title="Product Created Successfully"
            description="Your product has been added and is now ready to use."
            summary={[
              {
                label: "Product Name",
                value: savedProduct?.name ?? "-",
              },
              {
                label: "Product Code",
                value: savedProduct?.productCode ?? "-",
              },
              {
                label: "Status",
                value: "Active",
              },
              {
                label: "Created",
                value: "Just Now",
              },
            ]}
            status={[
              {
                label: "Product saved successfully.",
                value: "Completed",
              },
              {
                label: "Ready for Purchases.",
                value: "Yes",
              },
              {
                label: "Ready for Sales.",
                value: "Yes",
              },
              {
                label: "Inventory",
                value: "Updated",
              },
            ]}
            primaryAction={{
              label: "Add Another Product",
              icon: <Plus className="h-5 w-5" />,
              onClick: async () => {
                setSuccessOpen(false);
                await resetForm();
              },
            }}
            secondaryActions={[
              {
                label: "Products",
                icon: <Package className="h-4 w-4" />,
                onClick: () => router.push("/products"),
              },
              {
                label: "Purchase",
                icon: <ShoppingCart className="h-4 w-4" />,
                onClick: () => router.push("/purchases/new"),
              },
              {
                label: "Dashboard",
                icon: <Home className="h-4 w-4" />,
                variant: "ghost",
                onClick: () => router.push("/dashboard"),
              },
            ]}
          />
        )}
      </form>
      {/* Add Category Dialog */}

      <AddCategoryDialog
        open={categoryDialogOpen}
        loading={createCategoryMutation.isPending}
        onOpenChange={setCategoryDialogOpen}
        onSubmit={async (name) => {
          await createCategoryMutation.mutateAsync({
            name,
          });

          await queryClient.invalidateQueries({
            queryKey: ["categories"],
          });

          setCategoryDialogOpen(false);
        }}
      />

      {/* Add Sub Category Dialog */}
    </FormProvider>
  );
}
