"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface CategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onSelect: (category: string) => void;
}

const categories = [
  "All",
  "Bomb",
  "Rocket",
  "Flower Pot",
  "Sparklers",
  "Fancy",
  "Garland",
  "Gift Box",
];

export default function CategorySheet({
  open,
  onOpenChange,
  value,
  onSelect,
}: CategorySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl p-0">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>Select Category</SheetTitle>
        </SheetHeader>

        <div className="grid grid-cols-2 gap-3 p-5">
          {categories.map((category) => (
            <Button
              key={category}
              variant={value === category ? "default" : "outline"}
              className="h-12 rounded-2xl"
              onClick={() => {
                onSelect(category);
                onOpenChange(false);
              }}
            >
              {category}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
