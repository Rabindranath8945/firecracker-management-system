import { notFound } from "next/navigation";

import EditExpensePage from "@/features/expenses/pages/EditExpensePage";
import { expenses } from "@/features/expenses/services/expense.service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExpenseEditRoute({ params }: Props) {
  const { id } = await params;

  const expense = expenses.find((item) => item.id === id);

  if (!expense) {
    notFound();
  }

  return (
    <EditExpensePage
      expenseId={expense.id}
      defaultValues={{
        expenseNo: expense.expenseNo,
        date: expense.date,
        title: expense.title,
        description: expense.description ?? "",
        amount: expense.amount,
        paymentMethod: expense.paymentMethod,
        status: expense.status,
      }}
    />
  );
}
