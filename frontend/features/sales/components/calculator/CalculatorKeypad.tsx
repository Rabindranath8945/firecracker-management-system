"use client";

import { motion } from "framer-motion";
import { Delete, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CalculatorKeypadProps {
  quantity: number;
  onChange: (value: number) => void;
}

const KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "00", "0"];

export function CalculatorKeypad({
  quantity,
  onChange,
}: CalculatorKeypadProps) {
  const append = (value: string) => {
    const digit = Number(value);

    if (value === "00") {
      onChange(quantity * 100);
      return;
    }

    if (quantity === 0) {
      onChange(digit);
      return;
    }

    onChange(Number(`${quantity}${value}`));
  };

  const backspace = () => {
    const next = quantity.toString().slice(0, -1);

    onChange(next ? Number(next) : 0);
  };

  const clear = () => {
    onChange(0);
  };

  return (
    <div className="rounded-3xl border bg-card p-4">
      <div className="grid grid-cols-3 gap-3">
        {KEYS.map((key) => (
          <motion.div key={key} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              className="
h-16
w-full
rounded-3xl
border-0
bg-background
text-2xl
font-bold
shadow-sm
transition-all
hover:shadow-md
active:scale-95
"
              onClick={() => append(key)}
            >
              {key}
            </Button>
          </motion.div>
        ))}

        <Button
          variant="destructive"
          className="
h-16
rounded-3xl
bg-red-100
text-red-600
hover:bg-red-200
"
          onClick={backspace}
        >
          <Delete className="mr-2 h-5 w-5" />
          Del
        </Button>

        <Button
          variant="secondary"
          className="
h-16
rounded-3xl
bg-amber-100
text-amber-700
hover:bg-amber-200
"
          onClick={clear}
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Clear
        </Button>
      </div>
    </div>
  );
}
