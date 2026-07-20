"use client";

interface DataTableBodyProps {
  children: React.ReactNode;
}

export default function DataTableBody({ children }: DataTableBodyProps) {
  return <tbody>{children}</tbody>;
}
