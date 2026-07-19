import type { PurchaseLineItem } from "../components/PurchaseProductTable";

export interface PurchaseTotals {
  products: number;
  quantity: number;
  subtotal: number;
  discount: number;
  taxable: number;
  gst: number;
  transport: number;
  grandTotal: number;
}

export function calculatePurchaseTotals(
  items: PurchaseLineItem[],
  transport = 0,
): PurchaseTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.purchasePrice,
    0,
  );

  const discount = items.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.purchasePrice;

    return sum + (itemSubtotal * item.discount) / 100;
  }, 0);

  const taxable = subtotal - discount;

  const gst = items.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.purchasePrice;

    const itemDiscount = (itemSubtotal * item.discount) / 100;

    return sum + ((itemSubtotal - itemDiscount) * item.gstRate) / 100;
  }, 0);

  return {
    products: items.length,

    quantity: items.reduce((sum, item) => sum + item.quantity, 0),

    subtotal,

    discount,

    taxable,

    gst,

    transport,

    grandTotal: taxable + gst + transport,
  };
}
