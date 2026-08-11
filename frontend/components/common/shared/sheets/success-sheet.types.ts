import { ReactNode } from "react";

export interface SuccessStatusItem {
  label: string;
  value: string;
  color?: "success" | "warning" | "error" | "info";
}

export interface SuccessSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description?: string;
  icon?: React.ReactNode;

  summary: {
    label: string;
    value: string;
  }[];

  status?: SuccessStatusItem[];

  primaryAction: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };

  secondaryActions?: {
    label: string;
    icon?: React.ReactNode;
    variant?: "default" | "outline" | "ghost";
    onClick: () => void;
  }[];
}
