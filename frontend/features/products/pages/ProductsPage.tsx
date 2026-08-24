"use client";

import { useState } from "react";
import { scanBarcode } from "@/lib/barcode";
import { useProducts } from "../hooks/useProducts";
import { useProductFilters } from "../hooks/useProductFilters";
import { useDeleteProduct } from "../hooks/useDeleteProduct";

import FloatingActionButton from "@/components/common/shared/button/FloatingActionButton";
import ProductHeader from "../components/header/ProductHeader";
import ProductSearchBar from "../components/header/ProductSearchBar";
import ProductQuickActions from "../components/header/ProductQuickActions";
import ProductStats from "../components/header/ProductStats";
import ProductList from "../components/list/ProductList";
import DeleteConfirmDialog from "@/components/common/shared/dialogs/DeleteConfirmDialog";

import type { Product } from "../types/product.types";
import FilterSheet from "../components/filter/FilterSheet";
import CategorySheet from "../components/filter/CategorySheet";
import PageContainer from "@/features/shared/ui/layout/PageContainer";

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    try {
      setIsScanning(true);

      const barcode = await scanBarcode();

      if (barcode) {
        setSearch(barcode);
      }
    } finally {
      setIsScanning(false);
    }
  };

  function handleDelete(product: Product) {
    setSelectedProduct(product);
    setDeleteOpen(true);
  }

  function handleConfirmDelete() {
    if (!selectedProduct) return;

    deleteProduct(selectedProduct._id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedProduct(null);
      },
    });
  }

  const {
    search,
    setSearch,

    category,
    setCategory,

    stockFilter,
    setStockFilter,

    sortBy,
    setSortBy,
  } = useProductFilters();

  const { products, stats, isLoading } = useProducts({
    search,
    category,
    stockFilter,
    sortBy,
  });

  const [filterOpen, setFilterOpen] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);

  return (
    <>
      <PageContainer className="space-y-6 px-4 pt-8 pb-28">
        <ProductHeader totalProducts={stats.total} />

        <ProductSearchBar
          value={search}
          onChange={setSearch}
          onScan={handleScan}
          scanning={isScanning}
        />

        <ProductQuickActions
          onFilterClick={() => setFilterOpen(true)}
          onCategoryClick={() => setCategoryOpen(true)}
        />

        <ProductStats stats={stats} />

        <ProductList
          loading={isLoading}
          products={products}
          onDelete={handleDelete}
        />
      </PageContainer>

      <FilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        stockFilter={stockFilter}
        onStockFilterChange={setStockFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <CategorySheet
        open={categoryOpen}
        onOpenChange={setCategoryOpen}
        value={category}
        onSelect={setCategory}
      />

      <FloatingActionButton href="/products/new" label="Add Product" />
      <DeleteConfirmDialog
        open={deleteOpen}
        loading={isPending}
        title="Delete Product"
        description={
          selectedProduct
            ? `Are you sure you want to delete "${selectedProduct.name}"? This action can be restored only by reactivating the product.`
            : ""
        }
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
