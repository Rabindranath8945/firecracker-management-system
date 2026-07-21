"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ExpenseForm from "../components/ExpenseForm";

import SuccessDialog from "@/features/shared/ui/dialogs/SuccessDialog";

import type { ExpenseFormValues } from "../components/ExpenseForm";

export default function AddExpensePage() {
  const router = useRouter();

  const [successOpen, setSuccessOpen] = useState(false);

  async function handleSubmit(values: ExpenseFormValues) {
    try {
      console.log("Create Expense", values);

      // TODO:
      // await expenseService.create(values);

      setSuccessOpen(true);
    } catch (error) {
      console.error("Failed to create expense:", error);
    }
  }

  return (
    <>
      <ExpenseForm mode="create" onSubmit={handleSubmit} />

      <SuccessDialog
        open={successOpen}
        title="Expense Added"
        description="Expense has been added successfully."
        primaryLabel="Add Another"
        secondaryLabel="Back to Expenses"
        onPrimary={() => {
          setSuccessOpen(false);
        }}
        onSecondary={() => {
          router.push("/expenses");
        }}
      />
    </>
  );
}
