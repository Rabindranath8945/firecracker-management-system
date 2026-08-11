"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import CustomerService from "../services/customer.service";

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId: string) =>
      CustomerService.deleteCustomer(customerId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });
}
