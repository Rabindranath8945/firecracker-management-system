import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseApi, CreatePurchaseRequest } from "../api/purchases.api";

export function useCreatePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePurchaseRequest) => purchaseApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchases"],
      });
    },
  });
}
