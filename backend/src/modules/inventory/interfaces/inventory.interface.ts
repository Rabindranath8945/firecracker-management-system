export interface StockMovement {
  productId: string;

  quantity: number;
}

export interface StockValidation {
  productId: string;

  availableStock: number;

  requestedQuantity: number;
}
