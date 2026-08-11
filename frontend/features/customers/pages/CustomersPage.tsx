"use client";

import CustomerHero from "../components/cards/CustomerHero";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { Customer } from "../types/customer";

import { useCustomers } from "../hooks/useCustomers";
import { useDeleteCustomer } from "../hooks/useDeleteCustomer";

import CustomerSummary from "../components/cards/CustomerSummary";
import CustomerSearch from "../components/cards/CustomerSearch";
import CustomerFilterSheet from "../components/cards/CustomerFilterSheet";
import CustomerList from "../components/cards/CustomerList";

import EmptyState from "@/features/shared/ui/cards/EmptyState";
import DeleteDialog from "@/features/shared/ui/dialogs/DeleteDialog";
import ProgressDialog from "@/features/shared/ui/dialogs/ProgressDialog";
import FloatingActionButton from "@/components/common/shared/button/FloatingActionButton";

export default function CustomersPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ACTIVE");

  const [sort, setSort] = useState("NAME_ASC");

  const { customers, loading } = useCustomers({
    search,
    status,
    sort,
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const [filterOpen, setFilterOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const filtered = customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(keyword) ||
        customer.customerCode.toLowerCase().includes(keyword) ||
        (customer.mobile ?? "").toLowerCase().includes(keyword);

      const matchesStatus =
        status === "ALL"
          ? true
          : status === "ACTIVE"
            ? customer.isActive
            : !customer.isActive;

      return matchesSearch && matchesStatus;
    });

    switch (sort) {
      case "NAME_DESC":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case "NEWEST":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;

      case "OLDEST":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;

      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [customers, search, status, sort]);

  const { mutate: deleteCustomer, isPending: deleting } = useDeleteCustomer();

  function handleDelete() {
    if (!selectedCustomer) return;

    deleteCustomer(selectedCustomer._id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedCustomer(null);
      },
    });
  }

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading customers...</p>
      </main>
    );
  }

  return (
    <main className="space-y-5 px-4 py-5 pb-24">
      <CustomerHero />

      <CustomerSearch
        value={search}
        onChange={setSearch}
        onFilterClick={() => setFilterOpen(true)}
      />

      <CustomerSummary customers={filteredCustomers} />

      {filteredCustomers.length === 0 ? (
        <EmptyState
          title="No Customers Found"
          description="Create your first customer to start managing customers."
          actionLabel="Add Customer"
          onAction={() => router.push("/customers/new")}
        />
      ) : (
        <CustomerList
          customers={filteredCustomers}
          onDelete={(customer) => {
            setSelectedCustomer(customer);
            setDeleteOpen(true);
          }}
        />
      )}

      <FloatingActionButton href="/customers/new" label="New Customer" />

      <CustomerFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        status={status}
        sort={sort}
        onStatusChange={setStatus}
        onSortChange={setSort}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entityType="Customer"
        entityName={selectedCustomer?.name ?? ""}
        loading={deleting}
        onConfirm={handleDelete}
      />

      <ProgressDialog
        open={deleting}
        title="Deleting Customer"
        description="Please wait while deleting the customer..."
      />
    </main>
  );
}
