export const STOCK_OPERATION = {
  IN: "IN",

  OUT: "OUT",
} as const;

export type StockOperation =
  (typeof STOCK_OPERATION)[keyof typeof STOCK_OPERATION];
