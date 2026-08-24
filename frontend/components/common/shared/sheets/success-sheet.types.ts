import type { ReactNode } from "react";

export interface SuccessSummaryItem {
  label: string;
  value: string;
}

export interface SuccessStatusItem {
  label: string;
  value: string;
  color?: "success" | "warning" | "error" | "info";
}

export interface SuccessAction {
  label: string;
  icon?: ReactNode;
  variant?: "default" | "outline" | "ghost";
  onClick: () => void;
}

export interface SuccessSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description?: string;
  icon?: ReactNode;

  summary: SuccessSummaryItem[];

  status?: SuccessStatusItem[];

  primaryAction: SuccessAction;

  secondaryActions?: SuccessAction[];
}
