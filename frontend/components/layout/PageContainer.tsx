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
        "min-h-screen bg-slate-50",
        "pt-[72px]",
        "pb-[88px]",
        "mx-auto",
        "w-full",
        "max-w-md",
        className,
      )}
    >
      {children}
    </main>
  );
}
