"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import PageContainer from "@/features/shared/ui/layout/PageContainer";

import type { ReportSummary } from "../types/report";

import ReportHeader from "./ReportHeader";
import ReportStats from "./ReportStats";

interface ReportLayoutProps {
  title: string;
  description: string;

  totalRecords: number;

  summary: ReportSummary[];

  showBackButton?: boolean;

  toolbar?: ReactNode;

  children: ReactNode;

  onExport?: () => void;

  loading?: boolean;

  error?: string | null;
}

export default function ReportLayout({
  title,
  description,
  totalRecords,
  summary,
  showBackButton = false,
  toolbar,
  children,
  onExport,
  loading = false,
  error = null,
}: ReportLayoutProps) {
  const router = useRouter();

  return (
    <PageContainer className="space-y-6 pb-10">
      {/* Back */}
      {showBackButton && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="w-fit rounded-2xl shadow-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Button>
      )}

      {/* Header */}
      <ReportHeader
        title={title}
        description={description}
        totalRecords={totalRecords}
        loading={loading}
        {...(onExport ? { onExport } : {})}
      />

      {/* Toolbar */}
      {toolbar}

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      {!loading && summary.length > 0 && <ReportStats items={summary} />}

      {/* Content */}
      {children}
    </PageContainer>
  );
}
