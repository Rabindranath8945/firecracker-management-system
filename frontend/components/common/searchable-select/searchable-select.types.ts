import { ReactNode } from "react";

export interface SearchableSelectOption {
  label: string;
  value: string;
  icon?: ReactNode;
}

export interface SearchableSelectProps {
  label?: string;

  placeholder?: string;

  searchPlaceholder?: string;

  emptyMessage?: string;

  value?: string;

  disabled?: boolean;

  loading?: boolean;

  options: SearchableSelectOption[];

  onChange: (value: string) => void;

  onAddNew?: () => void;

  addButtonLabel?: string;

  className?: string;
}
