"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Supplier } from "../types/supplier";
import { suppliers } from "../services/supplier.service";

import SupplierStats from "../components/cards/SupplierStats";
import SupplierList from "../components/cards/SupplierList";
import SupplierListFilter from "../components/cards/SupplierListFilter";

import PageContainer from "@/features/shared/ui/layout/PageContainer";
import PageHeader from "@/features/shared/ui/layout/PageHeader";
import PageToolbar from "@/features/shared/ui/layout/PageToolbar";

import SearchInput from "@/features/shared/ui/forms/SearchInput";
import FilterSelect from "@/features/shared/ui/forms/FilterSelect";

import DeleteDialog from "@/features/shared/ui/dialogs/DeleteDialog";
import ProgressDialog from "@/features/shared/ui/dialogs/ProgressDialog";

import EmptyState from "@/features/shared/ui/cards/EmptyState";

import { Button } from "@/components/ui/button";

export default function SuppliersPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [sort, setSort] = useState("NAME_ASC");

  const [loading, setLoading] = useState(false);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );

  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredSuppliers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return suppliers.filter((supplier) => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(keyword) ||
        supplier.mobile.includes(keyword) ||
        supplier.supplierNo.toLowerCase().includes(keyword);

      const matchesStatus =
        status === "ALL"
          ? true
          : status === "ACTIVE"
            ? supplier.isActive
            : !supplier.isActive;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  async function handleDelete() {
    if (!selectedSupplier) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Delete", selectedSupplier);

    setLoading(false);

    setDeleteOpen(false);

    setSelectedSupplier(null);
  }

  return (
    <PageContainer className="space-y-4 pb-24">
      <PageHeader
        title="Suppliers"
        description="Manage suppliers, balances and purchase history."
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
            onClick={() => router.push("/suppliers/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        }
      />

      <SupplierStats suppliers={filteredSuppliers} />

      <PageToolbar
        left={
          <>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search suppliers..."
            />

            <FilterSelect
              value={status}
              onChange={setStatus}
              options={[
                {
                  label: "All Suppliers",
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

      {filteredSuppliers.length === 0 ? (
        <EmptyState
          title="No Suppliers Found"
          description="Create your first supplier to start managing purchases and payments."
          actionLabel="Add Supplier"
          onAction={() => router.push("/suppliers/new")}
        />
      ) : (
        <>
          <SupplierListFilter
            total={filteredSuppliers.length}
            status={status}
            onStatusChange={setStatus}
            sort={sort}
            onSortChange={setSort}
          />

          <SupplierList
            suppliers={filteredSuppliers}
            onAdd={() => router.push("/suppliers/new")}
            onDelete={(supplier) => {
              setSelectedSupplier(supplier);
              setDeleteOpen(true);
            }}
          />
        </>
      )}

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entityType="Supplier"
        entityName={selectedSupplier?.name ?? ""}
        loading={loading}
        onConfirm={handleDelete}
      />

      <ProgressDialog
        open={loading}
        title="Deleting Supplier"
        description="Please wait while we delete the supplier."
      />
    </PageContainer>
  );
}
