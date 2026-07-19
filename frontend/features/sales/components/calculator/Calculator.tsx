"use client";

import { useState } from "react";
import { useSaleStore } from "../../store/useSaleStore";
import { CalculatorDisplay } from "./CalculatorDisplay";
import { CalculatorKeypad } from "./CalculatorKeypad";

export function Calculator() {
  const quantity = useSaleStore((s) => s.quantity);

  const setQuantity = useSaleStore((s) => s.setQuantity);

  return (
    <section className="space-y-4">
      <CalculatorDisplay quantity={quantity} />

      <CalculatorKeypad quantity={quantity} onChange={setQuantity} />

      {/* Keypad comes next */}
    </section>
  );
}
