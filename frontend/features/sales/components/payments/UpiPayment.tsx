"use client";

import { useMemo } from "react";
import Image from "next/image";
import { QrCode, Smartphone, CircleCheckBig, Copy } from "lucide-react";

import QRCode from "react-qr-code";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

interface UpiPaymentProps {
  amount: number;
  loading: boolean;
  onSuccess: (receivedAmount: number) => void | Promise<void>;
}

const UPI_ID = "mandalcycle@upi";
const STORE_NAME = "Mandal Cycle Store";

export default function UpiPayment({
  amount,
  loading,
  onSuccess,
}: UpiPaymentProps) {
  const upiLink = useMemo(() => {
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
      STORE_NAME,
    )}&am=${amount}&cu=INR&tn=Invoice Payment`;
  }, [amount]);

  async function copyUpiId() {
    await navigator.clipboard.writeText(UPI_ID);
  }

  return (
    <Card className="rounded-3xl p-5 shadow-sm">
      {/* Header */}

      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-violet-100 p-3">
          <Smartphone className="h-6 w-6 text-violet-700" />
        </div>

        <div>
          <h3 className="font-bold">UPI Payment</h3>

          <p className="text-sm text-muted-foreground">
            Customer scans and pays
          </p>
        </div>
      </div>

      {/* QR */}

      <div className="flex justify-center">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <QRCode value={upiLink} size={220} />
        </div>
      </div>

      {/* Amount */}

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">Amount</p>

        <h2 className="mt-1 text-4xl font-black text-violet-700">
          ₹{amount.toLocaleString("en-IN")}
        </h2>
      </div>

      {/* UPI */}

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">UPI ID</p>

            <p className="mt-1 font-semibold">{UPI_ID}</p>
          </div>

          <Button variant="outline" size="icon" onClick={copyUpiId}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Waiting */}

      <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 p-4">
        <div className="flex items-center gap-3">
          <QrCode className="h-5 w-5 text-violet-700" />

          <div>
            <p className="font-semibold">Waiting for Payment</p>

            <p className="text-sm text-muted-foreground">
              Ask customer to scan QR and complete payment.
            </p>
          </div>
        </div>
      </div>

      {/* Button */}

      <Button
        disabled={loading}
        onClick={() => onSuccess(amount)}
        className="
    mt-6
    h-14
    w-full
    rounded-2xl
    bg-gradient-to-r
    from-violet-600
    via-violet-500
    to-fuchsia-600
    text-base
    font-bold
  "
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Confirming Payment...
          </>
        ) : (
          <>
            <CircleCheckBig className="mr-2 h-5 w-5" />
            Payment Successful
          </>
        )}
      </Button>
    </Card>
  );
}
