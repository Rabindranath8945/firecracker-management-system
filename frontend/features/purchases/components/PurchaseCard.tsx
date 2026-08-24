import { Purchase } from "../types/purchase.types";

interface PurchaseCardProps {
  purchase: Purchase;
}

export function PurchaseCard({ purchase }: PurchaseCardProps) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Purchase No</p>

          <h3 className="text-lg font-semibold">{purchase.purchaseNo}</h3>
        </div>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          {purchase.paymentStatus}
        </span>
      </div>

      <div className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Supplier</span>

          <span className="font-medium">{purchase.supplier?.name ?? "--"}</span>
        </div>

        <div className="flex justify-between">
          <span>Invoice</span>

          <span>{purchase.invoiceNo || "--"}</span>
        </div>

        <div className="flex justify-between">
          <span>Total</span>

          <span className="font-semibold">
            ₹{purchase.grandTotal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
