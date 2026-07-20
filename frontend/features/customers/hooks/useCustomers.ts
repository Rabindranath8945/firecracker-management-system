"use client";

import { useMemo, useState } from "react";

import { customers as mockCustomers } from "../data/customers";

export function useCustomers() {
  const [search, setSearch] = useState("");

  const customers = useMemo(() => {
    return mockCustomers.filter((customer) => {
      const keyword = search.toLowerCase();

      return (
        customer.name.toLowerCase().includes(keyword) ||
        customer.mobile.includes(keyword) ||
        customer.customerNo.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  const removeCustomer = (id: string) => {
    console.log("Delete Customer:", id);
  };

  const refresh = async () => {};

  return {
    customers,
    loading: false,

    total: customers.length,

    page: 1,
    pages: 1,

    search,

    setSearch,

    setPage: () => {},

    refresh,

    removeCustomer,
  };
}
