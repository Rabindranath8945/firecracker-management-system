"use client";

import { ArrowUpDown, Funnel, Search } from "lucide-react";

import SearchInput from "@/features/shared/ui/forms/SearchInput";
import FilterSelect from "@/features/shared/ui/forms/FilterSelect";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExpenseTableFilterProps {
  search: string;
  onSearchChange: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;

  sort: string;
  onSortChange: (value: string) => void;

  total: number;
}

export default function ExpenseTableFilter({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  total,
}: ExpenseTableFilterProps) {
  return (
    <Card className="rounded-3xl shadow-sm">
      <CardContent className="space-y-5 p-5">
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Expenses</h2>

            <p className="text-sm text-slate-500">Total {total} expenses</p>
          </div>
        </div>

        {/* Search */}

        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search expense no, title..."
        />

        {/* Status */}

        <div className="flex flex-wrap gap-2">
          {[
            {
              label: "All",
              value: "ALL",
            },
            {
              label: "Paid",
              value: "PAID",
            },
            {
              label: "Pending",
              value: "PENDING",
            },
            {
              label: "Cancelled",
              value: "CANCELLED",
            },
          ].map((item) => (
            <Button
              key={item.value}
              type="button"
              variant={status === item.value ? "default" : "outline"}
              className="rounded-full"
              onClick={() => onStatusChange(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>

        {/* Bottom */}

        <div className="flex gap-3">
          <FilterSelect
            value={sort}
            onChange={onSortChange}
            options={[
              {
                label: "Newest",
                value: "NEWEST",
              },
              {
                label: "Oldest",
                value: "OLDEST",
              },
              {
                label: "Highest Amount",
                value: "AMOUNT_DESC",
              },
              {
                label: "Lowest Amount",
                value: "AMOUNT_ASC",
              },
            ]}
          />

          <Button variant="outline" className="rounded-xl">
            <Funnel className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
