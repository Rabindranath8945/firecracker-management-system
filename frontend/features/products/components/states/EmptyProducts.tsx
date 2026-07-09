import { PackageOpen } from "lucide-react";

export default function EmptyProducts() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <PackageOpen className="text-slate-300" size={70} />

      <h2 className="mt-5 text-lg font-semibold">No Products Found</h2>

      <p className="mt-2 text-center text-sm text-slate-500">
        Start by adding your first product.
      </p>
    </div>
  );
}
