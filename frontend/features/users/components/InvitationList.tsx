"use client";

import { Inbox, Loader2 } from "lucide-react";

import InvitationCard from "./InvitationCard";

import type { Invitation } from "../types/invitation.types";

interface InvitationListProps {
  invitations: Invitation[];

  loading?: boolean;

  onViewQR: (invitation: Invitation) => void;

  onApprove?: (invitation: Invitation) => void;

  onReject?: (invitation: Invitation) => void;
}

export default function InvitationList({
  invitations,
  loading = false,
  onViewQR,
  onApprove,
  onReject,
}: InvitationListProps) {
  if (loading) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-sky-500" />

          <p className="mt-3 text-xs font-semibold text-slate-500">
            Loading invitations...
          </p>
        </div>
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-950">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
          <Inbox className="h-6 w-6 text-slate-400" />
        </div>

        <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
          No invitations yet
        </h3>

        <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-500">
          Invite employees to your business and manage their access from here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invitations.map((invitation, index) => {
        /*
         * The API should normally provide `id`.
         * `_id` is supported as a fallback because
         * MongoDB documents may return `_id`.
         */
        const invitationId =
          invitation.id ||
          ("_id" in invitation && typeof invitation._id === "string"
            ? invitation._id
            : null);

        /*
         * This fallback prevents React's duplicate/undefined
         * key warning even if malformed API data reaches the UI.
         */
        const key = invitationId || `invitation-${index}`;

        return (
          <InvitationCard
            key={key}
            invitation={invitation}
            onViewQR={onViewQR}
            {...(onApprove ? { onApprove } : {})}
            {...(onReject ? { onReject } : {})}
          />
        );
      })}
    </div>
  );
}
