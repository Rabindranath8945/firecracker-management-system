"use client";

import { useRouter } from "next/navigation";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Wallet,
  Building2,
  CreditCard,
  Smartphone,
  Receipt,
} from "lucide-react";

import type { Expense } from "../types/expense";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";

interface ExpenseTableProps {
  expenses: Expense[];

  onDelete: (expense: Expense) => void;
}

export default function ExpenseTable({
  expenses,
  onDelete,
}: ExpenseTableProps) {
  const router = useRouter();
  function getStatusClass(status: Expense["status"]) {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700 border-green-200";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "";
    }
  }

  function PaymentIcon(method: Expense["paymentMethod"]) {
    switch (method) {
      case "CASH":
        return Wallet;

      case "BANK":
        return Building2;

      case "UPI":
        return Smartphone;

      case "CARD":
        return CreditCard;

      default:
        return Receipt;
    }
  }

  if (expenses.length === 0) {
    return (
      <div className="rounded-3xl border bg-white py-16 text-center text-slate-500 shadow-sm">
        No expenses found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
      <div className="divide-y">
        {expenses.map((expense) => {
          const Icon = PaymentIcon(expense.paymentMethod);

          return (
            <div
              key={expense.id}
              className="flex items-start justify-between gap-4 p-5 transition-all hover:bg-slate-50"
            >
              {/* Left */}

              <div className="flex flex-1 gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="truncate text-base font-semibold text-slate-900">
                        {expense.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {expense.expenseNo}
                      </p>
                    </div>

                    <p className="text-lg font-bold text-slate-900">
                      ₹
                      {expense.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  {expense.description && (
                    <p className="mt-2 line-clamp-1 text-sm text-slate-500">
                      {expense.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="rounded-full">
                      {new Date(expense.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Badge>

                    <Badge variant="outline" className="rounded-full">
                      <Icon className="mr-1 h-3.5 w-3.5" />

                      {expense.paymentMethod}
                    </Badge>

                    <Badge className={getStatusClass(expense.status)}>
                      {expense.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions */}

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-xl
      transition-colors
      hover:bg-slate-100
    "
                >
                  <MoreVertical className="h-5 w-5" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => router.push(`/expenses/${expense.id}/edit`)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(expense)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>
    </div>
  );
}
