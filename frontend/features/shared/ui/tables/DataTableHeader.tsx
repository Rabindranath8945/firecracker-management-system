"use client";

interface DataTableHeaderProps {
  children: React.ReactNode;
}

export default function DataTableHeader({ children }: DataTableHeaderProps) {
  return (
    <thead className="sticky top-0 z-10 border-b bg-slate-50">{children}</thead>
  );
}
