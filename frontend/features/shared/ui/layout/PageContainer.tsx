"use client";

import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className,
}: PageContainerProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-4xl",
        "px-4 py-5",
        "sm:px-6",
        "lg:px-8",
        "pb-28",
        className,
      )}
    >
      {children}
    </main>
  );
}
