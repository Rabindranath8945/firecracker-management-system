import { ReactNode } from "react";

export interface MasterPickerItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export interface MasterPickerSheetProps {
  open: boolean;

  title: string;

  placeholder?: string;

  loading?: boolean;

  items: MasterPickerItem[];

  value?: string;

  addButtonLabel?: string;

  onClose: () => void;

  onSelect: (id: string) => void;

  onAddNew?: () => void;
}
