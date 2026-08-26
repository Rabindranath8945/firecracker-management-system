"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Loader2,
  Printer,
  Share2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  getOfflineSettings,
  saveOfflineSettings,
} from "@/libs/offline/store/offline.settings";

import { Button } from "@/components/ui/button";
import api from "@/lib/api";

import SalesService from "@/features/sales/services/sales.service";
import { generateSalePDF } from "@/features/sales/pdf/generateSalePDF";
import type { Sale } from "@/features/sales/types/Sales.types";

interface SalePrintPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface SettingsData {
  business: {
    name?: string;
    ownerName?: string;
    logo?: string;
    businessType?: string;
    gstNo?: string;
    panNo?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  invoice: {
    prefix?: string;
    nextNumber?: number;
    footer?: string;
    terms?: string;
    showLogo?: boolean;
    showGST?: boolean;
    showCustomerMobile?: boolean;
    showCustomerAddress?: boolean;
  };

  tax: {
    enabled?: boolean;
    defaultGST?: number;
    taxType?: string;
    currency?: string;
    currencySymbol?: string;
  };
}

export default function SalePrintPage({ params }: SalePrintPageProps) {
  const router = useRouter();

  const [saleId, setSaleId] = useState("");

  const [sale, setSale] = useState<Sale | null>(null);
  const [settings, setSettings] = useState<SettingsData | null>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(true);
  const [sharing, setSharing] = useState(false);

  const [error, setError] = useState("");

  /* ---------------------------------------------------------------------- */
  /* Load sale + business                                                   */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;

    async function resolveParams() {
      const resolvedParams = await params;

      if (!cancelled) {
        setSaleId(resolvedParams.id);
      }
    }

    void resolveParams();

    return () => {
      cancelled = true;
    };
  }, [params]);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setGenerating(true);
        setError("");

        const [saleResponse, settingsResponse] = await Promise.all([
          SalesService.getSale(saleId),
          fetchSettings(),
        ]);

        if (!mounted) {
          return;
        }

        setSale(saleResponse);
        setSettings(settingsResponse);

        // Generate PDF using the actual backend settings
        const pdfBlob = await generateSalePDF(
          saleResponse,
          settingsResponse.business,
          settingsResponse.invoice,
          settingsResponse.tax,
        );

        if (!mounted) {
          return;
        }

        const url = URL.createObjectURL(pdfBlob);

        setPdfUrl(url);
      } catch (err) {
        console.error("Failed to prepare invoice:", err);

        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Unable to prepare invoice.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setGenerating(false);
        }
      }
    }

    if (saleId) {
      void loadData();
    }

    return () => {
      mounted = false;
    };
  }, [saleId]);

  /* ---------------------------------------------------------------------- */
  /* Cleanup PDF URL                                                        */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  /* ---------------------------------------------------------------------- */
  /* Print                                                                  */
  /* ---------------------------------------------------------------------- */

  function handlePrint() {
    if (!pdfUrl) {
      return;
    }

    const printWindow = window.open(pdfUrl, "_blank", "noopener,noreferrer");

    if (!printWindow) {
      setError("Please allow pop-ups to print the invoice.");
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Download                                                               */
  /* ---------------------------------------------------------------------- */

  function handleDownload() {
    if (!pdfUrl || !sale) {
      return;
    }

    const link = document.createElement("a");

    link.href = pdfUrl;
    link.download = `${sale.invoiceNo}.pdf`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  /* ---------------------------------------------------------------------- */
  /* WhatsApp                                                               */
  /* ---------------------------------------------------------------------- */

  async function handleWhatsApp() {
    if (!sale || !settings || sharing) {
      return;
    }

    try {
      setSharing(true);
      setError("");

      const customerName = sale.customer?.name?.trim() || "Customer";

      const mobile = sale.customer?.mobile?.replace(/\D/g, "") || "";

      const businessName = settings.business.name?.trim() || "Business";

      const currency = settings.tax.currencySymbol || "₹";

      const amount = sale.grandTotal.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const message = [
        `Hello ${customerName},`,
        "",
        `Thank you for shopping with ${businessName}.`,
        "",
        `Invoice: ${sale.invoiceNo}`,
        `Date: ${new Date(sale.saleDate).toLocaleDateString("en-IN")}`,
        `Amount: ${currency}${amount}`,
        `Payment: ${sale.payment.method}`,
        "",
        settings.invoice.footer?.trim() || "Thank you for your business!",
      ].join("\n");

      /*
       * ------------------------------------------------------------
       * Try native file sharing first
       * ------------------------------------------------------------
       */

      if (pdfUrl && typeof navigator !== "undefined" && "share" in navigator) {
        const response = await fetch(pdfUrl);

        const blob = await response.blob();

        const file = new File([blob], `${sale.invoiceNo}.pdf`, {
          type: "application/pdf",
        });

        const shareNavigator = navigator as Navigator & {
          canShare?: (data: ShareData) => boolean;
        };

        const shareData: ShareData = {
          title: `Invoice ${sale.invoiceNo}`,
          text: message,
          files: [file],
        };

        const canShareFiles =
          typeof shareNavigator.canShare === "function"
            ? shareNavigator.canShare(shareData)
            : false;

        if (canShareFiles) {
          await navigator.share(shareData);
          return;
        }
      }

      /*
       * ------------------------------------------------------------
       * WhatsApp fallback
       * ------------------------------------------------------------
       */

      const whatsappUrl = mobile
        ? `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`
        : `https://wa.me/?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      console.error("WhatsApp sharing failed:", err);

      setError("Unable to share the invoice.");
    } finally {
      setSharing(false);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100">
            <Loader2 className="h-7 w-7 animate-spin text-violet-600" />
          </div>

          <h2 className="mt-5 text-lg font-black text-slate-900">
            Preparing Invoice
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Fetching sale and business details...
          </p>
        </div>
      </main>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Error                                                                  */
  /* ---------------------------------------------------------------------- */

  if (!sale) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100">
          <span className="text-2xl">!</span>
        </div>

        <h2 className="mt-5 text-xl font-black text-slate-900">
          Invoice Not Found
        </h2>

        <p className="mt-2 max-w-sm text-sm text-slate-500">
          {error || "Unable to load this invoice."}
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-5 rounded-xl"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </main>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Page                                                                   */
  /* ---------------------------------------------------------------------- */

  return (
    <main className="min-h-screen bg-slate-100">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-4 py-3">
          {/* Back */}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Title */}

          <div className="min-w-0 text-center">
            <p className="text-sm font-black text-slate-900">Invoice Preview</p>

            <p className="text-[10px] text-slate-400">{sale.invoiceNo}</p>
          </div>

          {/* Actions */}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleWhatsApp}
              disabled={sharing || generating}
              className="
                h-10
                rounded-xl
                border-emerald-200
                bg-emerald-50
                px-3
                font-bold
                text-emerald-700
                hover:bg-emerald-100
              "
            >
              {sharing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}

              <span className="ml-2 hidden sm:inline">WhatsApp</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleDownload}
              disabled={generating || !pdfUrl}
              className="h-10 rounded-xl px-3 font-bold"
            >
              <Download className="h-4 w-4" />

              <span className="ml-2 hidden sm:inline">PDF</span>
            </Button>

            <Button
              type="button"
              onClick={handlePrint}
              disabled={generating || !pdfUrl}
              className="
                h-10
                rounded-xl
                bg-violet-600
                px-4
                font-bold
                shadow-lg
                shadow-violet-200
                hover:bg-violet-700
              "
            >
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Printer className="mr-2 h-4 w-4" />
              )}
              Print A4
            </Button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Status                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="mx-auto max-w-[1100px] px-4 pt-5">
        {generating ? (
          <div className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin text-violet-600" />

            <div>
              <p className="text-xs font-bold text-slate-900">
                Generating A4 invoice
              </p>

              <p className="text-[10px] text-slate-400">Please wait...</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs font-bold text-emerald-800">
                Invoice ready
              </p>

              <p className="text-[10px] text-emerald-600">
                A4 PDF generated successfully
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* PDF Preview                                                        */}
      {/* ------------------------------------------------------------------ */}

      <section className="mx-auto max-w-[1100px] px-4 py-5">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title={`Invoice ${sale.invoiceNo}`}
              className="h-[calc(100vh-210px)] min-h-[700px] w-full border-0"
            />
          ) : (
            <div className="flex min-h-[700px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-7 w-7 animate-spin text-violet-600" />

                <p className="mt-3 text-sm font-bold text-slate-900">
                  Creating invoice...
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* ========================================================================== */
/* SETTINGS                                                                   */
/* ========================================================================== */

async function fetchSettings() {
  /*
   * ONLINE
   */

  if (typeof navigator === "undefined" || navigator.onLine) {
    const response = await api.get("/settings");

    if (!response.data?.success || !response.data?.data) {
      throw new Error("Business settings are unavailable.");
    }

    const settings = response.data.data;

    /*
     * Keep the latest settings
     * available for offline printing.
     */

    try {
      await saveOfflineSettings(settings);
    } catch (error) {
      console.warn("Unable to cache settings offline:", error);
    }

    return settings;
  }

  /*
   * OFFLINE
   */

  const settings = await getOfflineSettings();

  if (!settings) {
    throw new Error("Business settings are not available offline.");
  }

  return settings;
}
