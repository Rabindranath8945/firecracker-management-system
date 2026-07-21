"use client";

import type { ReactNode } from "react";

import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import PageContainer from "@/features/shared/ui/layout/PageContainer";
import PageHeader from "@/features/shared/ui/layout/PageHeader";

interface SettingsFormLayoutProps {
  title: string;
  description: string;

  children: ReactNode;

  onSave?: () => void;
}

export default function SettingsFormLayout({
  title,
  description,
  children,
  onSave,
}: SettingsFormLayoutProps) {
  const router = useRouter();

  return (
    <PageContainer className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="w-fit rounded-xl px-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <PageHeader
        title={title}
        description={description}
        action={
          onSave ? (
            <Button onClick={onSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          ) : undefined
        }
      />

      <div className="rounded-3xl border bg-card p-6 shadow-sm">{children}</div>
    </PageContainer>
  );
}
