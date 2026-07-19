"use client";

import { Loader2, Trash2 } from "lucide-react";

import ConfirmDialog from "./ConfirmDialog";

import { AlertDialogAction } from "@/components/ui/alert-dialog";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  entityName: string;
  entityType: string;

  loading?: boolean;

  onConfirm: () => void | Promise<void>;
}

export default function DeleteDialog({
  open,
  onOpenChange,
  entityName,
  entityType,
  loading = false,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      loading={loading}
      title={`Delete ${entityType}`}
      description={`Are you sure you want to delete "${entityName}"? This action cannot be undone.`}
      onConfirm={onConfirm}
      confirmButton={
        <AlertDialogAction
          className="bg-red-600 hover:bg-red-700"
          disabled={loading}
          onClick={(e) => {
            e.preventDefault();
            void onConfirm();
          }}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </>
          )}
        </AlertDialogAction>
      }
    />
  );
}
