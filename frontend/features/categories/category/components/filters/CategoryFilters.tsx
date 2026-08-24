"use client";

import { ChevronDown } from "lucide-react";

interface CategoryFiltersProps {
  status: string;
  sort: string;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const STATUS_OPTIONS = [
  {
    value: "ALL",
    label: "All Categories",
  },
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
  },
];

const SORT_OPTIONS = [
  {
    value: "NAME_ASC",
    label: "A → Z",
  },
  {
    value: "NAME_DESC",
    label: "Z → A",
  },
];

interface FilterSelectProps {
  label: string;
  value: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <div className="min-w-0">
      <label
        className="
          mb-1.5
          block
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.15em]
          text-slate-400
        "
      >
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="
            h-11
            w-full
            appearance-none
            rounded-xl
            border
            border-slate-200
            bg-white
            px-3
            pr-9
            text-sm
            text-slate-700
            outline-none
            transition
            focus:border-sky-300
            focus:ring-4
            focus:ring-sky-500/10
          "
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            -translate-y-1/2
            text-slate-400
          "
        />
      </div>
    </div>
  );
}

export default function CategoryFilters({
  status,
  sort,
  onStatusChange,
  onSortChange,
}: CategoryFiltersProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FilterSelect
        label="Status"
        value={status}
        onChange={onStatusChange}
        options={STATUS_OPTIONS}
      />

      <FilterSelect
        label="Sort"
        value={sort}
        onChange={onSortChange}
        options={SORT_OPTIONS}
      />
    </div>
  );
}
