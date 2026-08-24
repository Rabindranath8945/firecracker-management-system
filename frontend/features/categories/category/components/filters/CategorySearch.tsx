"use client";

import { Search, X } from "lucide-react";

interface CategorySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CategorySearch({
  value,
  onChange,
  placeholder = "Search categories...",
}: CategorySearchProps) {
  return (
    <div
      className="
        flex
        h-12
        items-center
        gap-3
        rounded-2xl
        border
        border-slate-200
        bg-slate-50
        px-4
        transition-all
        duration-200
        focus-within:border-sky-300
        focus-within:bg-white
        focus-within:ring-4
        focus-within:ring-sky-500/10
      "
    >
      <Search className="h-5 w-5 shrink-0 text-slate-400" />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="
          min-w-0
          flex-1
          bg-transparent
          text-sm
          text-slate-900
          outline-none
          placeholder:text-slate-400
        "
      />

      {value.trim() && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-full
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-slate-600
          "
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
