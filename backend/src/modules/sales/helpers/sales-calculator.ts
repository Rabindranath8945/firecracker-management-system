export interface SaleCalculationItem {
  quantity: number;

  purchasePrice: number;

  sellingPrice: number;

  discount: number;

  tax: number;

  total: number;
}

export interface SaleCalculationInput {
  items: SaleCalculationItem[];

  discount: number;
}

export interface SaleCalculationResult {
  subtotal: number;

  discount: number;

  taxAmount: number;

  grandTotal: number;

  totalProfit: number;
}

export function calculateSaleTotals(
  sale: SaleCalculationInput,
): SaleCalculationResult {
  let subtotal = 0;

  let taxAmount = 0;

  let totalProfit = 0;

  for (const item of sale.items) {
    const itemSubtotal = item.quantity * item.sellingPrice;

    const itemDiscount = item.discount;

    const taxableAmount = itemSubtotal - itemDiscount;

    const itemTax = (taxableAmount * item.tax) / 100;

    subtotal += taxableAmount;

    taxAmount += itemTax;

    totalProfit += (item.sellingPrice - item.purchasePrice) * item.quantity;
  }

  const grandTotal = subtotal - sale.discount + taxAmount;

  return {
    subtotal,

    discount: sale.discount,

    taxAmount,

    grandTotal,

    totalProfit,
  };
}
