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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[92vh] overflow-y-auto rounded-t-[32px] border-0 bg-gradient-to-b from-background via-background to-slate-50 px-6 pb-8 pt-5 shadow-2xl dark:to-slate-950"
      >
        <SuccessHeader
          title={title}
          {...(description ? { description } : {})}
          {...(icon ? { icon } : {})}
          onClose={() => onOpenChange(false)}
        />

        <SuccessSummary title="Details" items={summary} />

        {status.length > 0 && <SuccessStatus items={status} />}

        <SuccessActions
          primaryAction={primaryAction}
          secondaryActions={secondaryActions}
        />
      </SheetContent>
    </Sheet>
  );
}
