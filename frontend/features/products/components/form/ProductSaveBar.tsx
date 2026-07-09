"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";

export default function ProductSaveBar() {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto w-full max-w-md p-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-2xl"
        >
          {isSubmitting ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </div>
  );
}
