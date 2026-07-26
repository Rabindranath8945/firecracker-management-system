"use client";

import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { BusinessInfo } from "../types/onboarding.types";

interface BusinessInfoScreenProps {
  onNext: (data: BusinessInfo) => Promise<void> | void;
  onSkip: () => Promise<void> | void;
}

export default function BusinessInfoScreen({
  onNext,
  onSkip,
}: BusinessInfoScreenProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<BusinessInfo>({
    businessName: "",
    ownerName: "",
    mobile: "",
    gstNo: "",
    address: "",
  });

  function updateField<K extends keyof BusinessInfo>(
    key: K,
    value: BusinessInfo[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleContinue() {
    if (!form.businessName.trim()) return;

    try {
      setLoading(true);

      await onNext(form);
    } finally {
      setLoading(false);
    }
  }

  async function handleSkip() {
    try {
      setLoading(true);

      await onSkip();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col bg-white">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-28 -top-20 h-72 w-72 rounded-[90px] bg-sky-100/70 blur-sm" />

        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-[90px] bg-sky-100/70 blur-sm" />
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center">
            <Image
              src="/onehub.png"
              alt="OneHub"
              width={120}
              height={120}
              priority
            />
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Business Information
            </h1>

            <p className="mt-2 text-slate-500">Tell us about your business.</p>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <Label>
                Business Name <span className="text-red-500">*</span>
              </Label>

              <Input
                className="mt-2 h-12 rounded-xl"
                placeholder="ABC General Store"
                value={form.businessName}
                onChange={(e) => updateField("businessName", e.target.value)}
              />

              <p className="mt-1 text-xs text-slate-400">
                This will appear on invoices and reports.
              </p>
            </div>

            <div>
              <Label>Owner Name</Label>

              <Input
                className="mt-2 h-12 rounded-xl"
                placeholder="John Doe"
                value={form.ownerName}
                onChange={(e) => updateField("ownerName", e.target.value)}
              />
            </div>

            <div>
              <Label>Mobile Number</Label>

              <Input
                className="mt-2 h-12 rounded-xl"
                placeholder="+91 9876543210"
                value={form.mobile}
                onChange={(e) => updateField("mobile", e.target.value)}
              />
            </div>

            <div>
              <Label>GST Number</Label>

              <Input
                className="mt-2 h-12 rounded-xl"
                placeholder="Optional"
                value={form.gstNo}
                onChange={(e) => updateField("gstNo", e.target.value)}
              />
            </div>

            <div>
              <Label>Business Address</Label>

              <Textarea
                className="mt-2 rounded-xl"
                placeholder="Enter business address"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              variant="outline"
              className="h-12 flex-1 rounded-xl"
              disabled={loading}
              onClick={handleSkip}
            >
              Skip
            </Button>

            <Button
              className="h-12 flex-1 rounded-xl"
              disabled={!form.businessName.trim() || loading}
              onClick={handleContinue}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <footer className="relative z-10 pb-8 text-center">
        <p className="text-xs text-slate-500">Version 1.0.0</p>

        <p className="mt-1 text-xs text-slate-500">
          Built with ❤️ by{" "}
          <span className="font-semibold text-sky-600">
            Mahendra Tech Solutions
          </span>
        </p>
      </footer>
    </main>
  );
}
