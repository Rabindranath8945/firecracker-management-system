"use client";

import { Filter, Plus, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
}

export default function UserToolbar({
  search,
  onSearchChange,
  onCreate,
}: UserToolbarProps) {
  return (
    <section
      className="
        overflow-hidden
        rounded-[1.75rem]
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}

        <div className="relative min-w-0 flex-1 sm:max-w-md">
          <Search
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-slate-400
            "
          />

          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search name, email or role..."
            className="
              h-12
              rounded-2xl
              border-slate-200
              bg-slate-50
              pl-11
              pr-4
              text-sm
              shadow-none
              transition
              focus-visible:bg-white
            "
          />
        </div>

        {/* Actions */}

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="
              h-12
              rounded-2xl
              border-slate-200
              px-4
            "
          >
            <Filter className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>

          <Button
            type="button"
            onClick={onCreate}
            className="
              h-12
              rounded-2xl
              bg-slate-950
              px-5
              text-white
              shadow-lg
              shadow-slate-950/10
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-slate-800
              hover:shadow-xl
              active:scale-[0.98]
            "
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Toolbar footer */}

      <div
        className="
          flex
          items-center
          gap-2
          border-t
          border-slate-100
          bg-slate-50/70
          px-4
          py-3
          text-xs
          text-slate-500
        "
      >
        <Users className="h-3.5 w-3.5" />

        <span>Manage team members, roles and permissions from one place.</span>
      </div>
    </section>
  );
}
