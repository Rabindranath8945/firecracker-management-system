export interface ProfitCalculationItem {
  quantity: number;

  purchasePrice: number;

  sellingPrice: number;

  discount: number;
}

export interface ProfitCalculationInput {
  items: ProfitCalculationItem[];
}

export interface ProfitCalculationResult {
  grossProfit: number;

  totalCost: number;

  totalRevenue: number;

  profitMargin: number;
}

export function calculateProfit(
  sale: ProfitCalculationInput,
): ProfitCalculationResult {
  let totalCost = 0;

  let totalRevenue = 0;

  for (const item of sale.items) {
    totalCost += item.purchasePrice * item.quantity;

    totalRevenue += item.sellingPrice * item.quantity - item.discount;
  }

  const grossProfit = totalRevenue - totalCost;

  const profitMargin =
    totalRevenue === 0
      ? 0
      : Number(((grossProfit / totalRevenue) * 100).toFixed(2));

  return {
    grossProfit,

    totalCost,

    totalRevenue,

    profitMargin,
  };
}
