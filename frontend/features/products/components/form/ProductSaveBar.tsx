"use client";

import { Loader2, Save } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";

export default function ProductSaveBar() {
  const {
    formState: { isSubmitting, isDirty, isValid },
  } = useFormContext();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto w-full max-w-md p-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-2xl"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Product...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Product
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
