"use client";

import { Clock3, Copy, QrCode, ShieldCheck, UserRound } from "lucide-react";

import type { Invitation } from "../types/invitation.types";

interface InvitationCardProps {
  invitation: Invitation;

  onViewQR: (invitation: Invitation) => void;

  onApprove?: ((invitation: Invitation) => void) | undefined;

  onReject?: ((invitation: Invitation) => void) | undefined;
}

function getStatusStyle(status: Invitation["status"]) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";

    case "ACCEPTED":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";

    case "REJECTED":
      return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";

    case "REVOKED":
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";

    case "EXPIRED":
      return "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400";
  }
}

export default function InvitationCard({
  invitation,
  onViewQR,
  onApprove,
  onReject,
}: InvitationCardProps) {
  const hasRequest = Boolean(invitation.requestedBy);

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start gap-4 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
          {invitation.requestedProfilePicture ? (
            <img
              src={invitation.requestedProfilePicture}
              alt=""
              className="h-12 w-12 rounded-2xl object-cover"
            />
          ) : (
            <UserRound className="h-5 w-5 text-slate-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                {invitation.requestedName ??
                  invitation.requestedEmail ??
                  "Pending User"}
              </h3>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                {invitation.requestedEmail ?? "Invitation not claimed yet"}
              </p>
            </div>

            <span
              className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${getStatusStyle(
                invitation.status,
              )}`}
            >
              {invitation.status}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-lg bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-700 dark:bg-sky-500/10 dark:text-sky-400">
              {invitation.role}
            </span>

            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-400">
              {invitation.permissions.length} permissions
            </span>

            <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-400">
              <Clock3 className="h-3 w-3" />

              {new Date(invitation.expiresAt).toLocaleDateString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/40">
        <button
          type="button"
          onClick={() => onViewQR(invitation)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
        >
          <QrCode className="h-4 w-4" />
          QR
        </button>

        {hasRequest && invitation.status === "PENDING" && onApprove && (
          <button
            type="button"
            onClick={() => onApprove(invitation)}
            className="flex-1 rounded-xl bg-emerald-500 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-600"
          >
            Approve
          </button>
        )}

        {hasRequest && invitation.status === "PENDING" && onReject && (
          <button
            type="button"
            onClick={() => onReject(invitation)}
            className="rounded-xl px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            Reject
          </button>
        )}
      </div>
    </div>
  );
}
