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

  toolbar: ReactNode;

  children: ReactNode;

  onExport?: () => void;
}

export default function ReportLayout({
  title,
  description,
  totalRecords,
  summary,
  showBackButton,
  toolbar,
  children,
  onExport,
}: ReportLayoutProps) {
  const router = useRouter();

  return (
    <PageContainer className="space-y-6">
      {showBackButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="w-fit rounded-2xl shadow-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Button>
      )}

      <ReportHeader
        title={title}
        description={description}
        totalRecords={totalRecords}
        {...(onExport && { onExport })}
      />

      {toolbar}

      <ReportStats items={summary} />

      {children}
    </PageContainer>
  );
}
