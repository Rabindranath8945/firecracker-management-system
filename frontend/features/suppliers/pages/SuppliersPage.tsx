"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { Supplier } from "../types/supplier";
import { deleteSupplier, getSuppliers } from "../services/supplier.service";

import SupplierSummary from "../components/cards/SupplierSummary";
import SupplierList from "../components/cards/SupplierList";
import SupplierSearch from "../components/cards/SupplierSearch";
import SupplierFilterSheet from "../components/cards/SupplierFilterSheet";

import PageContainer from "@/features/shared/ui/layout/PageContainer";

import FloatingActionButton from "@/components/common/shared/button/FloatingActionButton";

import DeleteDialog from "@/features/shared/ui/dialogs/DeleteDialog";
import ProgressDialog from "@/features/shared/ui/dialogs/ProgressDialog";

import EmptyState from "@/features/shared/ui/cards/EmptyState";

export default function SuppliersPage() {
  const router = useRouter();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [sort, setSort] = useState("NAME_ASC");

  const [filterOpen, setFilterOpen] = useState(false);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [fetching, setFetching] = useState(true);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    void loadSuppliers();
  }, []);

  async function loadSuppliers() {
    try {
      setFetching(true);

      const response = await getSuppliers();

      setSuppliers(response.items);
    } catch (error) {
      console.error("Load Suppliers Error:", error);
    } finally {
      setFetching(false);
    }
  }

  const filteredSuppliers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const data = suppliers.filter((supplier) => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(keyword) ||
        supplier.mobile.includes(keyword) ||
        supplier.supplierCode.toLowerCase().includes(keyword);

      const matchesStatus =
        status === "ALL"
          ? true
          : status === "ACTIVE"
            ? supplier.isActive
            : !supplier.isActive;

      return matchesSearch && matchesStatus;
    });

    switch (sort) {
      case "NAME_ASC":
        data.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "NAME_DESC":
        data.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case "NEWEST":
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;

      case "OLDEST":
        data.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
    }

    return data;
  }, [suppliers, search, status, sort]);

  async function handleDelete() {
    if (!selectedSupplier) return;

    try {
      setDeleting(true);

      await deleteSupplier(selectedSupplier._id);

      await loadSuppliers();

      setDeleteOpen(false);

      setSelectedSupplier(null);
    } catch (error) {
      console.error("Delete Supplier Error:", error);
    } finally {
      setDeleting(false);
    }
  }

  if (fetching) {
    return (
      <ProgressDialog
        open
        title="Loading Suppliers"
        description="Please wait while we load your suppliers..."
      />
    );
  }

  return (
    <PageContainer className="space-y-6 pb-24">
      <SupplierSummary suppliers={filteredSuppliers} />

      <SupplierSearch
        value={search}
        onChange={setSearch}
        onFilterClick={() => setFilterOpen(true)}
      />

      {filteredSuppliers.length === 0 ? (
        <EmptyState
          title="No Suppliers Found"
          description="Create your first supplier to start managing purchases and supplier payments."
          actionLabel="Add Supplier"
          onAction={() => router.push("/suppliers/new")}
        />
      ) : (
        <SupplierList
          suppliers={filteredSuppliers}
          onDelete={(supplier) => {
            setSelectedSupplier(supplier);
            setDeleteOpen(true);
          }}
        />
      )}

      <FloatingActionButton href="/suppliers/new" label="New Supplier" />

      <SupplierFilterSheet
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
        entityType="Supplier"
        entityName={selectedSupplier?.name ?? ""}
        loading={deleting}
        onConfirm={handleDelete}
      />

      <ProgressDialog
        open={deleting}
        title="Deleting Supplier"
        description="Please wait while deleting the supplier..."
      />
    </PageContainer>
  );
}
