"use client";

import { CheckCircle2, AlertCircle, Info } from "lucide-react";

import { Card } from "@/components/ui/card";

export interface SuccessStatusItem {
  label: string;
  value: string;
  color?: "success" | "warning" | "error" | "info";
}

interface SuccessStatusProps {
  title?: string;
  items: SuccessStatusItem[];
}

export default function SuccessStatus({
  title = "Status",
  items,
}: SuccessStatusProps) {
  if (items.length === 0) {
    return null;
  }

  function getColor(color?: SuccessStatusItem["color"]) {
    switch (color) {
      case "warning":
        return {
          bg: "bg-amber-100",
          text: "text-amber-600",
          icon: <AlertCircle className="h-4 w-4" />,
        };

      case "error":
        return {
          bg: "bg-red-100",
          text: "text-red-600",
          icon: <AlertCircle className="h-4 w-4" />,
        };

      case "info":
        return {
          bg: "bg-sky-100",
          text: "text-sky-600",
          icon: <Info className="h-4 w-4" />,
        };

      default:
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-600",
          icon: <CheckCircle2 className="h-4 w-4" />,
        };
    }
  }

  return (
    <Card className="overflow-hidden rounded-3xl border shadow-sm">
      <div className="border-b bg-muted/40 px-5 py-4">
        <h3 className="font-semibold">{title}</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Operation completed successfully.
        </p>
      </div>

      <div className="space-y-3 p-5">
        {items.map((item) => {
          const style = getColor(item.color);

          return (
            <div
              key={`${item.label}-${item.value}`}
              className="
                flex
                items-center
                justify-between
                rounded-2xl
                bg-white
                p-3
                shadow-sm
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${style.bg} ${style.text}`}
                >
                  {style.icon}
                </div>

                <span className="font-medium">{item.label}</span>
              </div>

              <span className={`font-semibold ${style.text}`}>
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
