"use client";

import { ArrowRight, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { SuccessSheetProps } from "./success-sheet.types";

type PrimaryAction = SuccessSheetProps["primaryAction"];

type SecondaryAction = NonNullable<
  SuccessSheetProps["secondaryActions"]
>[number];

interface SuccessActionsProps {
  primaryAction: PrimaryAction;
  secondaryActions?: SecondaryAction[];
}

export default function SuccessActions({
  primaryAction,
  secondaryActions = [],
}: SuccessActionsProps) {
  return (
    <div className="space-y-3">
      {/* ------------------------------------------------------------------ */}
      {/* PRIMARY ACTION                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative">
        {/* Soft ambient glow */}

        <div
          className="
            pointer-events-none
            absolute
            -inset-1
            rounded-[22px]
            bg-primary/15
            opacity-70
            blur-lg
          "
        />

        <Button
          type="button"
          onClick={primaryAction.onClick}
          className="
            group
            relative
            h-13
            w-full
            overflow-hidden
            rounded-[18px]
            border
            border-primary/20
            bg-primary
            px-4
            text-sm
            font-semibold
            text-primary-foreground
            shadow-lg
            shadow-primary/15
            transition-all
            duration-300
            hover:bg-primary/90
            hover:shadow-xl
            hover:shadow-primary/20
            active:scale-[0.985]
          "
        >
          {/* Animated shine */}

          <span
            className="
              pointer-events-none
              absolute
              inset-y-0
              -left-1/2
              w-1/3
              -skew-x-12
              bg-gradient-to-r
              from-transparent
              via-white/20
              to-transparent
              opacity-0
              transition-all
              duration-700
              group-hover:left-[120%]
              group-hover:opacity-100
            "
          />

          {/* Content */}

          <span className="relative flex min-w-0 flex-1 items-center justify-center gap-2.5">
            {primaryAction.icon && (
              <span
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/10
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >
                {primaryAction.icon}
              </span>
            )}

            <span className="truncate">{primaryAction.label}</span>
          </span>

          {/* Arrow */}

          <span
            className="
              relative
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-white/10
              transition-all
              duration-300
              group-hover:translate-x-1
              group-hover:bg-white/15
            "
          >
            <ArrowRight
              className="
                h-4
                w-4
                transition-transform
                duration-300
                group-hover:translate-x-0.5
              "
            />
          </span>
        </Button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SECONDARY ACTIONS                                                  */}
      {/* ------------------------------------------------------------------ */}

      {secondaryActions.length > 0 && (
        <div
          className={
            secondaryActions.length === 1
              ? "grid grid-cols-1"
              : "grid grid-cols-2 gap-2.5"
          }
        >
          {secondaryActions.map((action, index) => (
            <Button
              key={action.label}
              type="button"
              variant={action.variant ?? "outline"}
              onClick={action.onClick}
              className="
                group
                relative
                h-11
                overflow-hidden
                rounded-[17px]
                border-border/60
                bg-background/80
                px-3
                text-xs
                font-medium
                shadow-sm
                backdrop-blur-sm
                transition-all
                duration-300
                hover:border-primary/25
                hover:bg-muted/50
                hover:shadow-md
                active:scale-[0.98]
              "
              style={{
                animationDelay: `${index * 80}ms`,
              }}
            >
              {/* Hover background */}

              <span
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-primary/[0.04]
                  via-transparent
                  to-primary/[0.04]
                  opacity-0
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                "
              />

              {/* Content */}

              <span className="relative flex min-w-0 flex-1 items-center justify-center gap-2">
                {action.icon && (
                  <span
                    className="
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-muted
                      text-muted-foreground
                      transition-all
                      duration-300
                      group-hover:bg-primary/10
                      group-hover:text-primary
                    "
                  >
                    {action.icon}
                  </span>
                )}

                <span className="truncate">{action.label}</span>
              </span>

              {/* Arrow */}

              <ChevronRight
                className="
                  relative
                  h-4
                  w-4
                  shrink-0
                  text-muted-foreground/60
                  transition-all
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:text-primary
                "
              />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
