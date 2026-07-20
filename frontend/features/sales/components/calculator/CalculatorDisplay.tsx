"use client";

import { Hash } from "lucide-react";
import { motion } from "framer-motion";

interface CalculatorDisplayProps {
  quantity: number;
}

export function CalculatorDisplay({ quantity }: CalculatorDisplayProps) {
  return (
    <motion.div
      layout
      className="
        overflow-hidden
        rounded-3xl
        border
        bg-gradient-to-br
        from-background
        to-muted/40
        shadow-sm
      "
    >
      <div className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Quantity
          </p>

          <motion.h1
            key={quantity}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="mt-2 text-6xl font-black tracking-tight"
          >
            {quantity}
          </motion.h1>
        </div>

        <div
          className="
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-3xl
            bg-primary/10
          "
        >
          <Hash className="h-10 w-10 text-primary" />
        </div>
      </div>

      <div className="h-1 w-full bg-primary/15">
        <div className="h-full w-1/3 rounded-full bg-primary" />
      </div>
    </motion.div>
  );
}
