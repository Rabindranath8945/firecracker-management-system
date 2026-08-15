"use client";

import { useMutation } from "@tanstack/react-query";

import { purchaseApi } from "../api/purchases.api";

export function usePurchaseOCR() {
  return useMutation({
    mutationFn: (file: File) => purchaseApi.ocr(file),
  });
}
