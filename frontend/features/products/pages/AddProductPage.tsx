"use client";

import ProductFormHeader from "../components/form/ProductFormHeader";
import ProductForm from "../components/form/ProductForm";
import PageHeader from "../../../components/common/shared/header/PageHeader";

export default function AddProductPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 pt-4 pb-24 space-y-5">
      <PageHeader
        title="Add Product"
        description="Create a new product"
        backHref="/products"
      />

      <ProductForm />
    </div>
  );
}
