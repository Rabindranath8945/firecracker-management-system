"use client";

import {
  ArrowRight,
  Eye,
  Pencil,
  Phone,
  ReceiptText,
  Trash2,
  WalletCards,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type { Supplier } from "../../types/supplier.type";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SupplierListCardProps {
  supplier: Supplier;
  onDelete: (supplier: Supplier) => void;
}

export default function SupplierListCard({
  supplier,
  onDelete,
}: SupplierListCardProps) {
  const router = useRouter();

  const currentDue = Number(supplier.currentDue ?? 0);
  const totalPurchases = Number(supplier.totalPurchases ?? 0);
  const totalPaid = Number(supplier.totalPaid ?? 0);

  const isDue = currentDue > 0;

  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const handleView = () => {
    router.push(`/suppliers/view?id=${supplier._id}`);
  };

  const handleEdit = () => {
    router.push(`/suppliers/edit?id=${supplier._id}`);
  };

  const handleDelete = () => {
    onDelete(supplier);
  };

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-[26px]
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-indigo-200
        hover:shadow-xl
      "
    >
      {/* ------------------------------------------------------------------ */}
      {/* Top accent                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-1
          bg-gradient-to-r
          from-indigo-600
          via-violet-500
          to-fuchsia-500
        "
      />

      {/* ------------------------------------------------------------------ */}
      {/* Main Content                                                       */}
      {/* ------------------------------------------------------------------ */}

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}

          <button
            type="button"
            onClick={handleView}
            aria-label={`View ${supplier.name}`}
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-[18px]
              bg-gradient-to-br
              from-indigo-600
              via-violet-600
              to-fuchsia-600
              text-xl
              font-bold
              text-white
              shadow-lg
              shadow-indigo-500/20
              transition-transform
              duration-300
              group-hover:scale-105
            "
          >
            {supplier.name.charAt(0).toUpperCase()}
          </button>

          {/* Supplier Information */}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={handleView}
                className="
                  min-w-0
                  text-left
                  outline-none
                "
              >
                <h3
                  className="
                    truncate
                    text-[16px]
                    font-bold
                    tracking-tight
                    text-slate-900
                    transition-colors
                    group-hover:text-indigo-600
                  "
                >
                  {supplier.name}
                </h3>

                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="
                      rounded-md
                      bg-indigo-50
                      px-2
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-indigo-600
                    "
                  >
                    {supplier.supplierCode}
                  </span>

                  <span className="text-[10px] text-slate-400">Supplier</span>
                </div>
              </button>

              {/* Status */}

              <Badge
                className={`
                  shrink-0
                  border-0
                  rounded-full
                  px-2.5
                  py-1
                  text-[10px]
                  font-bold
                  ${
                    supplier.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }
                `}
              >
                <span
                  className={`
                    mr-1.5
                    h-1.5
                    w-1.5
                    rounded-full
                    ${supplier.isActive ? "bg-emerald-500" : "bg-slate-400"}
                  `}
                />

                {supplier.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            {/* Phone */}

            {supplier.mobile && (
              <div className="mt-3 flex items-center gap-2">
                <div
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                    bg-slate-100
                    text-slate-500
                  "
                >
                  <Phone className="h-3.5 w-3.5" />
                </div>

                <span className="text-xs font-medium text-slate-600">
                  {supplier.mobile}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Financial Summary                                                */}
        {/* ---------------------------------------------------------------- */}

        <div
          className="
            mt-5
            grid
            grid-cols-2
            gap-2
          "
        >
          {/* Due */}

          <div
            className={`
              rounded-2xl
              border
              p-3
              ${
                isDue
                  ? "border-amber-200 bg-amber-50"
                  : "border-emerald-200 bg-emerald-50"
              }
            `}
          >
            <div className="flex items-center gap-2">
              <div
                className={`
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  ${
                    isDue
                      ? "bg-amber-100 text-amber-600"
                      : "bg-emerald-100 text-emerald-600"
                  }
                `}
              >
                <WalletCards className="h-3.5 w-3.5" />
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Current Due
              </span>
            </div>

            <p
              className={`
                mt-2
                text-lg
                font-bold
                tracking-tight
                ${isDue ? "text-amber-700" : "text-emerald-700"}
              `}
            >
              {formatCurrency(currentDue)}
            </p>
          </div>

          {/* Purchases */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-3
            "
          >
            <div className="flex items-center gap-2">
              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  bg-indigo-50
                  text-indigo-600
                "
              >
                <ReceiptText className="h-3.5 w-3.5" />
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Purchases
              </span>
            </div>

            <p
              className="
                mt-2
                text-lg
                font-bold
                tracking-tight
                text-slate-900
              "
            >
              {formatCurrency(totalPurchases)}
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Payment Summary                                                  */}
        {/* ---------------------------------------------------------------- */}

        <div
          className="
            mt-3
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-slate-100
            bg-slate-50/70
            px-3
            py-2.5
          "
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Total Paid
          </span>

          <span className="text-xs font-bold text-emerald-600">
            {formatCurrency(totalPaid)}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Actions                                                            */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          grid
          grid-cols-3
          border-t
          border-slate-100
          bg-slate-50/80
        "
      >
        {/* View */}

        <Button
          type="button"
          variant="ghost"
          onClick={handleView}
          className="
            h-12
            rounded-none
            text-xs
            font-semibold
            text-slate-600
            hover:bg-white
            hover:text-indigo-600
          "
        >
          <Eye className="mr-1.5 h-4 w-4" />
          View
        </Button>

        {/* Edit */}

        <Button
          type="button"
          variant="ghost"
          onClick={handleEdit}
          className="
            h-12
            rounded-none
            border-x
            border-slate-100
            text-xs
            font-semibold
            text-slate-600
            hover:bg-white
            hover:text-indigo-600
          "
        >
          <Pencil className="mr-1.5 h-4 w-4 text-indigo-600" />
          Edit
        </Button>

        {/* Delete */}

        <Button
          type="button"
          variant="ghost"
          onClick={handleDelete}
          className="
            h-12
            rounded-none
            text-xs
            font-semibold
            text-red-500
            hover:bg-red-50
            hover:text-red-700
          "
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* View indicator                                                     */}
      {/* ------------------------------------------------------------------ */}

      <button
        type="button"
        onClick={handleView}
        className="
          absolute
          bottom-[4.1rem]
          right-4
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          bg-white
          text-slate-400
          opacity-0
          shadow-md
          ring-1
          ring-slate-200
          transition-all
          duration-300
          group-hover:translate-x-0
          group-hover:opacity-100
          hover:text-indigo-600
        "
        aria-label="View supplier"
      >
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </article>
  );
}
