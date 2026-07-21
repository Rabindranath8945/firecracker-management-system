"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ExpenseForm from "../components/ExpenseForm";

import SuccessDialog from "@/features/shared/ui/dialogs/SuccessDialog";

import type { ExpenseFormValues } from "../components/ExpenseForm";

interface EditExpensePageProps {
  expenseId: string;
  defaultValues: Partial<ExpenseFormValues>;
}

export default function EditExpensePage({
  expenseId,
  defaultValues,
}: EditExpensePageProps) {
  const router = useRouter();

  const [successOpen, setSuccessOpen] = useState(false);

  async function handleSubmit(values: ExpenseFormValues) {
    try {
      console.log("Update Expense", values);

      // TODO:
      // await expenseService.update(expenseId, values);

      setSuccessOpen(true);
    } catch (error) {
      console.error("Failed to update expense:", error);
    }
  }

  return (
    <>
      <ExpenseForm
        mode="edit"
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
      />

      <SuccessDialog
        open={successOpen}
        title="Expense Updated"
        description="Expense has been updated successfully."
        primaryLabel="Back to Expenses"
        secondaryLabel="Close"
        onPrimary={() => {
          router.push("/expenses");
        }}
        onSecondary={() => {
          setSuccessOpen(false);
        }}
      />
    </>
  );
}
