"use client";

import { useEffect, useMemo, useState } from "react";
import type { SearchCustomer } from "../components/customer/CustomerSearchResult";

const DUMMY_CUSTOMERS: SearchCustomer[] = [
  {
    id: "1",
    name: "Rahul Shaw",
    phone: "9876543210",
    due: 2450,
    lastVisit: "3 days ago",
  },
  {
    id: "2",
    name: "Rakesh Das",
    phone: "9832100000",
    due: 0,
    lastVisit: "Yesterday",
  },
  {
    id: "3",
    name: "Raj Kumar",
    phone: "9871111111",
    due: 540,
    lastVisit: "1 week ago",
  },
  {
    id: "4",
    name: "Rana Mondal",
    phone: "9000000000",
    due: 1200,
    lastVisit: "Today",
  },
];

export function useCustomerSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [customers, setCustomers] = useState<SearchCustomer[]>([]);

  useEffect(() => {
    if (query.trim().length < 1) {
      setCustomers([]);
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      const search = query.toLowerCase();

      const filtered = DUMMY_CUSTOMERS.filter(
        (customer) =>
          customer.name.toLowerCase().includes(search) ||
          customer.phone.includes(search),
      );

      setCustomers(filtered);

      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  return useMemo(
    () => ({
      query,
      setQuery,
      customers,
      loading,
    }),
    [query, customers, loading],
  );
}
