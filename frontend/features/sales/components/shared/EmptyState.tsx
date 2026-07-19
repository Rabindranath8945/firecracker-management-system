"use client";

import { PackageOpen } from "lucide-react";

import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="rounded-3xl p-10 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <PackageOpen className="h-8 w-8 text-primary" />
      </div>

      <h2 className="text-xl font-semibold">{title}</h2>

      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}
