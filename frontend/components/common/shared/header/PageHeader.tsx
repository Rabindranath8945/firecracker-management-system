"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  rightAction?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  backHref,
  rightAction,
}: PageHeaderProps) {
  const router = useRouter();

  function handleBack() {
    if (backHref) {
      router.push(backHref);
      return;
    }

    router.back();
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="h-10 w-10 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>

          {description && (
            <p className="text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>

      {rightAction}
    </div>
  );
}
