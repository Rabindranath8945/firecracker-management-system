import { useQuery } from "@tanstack/react-query";

import { purchaseApi } from "../api/purchases.api";

import type { PurchaseQueryParams } from "../types/purchase.types";

export function usePurchases(params: PurchaseQueryParams = {}) {
  return useQuery({
    queryKey: ["purchases", params],

    queryFn: async () => {
      const response = await purchaseApi.getAll(params);

      return response.data;
    },
  });
}
