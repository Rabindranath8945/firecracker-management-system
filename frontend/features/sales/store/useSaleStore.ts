"use client";

import { create } from "zustand";

/* -------------------------------------------------------------------------- */
/* Types */
/* -------------------------------------------------------------------------- */

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

export interface SaleCustomer {
  id: string;
  name: string;
  phone: string;
  due: number;
  lastVisit: string;
  walkIn?: boolean;
}

export type PaymentMethod = "CASH" | "UPI" | "MIXED" | "CREDIT";

/* -------------------------------------------------------------------------- */
/* Store */
/* -------------------------------------------------------------------------- */

interface SaleStore {
  /* Customer */

  selectedCustomer: SaleCustomer;

  setSelectedCustomer: (customer: SaleCustomer) => void;

  /* Calculator */

  quantity: number;

  setQuantity: (qty: number) => void;

  resetQuantity: () => void;

  /* Cart */

  items: SaleItem[];

  addItem: (item: SaleItem) => void;

  updateQuantity: (productId: string, quantity: number) => void;

  removeItem: (productId: string) => void;

  clearCart: () => void;

  /* Payment */

  paymentMethod: PaymentMethod;

  paidAmount: number;

  setPaymentMethod: (method: PaymentMethod) => void;

  setPaidAmount: (amount: number) => void;

  /* Notes */

  notes: string;

  setNotes: (notes: string) => void;
}

export const useSaleStore = create<SaleStore>((set) => ({
  /* ---------------------------------------------------------------------- */
  /* Customer */
  /* ---------------------------------------------------------------------- */

  selectedCustomer: {
    id: "walk-in",
    name: "Walk-in Customer",
    phone: "Cash Sale",
    due: 0,
    lastVisit: "-",
    walkIn: true,
  },

  setSelectedCustomer: (customer) =>
    set({
      selectedCustomer: customer,
    }),

  /* ---------------------------------------------------------------------- */
  /* Calculator */
  /* ---------------------------------------------------------------------- */

  quantity: 1,

  setQuantity: (qty) =>
    set({
      quantity: qty,
    }),

  resetQuantity: () =>
    set({
      quantity: 1,
    }),

  /* ---------------------------------------------------------------------- */
  /* Cart */
  /* ---------------------------------------------------------------------- */

  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((p) => p.productId === item.productId);

      if (existing) {
        return {
          items: state.items.map((p) =>
            p.productId === item.productId
              ? {
                  ...p,
                  quantity: p.quantity + item.quantity,
                  total: (p.quantity + item.quantity) * p.price,
                }
              : p,
          ),
        };
      }

      return {
        items: [...state.items, item],
      };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.productId !== productId) {
          return item;
        }

        const qty = Math.max(1, quantity);

        return {
          ...item,
          quantity: qty,
          total: qty * item.price,
        };
      }),
    })),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),

  clearCart: () =>
    set({
      items: [],
    }),

  /* ---------------------------------------------------------------------- */
  /* Payment */
  /* ---------------------------------------------------------------------- */

  paymentMethod: "CASH",

  setPaymentMethod: (method) =>
    set({
      paymentMethod: method,
    }),

  paidAmount: 0,

  setPaidAmount: (amount) =>
    set({
      paidAmount: amount,
    }),

  /* ---------------------------------------------------------------------- */
  /* Notes */
  /* ---------------------------------------------------------------------- */

  notes: "",

  setNotes: (notes) =>
    set({
      notes,
    }),
}));
