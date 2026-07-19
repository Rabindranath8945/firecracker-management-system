"use client";

import { Building2, Mic, ScanLine } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SalesHeroProps {
  title: string;
  description: string;
  showActions?: boolean;
}

export function SalesHero({
  title,
  description,
  showActions = false,
}: SalesHeroProps) {
  return (
    <section className="border-b bg-background">
      <div className="px-4 py-5">
        {/* Title */}

        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

          <p className="text-muted-foreground">{description}</p>
        </div>

        {/* Actions */}

        {showActions && (
          <div className="mt-5 flex items-center justify-between gap-3">
            <Button variant="outline" className="h-11 rounded-2xl">
              <Building2 className="mr-2 h-4 w-4" />
              Wholesale
            </Button>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-11 w-11 rounded-2xl"
              >
                <Mic className="h-5 w-5" />
              </Button>

              <Button
                size="icon"
                variant="outline"
                className="h-11 w-11 rounded-2xl"
              >
                <ScanLine className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
