"use client";

import { Check, Copy, Download, QrCode, Share2, X } from "lucide-react";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

import type { Invitation } from "../types/invitation.types";

interface QRInvitationDialogProps {
  open: boolean;

  invitation: Invitation | null;

  token?: string;

  onClose: () => void;
}

export default function QRInvitationDialog({
  open,
  invitation,
  token,
  onClose,
}: QRInvitationDialogProps) {
  const [qr, setQr] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || !invitation || !token) {
      setQr(null);
      return;
    }

    const generate = async () => {
      const url = `${window.location.origin}/join/${token}`;

      const dataUrl = await QRCode.toDataURL(url, {
        width: 360,
        margin: 2,
        errorCorrectionLevel: "H",
      });

      setQr(dataUrl);
    };

    void generate();
  }, [open, invitation, token]);

  if (!open || !invitation) {
    return null;
  }

  const joinUrl = token ? `${window.location.origin}/join/${token}` : "";

  async function copyLink() {
    if (!joinUrl) return;

    await navigator.clipboard.writeText(joinUrl);

    setCopied(true);

    window.setTimeout(() => setCopied(false), 1800);
  }

  async function shareInvitation() {
    if (!joinUrl) return;

    if (navigator.share) {
      await navigator.share({
        title: "Join my business",
        text: "Scan or open this invitation to join my ERP business.",
        url: joinUrl,
      });

      return;
    }

    await copyLink();
  }

  function downloadQR() {
    if (!qr) return;

    const link = document.createElement("a");

    link.href = qr;

    link.download = "erp-business-invitation.png";

    link.click();
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-sm overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-slate-950">
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-center text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-slate-300 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400/15">
            <QrCode className="h-5 w-5 text-sky-300" />
          </div>

          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300">
            Secure Invitation
          </p>

          <h2 className="mt-1 text-lg font-bold">Join Business</h2>

          <p className="mt-1 text-xs text-slate-400">
            {invitation.role} access
          </p>
        </div>

        <div className="p-6">
          <div className="mx-auto flex aspect-square max-w-[250px] items-center justify-center rounded-3xl border border-slate-200 bg-white p-4 shadow-inner dark:border-slate-800">
            {qr ? (
              <img
                src={qr}
                alt="Business invitation QR code"
                className="h-full w-full"
              />
            ) : (
              <QrCode className="h-20 w-20 animate-pulse text-slate-300" />
            )}
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs font-semibold text-slate-500">Expires</p>

            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              {new Date(invitation.expiresAt).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => void copyLink()}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-3 text-[10px] font-bold text-slate-600 dark:border-slate-800 dark:text-slate-300"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}

              {copied ? "Copied" : "Copy"}
            </button>

            <button
              type="button"
              onClick={() => void shareInvitation()}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-slate-950 py-3 text-[10px] font-bold text-white dark:bg-white dark:text-slate-950"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>

            <button
              type="button"
              onClick={downloadQR}
              disabled={!qr}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-3 text-[10px] font-bold text-slate-600 disabled:opacity-40 dark:border-slate-800 dark:text-slate-300"
            >
              <Download className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
