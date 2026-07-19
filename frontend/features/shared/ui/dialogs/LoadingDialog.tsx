"use client";

import { Loader2 } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface LoadingDialogProps {
  open: boolean;

  title?: string;

  description?: string;
}

export default function LoadingDialog({
  open,
  title = "Please wait...",
  description = "We're processing your request.",
}: LoadingDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="max-w-sm rounded-3xl border-0 p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>

          <h2 className="text-xl font-semibold">{title}</h2>

          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
