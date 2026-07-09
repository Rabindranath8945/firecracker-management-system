"use client";

import Image from "next/image";
import { BadgeCheck, Boxes, Package2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProductHeroCard() {
  return (
    <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-slate-100">
            <Image
              src="/images/product-placeholder.png"
              alt="Product"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight">
            Rocket Deluxe
          </h1>

          <p className="mt-1 text-sm text-slate-500">SKU : PRD-000001</p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              🎆 Rocket
            </Badge>

            <Badge className="rounded-full bg-green-100 px-3 py-1 text-green-700 hover:bg-green-100">
              <BadgeCheck className="mr-1 h-4 w-4" />
              Active
            </Badge>

            <Badge className="rounded-full bg-violet-100 px-3 py-1 text-violet-700 hover:bg-violet-100">
              <Boxes className="mr-1 h-4 w-4" />
              250 PCS
            </Badge>
          </div>

          <div className="mt-6 grid w-full grid-cols-3 gap-3">
            <div className="rounded-2xl bg-orange-50 p-3 text-center">
              <p className="text-xs text-slate-500">Purchase</p>

              <h3 className="mt-2 text-lg font-bold text-orange-600">₹220</h3>
            </div>

            <div className="rounded-2xl bg-green-50 p-3 text-center">
              <p className="text-xs text-slate-500">Selling</p>

              <h3 className="mt-2 text-lg font-bold text-green-600">₹320</h3>
            </div>

            <div className="rounded-2xl bg-blue-50 p-3 text-center">
              <p className="text-xs text-slate-500">MRP</p>

              <h3 className="mt-2 text-lg font-bold text-blue-600">₹350</h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
