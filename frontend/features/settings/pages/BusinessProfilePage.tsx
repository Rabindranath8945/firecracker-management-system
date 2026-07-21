"use client";

import { useState } from "react";
import { Building2, ImagePlus, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsInput from "../components/SettingsInput";
import SettingsSection from "../components/SettingsSection";

export default function BusinessProfilePage() {
  const [logo] = useState<string | null>(null);

  return (
    <SettingsFormLayout
      title="Business Profile"
      description="Manage your company information used across invoices, reports and documents."
      onSave={() => {}}
    >
      <div className="space-y-6">
        {/* ------------------------------------------------------------ */}
        {/* Header */}
        {/* ------------------------------------------------------------ */}

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-blue-100">
              {logo ? (
                <img
                  src={logo}
                  alt="Business Logo"
                  className="h-full w-full rounded-3xl object-cover"
                />
              ) : (
                <Building2 className="h-12 w-12 text-blue-600" />
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold">Mahendra Business OS</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Your company information will appear on invoices, quotations,
                reports and other business documents.
              </p>

              <Button variant="outline" className="mt-5 rounded-xl">
                <ImagePlus className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Business */}
        {/* ------------------------------------------------------------ */}

        <SettingsSection
          title="Business Information"
          description="Basic company information."
          icon={Building2}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <SettingsInput
              label="Business Name"
              defaultValue="Mahendra Tech Solutions"
            />

            <SettingsInput
              label="Owner Name"
              defaultValue="Rabindranath Mondal"
            />

            <SettingsInput label="GST Number" placeholder="22AAAAA0000A1Z5" />

            <SettingsInput label="PAN Number" placeholder="ABCDE1234F" />
          </div>
        </SettingsSection>

        {/* ------------------------------------------------------------ */}
        {/* Contact */}
        {/* ------------------------------------------------------------ */}

        <SettingsSection
          title="Contact Information"
          description="Primary business contact details."
          icon={Phone}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <SettingsInput
              label="Mobile Number"
              placeholder="+91 XXXXX XXXXX"
            />

            <SettingsInput
              label="Email Address"
              placeholder="company@email.com"
            />
          </div>
        </SettingsSection>

        {/* ------------------------------------------------------------ */}
        {/* Address */}
        {/* ------------------------------------------------------------ */}

        <SettingsSection
          title="Business Address"
          description="Business location and mailing address."
          icon={MapPin}
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Address</label>

              <Textarea
                rows={4}
                placeholder="Enter complete business address"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <SettingsInput label="City" placeholder="Kolkata" />

              <SettingsInput label="State" placeholder="West Bengal" />

              <SettingsInput label="Pincode" placeholder="721657" />

              <SettingsInput label="Country" placeholder="India" />
            </div>
          </div>
        </SettingsSection>
      </div>
    </SettingsFormLayout>
  );
}
