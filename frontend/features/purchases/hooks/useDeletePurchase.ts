import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseApi } from "../api/purchases.api";

export function useDeletePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => purchaseApi.remove(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchases"],
      });
    },
  });
}
