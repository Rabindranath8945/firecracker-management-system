"use client";

import AppTimeline from "@/features/shared/components/timeline/AppTimeline";

const items = [
  {
    id: 1,
    title: "Product Created",
    description: "Rocket Deluxe was added.",
    time: "Today • 09:45 AM",
    color: "bg-green-500",
  },
  {
    id: 2,
    title: "Stock Updated",
    description: "+200 Pieces",
    time: "Yesterday",
    color: "bg-blue-500",
  },
  {
    id: 3,
    title: "Price Changed",
    description: "Selling ₹300 → ₹320",
    time: "2 days ago",
    color: "bg-orange-500",
  },
];
export default function ProductTimeline() {
  return <AppTimeline items={items} />;
}
