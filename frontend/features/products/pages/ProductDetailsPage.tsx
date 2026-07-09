"use client";

import ProductDetailsHeader from "../components/details/ProductDetailsHeader";
import ProductHeroCard from "../components/details/ProductHeroCard";
import ProductInfoCard from "../components/details/ProductInfoCard";
import ProductStockCard from "../components/details/ProductStockCard";
import ProductSummaryCard from "../components/details/ProductSummaryCard";
import ProductTimeline from "../components/details/ProductTimeline";

export default function ProductDetailsPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 pt-4 pb-24 space-y-5">
      <ProductDetailsHeader />
      <ProductHeroCard />
      <ProductSummaryCard />
      <ProductInfoCard />
      <ProductStockCard />
      <ProductTimeline />
    </div>
  );
}
