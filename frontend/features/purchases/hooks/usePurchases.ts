import { useQuery } from "@tanstack/react-query";
import { purchaseApi } from "../api/purchases.api";

export function usePurchases() {
  return useQuery({
    queryKey: ["purchases"],
    queryFn: async () => {
      const { data } = await purchaseApi.getAll();
      return data;
    },
  });
}
