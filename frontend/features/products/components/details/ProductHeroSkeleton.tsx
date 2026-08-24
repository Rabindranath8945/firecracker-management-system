"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function ProductHeroSkeleton() {
  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <CardContent className="animate-pulse p-6">
        <div className="flex flex-col items-center">
          {/* Image */}

          <div className="h-28 w-28 rounded-3xl bg-slate-200" />

          {/* Title */}

          <div className="mt-5 h-7 w-52 rounded-lg bg-slate-200" />

          {/* Product Code */}

          <div className="mt-3 h-4 w-28 rounded bg-slate-200" />

          {/* Badges */}

          <div className="mt-5 flex gap-2">
            <div className="h-8 w-20 rounded-full bg-slate-200" />

            <div className="h-8 w-24 rounded-full bg-slate-200" />

            <div className="h-8 w-24 rounded-full bg-slate-200" />
          </div>

          {/* Price Cards */}

          <div className="mt-6 grid w-full grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="mx-auto h-3 w-16 rounded bg-slate-200" />

              <div className="mx-auto mt-3 h-6 w-20 rounded bg-slate-200" />
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="mx-auto h-3 w-16 rounded bg-slate-200" />

              <div className="mx-auto mt-3 h-6 w-20 rounded bg-slate-200" />
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="mx-auto h-3 w-16 rounded bg-slate-200" />

              <div className="mx-auto mt-3 h-6 w-20 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
