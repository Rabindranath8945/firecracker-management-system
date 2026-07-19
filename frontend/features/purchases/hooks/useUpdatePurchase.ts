import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseApi, CreatePurchaseRequest } from "../api/purchases.api";

interface UpdatePurchasePayload {
  id: string;
  data: CreatePurchaseRequest;
}

export function useUpdatePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdatePurchasePayload) =>
      purchaseApi.update(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["purchases"],
      });

      queryClient.invalidateQueries({
        queryKey: ["purchase", variables.id],
      });
    },
  });
}
