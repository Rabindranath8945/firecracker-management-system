"use client";

import { Clock3 } from "lucide-react";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-6 dark:bg-background">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          flex
          w-full
          max-w-sm
          flex-col
          items-center
          justify-center
          rounded-[32px]
          border
          border-slate-200/80
          bg-white
          px-8
          py-12
          text-center
          shadow-[0_15px_50px_rgba(15,23,42,0.08)]
          dark:border-border
          dark:bg-card
        "
      >
        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-3xl
            bg-orange-100
            dark:bg-orange-500/10
          "
        >
          <Clock3 className="h-8 w-8 text-orange-500 dark:text-orange-400" />
        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-orange-500">
          OneHub ERP System
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-foreground">
          Coming Soon
        </h1>

        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-muted-foreground">
          This module is currently under development and will be available in a
          future update.
        </p>
      </motion.section>
    </main>
  );
}
