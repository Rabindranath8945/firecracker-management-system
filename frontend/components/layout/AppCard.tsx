import { cn } from "@/lib/utils";

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function AppCard({ children, className }: AppCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        "border border-slate-200",
        "bg-white",
        "shadow-sm",
        "p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
