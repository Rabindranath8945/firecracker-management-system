"use client";

import { useState } from "react";

export function useProductFilters() {
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("ALL");

  const [stockFilter, setStockFilter] = useState("All");

  const [sortBy, setSortBy] = useState("A-Z");

  return {
    search,
    setSearch,

    category,
    setCategory,

    stockFilter,
    setStockFilter,

    sortBy,
    setSortBy,
  };
}
