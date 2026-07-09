"use client";

import { useMemo, useState } from "react";

import ProductTopBar from "../components/header/ProductTopBar";
import ProductSearchBar from "../components/header/ProductSearchBar";
import ProductActionBar from "../components/header/ProductActionBar";
import ProductSummaryBar from "../components/header/ProductSummary";
import ProductList from "../components/list/ProductList";

import FilterSheet from "../components/filter/FilterSheet";
import CategorySheet from "../components/filter/CategorySheet";

import { products } from "../mock/products";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [sortBy, setSortBy] = useState("A-Z");
  const filteredProducts = useMemo(() => {
    let data = [...products];

    // Category

    if (category !== "All") {
      data = data.filter((item) => item.category === category);
    }

    // Search

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(keyword) ||
          item.sku.toLowerCase().includes(keyword) ||
          item.barcode.includes(keyword),
      );
    }

    // Stock

    switch (stockFilter) {
      case "In Stock":
        data = data.filter((item) => item.stock > item.minimumStock);
        break;

      case "Low Stock":
        data = data.filter(
          (item) => item.stock > 0 && item.stock <= item.minimumStock,
        );
        break;

      case "Out of Stock":
        data = data.filter((item) => item.stock === 0);
        break;
    }

    // Sort

    switch (sortBy) {
      case "A-Z":
        data.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "Z-A":
        data.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case "Price ↑":
        data.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;

      case "Price ↓":
        data.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;

      case "Stock ↑":
        data.sort((a, b) => a.stock - b.stock);
        break;

      case "Stock ↓":
        data.sort((a, b) => b.stock - a.stock);
        break;
    }

    return data;
  }, [search, category, stockFilter, sortBy]);

  return (
    <div className="space-y-5 px-4 pt-4 pb-24">
      <ProductTopBar />

      <ProductSearchBar value={search} onChange={setSearch} />

      <ProductActionBar
        onFilterClick={() => setFilterOpen(true)}
        onCategoryClick={() => setCategoryOpen(true)}
      />

      <ProductSummaryBar totalProducts={filteredProducts.length} />

      <ProductList products={filteredProducts} />

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
    </div>
  );
}
