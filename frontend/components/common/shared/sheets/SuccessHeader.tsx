"use client";

import { CheckCircle2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SuccessHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onClose: () => void;
}

export default function SuccessHeader({
  title,
  description,
  icon,
  onClose,
}: SuccessHeaderProps) {
  return (
    <header className="relative">
      {/* ------------------------------------------------------------------ */}
      {/* CLOSE BUTTON                                                       */}
      {/* ------------------------------------------------------------------ */}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onClose}
        aria-label="Close"
        className="
          group
          absolute
          right-0
          top-0
          z-20
          h-9
          w-9
          rounded-full
          border
          border-border/50
          bg-background/80
          text-muted-foreground
          shadow-sm
          backdrop-blur-sm
          transition-all
          duration-300
          hover:border-border
          hover:bg-muted
          hover:text-foreground
          hover:shadow-md
          active:scale-90
        "
      >
        <X
          className="
            h-4
            w-4
            transition-transform
            duration-300
            group-hover:rotate-90
          "
        />
      </Button>

      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                               */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col items-center px-4 pt-3 text-center">
        {/* Success Icon */}

        <div className="relative">
          {/* Soft animated glow */}

          <div
            className="
              absolute
              -inset-5
              rounded-full
              bg-emerald-400/15
              blur-2xl
              transition-all
              duration-1000
              animate-pulse
            "
          />

          {/* Dashed decorative ring */}

          <div
            className="
              absolute
              -inset-2
              rounded-full
              border
              border-dashed
              border-emerald-400/30
              transition-transform
              duration-[8000ms]
              hover:rotate-180
            "
          />

          {/* Outer circle */}

          <div
            className="
              relative
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-emerald-50
              ring-8
              ring-emerald-50/70
              transition-transform
              duration-500
              hover:scale-105
              dark:bg-emerald-500/10
              dark:ring-emerald-500/5
            "
          >
            {/* Inner circle */}

            <div
              className="
                relative
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-emerald-500
                shadow-lg
                shadow-emerald-500/25
                transition-transform
                duration-300
                hover:scale-105
              "
            >
              {/* Inner glow */}

              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  bg-white/10
                  animate-pulse
                "
              />

              {/* Check icon */}

              <span className="relative">
                {icon ?? (
                  <CheckCircle2
                    className="h-8 w-8 text-white"
                    strokeWidth={2.5}
                  />
                )}
              </span>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* TITLE                                                            */}
        {/* ---------------------------------------------------------------- */}

        <h2
          className="
            mt-5
            max-w-[90%]
            text-2xl
            font-bold
            tracking-tight
            text-foreground
          "
        >
          {title}
        </h2>

        {/* ---------------------------------------------------------------- */}
        {/* DESCRIPTION                                                      */}
        {/* ---------------------------------------------------------------- */}

        {description && (
          <p
            className="
              mt-1.5
              max-w-sm
              text-xs
              leading-5
              text-muted-foreground
            "
          >
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
