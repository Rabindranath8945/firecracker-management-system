"use client";

export default function ProductStockCard() {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white shadow-lg">
      <p className="text-blue-100">Inventory Value</p>

      <h2 className="mt-2 text-4xl font-bold">₹55,000</h2>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>Stock Health</span>

          <span>250 / 20</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-[90%] rounded-full bg-white" />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <div>
          <p className="text-blue-100 text-sm">Available</p>

          <h3 className="text-xl font-bold">250 PCS</h3>
        </div>

        <div className="text-right">
          <p className="text-blue-100 text-sm">Minimum</p>

          <h3 className="text-xl font-bold">20 PCS</h3>
        </div>
      </div>
    </div>
  );
}
