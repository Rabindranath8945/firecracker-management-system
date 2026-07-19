"use client";

import { Loader2, Save } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useSaleCalculation } from "@/features/sales/hooks/useSaleCalculation";
import { useSaleStore } from "@/features/sales/store/useSaleStore";

interface StickySaveBarProps {
  loading?: boolean;
  onSave?: () => void;
}

export function StickySaveBar({ loading = false, onSave }: StickySaveBarProps) {
  const { totalItems, grandTotal } = useSaleCalculation();

  const paymentMethod = useSaleStore((s) => s.paymentMethod);

  const disabled = totalItems === 0 || loading;

  return (
    <motion.div
      initial={{ y: 120 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 28,
      }}
      className="fixed bottom-20 left-4 right-4 z-50"
    >
      <div
        className="
          rounded-3xl
          border
          bg-background/95
          backdrop-blur-xl
          shadow-2xl
          px-4
          py-3
        "
      >
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Grand Total</p>

            <h2 className="text-2xl font-bold">
              ₹{grandTotal.toLocaleString()}
            </h2>

            <p className="text-xs text-muted-foreground">
              {totalItems} Items • {paymentMethod}
            </p>
          </div>

          <Button
            size="lg"
            disabled={disabled}
            onClick={onSave}
            className="
              h-12
              min-w-[150px]
              rounded-2xl
              text-base
              font-semibold
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
                Save Sale
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
