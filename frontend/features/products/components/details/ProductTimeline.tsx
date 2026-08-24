"use client";

import AppTimeline from "@/features/shared/components/timeline/AppTimeline";

import type { Product } from "../../types/product.types";

interface ProductTimelineProps {
  product: Product;
}

export default function ProductTimeline({ product }: ProductTimelineProps) {
  const items = [
    {
      id: 1,
      title: "Product Created",
      description: `${product.name} was created.`,
      time: new Date(product.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      color: "bg-emerald-500",
    },

    {
      id: 2,
      title: "Last Updated",
      description: "Product information was updated.",
      time: new Date(product.updatedAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      color: "bg-sky-500",
    },

    {
      id: 3,
      title: product.isActive ? "Product Active" : "Product Inactive",
      description: product.isActive
        ? "This product is available for sale."
        : "This product has been disabled.",
      time: new Date(product.updatedAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      color: product.isActive ? "bg-violet-500" : "bg-red-500",
    },

    {
      id: 4,
      title: "Current Stock",
      description: `${product.stock} ${product.unit} available.`,
      time: "Current",
      color: "bg-amber-500",
    },
  ];

  return <AppTimeline items={items} />;
}
