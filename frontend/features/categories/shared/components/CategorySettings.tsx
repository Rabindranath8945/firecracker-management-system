"use client";

import type { UseFormReturn } from "react-hook-form";

import type { CategoryFormValues } from "./CategoryForm";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface CategorySettingsProps {
  form: UseFormReturn<CategoryFormValues>;
}

export default function CategorySettings({ form }: CategorySettingsProps) {
  return (
    <Card className="rounded-[28px] shadow-sm">
      <CardContent className="space-y-6 p-7">
        {/* Header */}

        <div>
          <h2 className="text-xl font-semibold text-slate-900">Settings</h2>

          <p className="mt-1 text-sm text-slate-500">
            Configure category availability.
          </p>
        </div>

        {/* Active */}

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all hover:border-blue-200 hover:bg-white">
          <div>
            <h3 className="font-semibold text-slate-900">Active</h3>

            <p className="mt-1 text-sm text-slate-500">
              Enable this category for products and billing.
            </p>
          </div>

          <Switch
            checked={form.watch("isActive")}
            onCheckedChange={(checked) => form.setValue("isActive", checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
