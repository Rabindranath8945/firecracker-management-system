"use client";

import { useMemo, useState } from "react";

import { Check, Plus, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type {
  MasterPickerItem,
  MasterPickerSheetProps,
} from "./master-picker.types";

export default function MasterPickerSheet({
  open,
  title,
  placeholder = "Search...",
  loading,
  items,
  value,
  addButtonLabel = "Add New",
  onClose,
  onSelect,
  onAddNew,
}: MasterPickerSheetProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return items.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [items, search]);

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setSearch("");
          onClose();
        }
      }}
    >
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
        <SheetHeader className="sticky top-0 z-10 border-b bg-background px-5 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle>{title}</SheetTitle>

            <Button type="button" variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="h-12 rounded-2xl pl-12"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-28">
          {loading ? (
            <p className="py-10 text-center text-muted-foreground">
              Loading...
            </p>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Search className="mb-4 h-10 w-10 text-muted-foreground/50" />

              <p className="font-medium">No results found</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Try another keyword.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((item) => {
                const selected = value === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect(item.id);
                      onClose();
                    }}
                    className={cn(
                      "relative flex h-16 items-center justify-center rounded-2xl border bg-background px-3 text-center transition-all duration-200",
                      selected
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border hover:border-primary hover:bg-muted",
                    )}
                  >
                    <span className="line-clamp-2 text-sm font-medium">
                      {item.title}
                    </span>

                    {selected && (
                      <div className="absolute right-2 top-2">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {onAddNew && (
          <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
            <Button
              type="button"
              className="h-12 w-full rounded-xl"
              onClick={onAddNew}
            >
              <Plus className="mr-2 h-4 w-4" />
              {addButtonLabel}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
