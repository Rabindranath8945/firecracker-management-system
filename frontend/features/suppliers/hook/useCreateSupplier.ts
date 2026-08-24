"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supplierApi } from "../api/suppliers.api";
import type { Supplier } from "../types/supplier.type";

interface QuickSupplierData {
  businessName: string;
  contactPerson?: string | undefined;
  mobile: string;
}
export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation<Supplier, Error, QuickSupplierData>({
    mutationFn: async (data) => {
      const payload = {
        name: data.businessName.trim(),
        mobile: data.mobile.trim(),
        openingBalance: 0,
        type: "SUPPLIER" as const,
        isActive: true,
      };

      const response = await supplierApi.create(payload);

      return response.data.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
  });
}
