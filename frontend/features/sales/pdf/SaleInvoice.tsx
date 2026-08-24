"use client";

import {
  CheckCircle2,
  CreditCard,
  FileText,
  Package,
  Phone,
  Receipt,
  UserRound,
} from "lucide-react";

import type { Sale } from "../types/Sales.types";

export interface SaleInvoiceBusiness {
  businessName?: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  gstNo?: string;
}

interface SaleInvoiceProps {
  sale: Sale;
  business?: SaleInvoiceBusiness;
}

export default function SaleInvoice({ sale, business }: SaleInvoiceProps) {
  const customerName = sale.customer?.name ?? "Walk-in Customer";

  const customerMobile = sale.customer?.mobile ?? "";

  const totalQuantity = sale.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const businessName = business?.businessName ?? "Your Business";

  const businessAddress = [
    business?.address,
    business?.city,
    business?.state,
    business?.pinCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 print:min-h-0 print:bg-white print:p-0">
      <article
        className="
          invoice-page
          mx-auto
          w-full
          max-w-[794px]
          overflow-hidden
          rounded-[28px]
          border
          border-slate-200
          bg-white
          p-6
          shadow-xl
          shadow-slate-200/70
          sm:p-8
          print:max-w-none
          print:rounded-none
          print:border-0
          print:p-0
          print:shadow-none
        "
      >
        {/* ============================================================ */}
        {/* HEADER                                                        */}
        {/* ============================================================ */}

        <header className="border-b-2 border-violet-600 pb-6">
          <div className="flex items-start justify-between gap-6">
            {/* Business */}

            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-violet-600 text-lg font-black text-white">
                {business?.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={business.logo}
                    alt={businessName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  businessName.charAt(0).toUpperCase()
                )}
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  {businessName}
                </h1>

                {businessAddress && (
                  <p className="mt-1 max-w-[360px] text-[10px] leading-relaxed text-slate-500">
                    {businessAddress}
                  </p>
                )}

                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-slate-500">
                  {business?.phone && <span>{business.phone}</span>}

                  {business?.email && <span>{business.email}</span>}

                  {business?.gstNo && (
                    <span className="font-semibold">
                      GSTIN: {business.gstNo}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Invoice */}

            <div className="shrink-0 text-right">
              <div className="flex items-center justify-end gap-2">
                <Receipt className="h-4 w-4 text-violet-600" />

                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-600">
                  Tax Invoice
                </p>
              </div>

              <p className="mt-1 text-lg font-black text-slate-900">
                {sale.invoiceNo}
              </p>

              <p className="mt-1 text-[9px] text-slate-500">
                Sale No: {sale.saleNo}
              </p>
            </div>
          </div>
        </header>

        {/* ============================================================ */}
        {/* CUSTOMER / INVOICE INFO                                      */}
        {/* ============================================================ */}

        <section className="grid grid-cols-2 gap-6 border-b border-slate-200 py-5">
          {/* Customer */}

          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
                <UserRound className="h-3.5 w-3.5 text-violet-600" />
              </div>

              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Bill To
              </span>
            </div>

            <p className="text-sm font-black text-slate-900">{customerName}</p>

            {customerMobile && (
              <p className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                <Phone className="h-3 w-3" />
                {customerMobile}
              </p>
            )}

            {sale.customer?.email && (
              <p className="mt-1 text-[10px] text-slate-500">
                {sale.customer.email}
              </p>
            )}

            {sale.customer?.address && (
              <p className="mt-1 max-w-[300px] text-[9px] leading-relaxed text-slate-400">
                {sale.customer.address}
              </p>
            )}
          </div>

          {/* Invoice information */}

          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
              Invoice Details
            </p>

            <div className="mt-2 space-y-1.5">
              <InfoRow label="Date" value={formatDate(sale.saleDate)} />

              <InfoRow label="Payment" value={sale.payment.method} />

              <InfoRow
                label="Status"
                value={sale.paymentStatus}
                valueClassName="text-emerald-600"
              />
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* ITEMS                                                         */}
        {/* ============================================================ */}

        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100">
                <Package className="h-4 w-4 text-emerald-600" />
              </div>

              <div>
                <p className="text-xs font-black text-slate-900">Products</p>

                <p className="text-[9px] text-slate-400">
                  {sale.items.length} product
                  {sale.items.length !== 1 ? "s" : ""}
                  {" • "}
                  {totalQuantity} unit
                  {totalQuantity !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="rounded-full bg-slate-100 px-3 py-1 text-[9px] font-bold text-slate-500">
              {sale.items.length} Items
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="w-8 px-3 py-2.5 text-left text-[8px] font-black uppercase tracking-wider text-slate-400">
                    #
                  </th>

                  <th className="px-3 py-2.5 text-left text-[8px] font-black uppercase tracking-wider text-slate-400">
                    Product
                  </th>

                  <th className="px-3 py-2.5 text-right text-[8px] font-black uppercase tracking-wider text-slate-400">
                    Qty
                  </th>

                  <th className="px-3 py-2.5 text-right text-[8px] font-black uppercase tracking-wider text-slate-400">
                    Rate
                  </th>

                  <th className="px-3 py-2.5 text-right text-[8px] font-black uppercase tracking-wider text-slate-400">
                    GST
                  </th>

                  <th className="px-3 py-2.5 text-right text-[8px] font-black uppercase tracking-wider text-slate-400">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {sale.items.map((item, index) => (
                  <tr
                    key={`${item.product}-${index}`}
                    className="border-t border-slate-100"
                  >
                    <td className="px-3 py-2.5 text-[9px] font-semibold text-slate-400">
                      {index + 1}
                    </td>

                    <td className="px-3 py-2.5">
                      <p className="text-[10px] font-black text-slate-900">
                        {item.productName}
                      </p>

                      <p className="mt-0.5 text-[8px] text-slate-400">
                        {item.productCode}
                        {" • "}
                        {item.unit}

                        {item.brand ? ` • ${item.brand}` : ""}
                      </p>

                      {(item.category?.name || item.subCategory?.name) && (
                        <p className="mt-0.5 text-[8px] text-slate-400">
                          {item.category?.name}

                          {item.subCategory?.name
                            ? ` • ${item.subCategory.name}`
                            : ""}
                        </p>
                      )}
                    </td>

                    <td className="px-3 py-2.5 text-right text-[9px] font-bold text-slate-700">
                      {item.quantity}
                    </td>

                    <td className="px-3 py-2.5 text-right text-[9px] text-slate-600">
                      ₹{formatMoney(item.sellingPrice)}
                    </td>

                    <td className="px-3 py-2.5 text-right text-[9px] text-slate-600">
                      {item.tax}%
                    </td>

                    <td className="px-3 py-2.5 text-right text-[10px] font-black text-slate-900">
                      ₹{formatMoney(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SUMMARY                                                       */}
        {/* ============================================================ */}

        <section className="mt-5 flex justify-end">
          <div className="w-full max-w-[310px]">
            <div className="space-y-2">
              <SummaryRow
                label="Total Quantity"
                value={String(totalQuantity)}
                money={false}
              />

              <SummaryRow label="Subtotal" value={sale.subtotal} />

              <SummaryRow label="Discount" value={sale.discount} />

              <SummaryRow label="Tax / GST" value={sale.taxAmount} />
            </div>

            {/* Grand Total */}

            <div className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-600 to-fuchsia-600 p-4 text-white shadow-lg shadow-violet-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/70">
                    Grand Total
                  </p>

                  <p className="mt-1 text-2xl font-black">
                    ₹{formatMoney(sale.grandTotal)}
                  </p>
                </div>

                <FileText className="h-7 w-7 text-white/70" />
              </div>
            </div>

            {/* Payment */}

            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <SummaryRow
                label="Paid Amount"
                value={sale.paidAmount}
                valueClassName="text-emerald-600"
              />

              <div className="mt-2">
                <SummaryRow
                  label="Due Amount"
                  value={sale.dueAmount}
                  valueClassName={
                    sale.dueAmount > 0 ? "text-red-600" : "text-emerald-600"
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PAYMENT STATUS                                                */}
        {/* ============================================================ */}

        <section className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <p className="text-xs font-black text-emerald-800">
                  Payment {sale.paymentStatus}
                </p>

                <p className="mt-0.5 text-[9px] text-emerald-700/70">
                  Payment method: {sale.payment.method}
                </p>
              </div>
            </div>

            <CreditCard className="h-5 w-5 text-emerald-600" />
          </div>
        </section>

        {/* ============================================================ */}
        {/* NOTES                                                         */}
        {/* ============================================================ */}

        {sale.notes && (
          <section className="mt-4 rounded-2xl bg-slate-50 p-4">
            <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
              Notes
            </p>

            <p className="mt-1.5 text-[10px] leading-relaxed text-slate-600">
              {sale.notes}
            </p>
          </section>
        )}

        {/* ============================================================ */}
        {/* FOOTER                                                        */}
        {/* ============================================================ */}

        <footer className="mt-8 border-t border-slate-200 pt-5 text-center">
          <p className="text-xs font-black text-slate-800">
            Thank you for your business!
          </p>

          <p className="mt-1 text-[9px] text-slate-400">Please visit again.</p>

          <p className="mt-4 text-[8px] font-medium uppercase tracking-[0.2em] text-slate-300">
            Computer Generated Invoice
          </p>
        </footer>
      </article>

      {/* ============================================================ */}
      {/* A4 PRINT                                                      */}
      {/* ============================================================ */}

      <style jsx global>{`
        @page {
          size: A4;
          margin: 10mm;
        }

        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        @media print {
          html,
          body {
            width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          .invoice-page {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          .invoice-page section,
          .invoice-page header,
          .invoice-page footer {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }

          thead {
            display: table-header-group;
          }

          tr {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}

/* ========================================================================== */
/* INFO ROW                                                                   */
/* ========================================================================== */

interface InfoRowProps {
  label: string;
  value: string;
  valueClassName?: string;
}

function InfoRow({
  label,
  value,
  valueClassName = "text-slate-700",
}: InfoRowProps) {
  return (
    <div className="flex items-center justify-end gap-2 text-[9px]">
      <span className="text-slate-400">{label}</span>

      <span className={`font-bold ${valueClassName}`}>{value}</span>
    </div>
  );
}

/* ========================================================================== */
/* SUMMARY ROW                                                                */
/* ========================================================================== */

interface SummaryRowProps {
  label: string;
  value: number | string;
  money?: boolean;
  valueClassName?: string;
}

function SummaryRow({
  label,
  value,
  money = true,
  valueClassName = "text-slate-900",
}: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-slate-500">{label}</span>

      <span className={`text-xs font-bold ${valueClassName}`}>
        {money ? `₹${formatMoney(Number(value))}` : value}
      </span>
    </div>
  );
}

/* ========================================================================== */
/* HELPERS                                                                    */
/* ========================================================================== */

function formatMoney(value: number): string {
  return (value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
