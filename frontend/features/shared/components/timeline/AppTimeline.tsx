"use client";

import { Clock3 } from "lucide-react";

interface TimelineItem {
  id: number;
  title: string;
  description: string;
  time: string;
  color?: string;
}

interface Props {
  items: TimelineItem[];
}

export default function AppTimeline({ items }: Props) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                item.color ?? "bg-blue-500"
              } text-white`}
            >
              <Clock3 size={18} />
            </div>

            <div className="mt-2 h-full w-px bg-slate-200" />
          </div>

          <div className="flex-1 rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="font-semibold">{item.title}</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {item.description}
            </p>

            <p className="mt-3 text-xs text-slate-400">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
