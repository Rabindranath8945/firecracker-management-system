"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";

import SuccessHeader from "./SuccessHeader";
import SuccessSummary from "./SuccessSummary";
import SuccessStatus from "./SuccessStatus";
import SuccessActions from "./SuccessActions";

import type { SuccessSheetProps } from "./success-sheet.types";

export default function SuccessSheet({
  open,
  onOpenChange,
  title,
  description,
  icon,
  summary,
  status = [],
  primaryAction,
  secondaryActions = [],
}: SuccessSheetProps) {
  return (
    <Sheet open={open === true} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="
          flex
          max-h-[92vh]
          flex-col
          overflow-hidden
          rounded-t-[32px]
          border-0
          bg-background
          p-0
          shadow-2xl
          [&>button]:hidden
        "
      >
        <div className="shrink-0 px-6 pt-4">
          <div className="mx-auto h-1 w-12 rounded-full bg-muted-foreground/20" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-5 pt-3">
          <SuccessHeader
            title={title}
            {...(description !== undefined ? { description } : {})}
            {...(icon !== undefined ? { icon } : {})}
            onClose={() => onOpenChange(false)}
          />

          <div className="mt-5 space-y-4">
            <SuccessSummary title="Details" items={summary} />

            {status.length > 0 && <SuccessStatus items={status} />}
          </div>
        </div>

        <div
          className="
            shrink-0
            border-t
            bg-background
            px-6
            pb-[calc(1rem+env(safe-area-inset-bottom))]
            pt-3
          "
        >
          <SuccessActions
            primaryAction={primaryAction}
            secondaryActions={secondaryActions}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
