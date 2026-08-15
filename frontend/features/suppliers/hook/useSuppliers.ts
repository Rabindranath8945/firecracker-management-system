import { useQuery } from "@tanstack/react-query";

import { supplierApi } from "../api/suppliers.api";

export function useSuppliers() {
  return useQuery({
    queryKey: ["suppliers"],

    queryFn: async () => {
      const response = await supplierApi.getAll({
        page: 1,
        limit: 100,
        sort: "name",
        order: "asc",
        isActive: true,
      });

      return response.data.data.items;
    },
  });
}
