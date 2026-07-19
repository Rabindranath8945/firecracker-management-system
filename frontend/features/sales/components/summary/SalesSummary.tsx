"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Receipt, IndianRupee, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";

const SUMMARY = [
  {
    title: "Today's Sales",
    value: "₹0",
    icon: IndianRupee,
  },
  {
    title: "Orders",
    value: "0",
    icon: Receipt,
  },
  {
    title: "Items Sold",
    value: "0",
    icon: ShoppingCart,
  },
  {
    title: "Profit",
    value: "₹0",
    icon: TrendingUp,
  },
];

export function SalesSummary() {
  return (
    <section className="grid grid-cols-2 gap-4">
      {SUMMARY.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
            }}
          >
            <Card className="rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>

                  <h2 className="mt-2 text-2xl font-bold">{item.value}</h2>
                </div>

                <div className="rounded-2xl bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </section>
  );
}
