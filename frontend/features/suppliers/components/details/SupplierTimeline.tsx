"use client";

import { CreditCard, FileText, ShoppingBag, UserPlus } from "lucide-react";

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "supplier" | "purchase" | "payment" | "bill";
}

interface SupplierTimelineProps {
  timeline?: TimelineItem[];
}

export default function SupplierTimeline({
  timeline = [],
}: SupplierTimelineProps) {
  const getIcon = (type: TimelineItem["type"]) => {
    switch (type) {
      case "supplier":
        return {
          icon: UserPlus,
          color: "bg-blue-100 text-blue-600",
        };

      case "purchase":
        return {
          icon: ShoppingBag,
          color: "bg-orange-100 text-orange-600",
        };

      case "payment":
        return {
          icon: CreditCard,
          color: "bg-emerald-100 text-emerald-600",
        };

      case "bill":
        return {
          icon: FileText,
          color: "bg-violet-100 text-violet-600",
        };

      default:
        return {
          icon: FileText,
          color: "bg-slate-100 text-slate-600",
        };
    }
  };

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Activity Timeline</h2>

        <p className="mt-1 text-sm text-slate-500">
          Recent supplier activities
        </p>
      </div>

      {timeline.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-slate-300" />

          <h3 className="mt-4 font-semibold text-slate-700">
            No Activities Yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Purchase history and payments will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {timeline.map((item, index) => {
            const { icon: Icon, color } = getIcon(item.type);

            return (
              <div key={item.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {index !== timeline.length - 1 && (
                    <div className="mt-2 h-12 w-px bg-slate-200" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.description}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
