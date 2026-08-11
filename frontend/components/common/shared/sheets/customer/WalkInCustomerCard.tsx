"use client";

import { User, ChevronRight, Users } from "lucide-react";

import { Card } from "@/components/ui/card";

interface WalkInCustomerCardProps {
  onClick: () => void;
}

export default function WalkInCustomerCard({
  onClick,
}: WalkInCustomerCardProps) {
  return (
    <Card
      onClick={onClick}
      className="
        cursor-pointer
        rounded-3xl
        border-2
        border-violet-100
        bg-gradient-to-r
        from-violet-50
        to-fuchsia-50
        p-4
        transition-all
        duration-200
        hover:border-violet-300
        hover:shadow-lg
        active:scale-[0.99]
      "
    >
      <div className="flex items-center justify-between">
        {/* Left */}

        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-violet-600
              shadow-md
            "
          >
            <User className="h-7 w-7 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Walk-in Customer</h3>

              <span
                className="
                  rounded-full
                  bg-violet-600
                  px-2
                  py-0.5
                  text-[10px]
                  font-semibold
                  text-white
                "
              >
                DEFAULT
              </span>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Cash sale without customer details
            </p>

            <div className="mt-2 flex items-center gap-2 text-[11px] text-violet-700">
              <Users className="h-3.5 w-3.5" />

              <span>Quick Billing</span>

              <span>•</span>

              <span>No Due Tracking</span>
            </div>
          </div>
        </div>

        {/* Right */}

        <ChevronRight className="h-5 w-5 text-violet-500" />
      </div>
    </Card>
  );
}
