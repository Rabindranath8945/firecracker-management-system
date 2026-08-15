"use client";

import { CheckCircle2, Loader2, ScanText } from "lucide-react";

interface InvoiceProcessingDialogProps {
  open: boolean;
}

const STEPS = [
  "Detecting Supplier",
  "Reading Products",
  "Calculating GST",
  "Matching Database",
];

export default function InvoiceProcessingDialog({
  open,
}: InvoiceProcessingDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/60
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-[360px]
          overflow-hidden
          rounded-[28px]
          border
          bg-card
          shadow-2xl
        "
      >
        {/* Header */}

        <div
          className="
            bg-gradient-to-br
            from-emerald-600
            via-green-600
            to-teal-600
            px-6
            py-7
            text-center
            text-white
          "
        >
          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-white/15
              shadow-inner
              backdrop-blur
            "
          >
            <ScanText className="h-8 w-8" />
          </div>

          <h2 className="mt-4 text-lg font-bold">AI Processing Invoice</h2>

          <p className="mt-1 text-xs text-white/80">
            Please wait while we read your invoice
          </p>
        </div>

        {/* Body */}

        <div className="p-5">
          {/* Main Loader */}

          <div className="mb-5 flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />

            <span className="text-sm font-medium">Processing invoice...</span>
          </div>

          {/* Steps */}

          <div className="space-y-2">
            {STEPS.map((step, index) => (
              <ProcessingStep key={step} text={step} active={index === 0} />
            ))}
          </div>

          {/* Notice */}

          <div className="mt-5 rounded-2xl bg-muted/40 px-4 py-3 text-center">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              OCR may take a few seconds. Please don't close this screen while
              the invoice is being processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              PROCESSING STEP                               */
/* -------------------------------------------------------------------------- */

interface ProcessingStepProps {
  text: string;
  active: boolean;
}

function ProcessingStep({ text, active }: ProcessingStepProps) {
  return (
    <div
      className={`
        flex
        items-center
        gap-3
        rounded-xl
        px-3
        py-2.5
        transition-all
        ${active ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-muted/30"}
      `}
    >
      <div
        className={`
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-lg
          ${active ? "bg-emerald-100 dark:bg-emerald-500/15" : "bg-muted"}
        `}
      >
        {active ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600 dark:text-emerald-400" />
        ) : (
          <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>

      <span
        className={`
          text-xs
          font-medium
          ${active ? "text-foreground" : "text-muted-foreground"}
        `}
      >
        {text}
      </span>

      {active && (
        <span className="ml-auto text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
          Processing
        </span>
      )}
    </div>
  );
}
