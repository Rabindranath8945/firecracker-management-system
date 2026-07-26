export interface SaleItemCalculationInput {
  quantity: number;

  purchasePrice: number;

  sellingPrice: number;

  discount: number;

  tax: number;
}

export interface SaleItemCalculationResult {
  subtotal: number;

  taxableAmount: number;

  taxAmount: number;

  total: number;

  profit: number;
}

export function calculateSaleItem(
  item: SaleItemCalculationInput,
): SaleItemCalculationResult {
  const subtotal = item.quantity * item.sellingPrice;

  const taxableAmount = subtotal - item.discount;

  const taxAmount = (taxableAmount * item.tax) / 100;

  const total = taxableAmount + taxAmount;

  const profit = (item.sellingPrice - item.purchasePrice) * item.quantity;

  return {
    subtotal,

    taxableAmount,

    taxAmount,

    total,

    profit,
  };
}
