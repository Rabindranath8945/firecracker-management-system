"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import SaleHeader from "../components/header/SaleHeader";
import ProductSearch from "../components/search/ProductSearch";
import QuickShortcut from "../components/search/QuickShortcut";
import CategoryTabs from "../components/category/CategoryTabs";
import SubCategoryTabs from "../components/category/SubCategoryTabs";
import ProductGrid from "../components/products/ProductGrid";
import MiniCartBar from "../components/cart/MiniCartBar";

import { useProducts } from "@/features/products/hooks/useProducts";
import { useCategories } from "@/features/categories/category/hooks/useCategories";
import { useSubCategories } from "@/features/categories/sub-category/hooks/useSubCategories";

import { useSaleStore } from "../store/useSaleStore";

export default function NewSalePage() {
  const router = useRouter();

  /* -------------------------------------------------------------------------- */
  /* State                                                                      */
  /* -------------------------------------------------------------------------- */

  const [search, setSearch] = useState("");
  const [shortcut, setShortcut] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  /* -------------------------------------------------------------------------- */
  /* Products                                                                    */
  /* -------------------------------------------------------------------------- */

  const { products, isLoading: productLoading } = useProducts({
    search,
    category: categoryId,
    subCategory: subCategoryId,
  });

  /* -------------------------------------------------------------------------- */
  /* Categories                                                                  */
  /* -------------------------------------------------------------------------- */

  const { data: categories = [], isLoading: categoryLoading } = useCategories();

  /* -------------------------------------------------------------------------- */
  /* Sub Categories                                                              */
  /* -------------------------------------------------------------------------- */

  const { data: subCategories = [], isLoading: subCategoryLoading } =
    useSubCategories(categoryId);

  /* -------------------------------------------------------------------------- */
  /* Cart                                                                        */
  /* -------------------------------------------------------------------------- */

  const totalItems = useSaleStore((state) => state.totalItems);
  const grandTotal = useSaleStore((state) => state.grandTotal);
  const addItem = useSaleStore((state) => state.addItem);

  /* -------------------------------------------------------------------------- */

  return (
    <main className="space-y-5 px-4 py-5 pb-32">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <SaleHeader />

      <ProductSearch value={search} onChange={setSearch} onScan={() => {}} />

      <QuickShortcut value={shortcut} onChange={setShortcut} />

      <CategoryTabs
        categories={categories.map((item) => ({
          id: item._id,
          name: item.name,
        }))}
        value={categoryId}
        loading={categoryLoading}
        onChange={(id) => {
          setCategoryId(id);
          setSubCategoryId("");
        }}
      />

      <SubCategoryTabs
        categoryId={categoryId}
        subCategories={subCategories.map((item) => ({
          id: item._id,
          name: item.name,
        }))}
        value={subCategoryId}
        loading={subCategoryLoading}
        onChange={setSubCategoryId}
      />

      <ProductGrid
        products={products}
        loading={productLoading}
        onAdd={addItem}
      />

      <MiniCartBar
        totalItems={totalItems}
        totalAmount={grandTotal}
        onCheckout={() => router.push("/sales/review")}
      />
    </main>
  );
}
