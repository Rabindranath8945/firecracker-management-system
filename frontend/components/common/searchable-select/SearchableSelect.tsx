"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type {
  SearchableSelectOption,
  SearchableSelectProps,
} from "./searchable-select.types";

export default function SearchableSelect({
  value,
  options,
  disabled,
  loading,

  placeholder = "Select",

  searchPlaceholder = "Search...",

  emptyMessage = "No data found.",

  addButtonLabel = "Add New",

  onChange,

  onAddNew,

  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selected = React.useMemo(
    () => options.find((item) => item.value === value),
    [options, value],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full">
        <div
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex h-11 w-full cursor-pointer items-center justify-between rounded-xl border border-input bg-background px-3 text-sm",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          {selected ? (
            <span className="flex items-center gap-2">
              {selected.icon}
              {selected.label}
            </span>
          ) : (
            placeholder
          )}

          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />

          <CommandList>
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : (
              <>
                <CommandEmpty>
                  <div className="space-y-3 py-4">
                    <p className="text-sm text-muted-foreground">
                      {emptyMessage}
                    </p>

                    {onAddNew && (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setOpen(false);

                          onAddNew();
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />

                        {addButtonLabel}
                      </Button>
                    )}
                  </div>
                </CommandEmpty>

                <CommandGroup>
                  {options.map((option: SearchableSelectOption) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        onChange(option.value);

                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0",
                        )}
                      />

                      {option.icon}

                      <span className="ml-2">{option.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>

                {onAddNew && (
                  <>
                    <div className="mx-2 my-2 border-t" />

                    <div className="p-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setOpen(false);

                          onAddNew();
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />

                        {addButtonLabel}
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
