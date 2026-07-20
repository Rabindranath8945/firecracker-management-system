"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Phone, UserRound, Wallet } from "lucide-react";

export interface SearchCustomer {
  id: string;
  name: string;
  phone: string;
  due: number;
  lastVisit: string;
}

interface CustomerSearchResultProps {
  customers: SearchCustomer[];
  onSelect: (customer: SearchCustomer) => void;
}

export function CustomerSearchResult({
  customers,
  onSelect,
}: CustomerSearchResultProps) {
  if (customers.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="
          mt-3
          overflow-hidden
          rounded-2xl
          border
          bg-background
          shadow-lg
        "
      >
        {customers.map((customer, index) => (
          <button
            key={customer.id}
            type="button"
            onClick={() => onSelect(customer)}
            className={`
              flex
              w-full
              items-start
              gap-3
              p-4
              text-left
              transition-all
              hover:bg-muted/50

              ${index !== customers.length - 1 ? "border-b" : ""}
            `}
          >
            {/* Avatar */}

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-blue-100
              "
            >
              <UserRound className="h-5 w-5 text-blue-600" />
            </div>

            {/* Content */}

            <div className="flex-1">
              <h3 className="font-semibold">{customer.name}</h3>

              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                {customer.phone}
              </div>

              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1 text-xs">
                  <Wallet className="h-3.5 w-3.5 text-red-500" />

                  <span className="text-red-600 font-medium">
                    ₹{customer.due}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5 text-blue-500" />

                  {customer.lastVisit}
                </div>
              </div>
            </div>
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
