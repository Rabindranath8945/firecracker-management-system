"use client";

import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";

import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Receipt,
  Save,
  Wallet,
} from "lucide-react";

import type {
  Expense,
  ExpensePaymentMethod,
  ExpenseStatus,
} from "../types/expense";

import { expenses } from "../services/expense.service";

import PageContainer from "@/features/shared/ui/layout/PageContainer";
import PageHeader from "@/features/shared/ui/layout/PageHeader";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ExpenseFormValues {
  expenseNo: string;

  date: string;

  title: string;

  description: string;

  amount: number;

  paymentMethod: ExpensePaymentMethod;

  status: ExpenseStatus;
}

interface ExpenseFormProps {
  mode?: "create" | "edit";

  defaultValues?: Partial<ExpenseFormValues>;

  onSubmit: (values: ExpenseFormValues) => void | Promise<void>;
}

export default function ExpenseForm({
  mode = "create",
  defaultValues,
  onSubmit,
}: ExpenseFormProps) {
  const router = useRouter();

  const nextExpenseNo = `EXP-${String(expenses.length + 1).padStart(4, "0")}`;

  const form = useForm<ExpenseFormValues>({
    defaultValues: {
      expenseNo: defaultValues?.expenseNo ?? nextExpenseNo,

      date: defaultValues?.date ?? new Date().toISOString().slice(0, 10),

      title: defaultValues?.title ?? "",

      description: defaultValues?.description ?? "",

      amount: defaultValues?.amount ?? 0,

      paymentMethod: defaultValues?.paymentMethod ?? "CASH",

      status: defaultValues?.status ?? "PAID",
    },
  });

  const handleFormSubmit: SubmitHandler<ExpenseFormValues> = async (values) => {
    await onSubmit(values);
  };

  const submit = form.handleSubmit(handleFormSubmit);

  return (
    <PageContainer className="space-y-6 pb-32">
      <PageHeader
        title={mode === "edit" ? "Edit Expense" : "New Expense"}
        description={
          mode === "edit"
            ? "Update expense details."
            : "Record a new business expense."
        }
      />

      {/* Back */}

      <div className="flex items-center">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Expense Information */}

      <Card className="rounded-3xl shadow-sm">
        <CardContent className="space-y-8 p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
              <Receipt className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Expense Information</h2>

              <p className="text-sm text-slate-500">
                Fill in the required details.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Expense No */}

            <div className="space-y-2">
              <Label>Expense No</Label>

              <Input
                readOnly
                value={form.watch("expenseNo")}
                className="h-12 rounded-xl bg-slate-100 font-semibold"
              />
            </div>

            {/* Date */}

            <div className="space-y-2">
              <Label>Date</Label>

              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />

                <Input
                  type="date"
                  className="h-12 rounded-xl pl-11"
                  {...form.register("date")}
                />
              </div>
            </div>

            {/* Title */}

            <div className="space-y-2 md:col-span-2">
              <Label>Title</Label>

              <div className="relative">
                <Wallet className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />

                <Input
                  className="h-12 rounded-xl pl-11"
                  placeholder="Enter expense title"
                  {...form.register("title")}
                />
              </div>
            </div>

            {/* Description */}

            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>

              <Textarea
                rows={4}
                className="resize-none rounded-xl"
                placeholder="Write a short description..."
                {...form.register("description")}
              />
            </div>
            {/* Amount */}

            <div className="space-y-2">
              <Label>Amount</Label>

              <div className="relative">
                <span className="absolute left-4 top-3 text-lg font-semibold text-slate-500">
                  ₹
                </span>

                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  className="h-12 rounded-xl pl-10"
                  placeholder="0.00"
                  {...form.register("amount", {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </div>

            {/* Payment Method */}

            <div className="space-y-2">
              <Label>Payment Method</Label>

              <div className="relative">
                {/* Payment Method */}

                <div className="space-y-3 md:col-span-2">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    {[
                      {
                        label: "Cash",
                        value: "CASH",
                        icon: "💵",
                      },
                      {
                        label: "UPI",
                        value: "UPI",
                        icon: "📱",
                      },
                      {
                        label: "Bank",
                        value: "BANK",
                        icon: "🏦",
                      },
                      {
                        label: "Card",
                        value: "CARD",
                        icon: "💳",
                      },
                      {
                        label: "Cheque",
                        value: "CHEQUE",
                        icon: "🧾",
                      },
                    ].map((item) => {
                      const active = form.watch("paymentMethod") === item.value;

                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() =>
                            form.setValue(
                              "paymentMethod",
                              item.value as ExpensePaymentMethod,
                            )
                          }
                          className={`rounded-2xl border p-4 transition-all ${
                            active
                              ? "border-blue-600 bg-blue-50 shadow"
                              : "hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="text-2xl">{item.icon}</div>

                          <div className="mt-2 text-sm font-medium">
                            {item.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}

            {/* Status */}

            <div className="space-y-3 md:col-span-2">
              <Label>Status</Label>

              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Paid",
                    value: "PAID",
                    active:
                      "border-green-500 bg-green-50 text-green-700 shadow-sm",
                  },
                  {
                    label: "Pending",
                    value: "PENDING",
                    active:
                      "border-yellow-500 bg-yellow-50 text-yellow-700 shadow-sm",
                  },
                  {
                    label: "Cancelled",
                    value: "CANCELLED",
                    active: "border-red-500 bg-red-50 text-red-700 shadow-sm",
                  },
                ].map((item) => {
                  const selected = form.watch("status") === item.value;

                  return (
                    <Button
                      key={item.value}
                      type="button"
                      variant="outline"
                      onClick={() =>
                        form.setValue("status", item.value as ExpenseStatus)
                      }
                      className={`h-14 rounded-2xl border-2 font-semibold transition-all duration-200 ${
                        selected
                          ? item.active
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sticky Bottom Bar */}

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-end gap-3 p-4">
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-xl"
            onClick={() => router.back()}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={submit}
            className="h-12 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 px-6 shadow-lg transition-all hover:scale-[1.02]"
          >
            <Save className="mr-2 h-4 w-4" />

            {mode === "edit" ? "Update Expense" : "Save Expense"}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
