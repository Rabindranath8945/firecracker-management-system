"use client";

import { CheckCircle2, Plus, ArrowRight } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface SuccessDialogProps {
  open: boolean;

  title: string;
  description: string;

  primaryLabel?: string;
  secondaryLabel?: string;

  onPrimary: () => void;
  onSecondary?: () => void;
}

export default function SuccessDialog({
  open,
  title,
  description,
  primaryLabel = "View Details",
  secondaryLabel = "Add Another",
  onPrimary,
  onSecondary,
}: SuccessDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="max-w-sm overflow-hidden rounded-3xl border-0 p-0 shadow-2xl"
      >
        {/* Top */}

        <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 px-6 py-10 text-center text-white">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <CheckCircle2 className="h-14 w-14" />
          </div>

          <h2 className="mt-6 text-2xl font-bold">{title}</h2>

          <p className="mt-2 text-sm text-emerald-100">{description}</p>
        </div>

        {/* Bottom */}

        <div className="space-y-3 p-6">
          <Button className="h-11 w-full rounded-xl" onClick={onPrimary}>
            <ArrowRight className="mr-2 h-4 w-4" />

            {primaryLabel}
          </Button>

          {onSecondary && (
            <Button
              variant="outline"
              className="h-11 w-full rounded-xl"
              onClick={onSecondary}
            >
              <Plus className="mr-2 h-4 w-4" />

              {secondaryLabel}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
