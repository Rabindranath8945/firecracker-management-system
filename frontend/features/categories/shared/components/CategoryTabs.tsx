"use client";

import { FolderTree, FolderOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  value: "CATEGORY" | "SUB_CATEGORY";
  onChange: (value: "CATEGORY" | "SUB_CATEGORY") => void;
}

export default function CategoryTabs({ value, onChange }: Props) {
  return (
    <div className="flex rounded-2xl bg-slate-100 p-1">
      <Button
        type="button"
        variant={value === "CATEGORY" ? "default" : "ghost"}
        className="flex-1 rounded-xl"
        onClick={() => onChange("CATEGORY")}
      >
        <FolderTree className="mr-2 h-4 w-4" />
        Categories
      </Button>

      <Button
        type="button"
        variant={value === "SUB_CATEGORY" ? "default" : "ghost"}
        className="flex-1 rounded-xl"
        onClick={() => onChange("SUB_CATEGORY")}
      >
        <FolderOpen className="mr-2 h-4 w-4" />
        Sub Categories
      </Button>
    </div>
  );
}
