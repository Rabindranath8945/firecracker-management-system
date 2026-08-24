"use client";

import {
  AlertCircle,
  Building2,
  BuildingIcon,
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  Save,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import SettingsFormLayout from "../components/SettingsFormLayout";
import SettingsInput from "../components/SettingsInput";

import {
  businessProfileService,
  type BusinessProfile,
} from "../services/business-profile.service";

/* -------------------------------------------------------------------------- */
/* Defaults                                                                   */
/* -------------------------------------------------------------------------- */

const EMPTY_PROFILE: BusinessProfile = {
  businessName: "",
  ownerName: "",
  gstNo: "",
  panNo: "",
  mobile: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pinCode: "",
  country: "India",
  logo: "",
};

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

interface FormErrors {
  businessName?: string;
  ownerName?: string;
  gstNo?: string;
  panNo?: string;
  mobile?: string;
  email?: string;
  pinCode?: string;
}

interface FormWarnings {
  gstNo?: string;
  panNo?: string;
  address?: string;
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function BusinessProfilePage() {
  const [form, setForm] = useState<BusinessProfile>(EMPTY_PROFILE);

  const [errors, setErrors] = useState<FormErrors>({});

  const [warnings, setWarnings] = useState<FormWarnings>({});

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [serverError, setServerError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Load Profile                                                             */
  /* ------------------------------------------------------------------------ */

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setServerError(null);

      const profile = await businessProfileService.getProfile();

      setForm({
        ...EMPTY_PROFILE,
        ...profile,
      });
    } catch (error) {
      console.error("Failed to load business profile:", error);

      setServerError("Unable to load your business profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  /* ------------------------------------------------------------------------ */
  /* Update Field                                                             */
  /* ------------------------------------------------------------------------ */

  const updateField = <K extends keyof BusinessProfile>(
    field: K,
    value: BusinessProfile[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      const next = { ...current };

      delete next[field as keyof FormErrors];

      return next;
    });

    setWarnings((current) => {
      const next = { ...current };

      delete next[field as keyof FormWarnings];

      return next;
    });

    setServerError(null);
    setSuccess(null);
  };

  /* ------------------------------------------------------------------------ */
  /* Validate Field                                                           */
  /* ------------------------------------------------------------------------ */

  const validateField = (field: keyof BusinessProfile, value: string) => {
    const trimmed = value.trim();

    let error: string | undefined;
    let warning: string | undefined;

    switch (field) {
      case "businessName":
        if (!trimmed) {
          error = "Business name is required.";
        } else if (trimmed.length < 2) {
          error = "Business name must contain at least 2 characters.";
        }
        break;

      case "ownerName":
        if (!trimmed) {
          error = "Owner name is required.";
        }
        break;

      case "mobile":
        if (!trimmed) {
          error = "Mobile number is required.";
        } else if (!/^\+?[0-9\s-]{10,15}$/.test(trimmed)) {
          error = "Enter a valid mobile number.";
        }
        break;

      case "email":
        if (trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
          error = "Enter a valid email address.";
        }
        break;

      case "gstNo":
        if (trimmed && !/^[0-9A-Z]{15}$/.test(trimmed.toUpperCase())) {
          error = "GST number must contain 15 characters.";
        } else if (!trimmed) {
          warning = "GST number is optional but recommended.";
        }
        break;

      case "panNo":
        if (trimmed && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(trimmed.toUpperCase())) {
          error = "Enter a valid PAN number.";
        } else if (!trimmed) {
          warning = "PAN is optional but recommended for business documents.";
        }
        break;

      case "address":
        if (!trimmed) {
          warning = "Adding your business address improves invoice quality.";
        }
        break;

      case "pinCode":
        if (trimmed && !/^[0-9]{6}$/.test(trimmed)) {
          error = "Pincode must contain 6 digits.";
        }
        break;

      default:
        break;
    }

    setErrors((current) => ({
      ...current,
      [field]: error,
    }));

    setWarnings((current) => ({
      ...current,
      [field]: warning,
    }));
  };

  /* ------------------------------------------------------------------------ */
  /* Validate Form                                                            */
  /* ------------------------------------------------------------------------ */

  const validateForm = useCallback(() => {
    const nextErrors: FormErrors = {};
    const nextWarnings: FormWarnings = {};

    const businessName = form.businessName.trim();

    const ownerName = form.ownerName.trim();

    const mobile = form.mobile.trim();

    const email = form.email.trim();

    const gstNo = form.gstNo.trim().toUpperCase();

    const panNo = form.panNo.trim().toUpperCase();

    const pinCode = form.pinCode.trim();

    if (!businessName) {
      nextErrors.businessName = "Business name is required.";
    } else if (businessName.length < 2) {
      nextErrors.businessName =
        "Business name must contain at least 2 characters.";
    }

    if (!ownerName) {
      nextErrors.ownerName = "Owner name is required.";
    }

    if (!mobile) {
      nextErrors.mobile = "Mobile number is required.";
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(mobile)) {
      nextErrors.mobile = "Enter a valid mobile number.";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (gstNo && !/^[0-9A-Z]{15}$/.test(gstNo)) {
      nextErrors.gstNo = "GST number must contain 15 characters.";
    } else if (!gstNo) {
      nextWarnings.gstNo = "GST number is optional but recommended.";
    }

    if (panNo && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNo)) {
      nextErrors.panNo = "Enter a valid PAN number.";
    } else if (!panNo) {
      nextWarnings.panNo = "PAN is optional but recommended.";
    }

    if (!form.address.trim()) {
      nextWarnings.address =
        "Adding your business address improves invoice quality.";
    }

    if (pinCode && !/^[0-9]{6}$/.test(pinCode)) {
      nextErrors.pinCode = "Pincode must contain 6 digits.";
    }

    setErrors(nextErrors);
    setWarnings(nextWarnings);

    return Object.keys(nextErrors).length === 0;
  }, [form]);

  /* ------------------------------------------------------------------------ */
  /* Save                                                                     */
  /* ------------------------------------------------------------------------ */

  const handleSave = async () => {
    setSuccess(null);
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const updated = await businessProfileService.updateProfile(form);

      setForm({
        ...EMPTY_PROFILE,
        ...updated,
      });

      setSuccess("Business profile saved successfully.");
    } catch (error) {
      console.error("Failed to save business profile:", error);

      setServerError("Unable to save your business profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Completion                                                               */
  /* ------------------------------------------------------------------------ */

  const completion = useMemo(() => {
    const fields = [
      form.businessName,
      form.ownerName,
      form.mobile,
      form.email,
      form.address,
      form.city,
      form.state,
      form.pinCode,
    ];

    const completed = fields.filter((field) => field.trim().length > 0).length;

    return Math.round((completed / fields.length) * 100);
  }, [form]);

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <SettingsFormLayout
        title="Business Profile"
        description="Manage your business information used across invoices, reports and documents."
      >
        <div className="flex min-h-[430px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />

            <p className="mt-3 text-sm text-muted-foreground">
              Loading business profile...
            </p>
          </div>
        </div>
      </SettingsFormLayout>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <SettingsFormLayout
      title="Business Profile"
      description="Manage the information that appears across your business documents."
    >
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_8px_30px_-18px_rgba(15,23,42,0.25)]">
          {/* Header */}

          <div className="flex items-center gap-4 border-b border-slate-200/80 px-6 py-5 sm:px-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BuildingIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-semibold text-slate-900">
                {form.businessName || "Business Profile"}
              </h1>

              <p className="mt-0.5 text-xs text-slate-500">
                Business identity and contact information
              </p>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${completion}%`,
                  }}
                />
              </div>

              <span className="text-xs font-medium text-slate-500">
                {completion}%
              </span>
            </div>
          </div>

          {/* Server Messages */}

          {serverError && (
            <div className="mx-6 mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-8">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {success && (
            <div className="mx-6 mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 sm:mx-8">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Business Information */}

          <section className="px-6 py-8 sm:px-8">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Building2 className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Business Information
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Your basic business identity.
                </p>
              </div>
            </div>

            <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
              <SettingsInput
                label="Business Name"
                required
                value={form.businessName}
                onChange={(event) =>
                  updateField("businessName", event.target.value)
                }
                onBlur={(event) =>
                  validateField("businessName", event.target.value)
                }
                error={errors.businessName}
                placeholder="Mahendra Tech Solutions"
              />

              <SettingsInput
                label="Owner Name"
                required
                value={form.ownerName}
                onChange={(event) =>
                  updateField("ownerName", event.target.value)
                }
                onBlur={(event) =>
                  validateField("ownerName", event.target.value)
                }
                error={errors.ownerName}
                placeholder="Owner name"
              />

              <SettingsInput
                label="GST Number"
                value={form.gstNo}
                onChange={(event) =>
                  updateField("gstNo", event.target.value.toUpperCase())
                }
                onBlur={(event) => validateField("gstNo", event.target.value)}
                error={errors.gstNo}
                warning={warnings.gstNo}
                placeholder="22AAAAA0000A1Z5"
              />

              <SettingsInput
                label="PAN Number"
                value={form.panNo}
                onChange={(event) =>
                  updateField("panNo", event.target.value.toUpperCase())
                }
                onBlur={(event) => validateField("panNo", event.target.value)}
                error={errors.panNo}
                warning={warnings.panNo}
                placeholder="ABCDE1234F"
              />
            </div>
          </section>

          {/* Contact Information */}

          <section className="border-t border-slate-200/80 px-6 py-8 sm:px-8">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Phone className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Contact Information
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  How customers can reach your business.
                </p>
              </div>
            </div>

            <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
              <SettingsInput
                label="Mobile Number"
                required
                value={form.mobile}
                onChange={(event) => updateField("mobile", event.target.value)}
                onBlur={(event) => validateField("mobile", event.target.value)}
                error={errors.mobile}
                placeholder="+91 XXXXX XXXXX"
              />

              <SettingsInput
                label="Email Address"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                onBlur={(event) => validateField("email", event.target.value)}
                error={errors.email}
                placeholder="company@email.com"
              />
            </div>
          </section>

          {/* Business Address */}

          <section className="border-t border-slate-200/80 px-6 py-8 sm:px-8">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <MapPin className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Business Address
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Your registered business location.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="business-address"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Address
                </label>

                <Textarea
                  id="business-address"
                  value={form.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  onBlur={(event) =>
                    validateField("address", event.target.value)
                  }
                  rows={3}
                  placeholder="Enter complete business address"
                  className={cn(
                    "resize-none rounded-xl border-slate-200 shadow-none",
                    "focus-visible:border-primary/40",
                    "focus-visible:ring-2 focus-visible:ring-primary/10",
                    warnings.address && "border-amber-400 bg-amber-50/30",
                  )}
                />

                {warnings.address && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {warnings.address}
                  </p>
                )}
              </div>

              <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
                <SettingsInput
                  label="City"
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                />

                <SettingsInput
                  label="State"
                  value={form.state}
                  onChange={(event) => updateField("state", event.target.value)}
                />

                <SettingsInput
                  label="Pincode"
                  value={form.pinCode}
                  onChange={(event) =>
                    updateField("pinCode", event.target.value)
                  }
                  onBlur={(event) =>
                    validateField("pinCode", event.target.value)
                  }
                  error={errors.pinCode}
                  placeholder="721657"
                />

                <SettingsInput
                  label="Country"
                  value={form.country}
                  onChange={(event) =>
                    updateField("country", event.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {/* Save */}

          <div className="flex items-center justify-between gap-4 border-t border-slate-200/80 bg-slate-50/50 px-6 py-4 sm:px-8">
            <p className="hidden text-xs text-slate-500 sm:block">
              Your changes are saved to your business profile.
            </p>

            <Button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="ml-auto h-10 rounded-xl px-5"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </SettingsFormLayout>
  );
}
