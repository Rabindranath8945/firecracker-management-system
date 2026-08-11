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
    <div className="sticky bottom-0 z-20 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-4xl gap-3">
        {/* Cancel */}

        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={onCancel}
          className="
            h-14
            flex-1
            rounded-2xl
            border-slate-200
            text-slate-700
            transition-all
            hover:bg-slate-100
          "
        >
          <X className="mr-2 h-5 w-5" />
          {cancelLabel}
        </Button>

        {/* Save */}

        <Button
          type="submit"
          disabled={loading}
          className="
            h-14
            flex-[2]
            rounded-2xl
            bg-gradient-to-r
            from-slate-900
            via-slate-800
            to-slate-700
            text-white
            shadow-lg
            transition-all
            hover:scale-[1.02]
            hover:shadow-xl
            active:scale-[0.98]
          "
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              {saveLabel}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
