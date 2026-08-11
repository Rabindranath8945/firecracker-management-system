"use client";

import { create } from "zustand";

import type { Product } from "@/features/products/types/product.types";
import type { PaymentMethod, SaleCustomer } from "../types/Sales.types";

/* -------------------------------------------------------------------------- */
/* Cart Types                                                                 */
/* -------------------------------------------------------------------------- */

export interface SaleCartItem {
  productId: string;
  productCode: string;
  productName: string;

  categoryName: string;
  subCategoryName: string;

  stock: number;
  tax: number;

  quantity: number;
  price: number;

  discount: number;
  total: number;
}

/* -------------------------------------------------------------------------- */
/* Store Summary                                                              */
/* -------------------------------------------------------------------------- */

interface SaleSummary {
  totalItems: number;
  subTotal: number;
  discount: number;
  taxAmount: number;
  grandTotal: number;
  dueAmount: number;
}

/* -------------------------------------------------------------------------- */
/* Store Type                                                                 */
/* -------------------------------------------------------------------------- */

interface SaleStore {
  /* ---------------------------------------------------------------------- */
  /* Customer                                                               */
  /* ---------------------------------------------------------------------- */

  selectedCustomer: SaleCustomer | null;

  setSelectedCustomer: (customer: SaleCustomer | null) => void;

  /* ---------------------------------------------------------------------- */
  /* Previous Due                                                           */
  /* ---------------------------------------------------------------------- */

  previousDue: number;

  collectPreviousDue: boolean;

  setPreviousDue: (amount: number) => void;

  setCollectPreviousDue: (value: boolean) => void;

  /* ---------------------------------------------------------------------- */
  /* Calculator                                                             */
  /* ---------------------------------------------------------------------- */

  quantity: number;

  setQuantity: (qty: number) => void;

  resetQuantity: () => void;

  /* ---------------------------------------------------------------------- */
  /* Cart                                                                   */
  /* ---------------------------------------------------------------------- */

  items: SaleCartItem[];

  totalItems: number;

  subTotal: number;

  discount: number;

  setDiscount: (discount: number) => void;

  taxAmount: number;

  grandTotal: number;

  dueAmount: number;

  addItem: (product: Product, quantity: number) => void;

  updateQuantity: (productId: string, quantity: number) => void;

  removeItem: (productId: string) => void;

  clearCart: () => void;

  /* ---------------------------------------------------------------------- */
  /* Payment                                                                */
  /* ---------------------------------------------------------------------- */

  paymentMethod: PaymentMethod;

  paidAmount: number;

  setPaymentMethod: (method: PaymentMethod) => void;

  setPaidAmount: (amount: number) => void;

  /* ---------------------------------------------------------------------- */
  /* Notes                                                                  */
  /* ---------------------------------------------------------------------- */

  notes: string;

  setNotes: (notes: string) => void;
}

/* -------------------------------------------------------------------------- */
/* Summary Calculator                                                         */
/* -------------------------------------------------------------------------- */

function calculateSummary(
  items: SaleCartItem[],
  invoiceDiscount: number,
  paidAmount: number,
): SaleSummary {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subTotal = items.reduce((sum, item) => sum + item.total, 0);

  const itemDiscount = items.reduce((sum, item) => sum + item.discount, 0);

  const safeInvoiceDiscount = Math.max(0, invoiceDiscount);

  const discount = Math.min(subTotal, itemDiscount + safeInvoiceDiscount);

  const taxAmount = items.reduce((sum, item) => {
    const taxableAmount = Math.max(0, item.total - item.discount);

    return sum + (taxableAmount * item.tax) / 100;
  }, 0);

  const grandTotal = Math.max(0, subTotal - discount + taxAmount);

  const dueAmount = Math.max(0, grandTotal - paidAmount);

  return {
    totalItems,
    subTotal,
    discount,
    taxAmount,
    grandTotal,
    dueAmount,
  };
}

/* -------------------------------------------------------------------------- */
/* Store                                                                      */
/* -------------------------------------------------------------------------- */

export const useSaleStore = create<SaleStore>((set) => ({
  /* ---------------------------------------------------------------------- */
  /* Customer                                                               */
  /* ---------------------------------------------------------------------- */

  selectedCustomer: null,

  setSelectedCustomer: (customer) =>
    set({
      selectedCustomer: customer,

      /*
       * Always take the latest outstanding balance
       * from the selected customer.
       */
      previousDue: Math.max(0, customer?.dueAmount ?? 0),

      /*
       * IMPORTANT:
       * Previous due must NEVER be automatically collected.
       *
       * User must explicitly enable the switch.
       */
      collectPreviousDue: false,
    }),

  /* ---------------------------------------------------------------------- */
  /* Previous Due                                                           */
  /* ---------------------------------------------------------------------- */

  previousDue: 0,

  collectPreviousDue: false,

  setPreviousDue: (amount) =>
    set({
      previousDue: Math.max(0, amount),
    }),

  setCollectPreviousDue: (value) =>
    set({
      collectPreviousDue: value,
    }),

  /* ---------------------------------------------------------------------- */
  /* Calculator                                                             */
  /* ---------------------------------------------------------------------- */

  quantity: 1,

  setQuantity: (qty) =>
    set({
      quantity: Math.max(1, qty),
    }),

  resetQuantity: () =>
    set({
      quantity: 1,
    }),

  /* ---------------------------------------------------------------------- */
  /* Cart                                                                   */
  /* ---------------------------------------------------------------------- */

  items: [],

  totalItems: 0,

  subTotal: 0,

  discount: 0,

  setDiscount: (discount) =>
    set((state) => {
      const safeDiscount = Math.min(Math.max(0, discount), state.subTotal);

      return calculateSummary(state.items, safeDiscount, state.paidAmount);
    }),

  taxAmount: 0,

  grandTotal: 0,

  dueAmount: 0,

  /* ---------------------------------------------------------------------- */
  /* Add Item                                                               */
  /* ---------------------------------------------------------------------- */

  addItem: (product, quantity) =>
    set((state) => {
      const safeQuantity = Math.max(1, quantity);

      const existing = state.items.find(
        (item) => item.productId === product._id,
      );

      let items: SaleCartItem[];

      if (existing) {
        items = state.items.map((item) => {
          if (item.productId !== product._id) {
            return item;
          }

          const newQuantity = item.quantity + safeQuantity;

          return {
            ...item,

            quantity: newQuantity,

            total: newQuantity * item.price - item.discount,
          };
        });
      } else {
        const categoryName = product.category?.name ?? "Uncategorized";

        const subCategoryName = product.subCategory?.name ?? "-";

        items = [
          ...state.items,
          {
            productId: product._id,

            productCode: product.productCode,

            productName: product.name,

            categoryName,

            subCategoryName,

            stock: product.stock,

            tax: product.tax,

            quantity: safeQuantity,

            price: product.sellingPrice,

            discount: 0,

            total: safeQuantity * product.sellingPrice,
          },
        ];
      }

      return {
        items,

        ...calculateSummary(items, state.discount, state.paidAmount),
      };
    }),

  /* ---------------------------------------------------------------------- */
  /* Update Quantity                                                        */
  /* ---------------------------------------------------------------------- */

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const items = state.items.map((item) => {
        if (item.productId !== productId) {
          return item;
        }

        const qty = Math.max(1, quantity);

        return {
          ...item,

          quantity: qty,

          total: qty * item.price - item.discount,
        };
      });

      return {
        items,

        ...calculateSummary(items, state.discount, state.paidAmount),
      };
    }),

  /* ---------------------------------------------------------------------- */
  /* Remove Item                                                            */
  /* ---------------------------------------------------------------------- */

  removeItem: (productId) =>
    set((state) => {
      const items = state.items.filter((item) => item.productId !== productId);

      return {
        items,

        ...calculateSummary(items, state.discount, state.paidAmount),
      };
    }),

  /* ---------------------------------------------------------------------- */
  /* Clear Cart                                                             */
  /* ---------------------------------------------------------------------- */

  clearCart: () =>
    set({
      items: [],

      totalItems: 0,

      subTotal: 0,

      discount: 0,

      taxAmount: 0,

      grandTotal: 0,

      dueAmount: 0,

      paidAmount: 0,

      paymentMethod: "CASH",

      notes: "",

      selectedCustomer: null,

      previousDue: 0,

      /*
       * IMPORTANT:
       * New sale starts with Previous Due OFF.
       */
      collectPreviousDue: false,

      quantity: 1,
    }),

  /* ---------------------------------------------------------------------- */
  /* Payment                                                                */
  /* ---------------------------------------------------------------------- */

  paymentMethod: "CASH",

  paidAmount: 0,

  setPaymentMethod: (method) =>
    set({
      paymentMethod: method,
    }),

  setPaidAmount: (amount) =>
    set((state) => {
      const safeAmount = Math.max(0, amount);

      return {
        paidAmount: safeAmount,

        dueAmount: Math.max(0, state.grandTotal - safeAmount),
      };
    }),

  /* ---------------------------------------------------------------------- */
  /* Notes                                                                  */
  /* ---------------------------------------------------------------------- */

  notes: "",

  setNotes: (notes) =>
    set({
      notes,
    }),
}));
