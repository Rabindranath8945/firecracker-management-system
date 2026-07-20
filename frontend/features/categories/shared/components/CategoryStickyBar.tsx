"use client";

import { ArrowLeft, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CategoryStickyBarProps {
  loading?: boolean;

  saveLabel: string;

  onSave: () => void;

  onCancel: () => void;
}

export default function CategoryStickyBar({
  loading = false,
  saveLabel,
  onSave,
  onCancel,
}: CategoryStickyBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center gap-3 p-4">
        <Button
          type="button"
          variant="outline"
          className="h-12 flex-1 rounded-xl"
          onClick={onCancel}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel
        </Button>

        <Button
          type="button"
          disabled={loading}
          onClick={onSave}
          className="h-12 flex-1 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 shadow-lg transition-all hover:scale-[1.02]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {saveLabel}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
