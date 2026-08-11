"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

export default function FloatingActionButton({
  href,
  label,
  icon,
}: FloatingActionButtonProps) {
  return (
    <Link href={href}>
      <Button
        size="lg"
        className="
          fixed
          bottom-24
          right-5
          z-50
          h-14
          rounded-full
          px-5
          shadow-xl
        "
      >
        {icon ?? <Plus className="mr-2 h-5 w-5" />}

        {label}
      </Button>
    </Link>
  );
}
