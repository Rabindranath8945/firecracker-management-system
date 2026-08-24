import { useQuery } from "@tanstack/react-query";

import { purchaseApi } from "../api/purchases.api";

export function usePurchase(id: string) {
  return useQuery({
    queryKey: ["purchase", id],

    queryFn: async () => {
      const response = await purchaseApi.getById(id);

      return response.data;
    },

    enabled: Boolean(id),
  });
}
