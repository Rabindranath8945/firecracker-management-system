"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  MessageCircle,
  Send,
  User,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import api from "@/lib/api";

import type { Sale } from "@/features/sales/types/Sales.types";

interface SaleSharePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SaleSharePage({ params }: SaleSharePageProps) {
  const router = useRouter();

  const [saleId, setSaleId] = useState("");

  const [sale, setSale] = useState<Sale | null>(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [message, setMessage] = useState("");

  /* ---------------------------------------------------------------------- */
  /* RESOLVE PARAMS                                                         */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    let cancelled = false;

    async function resolveParams() {
      const resolvedParams = await params;

      if (cancelled) {
        return;
      }

      setSaleId(resolvedParams.id);
    }

    void resolveParams();

    return () => {
      cancelled = true;
    };
  }, [params]);

  /* ---------------------------------------------------------------------- */
  /* LOAD SALE                                                              */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!saleId) {
      return;
    }

    let cancelled = false;

    async function loadSale() {
      try {
        setLoading(true);

        const response = await api.get(`/sales/${saleId}`);

        const loadedSale = response.data.data as Sale;

        if (cancelled) {
          return;
        }

        setSale(loadedSale);

        const customerName = loadedSale.customer?.name ?? "Customer";

        setMessage(
          `Hello ${customerName},

Thank you for shopping with us.

Please find your invoice ${loadedSale.invoiceNo}.

Thank you!`,
        );
      } catch (error) {
        console.error("Failed to load sale:", error);

        if (!cancelled) {
          setSale(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSale();

    return () => {
      cancelled = true;
    };
  }, [saleId]);

  /* ---------------------------------------------------------------------- */
  /* DERIVED DATA                                                           */
  /* ---------------------------------------------------------------------- */

  const customerName = sale?.customer?.name ?? "Walk-in Customer";

  const mobile = sale?.customer?.mobile ?? "";

  const grandTotal = sale?.grandTotal ?? 0;

  const totalItems =
    sale?.items?.reduce(
      (total, item) => total + Number(item.quantity ?? 0),
      0,
    ) ?? 0;

  const formattedMobile = useMemo(() => {
    const digits = mobile.replace(/\D/g, "");

    if (digits.length === 10) {
      return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    }

    return mobile || "No mobile number";
  }, [mobile]);

  /* ---------------------------------------------------------------------- */
  /* WHATSAPP                                                               */
  /* ---------------------------------------------------------------------- */

  function openWhatsApp() {
    if (!sale || !mobile) {
      return;
    }

    const digits = mobile.replace(/\D/g, "");

    const whatsappNumber = digits.length === 10 ? `91${digits}` : digits;

    const text = encodeURIComponent(message.trim());

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  async function handleSend() {
    if (!sale || !mobile) {
      return;
    }

    try {
      setSending(true);

      openWhatsApp();
    } finally {
      window.setTimeout(() => {
        setSending(false);
      }, 700);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* LOADING                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* NOT FOUND                                                              */
  /* ---------------------------------------------------------------------- */

  if (!sale) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="font-semibold">Invoice not found.</p>

        <Button onClick={() => router.back()} className="rounded-xl">
          Go Back
        </Button>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* UI                                                                     */
  /* ---------------------------------------------------------------------- */

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-base font-bold">Share Invoice</h1>

            <p className="text-[10px] text-slate-400">
              Send invoice to customer
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg space-y-4 px-4 py-5">
        <Card className="overflow-hidden rounded-[26px] border-slate-200 bg-white shadow-sm">
          <div className="p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Send To
            </p>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
                <MessageCircle className="h-6 w-6 text-emerald-600" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">
                  {customerName}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  {formattedMobile}
                </p>
              </div>

              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[26px] border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                <FileText className="h-5 w-5 text-red-500" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900">
                  {sale.invoiceNo}
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  PDF • A4 Invoice
                </p>
              </div>
            </div>

            <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[9px] font-bold text-violet-700">
              INVOICE
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <SummaryBox label="Items" value={String(totalItems)} />

            <SummaryBox
              label="Payment"
              value={sale.payment?.method ?? "CASH"}
            />

            <SummaryBox
              label="Total"
              value={`₹${grandTotal.toLocaleString("en-IN")}`}
            />
          </div>
        </Card>

        <Card className="rounded-[26px] border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">Message</p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Customize your WhatsApp message
              </p>
            </div>

            <User className="h-4 w-4 text-slate-300" />
          </div>

          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="min-h-[150px] resize-none rounded-2xl border-slate-200 text-xs leading-5 focus-visible:ring-emerald-500"
            placeholder="Write your message..."
          />
        </Card>

        {!mobile && (
          <Card className="rounded-2xl border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-semibold text-amber-700">
              This customer does not have a mobile number. Add a mobile number
              from the Customers module before sharing on WhatsApp.
            </p>
          </Card>
        )}

        <Button
          type="button"
          disabled={!mobile || sending}
          onClick={handleSend}
          className="h-14 w-full rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white/15">
            <Send className="h-4 w-4" />
          </span>

          {sending ? "Opening WhatsApp..." : "Send on WhatsApp"}
        </Button>

        <p className="pb-6 text-center text-[9px] text-slate-400">
          WhatsApp will open with the invoice message ready to send.
        </p>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* SUMMARY BOX                                                                */
/* -------------------------------------------------------------------------- */

interface SummaryBoxProps {
  label: string;
  value: string;
}

function SummaryBox({ label, value }: SummaryBoxProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-2.5 text-center">
      <p className="text-[9px] font-medium text-slate-400">{label}</p>

      <p className="mt-1 truncate text-[10px] font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}
