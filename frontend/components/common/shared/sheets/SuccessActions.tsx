"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { SuccessAction } from "./success-sheet.types";

interface SuccessActionsProps {
  primaryAction: SuccessAction;
  secondaryActions?: SuccessAction[];
}

export default function SuccessActions({
  primaryAction,
  secondaryActions = [],
}: SuccessActionsProps) {
  return (
    <div className="mt-8 space-y-5">
      {/* Primary Action */}
      <Button
        onClick={primaryAction.onClick}
        className="h-14 w-full rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-base font-semibold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
      >
        {primaryAction.icon && (
          <span className="mr-2 flex items-center">{primaryAction.icon}</span>
        )}

        {primaryAction.label}

        <ArrowRight className="ml-auto h-5 w-5" />
      </Button>

      {/* Secondary Actions */}
      {secondaryActions.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {secondaryActions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant ?? "outline"}
              onClick={action.onClick}
              className="h-12 rounded-2xl"
            >
              {action.icon && (
                <span className="mr-2 flex items-center">{action.icon}</span>
              )}

              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
