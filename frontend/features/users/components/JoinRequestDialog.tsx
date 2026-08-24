"use client";

import { CheckCircle2, Loader2, ShieldCheck, UserRound, X } from "lucide-react";

import type { Invitation } from "../types/invitation.types";

interface JoinRequestDialogProps {
  open: boolean;

  invitation: Invitation | null;

  loading?: boolean;

  onApprove?: () => void;

  onReject?: () => void;

  onClose: () => void;
}

export default function JoinRequestDialog({
  open,
  invitation,
  loading = false,
  onApprove,
  onReject,
  onClose,
}: JoinRequestDialogProps) {
  if (!open || !invitation) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-slate-950">
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-7 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-slate-300 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300">
            Join Request
          </p>

          <h2 className="mt-1 text-xl font-bold">Review team member</h2>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white dark:bg-slate-950">
              {invitation.requestedProfilePicture ? (
                <img
                  src={invitation.requestedProfilePicture}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound className="h-5 w-5 text-slate-400" />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                {invitation.requestedName ?? "New team member"}
              </p>

              <p className="truncate text-xs text-slate-500">
                {invitation.requestedEmail ?? "No email available"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Role
              </p>

              <p className="mt-1 text-sm font-bold">{invitation.role}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Access
              </p>

              <p className="mt-1 text-sm font-bold">
                {invitation.permissions.length} modules
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-500/5">
            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-500" />

            <p className="text-xs leading-5 text-emerald-700 dark:text-emerald-400">
              Approving this request will activate the employee and assign the
              selected role and permissions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={onReject}
              className="rounded-2xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/40 dark:hover:bg-red-500/10"
            >
              Reject
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={onApprove}
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-600 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
