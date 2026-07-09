"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductTopBarProps {
  onAdd?: () => void;
}

export default function ProductTopBar({ onAdd }: ProductTopBarProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Products</h1>
        <p className="text-sm text-muted-foreground">Manage your inventory</p>
      </div>

      <Button size="icon" onClick={onAdd} className="rounded-xl">
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}
