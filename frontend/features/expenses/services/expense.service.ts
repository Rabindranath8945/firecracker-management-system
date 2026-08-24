import { expenses } from "../data/expenses";

export { expenses };

export function getExpenseById(id: string) {
  return expenses.find((expense) => expense.id === id);
}

export function getTotalExpenses() {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

export function getPaidExpenses() {
  return expenses.filter((expense) => expense.status === "PAID");
}

export function getPendingExpenses() {
  return expenses.filter((expense) => expense.status === "PENDING");
}

export function getCancelledExpenses() {
  return expenses.filter((expense) => expense.status === "CANCELLED");
}

export function getTodayExpenses() {
  const today = new Date().toISOString().split("T")[0];

  return expenses.filter((expense) => expense.date === today);
}

export function getMonthlyExpenses() {
  const currentMonth = new Date().toISOString().slice(0, 7);

  return expenses.filter((expense) => expense.date.startsWith(currentMonth));
}

export function getYearlyExpenses() {
  const currentYear = new Date().getFullYear().toString();

  return expenses.filter((expense) => expense.date.startsWith(currentYear));
}
