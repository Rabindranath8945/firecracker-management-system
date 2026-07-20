"use client";

import { cn } from "@/lib/utils";

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageSection({ children, className }: PageSectionProps) {
  return (
    <section
      className={cn(
        "rounded-3xl border bg-background",
        "p-5 md:p-6",
        "shadow-sm",
        className,
      )}
    >
      {children}
    </section>
  );
}
