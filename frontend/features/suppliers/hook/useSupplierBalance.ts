import { useQuery } from "@tanstack/react-query";

import { supplierApi } from "../api/suppliers.api";

export function useSupplierBalance(supplierId?: string) {
  return useQuery({
    queryKey: ["supplier-balance", supplierId],

    queryFn: async () => {
      if (!supplierId) {
        throw new Error("Supplier ID is required.");
      }

      const response = await supplierApi.getBalance(supplierId);

      return response.data.data;
    },

    enabled: Boolean(supplierId),
  });
}
