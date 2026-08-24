"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { purchaseApi } from "../api/purchases.api";

import type { CreatePurchaseRequest } from "../types/purchase.types";

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
      void queryClient.invalidateQueries({
        queryKey: ["purchases"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["purchase", variables.id],
      });
    },
  });
}
