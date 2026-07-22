"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BusinessInfo {
  businessName: string;
  ownerName: string;
  mobile: string;
  gstNo: string;
  address: string;
}

interface BusinessInfoScreenProps {
  onNext: (data: BusinessInfo) => void;
  onSkip: () => void;
}

export default function BusinessInfoScreen({
  onNext,
  onSkip,
}: BusinessInfoScreenProps) {
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

  return (
    <main className="relative flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="OneHub"
              width={120}
              height={120}
              priority
              className="h-28 w-28 object-contain"
            />
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold">Business Information</h1>

            <p className="mt-2 text-muted-foreground">
              All fields are optional. You can update them later.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <Label>Business Name</Label>
              <Input
                placeholder="ABC General Store"
                value={form.businessName}
                onChange={(e) => updateField("businessName", e.target.value)}
              />
            </div>

            <div>
              <Label>Owner Name</Label>
              <Input
                placeholder="John Doe"
                value={form.ownerName}
                onChange={(e) => updateField("ownerName", e.target.value)}
              />
            </div>

            <div>
              <Label>Mobile Number</Label>
              <Input
                placeholder="+91 9876543210"
                value={form.mobile}
                onChange={(e) => updateField("mobile", e.target.value)}
              />
            </div>

            <div>
              <Label>GST Number</Label>
              <Input
                placeholder="Optional"
                value={form.gstNo}
                onChange={(e) => updateField("gstNo", e.target.value)}
              />
            </div>

            <div>
              <Label>Business Address</Label>
              <Textarea
                placeholder="Enter business address"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Button variant="outline" className="flex-1" onClick={onSkip}>
              Skip
            </Button>

            <Button className="flex-1" onClick={() => onNext(form)}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <footer className="pb-8 text-center">
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>

        <p className="mt-1 text-xs text-muted-foreground">
          Built by{" "}
          <span className="font-medium text-foreground">
            Mahendra Tech Solutions
          </span>
        </p>
      </footer>
    </main>
  );
}
