"use client";

import { Download, Plus, Printer, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CustomerToolbarProps {
  search: string;
  onSearch: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;

  onAdd?: () => void;
}

export default function CustomerToolbar({
  search,
  onSearch,
  status,
  onStatusChange,
  onAdd,
}: CustomerToolbarProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Search */}

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by customer name, mobile or customer no..."
          className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-12 text-sm shadow-none focus:bg-white"
        />
      </div>

      {/* Actions */}

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Primary */}

        <Button
          onClick={onAdd}
          className="h-12 rounded-2xl bg-slate-900 px-6 text-white hover:bg-slate-800"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Customer
        </Button>

        {/* Secondary */}

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-blue-500"
          >
            <option value="ALL">All Customers</option>

            <option value="Active">Active</option>

            <option value="Inactive">Inactive</option>
          </select>

          <Button variant="outline" className="h-11 rounded-xl">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>

          <Button variant="outline" className="h-11 rounded-xl">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
