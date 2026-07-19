"use client";

import { Loader2, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PartyFooterProps {
  loading?: boolean;
  saveLabel: string;
  cancelLabel?: string;
  onCancel: () => void;
}

export default function PartyFooter({
  loading = false,
  saveLabel,
  cancelLabel = "Cancel",
  onCancel,
}: PartyFooterProps) {
  return (
    <div className="sticky bottom-0 z-40 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex gap-3">
        {/* Cancel */}

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-11 flex-1 rounded-xl border-slate-200"
        >
          <X className="mr-2 h-4 w-4" />
          {cancelLabel}
        </Button>

        {/* Save */}

        <Button
          type="submit"
          disabled={loading}
          className="h-11 flex-[2] rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 shadow-lg transition-all hover:shadow-xl"
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
