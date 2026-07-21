"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Expense } from "../types/expense";
import { expenses } from "../services/expense.service";

import ExpenseStats from "../components/ExpenseStats";
import ExpenseTable from "../components/ExpenseTable";
import ExpenseTableFilter from "../components/ExpenseTableFilter";

import PageContainer from "@/features/shared/ui/layout/PageContainer";
import PageHeader from "@/features/shared/ui/layout/PageHeader";
import PageToolbar from "@/features/shared/ui/layout/PageToolbar";

import SearchInput from "@/features/shared/ui/forms/SearchInput";

import DeleteDialog from "@/features/shared/ui/dialogs/DeleteDialog";
import ProgressDialog from "@/features/shared/ui/dialogs/ProgressDialog";

import EmptyState from "@/features/shared/ui/cards/EmptyState";

import { Button } from "@/components/ui/button";

export default function ExpensesPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [sort, setSort] = useState("DATE_DESC");

  const [loading, setLoading] = useState(false);

  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredExpenses = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    let data = expenses.filter((expense) => {
      const matchesSearch =
        expense.expenseNo.toLowerCase().includes(keyword) ||
        expense.title.toLowerCase().includes(keyword);

      const matchesStatus = status === "ALL" ? true : expense.status === status;

      return matchesSearch && matchesStatus;
    });

    data = [...data].sort((a, b) => {
      if (sort === "DATE_ASC") {
        return a.date.localeCompare(b.date);
      }

      return b.date.localeCompare(a.date);
    });

    return data;
  }, [search, status, sort]);

  async function handleDelete() {
    if (!selectedExpense) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Delete Expense", selectedExpense);

    setLoading(false);

    setDeleteOpen(false);

    setSelectedExpense(null);
  }

  return (
    <PageContainer className="space-y-4 pb-24">
      <PageHeader
        title="Expenses"
        description="Track and manage all business expenses."
        action={
          <Button onClick={() => router.push("/expenses/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        }
      />

      <ExpenseStats
        todayExpense={2500}
        monthExpense={20569}
        yearExpense={180450}
        pendingExpense={420}
        todayCount={3}
        monthCount={18}
        yearCount={146}
        pendingCount={2}
      />

      {filteredExpenses.length === 0 ? (
        <EmptyState
          title="No Expenses Found"
          description="Create your first expense to start tracking business expenses."
          actionLabel="Add Expense"
          onAction={() => router.push("/expenses/new")}
        />
      ) : (
        <>
          <ExpenseTableFilter
            total={filteredExpenses.length}
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            sort={sort}
            onSortChange={setSort}
          />

          <ExpenseTable
            expenses={filteredExpenses}
            onDelete={(expense) => {
              setSelectedExpense(expense);
              setDeleteOpen(true);
            }}
          />
        </>
      )}

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entityType="Expense"
        entityName={selectedExpense?.title ?? ""}
        loading={loading}
        onConfirm={handleDelete}
      />

      <ProgressDialog
        open={loading}
        title="Deleting Expense"
        description="Please wait while we delete the expense."
      />
    </PageContainer>
  );
}
