"use client";

import ProductFormHeader from "../components/form/ProductFormHeader";
import ProductForm from "../components/form/ProductForm";

export default function AddProductPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 pt-4 pb-24 space-y-5">
      <ProductFormHeader />

      <ProductForm />
    </div>
  );
}
