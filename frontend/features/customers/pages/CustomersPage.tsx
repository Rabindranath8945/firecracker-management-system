"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Customer } from "../types/customer";
import { customers } from "../services/customer.service";

import CustomerStats from "../components/cards/CustomerStats";
import CustomerList from "../components/cards/CustomerList";
import CustomerListFilter from "../components/cards/CustomerListFilter";

import PageContainer from "@/features/shared/ui/layout/PageContainer";
import PageHeader from "@/features/shared/ui/layout/PageHeader";
import PageToolbar from "@/features/shared/ui/layout/PageToolbar";

import SearchInput from "@/features/shared/ui/forms/SearchInput";
import FilterSelect from "@/features/shared/ui/forms/FilterSelect";

import DeleteDialog from "@/features/shared/ui/dialogs/DeleteDialog";
import ProgressDialog from "@/features/shared/ui/dialogs/ProgressDialog";

import EmptyState from "@/features/shared/ui/cards/EmptyState";

import { Button } from "@/components/ui/button";

export default function CustomersPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [sort, setSort] = useState("NAME_ASC");

  const [loading, setLoading] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(keyword) ||
        customer.mobile.includes(keyword) ||
        customer.customerNo.toLowerCase().includes(keyword);

      const matchesStatus =
        status === "ALL"
          ? true
          : status === "ACTIVE"
            ? customer.isActive
            : !customer.isActive;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  async function handleDelete() {
    if (!selectedCustomer) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Delete", selectedCustomer);

    setLoading(false);

    setDeleteOpen(false);

    setSelectedCustomer(null);
  }

  return (
    <PageContainer className="space-y-4 pb-24">
      <PageHeader
        title="Customers"
        description="Manage customers, balances and payment history."
        action={
          <Button
            className="
    h-11
    rounded-xl
    bg-gradient-to-r
    from-slate-900
    to-slate-700
    px-5
    shadow-lg
    transition-all
    hover:scale-105
    hover:shadow-xl
  "
            onClick={() => router.push("/customers/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        }
      />

      <CustomerStats customers={filteredCustomers} />

      <PageToolbar
        left={
          <>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search customers..."
            />

            <FilterSelect
              value={status}
              onChange={setStatus}
              options={[
                {
                  label: "All Customers",
                  value: "ALL",
                },
                {
                  label: "Active",
                  value: "ACTIVE",
                },
                {
                  label: "Inactive",
                  value: "INACTIVE",
                },
              ]}
            />
          </>
        }
      />

      {filteredCustomers.length === 0 ? (
        <EmptyState
          title="No Customers Found"
          description="Create your first customer to start managing sales and payments."
          actionLabel="Add Customer"
          onAction={() => router.push("/customers/new")}
        />
      ) : (
        <>
          <CustomerListFilter
            total={filteredCustomers.length}
            status={status}
            onStatusChange={setStatus}
            sort={sort}
            onSortChange={setSort}
          />
          <CustomerList
            customers={filteredCustomers}
            onAdd={() => router.push("/customers/new")}
            onDelete={(customer) => {
              setSelectedCustomer(customer);
              setDeleteOpen(true);
            }}
          />
        </>
      )}

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entityType="Customer"
        entityName={selectedCustomer?.name ?? ""}
        loading={loading}
        onConfirm={handleDelete}
      />

      <ProgressDialog
        open={loading}
        title="Deleting Customer"
        description="Please wait while we delete the customer."
      />
    </PageContainer>
  );
}
