"use client";

import { useQuery } from "@tanstack/react-query";

import CustomerService from "../services/customer.service";

interface UseCustomersParams {
  search?: string;
  status?: "ACTIVE" | "ALL" | "INACTIVE";
  sort?: string;
  page?: number;
  limit?: number;
}

export function useCustomers({
  search = "",
  status = "ACTIVE",
  sort = "NAME_ASC",
  page = 1,
  limit = 20,
}: UseCustomersParams = {}) {
  const query = useQuery({
    queryKey: ["customers", search, status, sort, page, limit],

    queryFn: () =>
      CustomerService.getCustomers({
        search,
        status,
        sort,
        page,
        limit,
      }),
  });

  return {
    customers: query.data?.items ?? [],

    loading: query.isLoading,

    isFetching: query.isFetching,

    total: query.data?.pagination.total ?? 0,

    pages: query.data?.pagination.totalPages ?? 1,

    error: query.error,

    refetch: query.refetch,
  };
}
