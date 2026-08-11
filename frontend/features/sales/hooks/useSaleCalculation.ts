"use client";

import { useMemo } from "react";

import { useSaleStore } from "../store/useSaleStore";

export function useSaleCalculation() {
  const items = useSaleStore((s) => s.items);
  const paidAmount = useSaleStore((s) => s.paidAmount);

  return useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);

    const discount = items.reduce((sum, item) => sum + item.discount, 0);

    const grandTotal = subtotal - discount;

    const dueAmount = Math.max(0, grandTotal - paidAmount);

    const changeAmount = Math.max(0, paidAmount - grandTotal);

    const paidStatus =
      dueAmount === 0 ? "PAID" : paidAmount === 0 ? "DUE" : "PARTIAL";

    return {
      totalItems,
      subtotal,
      discount,
      grandTotal,
      dueAmount,
      changeAmount,
      paidAmount,
      paidStatus,
    };
  }, [items, paidAmount]);
}
